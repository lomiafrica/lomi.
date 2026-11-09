//! Minimal Gemini Live client over the raw `BidiGenerateContent` WebSocket.
//!
//! A `Live` hides connection turnover: on `goAway` (connections last about ten minutes) or a
//! dropped socket it reconnects with the latest session-resumption handle, so the conversation
//! carries on and callers only ever see one stream of events.

use std::collections::VecDeque;
use std::time::Duration;

use anyhow::{Context, Result, anyhow, bail};
use base64::Engine;
use base64::engine::general_purpose::STANDARD as B64;
use futures_util::{SinkExt, StreamExt};
use serde_json::{Value, json};
use tokio::net::TcpStream;
use tokio::sync::mpsc;
use tokio::task::JoinHandle;
use tokio::time::{Instant, sleep_until};
use tokio_tungstenite::tungstenite::Message;
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::{MaybeTlsStream, WebSocketStream};

use crate::audio::{i16_to_le_bytes, le_bytes_to_i16};

pub const ENDPOINT: &str = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";
const MAX_RECONNECTS: u32 = 3;

type Ws = WebSocketStream<MaybeTlsStream<TcpStream>>;

#[derive(Clone, Debug, Default)]
pub struct Setup {
    pub model: String,
    pub voice: String,
    pub system_instruction: String,
    pub functions: Vec<Value>,
    /// Language codes to pin speech recognition to; empty lets Gemini detect the language.
    pub languages: Vec<String>,
    /// The language the owner speaks (`speechConfig.languageCode`), which Gemini uses for both
    /// recognition and the voice; stronger than the `languages` hints. Empty leaves it unset.
    pub speech_language: String,
    /// How long the owner may pause before their turn counts as over and the model replies.
    pub pause_ms: u32,
    /// Owner-supplied setup fields (the `live_config` setting), merged over the defaults.
    pub overrides: Value,
    /// Earlier conversation as `Content` turns, loaded before the call starts (not on resume).
    pub history: Vec<Value>,
    /// Words transcription should spell as given, e.g. the owner's name.
    pub vocabulary: Vec<String>,
}

/// Deep-merges `over` into `base`: objects merge key by key, anything else replaces.
/// `tools` is appended instead, so owner tools (e.g. googleSearch) add to ask_hermes/end_call.
fn merge(base: &mut Value, over: &Value) {
    match (base, over) {
        (Value::Object(b), Value::Object(o)) => {
            for (key, value) in o {
                match (key.as_str(), b.get_mut(key)) {
                    ("tools", Some(Value::Array(existing))) if value.is_array() => {
                        existing.extend(value.as_array().unwrap().iter().cloned())
                    }
                    (_, Some(slot)) => merge(slot, value),
                    (_, None) => {
                        b.insert(key.clone(), value.clone());
                    }
                }
            }
        }
        (slot, value) => *slot = value.clone(),
    }
}

impl Setup {
    fn message(&self, resume_handle: Option<&str>) -> Value {
        let mut setup = json!({
            "model": format!("models/{}", self.model),
            "generationConfig": {
                "responseModalities": ["AUDIO"],
                "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": self.voice}}},
            },
            "systemInstruction": {"parts": [{"text": self.system_instruction}]},
            "inputAudioTranscription": self.transcription(true),
            "outputAudioTranscription": self.transcription(false),
            "realtimeInputConfig": {
                "automaticActivityDetection": {"silenceDurationMs": self.pause_ms},
                "activityHandling": "START_OF_ACTIVITY_INTERRUPTS",
            },
            "contextWindowCompression": {"slidingWindow": {}},
            "sessionResumption": match resume_handle {
                Some(h) => json!({"handle": h}),
                None => json!({}),
            },
        });
        if !self.speech_language.is_empty() {
            setup["generationConfig"]["speechConfig"]["languageCode"] = json!(self.speech_language);
        }
        if !self.functions.is_empty() {
            setup["tools"] = json!([{"functionDeclarations": self.functions}]);
        }
        // A resumed session already holds the history.
        if !self.history.is_empty() && resume_handle.is_none() {
            setup["historyConfig"] = json!({"initialHistoryInClientContent": true});
        }
        if self.overrides.is_object() {
            merge(&mut setup, &self.overrides);
        }
        json!({"setup": setup})
    }

    fn transcription(&self, input: bool) -> Value {
        let mut config = json!({});
        if input && !self.languages.is_empty() {
            config["languageCodes"] = json!(self.languages);
        }
        if !self.vocabulary.is_empty() {
            config["customVocabulary"] = json!(self.vocabulary);
        }
        config
    }
}

#[derive(Debug, PartialEq)]
pub enum LiveEvent {
    /// Model speech, 24 kHz mono.
    Audio(Vec<i16>),
    /// The caller started talking over the model; drop queued speech.
    Interrupted,
    InputTranscript(String),
    OutputTranscript(String),
    ToolCall {
        id: String,
        name: String,
        args: Value,
    },
    ToolCancelled(Vec<String>),
    /// The model finished its turn.
    TurnComplete,
    /// Tokens billed for one model response.
    Usage {
        prompt: u64,
        response: u64,
    },
    /// The session ended for good; carries the reason.
    Closed(String),
}

/// What one server message means: events to surface, plus connection bookkeeping.
#[derive(Debug, Default, PartialEq)]
struct Parsed {
    events: Vec<LiveEvent>,
    resume_handle: Option<String>,
    turn_complete: bool,
    /// Set on `goAway`: how long the server will keep this connection open.
    go_away: Option<Duration>,
}

/// Parses protobuf JSON durations like "5s" or "1.500s".
fn parse_time_left(v: &Value) -> Duration {
    v.as_str()
        .and_then(|s| s.strip_suffix('s'))
        .and_then(|s| s.parse::<f64>().ok())
        .map(Duration::from_secs_f64)
        .unwrap_or(Duration::ZERO)
}

fn parse_server_message(msg: &Value) -> Parsed {
    let mut p = Parsed::default();
    if let Some(sc) = msg.get("serverContent") {
        if sc["interrupted"].as_bool() == Some(true) {
            p.events.push(LiveEvent::Interrupted);
        }
        for part in sc["modelTurn"]["parts"].as_array().into_iter().flatten() {
            if let Some(data) = part["inlineData"]["data"].as_str()
                && let Ok(bytes) = B64.decode(data)
            {
                p.events.push(LiveEvent::Audio(le_bytes_to_i16(&bytes)));
            }
        }
        if let Some(t) = sc["inputTranscription"]["text"]
            .as_str()
            .filter(|t| !t.is_empty())
        {
            p.events.push(LiveEvent::InputTranscript(t.to_string()));
        }
        if let Some(t) = sc["outputTranscription"]["text"]
            .as_str()
            .filter(|t| !t.is_empty())
        {
            p.events.push(LiveEvent::OutputTranscript(t.to_string()));
        }
        p.turn_complete = sc["turnComplete"].as_bool() == Some(true);
        if p.turn_complete {
            p.events.push(LiveEvent::TurnComplete);
        }
    }
    for fc in msg["toolCall"]["functionCalls"]
        .as_array()
        .into_iter()
        .flatten()
    {
        p.events.push(LiveEvent::ToolCall {
            id: fc["id"].as_str().unwrap_or_default().to_string(),
            name: fc["name"].as_str().unwrap_or_default().to_string(),
            args: fc.get("args").cloned().unwrap_or(json!({})),
        });
    }
    if let Some(ids) = msg["toolCallCancellation"]["ids"].as_array() {
        let ids = ids
            .iter()
            .filter_map(|v| v.as_str().map(String::from))
            .collect();
        p.events.push(LiveEvent::ToolCancelled(ids));
    }
    let update = &msg["sessionResumptionUpdate"];
    if update["resumable"].as_bool() == Some(true)
        && let Some(h) = update["newHandle"].as_str()
    {
        p.resume_handle = Some(h.to_string());
    }
    p.go_away = msg.get("goAway").map(|g| parse_time_left(&g["timeLeft"]));
    if let Some(u) = msg.get("usageMetadata") {
        p.events.push(LiveEvent::Usage {
            prompt: u["promptTokenCount"].as_u64().unwrap_or(0),
            response: u["responseTokenCount"].as_u64().unwrap_or(0),
        });
    }
    p
}

/// Caller audio is only worth sending live; everything else must arrive even across a reconnect.
enum Outgoing {
    Audio(String),
    Control(String),
}

pub struct Live {
    outbox: mpsc::UnboundedSender<Outgoing>,
    pub events: mpsc::UnboundedReceiver<LiveEvent>,
    task: JoinHandle<()>,
}

impl Live {
    pub async fn connect(url: &str, api_key: &str, setup: Setup) -> Result<Self> {
        let mut ws = open(url, api_key, &setup.message(None)).await?;
        if !setup.history.is_empty() {
            // With initialHistoryInClientContent the server takes this as context, not a prompt.
            let history = json!({"clientContent": {"turns": setup.history, "turnComplete": true}});
            ws.send(Message::text(history.to_string()))
                .await
                .context("sending call history to Gemini Live")?;
        }
        let (outbox, out_rx) = mpsc::unbounded_channel();
        let (ev_tx, events) = mpsc::unbounded_channel();
        let task = tokio::spawn(run(
            url.to_string(),
            api_key.to_string(),
            setup,
            ws,
            out_rx,
            ev_tx,
        ));
        Ok(Self {
            outbox,
            events,
            task,
        })
    }

    fn send(&self, msg: Value) {
        let _ = self.outbox.send(Outgoing::Control(msg.to_string()));
    }

    /// 16 kHz mono caller audio.
    pub fn send_audio(&self, pcm: &[i16]) {
        let msg = json!({"realtimeInput": {"audio": {
            "data": B64.encode(i16_to_le_bytes(pcm)),
            "mimeType": "audio/pcm;rate=16000",
        }}});
        let _ = self.outbox.send(Outgoing::Audio(msg.to_string()));
    }

    pub fn send_text(&self, text: &str) {
        self.send(json!({"realtimeInput": {"text": text}}));
    }

    /// Adds context without prompting a reply (e.g. a text message that arrived mid-call).
    pub fn add_context(&self, text: &str) {
        self.send(json!({"clientContent": {
            "turns": [{"role": "user", "parts": [{"text": text}]}],
            "turnComplete": false,
        }}));
    }

    /// `scheduling` applies to non-blocking functions: "INTERRUPT", "WHEN_IDLE" or "SILENT".
    pub fn send_tool_response(&self, id: &str, name: &str, response: Value, scheduling: &str) {
        self.send(json!({"toolResponse": {"functionResponses": [{
            "id": id, "name": name, "response": response, "scheduling": scheduling,
        }]}}));
    }
}

impl Drop for Live {
    fn drop(&mut self) {
        self.task.abort();
    }
}

async fn open(url: &str, api_key: &str, setup: &Value) -> Result<Ws> {
    let mut req = url.into_client_request()?;
    req.headers_mut().insert("x-goog-api-key", api_key.parse()?);
    let (mut ws, _) = tokio::time::timeout(
        Duration::from_secs(15),
        tokio_tungstenite::connect_async(req),
    )
    .await
    .context("timed out connecting to Gemini Live")?
    .context("connecting to Gemini Live")?;
    ws.send(Message::text(setup.to_string())).await?;
    let ready = async {
        while let Some(frame) = ws.next().await {
            match frame? {
                Message::Text(t) => {
                    if serde_json::from_str::<Value>(&t)?
                        .get("setupComplete")
                        .is_some()
                    {
                        return Ok(());
                    }
                }
                Message::Binary(b) => {
                    if serde_json::from_slice::<Value>(&b)?
                        .get("setupComplete")
                        .is_some()
                    {
                        return Ok(());
                    }
                }
                Message::Close(c) => bail!("Gemini Live closed during setup: {c:?}"),
                _ => {}
            }
        }
        Err(anyhow!("Gemini Live closed during setup"))
    };
    tokio::time::timeout(Duration::from_secs(15), ready)
        .await
        .context("timed out waiting for Gemini Live setup")??;
    Ok(ws)
}

enum Turnover {
    Reconnect(String),
    Stop,
}

/// Runs one connection. `backlog` holds control messages that must go out first; a message whose
/// send fails is put back so the next connection delivers it.
async fn pump(
    ws: &mut Ws,
    out_rx: &mut mpsc::UnboundedReceiver<Outgoing>,
    backlog: &mut VecDeque<String>,
    ev_tx: &mpsc::UnboundedSender<LiveEvent>,
    resume_handle: &mut Option<String>,
) -> Turnover {
    while let Some(text) = backlog.pop_front() {
        if let Err(e) = ws.send(Message::text(text.clone())).await {
            backlog.push_front(text);
            return Turnover::Reconnect(format!("send failed: {e}"));
        }
    }
    // After goAway, let the current turn finish (resumption restores state only up to the
    // last checkpoint) unless the server is about to close anyway.
    let mut leave_at: Option<Instant> = None;
    loop {
        tokio::select! {
            _ = sleep_until(leave_at.unwrap_or_else(Instant::now)), if leave_at.is_some() => {
                return Turnover::Reconnect("goAway".into());
            }
            out = out_rx.recv() => match out {
                Some(Outgoing::Audio(text)) => {
                    if let Err(e) = ws.send(Message::text(text)).await {
                        return Turnover::Reconnect(format!("send failed: {e}"));
                    }
                }
                Some(Outgoing::Control(text)) => {
                    if let Err(e) = ws.send(Message::text(text.clone())).await {
                        backlog.push_back(text);
                        return Turnover::Reconnect(format!("send failed: {e}"));
                    }
                }
                None => {
                    let _ = ws.close(None).await;
                    return Turnover::Stop;
                }
            },
            frame = ws.next() => {
                let value = match frame {
                    Some(Ok(Message::Text(t))) => serde_json::from_str::<Value>(&t),
                    Some(Ok(Message::Binary(b))) => serde_json::from_slice::<Value>(&b),
                    Some(Ok(Message::Close(c))) => return Turnover::Reconnect(format!("closed: {c:?}")),
                    Some(Ok(_)) => continue,
                    Some(Err(e)) => return Turnover::Reconnect(format!("socket error: {e}")),
                    None => return Turnover::Reconnect("socket ended".into()),
                };
                let Ok(value) = value else { continue };
                let parsed = parse_server_message(&value);
                if parsed.resume_handle.is_some() {
                    *resume_handle = parsed.resume_handle;
                }
                for ev in parsed.events {
                    if ev_tx.send(ev).is_err() {
                        return Turnover::Stop;
                    }
                }
                if let Some(time_left) = parsed.go_away {
                    leave_at = Some(Instant::now() + time_left.saturating_sub(Duration::from_secs(1)));
                }
                if leave_at.is_some() && parsed.turn_complete {
                    return Turnover::Reconnect("goAway".into());
                }
            }
        }
    }
}

async fn run(
    url: String,
    api_key: String,
    setup: Setup,
    mut ws: Ws,
    mut out_rx: mpsc::UnboundedReceiver<Outgoing>,
    ev_tx: mpsc::UnboundedSender<LiveEvent>,
) {
    let mut resume_handle = None;
    let mut backlog = VecDeque::new();
    let mut failures = 0;
    loop {
        let why = match pump(
            &mut ws,
            &mut out_rx,
            &mut backlog,
            &ev_tx,
            &mut resume_handle,
        )
        .await
        {
            Turnover::Stop => return,
            Turnover::Reconnect(why) => why,
        };
        let Some(handle) = resume_handle.clone() else {
            let _ = ev_tx.send(LiveEvent::Closed(why));
            return;
        };
        log::info!("gemini: {why}; resuming session");
        // After goAway the old socket is still open, and the server refuses to resume a session
        // that is still connected ("already connected to an existing client").
        let _ = tokio::time::timeout(Duration::from_secs(2), ws.close(None)).await;
        loop {
            match open(&url, &api_key, &setup.message(Some(&handle))).await {
                Ok(next) => {
                    ws = next;
                    failures = 0;
                    break;
                }
                Err(e) if failures + 1 < MAX_RECONNECTS => {
                    failures += 1;
                    log::warn!("gemini: resume attempt {failures} failed: {e:#}");
                    tokio::time::sleep(Duration::from_millis(500 * u64::from(failures))).await;
                }
                Err(e) => {
                    let _ = ev_tx.send(LiveEvent::Closed(format!("could not resume: {e:#}")));
                    return;
                }
            }
        }
        // Audio that piled up during the gap is stale; control messages are kept in order.
        while let Ok(out) = out_rx.try_recv() {
            if let Outgoing::Control(text) = out {
                backlog.push_back(text);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_audio_transcripts_and_interrupt() {
        let pcm = B64.encode(i16_to_le_bytes(&[1, -2, 3]));
        let msg = json!({"serverContent": {
            "interrupted": true,
            "modelTurn": {"parts": [{"inlineData": {"mimeType": "audio/pcm;rate=24000", "data": pcm}}]},
            "inputTranscription": {"text": "hi"},
            "outputTranscription": {"text": "hello"},
        }});
        assert_eq!(
            parse_server_message(&msg).events,
            vec![
                LiveEvent::Interrupted,
                LiveEvent::Audio(vec![1, -2, 3]),
                LiveEvent::InputTranscript("hi".into()),
                LiveEvent::OutputTranscript("hello".into()),
            ]
        );
    }

    #[test]
    fn parses_tool_calls_resumption_and_go_away() {
        let msg = json!({
            "toolCall": {"functionCalls": [{"id": "c1", "name": "ask_hermes", "args": {"request": "x"}}]},
            "toolCallCancellation": {"ids": ["c0"]},
            "sessionResumptionUpdate": {"newHandle": "h2", "resumable": true},
            "goAway": {"timeLeft": "5s"},
            "serverContent": {"turnComplete": true},
        });
        let p = parse_server_message(&msg);
        assert_eq!(
            p.events,
            vec![
                LiveEvent::TurnComplete,
                LiveEvent::ToolCall {
                    id: "c1".into(),
                    name: "ask_hermes".into(),
                    args: json!({"request": "x"})
                },
                LiveEvent::ToolCancelled(vec!["c0".into()]),
            ]
        );
        assert_eq!(p.resume_handle.as_deref(), Some("h2"));
        assert!(p.turn_complete);
        assert_eq!(p.go_away, Some(Duration::from_secs(5)));
    }

    #[test]
    fn reports_token_usage() {
        let msg = json!({"usageMetadata": {"promptTokenCount": 1200, "responseTokenCount": 80, "totalTokenCount": 1280}});
        assert_eq!(
            parse_server_message(&msg).events,
            vec![LiveEvent::Usage {
                prompt: 1200,
                response: 80
            }]
        );
    }

    #[test]
    fn ignores_non_resumable_handles() {
        let msg = json!({"sessionResumptionUpdate": {"newHandle": "h", "resumable": false}});
        assert_eq!(parse_server_message(&msg).resume_handle, None);
    }

    #[test]
    fn live_config_overrides_merge_into_setup() {
        let setup = Setup {
            model: "gemini-3.8-live".into(),
            voice: "Kore".into(),
            system_instruction: "be brief".into(),
            functions: vec![json!({"name": "end_call"})],
            languages: vec!["en-US".into(), "ta-IN".into()],
            speech_language: String::new(),
            pause_ms: 600,
            overrides: json!({
                "generationConfig": {"temperature": 0.4, "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Puck"}}}},
                "realtimeInputConfig": {"automaticActivityDetection": {"silenceDurationMs": 900}},
                "inputAudioTranscription": {"languageCodes": ["ta-IN", "en-US"]},
                "tools": [{"googleSearch": {}}],
            }),
            ..Default::default()
        };
        let m = &setup.message(None)["setup"];
        let gen_cfg = &m["generationConfig"];
        assert_eq!(gen_cfg["temperature"], 0.4);
        assert_eq!(
            gen_cfg["speechConfig"]["voiceConfig"]["prebuiltVoiceConfig"]["voiceName"],
            "Puck"
        );
        assert_eq!(
            gen_cfg["responseModalities"][0], "AUDIO",
            "untouched defaults stay"
        );
        assert_eq!(
            m["realtimeInputConfig"]["automaticActivityDetection"]["silenceDurationMs"],
            900
        );
        assert_eq!(
            m["realtimeInputConfig"]["activityHandling"],
            "START_OF_ACTIVITY_INTERRUPTS"
        );
        assert_eq!(
            m["inputAudioTranscription"]["languageCodes"][0], "ta-IN",
            "live_config wins over languages"
        );
        assert_eq!(
            m["tools"][0]["functionDeclarations"][0]["name"], "end_call",
            "plugin tools kept"
        );
        assert!(
            m["tools"][1].get("googleSearch").is_some(),
            "owner tools appended"
        );
    }

    #[test]
    fn languages_pin_speech_recognition() {
        let setup = Setup {
            model: "m".into(),
            voice: "v".into(),
            system_instruction: String::new(),
            functions: vec![],
            languages: vec!["en-US".into(), "ta-IN".into()],
            overrides: json!({}),
            ..Default::default()
        };
        let m = &setup.message(None)["setup"];
        assert_eq!(
            m["inputAudioTranscription"]["languageCodes"],
            json!(["en-US", "ta-IN"])
        );
        assert!(m["generationConfig"]["speechConfig"]["languageCode"].is_null());

        let setup = Setup {
            voice: "v".into(),
            speech_language: "ta-IN".into(),
            ..setup
        };
        let speech = &setup.message(None)["setup"]["generationConfig"]["speechConfig"];
        assert_eq!(speech["languageCode"], "ta-IN");
        assert_eq!(
            speech["voiceConfig"]["prebuiltVoiceConfig"]["voiceName"],
            "v"
        );
    }

    #[test]
    fn history_and_vocabulary_go_into_setup() {
        let setup = Setup {
            languages: vec!["en-US".into()],
            history: vec![json!({"role": "user", "parts": [{"text": "hi"}]})],
            vocabulary: vec!["Zephyrine".into()],
            ..Default::default()
        };
        let m = &setup.message(None)["setup"];
        assert_eq!(m["historyConfig"]["initialHistoryInClientContent"], true);
        assert_eq!(
            m["inputAudioTranscription"],
            json!({"languageCodes": ["en-US"], "customVocabulary": ["Zephyrine"]})
        );
        assert_eq!(
            m["outputAudioTranscription"],
            json!({"customVocabulary": ["Zephyrine"]})
        );
    }

    #[test]
    fn setup_message_shape() {
        let setup = Setup {
            model: "gemini-3.8-live".into(),
            voice: "Kore".into(),
            system_instruction: "be brief".into(),
            functions: vec![json!({"name": "end_call"})],
            languages: vec![],
            speech_language: String::new(),
            pause_ms: 750,
            overrides: json!({}),
            history: vec![json!({"role": "user", "parts": [{"text": "hi"}]})],
            vocabulary: vec![],
        };
        let m = setup.message(Some("h1"));
        assert!(
            m["setup"].get("historyConfig").is_none(),
            "a resumed session already has its history"
        );
        assert_eq!(m["setup"]["model"], "models/gemini-3.8-live");
        assert_eq!(m["setup"]["sessionResumption"]["handle"], "h1");
        assert_eq!(
            m["setup"]["tools"][0]["functionDeclarations"][0]["name"],
            "end_call"
        );
        assert_eq!(
            m["setup"]["generationConfig"]["responseModalities"][0],
            "AUDIO"
        );
        assert_eq!(
            m["setup"]["realtimeInputConfig"]["automaticActivityDetection"]["silenceDurationMs"],
            750
        );
    }

    /// Live check against the real API: `GEMINI_API_KEY=... cargo test -- --ignored`.
    /// `HWV_LIVE_CONFIG='{...}'` also sends those setup overrides, to check the API accepts them.
    #[tokio::test]
    #[ignore]
    async fn live_round_trip() {
        let key = std::env::var("GEMINI_API_KEY").expect("GEMINI_API_KEY");
        let setup = Setup {
            model: std::env::var("HWV_MODEL").unwrap_or_else(|_| "gemini-3.8-live".into()),
            voice: "Kore".into(),
            system_instruction: "Answer in one short sentence.".into(),
            functions: vec![
                json!({"name": "end_call", "description": "Hang up.", "behavior": "NON_BLOCKING"}),
            ],
            languages: vec![],
            speech_language: String::new(),
            pause_ms: 600,
            overrides: std::env::var("HWV_LIVE_CONFIG")
                .map(|raw| serde_json::from_str(&raw).expect("HWV_LIVE_CONFIG JSON"))
                .unwrap_or_else(|_| json!({})),
            // Checks that the API takes history and vocabulary, and that the model uses the history.
            history: vec![
                json!({"role": "user", "parts": [{"text": "My favourite colour is teal."}]}),
                json!({"role": "model", "parts": [{"text": "Got it, teal."}]}),
            ],
            vocabulary: vec!["Zephyrine".into()],
        };
        let mut live = Live::connect(ENDPOINT, &key, setup).await.expect("connect");
        live.send_text("What is my favourite colour?");
        let (mut audio, mut transcript) = (0usize, String::new());
        let deadline = tokio::time::Instant::now() + Duration::from_secs(30);
        loop {
            match tokio::time::timeout_at(deadline, live.events.recv()).await {
                Ok(Some(LiveEvent::Audio(pcm))) => audio += pcm.len(),
                Ok(Some(LiveEvent::OutputTranscript(t))) => transcript.push_str(&t),
                Ok(Some(LiveEvent::TurnComplete)) if !transcript.is_empty() => break,
                Ok(Some(LiveEvent::Closed(why))) => panic!("closed: {why}"),
                Ok(Some(_)) => {}
                Ok(None) | Err(_) => break,
            }
        }
        println!("audio samples: {audio}, transcript: {transcript:?}");
        assert!(
            audio >= 24_000,
            "expected at least 1s of speech, got {audio} samples"
        );
        assert!(
            transcript.to_lowercase().contains("teal"),
            "history not used: {transcript:?}"
        );
    }
}
