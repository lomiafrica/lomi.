//! Whole calls without WhatsApp or Gemini: the real `Bridge::converse` against a fake phone, a fake
//! Gemini Live server and a fake Hermes. Each test scripts one situation that has broken calls
//! before (a goAway, a dropped socket, a slow tool, a hangup) and checks how the call went.
//!
//! `live_model_*` tests swap the fake model for the real one (`--ignored`, costs a few cents).

use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering::SeqCst};

use axum::Json;
use axum::extract::{Path, State};
use axum::routing::{get, post};
use base64::Engine;
use base64::engine::general_purpose::STANDARD as B64;
use futures_util::{SinkExt, StreamExt};
use tokio::net::TcpListener;
use tokio_tungstenite::tungstenite::Message;
use tokio_tungstenite::tungstenite::protocol::CloseFrame;
use tokio_tungstenite::tungstenite::protocol::frame::coding::CloseCode;

use super::*;
use crate::audio::{i16_to_le_bytes, read_wav};

const WAIT: Duration = Duration::from_secs(5);

// ---- fake Gemini Live ------------------------------------------------------------------------

/// A local Live API server. Each connection the sidecar opens arrives as a `ModelConn` that the
/// test drives by hand.
struct FakeModel {
    url: String,
    conns: mpsc::UnboundedReceiver<ModelConn>,
}

impl FakeModel {
    async fn start() -> Self {
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let url = format!("ws://{}", listener.local_addr().unwrap());
        let (tx, conns) = mpsc::unbounded_channel();
        let open = Arc::new(AtomicUsize::new(0));
        tokio::spawn(async move {
            while let Ok((stream, _)) = listener.accept().await {
                tokio::spawn(serve_model_conn(stream, tx.clone(), open.clone()));
            }
        });
        Self { url, conns }
    }

    /// The next connection the sidecar opens, once its setup is done.
    async fn accept(&mut self) -> ModelConn {
        tokio::time::timeout(WAIT, self.conns.recv())
            .await
            .expect("the sidecar did not connect to the voice model")
            .unwrap()
    }
}

async fn serve_model_conn(
    stream: tokio::net::TcpStream,
    conns: mpsc::UnboundedSender<ModelConn>,
    open: Arc<AtomicUsize>,
) {
    let Ok(mut ws) = tokio_tungstenite::accept_async(stream).await else {
        return;
    };
    let Some(Ok(Message::Text(setup))) = ws.next().await else {
        return;
    };
    let setup: Value = serde_json::from_str(&setup).unwrap();
    // Like Gemini: a session cannot be resumed while an earlier connection is still open.
    if setup["setup"]["sessionResumption"]["handle"].is_string() && open.load(SeqCst) > 0 {
        let reason = "BidiGenerateContent session is already connected to an existing client";
        let _ = ws
            .close(Some(CloseFrame {
                code: CloseCode::Policy,
                reason: reason.into(),
            }))
            .await;
        return;
    }
    open.fetch_add(1, SeqCst);
    let _ = ws
        .send(Message::text(json!({"setupComplete": {}}).to_string()))
        .await;
    let (out_tx, mut out_rx) = mpsc::unbounded_channel::<Option<Message>>();
    let (in_tx, in_rx) = mpsc::unbounded_channel::<Value>();
    let _ = conns.send(ModelConn {
        setup: setup["setup"].clone(),
        tx: out_tx,
        rx: in_rx,
    });
    loop {
        tokio::select! {
            cmd = out_rx.recv() => match cmd {
                Some(Some(m)) => if ws.send(m).await.is_err() { break },
                _ => break, // the test dropped the socket
            },
            msg = ws.next() => match msg {
                Some(Ok(Message::Text(t))) => { let _ = in_tx.send(serde_json::from_str(&t).unwrap()); }
                Some(Ok(Message::Close(_))) | Some(Err(_)) | None => break,
                _ => {}
            },
        }
    }
    open.fetch_sub(1, SeqCst);
}

struct ModelConn {
    setup: Value,
    tx: mpsc::UnboundedSender<Option<Message>>,
    rx: mpsc::UnboundedReceiver<Value>,
}

impl ModelConn {
    fn send(&self, v: Value) {
        let _ = self.tx.send(Some(Message::text(v.to_string())));
    }

    /// Says `text`: half a second of audio, its transcript, then the end of the turn.
    fn say(&self, text: &str) {
        let pcm: Vec<i16> = (0..12_000)
            .map(|i| ((i as f32 * 0.05).sin() * 8000.0) as i16)
            .collect();
        let data = B64.encode(i16_to_le_bytes(&pcm));
        self.send(json!({"serverContent": {"modelTurn": {"parts": [{"inlineData": {"mimeType": "audio/pcm;rate=24000", "data": data}}]}}}));
        self.send(json!({"serverContent": {"outputTranscription": {"text": text}}}));
        self.send(json!({"serverContent": {"turnComplete": true}, "usageMetadata": {"promptTokenCount": 1000, "responseTokenCount": 50}}));
    }

    /// The model's transcript of the owner's speech.
    fn heard(&self, text: &str) {
        self.send(json!({"serverContent": {"inputTranscription": {"text": text}}}));
    }

    fn call_tool(&self, id: &str, name: &str, args: Value) {
        self.send(json!({"toolCall": {"functionCalls": [{"id": id, "name": name, "args": args}]}}));
    }

    fn resumable(&self, handle: &str) {
        self.send(json!({"sessionResumptionUpdate": {"newHandle": handle, "resumable": true}}));
    }

    fn drop_socket(&self) {
        let _ = self.tx.send(None);
    }

    /// The next message from the sidecar that matches, skipping the rest (mostly caller audio).
    async fn wait_for(&mut self, what: &str, matches: impl Fn(&Value) -> bool) -> Value {
        let deadline = tokio::time::Instant::now() + WAIT;
        loop {
            match tokio::time::timeout_at(deadline, self.rx.recv()).await {
                Ok(Some(v)) if matches(&v) => return v,
                Ok(Some(_)) => {}
                Ok(None) => panic!("connection closed while waiting for {what}"),
                Err(_) => panic!("the voice model never got {what}"),
            }
        }
    }

    async fn wait_text(&mut self) -> String {
        let v = self
            .wait_for("a text prompt", |v| v["realtimeInput"]["text"].is_string())
            .await;
        v["realtimeInput"]["text"].as_str().unwrap().to_string()
    }

    async fn wait_tool_response(&mut self, id: &str) -> Value {
        let v = self
            .wait_for(&format!("the response to tool call {id}"), |v| {
                v["toolResponse"]["functionResponses"][0]["id"] == id
            })
            .await;
        v["toolResponse"]["functionResponses"][0]["response"].clone()
    }

    fn function_names(&self) -> Vec<String> {
        self.setup["tools"][0]["functionDeclarations"]
            .as_array()
            .into_iter()
            .flatten()
            .filter_map(|f| f["name"].as_str().map(String::from))
            .collect()
    }
}

// ---- fake Hermes (API server and core-session service) -----------------------------------------

#[derive(Default)]
struct HermesState {
    /// How long a /v1/runs run and a core-session tool take.
    work: Mutex<Duration>,
    start_fails: AtomicBool,
    requests: Mutex<Vec<(String, Value)>>,
    /// When each /v1/runs run started.
    runs: Mutex<HashMap<String, Instant>>,
}

impl HermesState {
    fn log(&self, path: &str, body: Value) {
        self.requests.lock().unwrap().push((path.to_string(), body));
    }

    fn paths(&self) -> Vec<String> {
        let requests = self.requests.lock().unwrap();
        requests.iter().map(|(p, _)| p.clone()).collect()
    }

    fn bodies(&self, path: &str) -> Vec<Value> {
        let requests = self.requests.lock().unwrap();
        let matching = requests.iter().filter(|(p, _)| p == path);
        matching.map(|(_, b)| b.clone()).collect()
    }

    fn work(&self) -> Duration {
        *self.work.lock().unwrap()
    }
}

type Hs = State<Arc<HermesState>>;

async fn start_hermes() -> (String, Arc<HermesState>) {
    let state = Arc::new(HermesState::default());
    let app = axum::Router::new()
        .route(
            "/v1/runs",
            post(|State(s): Hs, Json(b): Json<Value>| async move {
                s.log("/v1/runs", b);
                let id = format!("run{}", rand::random::<u32>());
                s.runs.lock().unwrap().insert(id.clone(), Instant::now());
                Json(json!({"run_id": id}))
            }),
        )
        .route(
            "/v1/runs/{id}",
            get(|State(s): Hs, Path(id): Path<String>| async move {
                let started = s.runs.lock().unwrap()[&id];
                Json(if started.elapsed() >= s.work() {
                    json!({"status": "completed", "output": "It is sunny."})
                } else {
                    json!({"status": "running"})
                })
            }),
        )
        .route(
            "/v1/runs/{id}/stop",
            post(|State(s): Hs, Path(id): Path<String>| async move {
                s.log("/v1/runs/stop", json!({"run_id": id}));
                Json(json!({}))
            }),
        )
        .route(
            "/voice/start",
            post(|State(s): Hs, Json(b): Json<Value>| async move {
                s.log("/voice/start", b);
                if s.start_fails.load(SeqCst) {
                    return Err((
                        axum::http::StatusCode::CONFLICT,
                        Json(json!({"error": "no WhatsApp DM session yet"})),
                    ));
                }
                Ok(Json(json!({
                    "session_id": "s1",
                    "system_instruction": "You are the owner's assistant, in their WhatsApp chat. The owner lives in Chennai.",
                    "history": [
                        {"role": "user", "parts": [{"text": "Remind me about the dentist."}]},
                        {"role": "model", "parts": [{"text": "Done."}]},
                    ],
                    "functions": [{"name": "web_search", "description": "Search the web.",
                        "parameters": {"type": "object", "properties": {"query": {"type": "string"}}}}],
                    "vocabulary": [],
                })))
            }),
        )
        .route(
            "/voice/tool",
            post(|State(s): Hs, Json(b): Json<Value>| async move {
                s.log("/voice/tool", b);
                tokio::time::sleep(s.work()).await;
                Json(json!({"result": "Sunny, 24 degrees."}))
            }),
        )
        .route(
            "/voice/deep",
            post(|State(s): Hs, Json(b): Json<Value>| async move {
                s.log("/voice/deep", b);
                tokio::time::sleep(s.work()).await;
                Json(json!({"result": "Booked."}))
            }),
        )
        .route(
            "/voice/events",
            post(|State(s): Hs, Json(b): Json<Value>| async move {
                s.log("/voice/events", b);
                Json(json!({"chat_updates": ""}))
            }),
        )
        .route(
            "/voice/end",
            post(|State(s): Hs, Json(b): Json<Value>| async move {
                s.log("/voice/end", b);
                Json(json!({"written": 2}))
            }),
        )
        .with_state(state.clone());
    let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
    let url = format!("http://{}", listener.local_addr().unwrap());
    tokio::spawn(async move { axum::serve(listener, app).await.unwrap() });
    (url, state)
}

// ---- fake phone ------------------------------------------------------------------------------

struct FakeLine {
    phone_hung_up: watch::Receiver<bool>,
    bridge_hung_up: Arc<AtomicBool>,
}

impl Line for FakeLine {
    fn ended(&self) -> impl Future<Output = ()> + Send {
        let mut rx = self.phone_hung_up.clone();
        async move {
            let _ = rx.wait_for(|up| *up).await;
        }
    }

    fn hang_up(&self) -> impl Future<Output = ()> + Send {
        self.bridge_hung_up.store(true, SeqCst);
        async {}
    }
}

/// The owner's end of the call.
struct Phone {
    hang_up: watch::Sender<bool>,
    bridge_hung_up: Arc<AtomicBool>,
    to_bot: async_channel::Sender<Vec<i16>>,
    from_bot: async_channel::Receiver<Vec<i16>>,
}

impl Phone {
    /// Sends `ms` of owner audio (20 ms frames, as WhatsApp delivers it).
    async fn speak(&self, ms: usize) {
        for _ in 0..ms / 20 {
            self.to_bot.send(vec![3000; 320]).await.unwrap();
        }
    }

    async fn play(&self, pcm: &[i16]) {
        for frame in pcm.chunks(320) {
            self.to_bot.send(frame.to_vec()).await.unwrap();
            tokio::time::sleep(Duration::from_millis(20)).await;
        }
    }

    /// Whether the owner hears the assistant speak within `within`.
    async fn hears_speech(&self, within: Duration) -> bool {
        tokio::time::timeout(within, async {
            while let Ok(frame) = self.from_bot.recv().await {
                if frame.iter().any(|s| s.abs() > 100) {
                    return true;
                }
            }
            false
        })
        .await
        .unwrap_or(false)
    }

    fn hang_up(&self) {
        let _ = self.hang_up.send(true);
    }

    fn bridge_hung_up(&self) -> bool {
        self.bridge_hung_up.load(SeqCst)
    }
}

// ---- harness ---------------------------------------------------------------------------------

struct Sim {
    bridge: Arc<Bridge>,
    model: FakeModel,
    hermes: Arc<HermesState>,
}

fn test_config(gemini_url: &str, hermes_url: &str) -> Config {
    Config {
        owner: "15550000000".into(),
        listen: "127.0.0.1:0".into(),
        token: "test-token".into(),
        gemini_api_key: "test-key".into(),
        gemini_url: gemini_url.into(),
        model: "gemini-3.8-live".into(),
        voice: "Kore".into(),
        assistant_name: "Hermes".into(),
        voice_instructions: String::new(),
        languages: vec![],
        speech_language: String::new(),
        pause_ms: 600,
        live_config: json!({}),
        hermes_api_url: hermes_url.into(),
        hermes_api_key: "test-key".into(),
        ring_timeout: Duration::from_secs(5),
        max_duration: Duration::from_secs(60),
        silence_timeout: Duration::from_secs(30),
        hermes_timeout: Duration::from_secs(10),
        hangup_grace: Duration::from_millis(300),
        max_silent_tools: 5,
        recordings: None,
        answer_inbound: true,
        send_summary: true,
        context_url: String::new(),
        vocabulary: vec![],
    }
}

impl Sim {
    /// `core`: run calls as the owner's chat session (the core-session service is faked too).
    async fn new(core: bool, tweak: impl FnOnce(&mut Config)) -> Self {
        let model = FakeModel::start().await;
        let (hermes_url, hermes) = start_hermes().await;
        let mut cfg = test_config(&model.url, &hermes_url);
        if core {
            cfg.context_url = hermes_url;
        }
        tweak(&mut cfg);
        Self {
            bridge: Arc::new(Bridge::new(cfg, None)),
            model,
            hermes,
        }
    }

    /// The owner calls and the bot answers.
    fn call(&self) -> (String, Phone, JoinHandle<()>) {
        let record = self.bridge.calls.begin("inbound", "owner called").unwrap();
        let (mic_tx, mic_rx) = async_channel::bounded::<Vec<i16>>(8);
        let (spk_tx, spk_rx) = async_channel::bounded::<Vec<i16>>(64);
        let (hang_up, phone_hung_up) = watch::channel(false);
        let bridge_hung_up = Arc::new(AtomicBool::new(false));
        let line = FakeLine {
            phone_hung_up,
            bridge_hung_up: bridge_hung_up.clone(),
        };
        let phone = Phone {
            hang_up,
            bridge_hung_up,
            to_bot: spk_tx,
            from_bot: mic_rx,
        };
        let (bridge, id) = (self.bridge.clone(), record.id.clone());
        let task = tokio::spawn(async move {
            bridge
                .converse(&id, &line, mic_tx, spk_rx, CallInfo::inbound())
                .await;
        });
        (record.id, phone, task)
    }

    /// Waits for the call (and its after-call work) to finish; returns its record.
    async fn finished(&self, id: &str, task: JoinHandle<()>) -> CallRecord {
        tokio::time::timeout(Duration::from_secs(15), task)
            .await
            .expect("the call did not end")
            .unwrap();
        self.bridge.calls.get(id).unwrap()
    }

    fn record(&self, id: &str) -> CallRecord {
        self.bridge.calls.get(id).unwrap()
    }
}

// ---- scenarios -------------------------------------------------------------------------------

#[tokio::test]
async fn answers_greets_and_replies_to_the_owner() {
    let mut sim = Sim::new(false, |_| {}).await;
    let (id, phone, task) = sim.call();
    let mut m = sim.model.accept().await;
    assert!(m.function_names().contains(&"ask_hermes".to_string()));
    assert!(
        m.wait_text().await.contains("calling you"),
        "opening prompt"
    );

    m.say("Hi! What's up?");
    assert!(
        phone.hears_speech(WAIT).await,
        "the owner hears the greeting"
    );

    phone.speak(400).await;
    m.wait_for("the owner's audio", |v| {
        v["realtimeInput"]["audio"]["mimeType"] == "audio/pcm;rate=16000"
    })
    .await;
    m.heard("What's the weather?");
    m.say("Sunny all day.");
    assert!(phone.hears_speech(WAIT).await, "the owner hears the reply");

    phone.hang_up();
    let r = sim.finished(&id, task).await;
    assert_eq!(r.status, Status::Completed);
    assert_eq!(r.metrics.ended_by, "phone");
    assert!(
        !phone.bridge_hung_up(),
        "no hangup sent for a call the owner ended"
    );
    assert!(r.metrics.first_audio_ms.is_some_and(|ms| ms < 2000));
    assert_eq!(r.metrics.reply_ms.len(), 1, "one owner turn answered");
    assert_eq!(r.metrics.prompt_tokens, 2000);
    assert_eq!(
        r.transcript_text(),
        "assistant: Hi! What's up?\nowner: What's the weather?\nassistant: Sunny all day."
    );
    assert!(
        sim.hermes
            .bodies("/v1/runs")
            .iter()
            .any(|b| b["input"].as_str().unwrap().contains("Sunny all day")),
        "the transcript goes to Hermes for the summary"
    );
}

/// Issue #25: after goAway the old socket must be closed, or the resume is refused.
#[tokio::test]
async fn resumes_on_a_new_connection_after_go_away() {
    let mut sim = Sim::new(false, |_| {}).await;
    let (id, phone, task) = sim.call();
    let mut m1 = sim.model.accept().await;
    m1.wait_text().await;
    m1.resumable("handle-1");
    m1.send(json!({"goAway": {"timeLeft": "0s"}}));

    let m2 = sim.model.accept().await;
    assert_eq!(m2.setup["sessionResumption"]["handle"], "handle-1");
    m2.say("Still here.");
    assert!(
        phone.hears_speech(WAIT).await,
        "speech on the resumed session"
    );
    m2.heard("Good.");
    assert_eq!(sim.record(&id).status, Status::InProgress);

    phone.hang_up();
    assert_eq!(sim.finished(&id, task).await.metrics.ended_by, "phone");
}

#[tokio::test]
async fn resumes_after_the_socket_drops_and_resends_pending_tool_results() {
    let mut sim = Sim::new(false, |_| {}).await;
    *sim.hermes.work.lock().unwrap() = Duration::from_millis(1500);
    let (id, phone, task) = sim.call();
    let mut m1 = sim.model.accept().await;
    m1.wait_text().await;
    m1.resumable("handle-1");
    m1.call_tool("t1", "ask_hermes", json!({"request": "weather?"}));
    m1.drop_socket();

    let mut m2 = sim.model.accept().await;
    assert_eq!(m2.setup["sessionResumption"]["handle"], "handle-1");
    let result = m2.wait_tool_response("t1").await;
    assert_eq!(result["result"], "It is sunny.");
    phone.hang_up();
    sim.finished(&id, task).await;
}

#[tokio::test]
async fn ends_the_call_when_the_voice_model_drops_without_a_resume_handle() {
    let mut sim = Sim::new(false, |_| {}).await;
    let (id, phone, task) = sim.call();
    let m = sim.model.accept().await;
    m.drop_socket();
    let r = sim.finished(&id, task).await;
    assert_eq!(r.metrics.ended_by, "voice_model");
    assert!(
        phone.bridge_hung_up(),
        "the owner is not left on a dead line"
    );
}

#[tokio::test]
async fn fails_cleanly_when_the_voice_model_is_unreachable() {
    let sim = Sim::new(false, |c| c.gemini_url = "ws://127.0.0.1:1".into()).await;
    let (id, phone, task) = sim.call();
    let r = sim.finished(&id, task).await;
    assert_eq!(r.status, Status::Failed);
    assert_eq!(r.metrics.ended_by, "error");
    assert!(phone.bridge_hung_up());
}

#[tokio::test]
async fn hangs_up_after_the_goodbye_has_played() {
    let mut sim = Sim::new(false, |_| {}).await;
    let (id, phone, task) = sim.call();
    let mut m = sim.model.accept().await;
    m.wait_text().await;
    m.heard("That's all, bye.");
    m.say("Bye!");
    m.call_tool("e1", "end_call", json!({}));
    assert_eq!(m.wait_tool_response("e1").await, json!({"ok": true}));
    assert!(phone.hears_speech(WAIT).await, "the goodbye plays");
    let r = sim.finished(&id, task).await;
    assert_eq!(r.metrics.ended_by, "assistant");
    assert!(phone.bridge_hung_up());
}

#[tokio::test]
async fn will_not_hang_up_on_its_own_question() {
    let mut sim = Sim::new(false, |_| {}).await;
    let (id, phone, task) = sim.call();
    let mut m = sim.model.accept().await;
    m.wait_text().await;
    m.say("Anything else?");
    m.call_tool("e1", "end_call", json!({}));
    assert!(m.wait_tool_response("e1").await["error"].is_string());
    tokio::time::sleep(Duration::from_secs(1)).await;
    assert_eq!(sim.record(&id).status, Status::InProgress);
    phone.hang_up();
    sim.finished(&id, task).await;
}

#[tokio::test]
async fn owner_speech_after_the_goodbye_keeps_the_call_up() {
    let mut sim = Sim::new(false, |c| c.hangup_grace = Duration::from_secs(1)).await;
    let (id, phone, task) = sim.call();
    let mut m = sim.model.accept().await;
    m.wait_text().await;
    m.heard("Thanks.");
    m.say("Bye!");
    m.call_tool("e1", "end_call", json!({}));
    m.wait_tool_response("e1").await;
    m.heard("Oh wait, one more thing.");
    assert!(m.wait_text().await.contains("still connected"));
    tokio::time::sleep(Duration::from_secs(2)).await;
    assert_eq!(sim.record(&id).status, Status::InProgress);
    phone.hang_up();
    sim.finished(&id, task).await;
}

#[tokio::test]
async fn silence_ends_an_abandoned_call() {
    let mut sim = Sim::new(false, |c| c.silence_timeout = Duration::from_secs(1)).await;
    let (id, _phone, task) = sim.call();
    let _m = sim.model.accept().await;
    let r = sim.finished(&id, task).await;
    assert_eq!(r.metrics.ended_by, "silence");
}

#[tokio::test]
async fn slow_hermes_work_is_not_taken_for_silence() {
    let mut sim = Sim::new(false, |c| c.silence_timeout = Duration::from_secs(1)).await;
    *sim.hermes.work.lock().unwrap() = Duration::from_millis(2500);
    let (id, phone, task) = sim.call();
    let mut m = sim.model.accept().await;
    m.wait_text().await;
    m.call_tool("t1", "ask_hermes", json!({"request": "weather?"}));
    let result = m.wait_tool_response("t1").await;
    assert_eq!(result["result"], "It is sunny.");
    assert_eq!(
        sim.record(&id).status,
        Status::InProgress,
        "still up while Hermes worked"
    );
    m.say("It's sunny.");
    assert!(phone.hears_speech(WAIT).await);
    phone.hang_up();
    let r = sim.finished(&id, task).await;
    assert!(
        r.metrics.longest_silence_ms >= 2000,
        "the wait shows up in the metrics"
    );
}

#[tokio::test]
async fn a_cancelled_tool_stops_its_hermes_run() {
    let mut sim = Sim::new(false, |_| {}).await;
    *sim.hermes.work.lock().unwrap() = Duration::from_secs(30);
    let (id, phone, task) = sim.call();
    let mut m = sim.model.accept().await;
    m.wait_text().await;
    m.call_tool("t1", "ask_hermes", json!({"request": "a long job"}));
    tokio::time::sleep(Duration::from_millis(300)).await;
    m.send(json!({"toolCallCancellation": {"ids": ["t1"]}}));
    tokio::time::sleep(Duration::from_millis(500)).await;
    assert!(sim.hermes.paths().contains(&"/v1/runs/stop".to_string()));
    phone.hang_up();
    sim.finished(&id, task).await;
}

/// Issue #20: the Hermes timeout is a setting, and running out is reported, not silent.
#[tokio::test]
async fn hermes_timeout_is_reported_to_the_model() {
    let mut sim = Sim::new(false, |c| c.hermes_timeout = Duration::from_secs(1)).await;
    *sim.hermes.work.lock().unwrap() = Duration::from_secs(30);
    let (id, phone, task) = sim.call();
    let mut m = sim.model.accept().await;
    m.wait_text().await;
    m.call_tool("t1", "ask_hermes", json!({"request": "a long job"}));
    let result = m.wait_tool_response("t1").await;
    assert!(
        result["error"].as_str().unwrap().contains("did not finish"),
        "{result}"
    );
    phone.hang_up();
    sim.finished(&id, task).await;
}

#[tokio::test]
async fn core_session_call_uses_the_chat_and_writes_back() {
    let mut sim = Sim::new(true, |_| {}).await;
    let (id, phone, task) = sim.call();
    let mut m = sim.model.accept().await;
    assert!(
        m.setup["systemInstruction"]["parts"][0]["text"]
            .as_str()
            .unwrap()
            .contains("WhatsApp chat")
    );
    assert_eq!(
        m.setup["historyConfig"]["initialHistoryInClientContent"],
        true
    );
    let names = m.function_names();
    for f in ["web_search", "end_call", "ask_hermes_deep"] {
        assert!(names.contains(&f.to_string()), "{f} missing from {names:?}");
    }
    assert!(!names.contains(&"ask_hermes".to_string()));
    let history = m
        .wait_for("the chat history", |v| {
            v["clientContent"]["turns"].is_array()
        })
        .await;
    assert_eq!(
        history["clientContent"]["turns"].as_array().unwrap().len(),
        2
    );

    m.wait_text().await;
    m.heard("Weather?");
    m.say("Checking.");
    m.call_tool("t1", "web_search", json!({"query": "weather"}));
    assert_eq!(
        m.wait_tool_response("t1").await["result"],
        "Sunny, 24 degrees."
    );
    m.say("Sunny.");
    tokio::time::sleep(Duration::from_millis(500)).await;
    phone.hang_up();
    sim.finished(&id, task).await;
    tokio::time::sleep(Duration::from_millis(500)).await; // write-back runs after the call

    let tool = &sim.hermes.bodies("/voice/tool")[0];
    assert_eq!(
        (tool["name"].as_str(), tool["call"].as_str()),
        (Some("web_search"), Some(id.as_str()))
    );
    let events: Vec<Value> = sim
        .hermes
        .bodies("/voice/events")
        .iter()
        .flat_map(|b| b["events"].as_array().cloned().unwrap_or_default())
        .collect();
    let kinds: Vec<&str> = events.iter().filter_map(|e| e["type"].as_str()).collect();
    for k in ["owner", "assistant", "tool_call", "tool_result"] {
        assert!(kinds.contains(&k), "{k} not written back: {kinds:?}");
    }
    assert!(sim.hermes.paths().contains(&"/voice/end".to_string()));
}

#[tokio::test]
async fn falls_back_to_the_separate_agent_without_a_chat_session() {
    let mut sim = Sim::new(true, |_| {}).await;
    sim.hermes.start_fails.store(true, SeqCst);
    let (id, phone, task) = sim.call();
    let mut m = sim.model.accept().await;
    assert!(m.function_names().contains(&"ask_hermes".to_string()));
    m.wait_text().await;
    phone.hang_up();
    sim.finished(&id, task).await;
}

#[tokio::test]
async fn the_model_must_speak_between_long_runs_of_tools() {
    let mut sim = Sim::new(true, |c| c.max_silent_tools = 2).await;
    let (id, phone, task) = sim.call();
    let mut m = sim.model.accept().await;
    m.wait_text().await;
    for t in ["t1", "t2", "t3"] {
        m.call_tool(t, "web_search", json!({"query": t}));
    }
    let held = m.wait_tool_response("t3").await;
    assert!(
        held["error"]
            .as_str()
            .unwrap()
            .contains("without saying anything")
    );
    phone.hang_up();
    let r = sim.finished(&id, task).await;
    assert_eq!((r.metrics.tool_calls, r.metrics.max_silent_tools), (2, 2));
}

#[tokio::test]
async fn owner_texts_during_a_core_call_reach_the_model() {
    let mut sim = Sim::new(true, |_| {}).await;
    let (id, phone, task) = sim.call();
    let mut m = sim.model.accept().await;
    m.wait_text().await;
    assert!(sim.bridge.deliver_text("here's the link"));
    assert!(m.wait_text().await.contains("here's the link"));
    phone.hang_up();
    sim.finished(&id, task).await;
    assert!(!sim.bridge.deliver_text("after the call"));
}

#[tokio::test]
async fn records_the_owner_audio_when_enabled() {
    let dir = std::env::temp_dir().join(format!("hwv-rec-{}", rand::random::<u32>()));
    let rec = dir.clone();
    let mut sim = Sim::new(false, move |c| c.recordings = Some(rec)).await;
    let (id, phone, task) = sim.call();
    let mut m = sim.model.accept().await;
    m.wait_text().await;
    phone.speak(400).await;
    m.wait_for("the owner's audio", |v| {
        v["realtimeInput"]["audio"].is_object()
    })
    .await;
    tokio::time::sleep(Duration::from_millis(200)).await;
    phone.hang_up();
    sim.finished(&id, task).await;
    let (rate, pcm) = read_wav(&dir.join(format!("{id}.wav"))).unwrap();
    assert_eq!((rate, pcm.len()), (16_000, 400 / 20 * 320));
    std::fs::remove_dir_all(dir).unwrap();
}

// ---- the real voice model (opt-in: costs a few cents per run) ----------------------------------
//
// The same harness against the real Gemini Live, with the sidecar's real setup and a fake Hermes.
// Run before a release, or to try a model or a language setting:
//   GEMINI_API_KEY=... cargo test live_model -- --ignored --nocapture --test-threads=1
// HWV_MODEL picks the model; HWV_LANGUAGES / HWV_SPEECH_LANGUAGE the language settings under test.
// The owner's lines are synthetic voices in tests/audio; HWV_TEST_AUDIO adds your own recording
// (16 kHz mono WAV, e.g. from record_calls).

async fn live_sim(core: bool) -> Sim {
    let key = std::env::var("GEMINI_API_KEY").expect("GEMINI_API_KEY");
    let env = |name: &str| std::env::var(name).ok();
    Sim::new(core, |c| {
        c.gemini_url = crate::gemini::ENDPOINT.into();
        c.gemini_api_key = key;
        c.model = env("HWV_MODEL").unwrap_or(c.model.clone());
        c.languages = crate::config::list(&env("HWV_LANGUAGES").unwrap_or("en-US, ta-IN".into()));
        c.speech_language = env("HWV_SPEECH_LANGUAGE").unwrap_or_default();
        c.silence_timeout = Duration::from_secs(60);
        c.hangup_grace = Duration::from_secs(2);
    })
    .await
}

fn audio(name: &str) -> Vec<i16> {
    let dir = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/audio");
    read_wav(&dir.join(format!("{name}.wav"))).unwrap().1
}

impl Phone {
    /// Speaks a line in real time, then a second of silence so the model takes its turn.
    async fn say(&self, pcm: &[i16]) {
        self.play(pcm).await;
        self.play(&vec![0; 16_000]).await;
    }

    /// Listens until the assistant has been quiet for `quiet` (or `within` runs out); returns
    /// whether it said anything meanwhile.
    async fn listen(&self, quiet: Duration, within: Duration) -> bool {
        let (mut spoke, mut last) = (false, Instant::now());
        let deadline = Instant::now() + within;
        while Instant::now() < deadline && last.elapsed() < quiet {
            let Ok(Ok(frame)) =
                tokio::time::timeout(Duration::from_millis(200), self.from_bot.recv()).await
            else {
                continue;
            };
            if frame.iter().any(|s| s.abs() > 100) {
                (spoke, last) = (true, Instant::now());
            }
        }
        spoke
    }
}

/// The owner's turns that contain a script other than Tamil or Latin (the "Hindi and Japanese"
/// transcripts seen on real calls).
fn foreign_turns(r: &CallRecord) -> Vec<String> {
    let ok = |c: char| c.is_ascii() || ('\u{0B80}'..='\u{0BFF}').contains(&c) || !c.is_alphabetic();
    r.transcript
        .iter()
        .filter(|t| t.role == "owner" && !t.text.chars().all(ok))
        .map(|t| t.text.clone())
        .collect()
}

fn report(r: &CallRecord) {
    println!(
        "--- transcript\n{}\n--- metrics\n{:#?}",
        r.transcript_text(),
        r.metrics
    );
}

#[tokio::test]
#[ignore]
async fn live_model_greets_and_answers_on_time() {
    let sim = live_sim(false).await;
    let (id, phone, task) = sim.call();
    assert!(
        phone
            .listen(Duration::from_millis(1500), Duration::from_secs(15))
            .await,
        "no greeting"
    );
    phone.say(&audio("en_weather")).await;
    assert!(
        phone
            .listen(Duration::from_secs(3), Duration::from_secs(20))
            .await,
        "no answer"
    );
    phone.hang_up();
    let r = sim.finished(&id, task).await;
    report(&r);
    assert!(
        r.metrics.first_audio_ms.is_some_and(|ms| ms < 5000),
        "slow greeting"
    );
    assert!(
        !r.metrics.reply_ms.is_empty() && r.metrics.reply_ms.iter().all(|&ms| ms < 5000),
        "slow reply"
    );
    let heard = r
        .transcript
        .iter()
        .filter(|t| t.role == "owner")
        .map(|t| t.text.to_lowercase());
    assert!(
        heard.collect::<String>().contains("weather"),
        "misheard the question"
    );
}

/// Checks the language settings: Tamil and Tamil-English speech must come out as Tamil or
/// English, not another language. Try settings with HWV_LANGUAGES / HWV_SPEECH_LANGUAGE.
#[tokio::test]
#[ignore]
async fn live_model_hears_tamil_and_mixed_speech() {
    let sim = live_sim(false).await;
    let (id, phone, task) = sim.call();
    assert!(
        phone
            .listen(Duration::from_millis(1500), Duration::from_secs(15))
            .await,
        "no greeting"
    );
    for line in ["ta_weather", "mixed_meeting"] {
        phone.say(&audio(line)).await;
        assert!(
            phone
                .listen(Duration::from_secs(3), Duration::from_secs(20))
                .await,
            "no answer to {line}"
        );
    }
    phone.hang_up();
    let r = sim.finished(&id, task).await;
    report(&r);
    assert!(
        r.transcript.iter().filter(|t| t.role == "owner").count() >= 2,
        "owner speech not transcribed"
    );
    assert_eq!(
        foreign_turns(&r),
        Vec::<String>::new(),
        "transcribed in the wrong language"
    );
}

/// A request that takes Hermes 8 s: the model must hand it over, keep the line alive, and report
/// the result when it comes.
#[tokio::test]
#[ignore]
async fn live_model_reports_a_slow_tool_result() {
    let sim = live_sim(false).await;
    *sim.hermes.work.lock().unwrap() = Duration::from_secs(8);
    let (id, phone, task) = sim.call();
    assert!(
        phone
            .listen(Duration::from_millis(1500), Duration::from_secs(15))
            .await,
        "no greeting"
    );
    phone.say(&audio("en_weather")).await;
    let deadline = Instant::now() + Duration::from_secs(40);
    let reported = || {
        let r = sim.record(&id);
        r.transcript
            .iter()
            .any(|t| t.role == "assistant" && t.text.to_lowercase().contains("sunny"))
    };
    while !reported() && Instant::now() < deadline {
        phone
            .listen(Duration::from_secs(1), Duration::from_secs(1))
            .await;
    }
    phone
        .listen(Duration::from_secs(2), Duration::from_secs(10))
        .await;
    *sim.hermes.work.lock().unwrap() = Duration::ZERO; // the after-call summary need not wait
    phone.hang_up();
    let r = sim.finished(&id, task).await;
    report(&r);
    let asked = sim.hermes.bodies("/v1/runs");
    assert!(
        asked.iter().any(|b| b["input"]
            .as_str()
            .unwrap()
            .to_lowercase()
            .contains("weather")),
        "never asked Hermes"
    );
    assert!(reported(), "never told the owner the result");
    assert_eq!(r.metrics.ended_by, "phone", "hung up on its own");
}

/// The owner's "bye" ends the call from the assistant's side.
#[tokio::test]
#[ignore]
async fn live_model_hangs_up_after_goodbye() {
    let sim = live_sim(false).await;
    let (id, phone, task) = sim.call();
    assert!(
        phone
            .listen(Duration::from_millis(1500), Duration::from_secs(15))
            .await,
        "no greeting"
    );
    phone.say(&audio("en_bye")).await;
    let ended = tokio::time::timeout(Duration::from_secs(30), async {
        while sim.record(&id).status == Status::InProgress {
            phone
                .listen(Duration::from_millis(500), Duration::from_millis(500))
                .await;
        }
    })
    .await;
    phone.hang_up();
    let r = sim.finished(&id, task).await;
    report(&r);
    assert!(
        ended.is_ok(),
        "still on the line 30 s after the owner said bye"
    );
    assert_eq!(r.metrics.ended_by, "assistant");
}

/// Chat-session mode's setup (history, the chat's tools, ask_hermes_deep) is accepted, and the
/// model uses a tool for a question it cannot answer itself.
#[tokio::test]
#[ignore]
async fn live_model_works_in_chat_session_mode() {
    let sim = live_sim(true).await;
    let (id, phone, task) = sim.call();
    assert!(
        phone
            .listen(Duration::from_millis(1500), Duration::from_secs(15))
            .await,
        "no greeting"
    );
    phone.say(&audio("en_weather")).await;
    assert!(
        phone
            .listen(Duration::from_secs(4), Duration::from_secs(30))
            .await,
        "no answer"
    );
    phone.hang_up();
    let r = sim.finished(&id, task).await;
    report(&r);
    assert!(sim.hermes.paths().contains(&"/voice/start".to_string()));
    assert!(
        r.metrics.tool_calls >= 1,
        "answered a live question without a tool"
    );
}

/// Your own recorded voice (HWV_TEST_AUDIO): it must be understood and answered.
#[tokio::test]
#[ignore]
async fn live_model_answers_your_recording() {
    let Ok(path) = std::env::var("HWV_TEST_AUDIO") else {
        return println!("HWV_TEST_AUDIO not set; skipped");
    };
    let (rate, pcm) = read_wav(std::path::Path::new(&path)).unwrap();
    assert_eq!(rate, 16_000, "HWV_TEST_AUDIO must be 16 kHz mono");
    let sim = live_sim(false).await;
    let (id, phone, task) = sim.call();
    assert!(
        phone
            .listen(Duration::from_millis(1500), Duration::from_secs(15))
            .await,
        "no greeting"
    );
    phone.say(&pcm).await;
    assert!(
        phone
            .listen(Duration::from_secs(3), Duration::from_secs(20))
            .await,
        "no answer"
    );
    phone.hang_up();
    let r = sim.finished(&id, task).await;
    report(&r);
    assert_eq!(
        foreign_turns(&r),
        Vec::<String>::new(),
        "transcribed in the wrong language"
    );
}
