//! Configuration from the environment. `hermes whatsapp-voice serve` fills it from the plugin's
//! settings and Hermes secrets.

use std::path::PathBuf;
use std::time::Duration;

use anyhow::{Context, Result, bail};

#[derive(Clone, Debug)]
pub struct Config {
    /// Owner's phone number, digits only.
    pub owner: String,
    pub listen: String,
    pub token: String,
    pub gemini_api_key: String,
    /// Live API WebSocket endpoint (a proxy, or a local fake in tests).
    pub gemini_url: String,
    pub model: String,
    pub voice: String,
    pub assistant_name: String,
    /// The owner's own extra rules for the voice (style, language, call length).
    pub voice_instructions: String,
    /// Language codes (e.g. en-US) the voice may use; empty means any.
    pub languages: Vec<String>,
    /// The owner's main spoken language (one code, e.g. ta-IN); empty leaves it to Gemini.
    pub speech_language: String,
    /// Owner pause (ms) that ends their turn.
    pub pause_ms: u32,
    /// Raw Gemini Live setup fields (JSON object) merged over the defaults.
    pub live_config: serde_json::Value,
    pub hermes_api_url: String,
    /// Empty disables ask_hermes.
    pub hermes_api_key: String,
    /// How long one Hermes run may take before it is abandoned: an owner's request during a
    /// call, the post-call digest, and the persona briefing. Raise it when real work (test
    /// runs, audits, long reports) legitimately needs more than three minutes.
    pub hermes_timeout: Duration,
    pub ring_timeout: Duration,
    pub max_duration: Duration,
    /// End a call after this long with nobody speaking.
    pub silence_timeout: Duration,
    /// Quiet time after the assistant's goodbye before it hangs up.
    pub hangup_grace: Duration,
    /// Tool calls the model may make in a row before it must speak to the owner.
    pub max_silent_tools: u32,
    /// Where each call's owner audio is saved as a WAV file; None turns recording off.
    pub recordings: Option<PathBuf>,
    pub answer_inbound: bool,
    pub send_summary: bool,
    /// Where the plugin's core-session service listens; empty means the separate-agent mode
    /// (persona briefing + ask_hermes) instead of acting as the owner's DM session.
    pub context_url: String,
    /// Words transcription should spell as given (names).
    pub vocabulary: Vec<String>,
}

pub(crate) fn list(raw: &str) -> Vec<String> {
    raw.split(',')
        .map(|l| l.trim().to_string())
        .filter(|l| !l.is_empty())
        .collect()
}

fn var(name: &str, default: &str) -> String {
    std::env::var(name)
        .ok()
        .filter(|v| !v.trim().is_empty())
        .unwrap_or_else(|| default.to_string())
}

fn required(name: &str) -> Result<String> {
    let v = var(name, "");
    if v.is_empty() {
        bail!("{name} is not set");
    }
    Ok(v)
}

/// Parses "45s", "15m", "1h" or plain seconds.
pub fn parse_duration(s: &str) -> Result<Duration> {
    let s = s.trim();
    if s.trim_start_matches('0')
        .trim_end_matches(['s', 'm', 'h'])
        .is_empty()
    {
        bail!("duration {s:?} must be more than zero");
    }
    let (num, unit) = s.split_at(s.find(|c: char| !c.is_ascii_digit()).unwrap_or(s.len()));
    let n: u64 = num.parse().with_context(|| format!("bad duration {s:?}"))?;
    let secs = match unit {
        "" | "s" => n,
        "m" => n * 60,
        "h" => n * 3600,
        _ => bail!("bad duration unit in {s:?}"),
    };
    Ok(Duration::from_secs(secs))
}

fn live_config(raw: &str) -> Result<serde_json::Value> {
    let value: serde_json::Value =
        serde_json::from_str(raw).context("live_config is not valid JSON")?;
    if !value.is_object() {
        bail!("live_config must be a JSON object of Gemini Live setup fields");
    }
    Ok(value)
}

pub fn digits(number: &str) -> String {
    number.chars().filter(char::is_ascii_digit).collect()
}

impl Config {
    /// Settings needed by both `pair` and `serve`.
    pub fn data_dir() -> Result<PathBuf> {
        Ok(PathBuf::from(required("HWV_DATA_DIR")?))
    }

    pub fn from_env() -> Result<Self> {
        let owner = digits(&required("HWV_OWNER")?);
        let listen = var("HWV_LISTEN", "127.0.0.1:8796");
        let remote = var("HWV_ALLOW_REMOTE", "false") == "true";
        let addr = listen
            .parse::<std::net::SocketAddr>()
            .with_context(|| format!("HWV_LISTEN must be host:port, got {listen:?}"))?;
        // The bearer token is the only auth. Loopback is the default so it never leaves the machine.
        if !remote && !addr.ip().is_loopback() {
            bail!("HWV_LISTEN must be a loopback address like 127.0.0.1:8796, got {listen:?}. Set HWV_ALLOW_REMOTE=true only on a private network.");
        }
        if owner.len() < 7 {
            bail!("HWV_OWNER must be a full international phone number");
        }
        Ok(Self {
            owner,
            listen,
            token: required("HWV_TOKEN")?,
            gemini_api_key: required("GEMINI_API_KEY")?,
            gemini_url: var("HWV_GEMINI_URL", crate::gemini::ENDPOINT),
            model: var("HWV_MODEL", "gemini-3.8-live"),
            voice: var("HWV_VOICE", "Kore"),
            assistant_name: var("HWV_ASSISTANT_NAME", "Nomad"),
            voice_instructions: var("HWV_VOICE_INSTRUCTIONS", ""),
            languages: list(&var("HWV_LANGUAGES", "")),
            speech_language: var("HWV_SPEECH_LANGUAGE", "").trim().to_string(),
            pause_ms: var("HWV_PAUSE_MS", "600")
                .parse()
                .context("HWV_PAUSE_MS must be a whole number of milliseconds")?,
            live_config: live_config(&var("HWV_LIVE_CONFIG", "{}"))?,
            hermes_api_url: var("HERMES_API_URL", "http://127.0.0.1:8642")
                .trim_end_matches('/')
                .to_string(),
            hermes_api_key: var("HERMES_API_KEY", ""),
            hermes_timeout: parse_duration(&var("HWV_HERMES_TIMEOUT", "180s"))?,
            ring_timeout: parse_duration(&var("HWV_RING_TIMEOUT", "45s"))?,
            max_duration: parse_duration(&var("HWV_MAX_DURATION", "15m"))?,
            silence_timeout: parse_duration(&var("HWV_SILENCE_TIMEOUT", "180s"))?,
            hangup_grace: parse_duration(&var("HWV_HANGUP_GRACE", "3s"))?,
            max_silent_tools: var("HWV_MAX_SILENT_TOOLS", "5")
                .parse()
                .context("HWV_MAX_SILENT_TOOLS must be a whole number")?,
            recordings: (var("HWV_RECORD_CALLS", "false") == "true")
                .then(|| Self::data_dir().map(|d| d.join("recordings")))
                .transpose()?,
            answer_inbound: var("HWV_ANSWER_INBOUND", "true") == "true",
            send_summary: var("HWV_SEND_SUMMARY", "true") == "true",
            context_url: var("HWV_CONTEXT_URL", "").trim_end_matches('/').to_string(),
            vocabulary: list(&var("HWV_VOCABULARY", "")),
        })
    }

    pub fn store_path(data_dir: &std::path::Path) -> String {
        data_dir.join("whatsapp.db").to_string_lossy().into_owned()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn durations() {
        assert_eq!(parse_duration("45s").unwrap(), Duration::from_secs(45));
        assert_eq!(parse_duration("15m").unwrap(), Duration::from_secs(900));
        assert_eq!(parse_duration("90").unwrap(), Duration::from_secs(90));
        assert!(parse_duration("5x").is_err());
        assert!(parse_duration("0m").is_err());
        assert!(parse_duration("0").is_err());
    }

    #[test]
    fn live_config_must_be_an_object() {
        assert_eq!(live_config("{}").unwrap(), serde_json::json!({}));
        assert!(live_config("[1]").is_err());
        assert!(live_config("{bad").is_err());
    }

    #[test]
    fn owner_digits() {
        assert_eq!(digits("+1 (555) 123-4567"), "15551234567");
    }
}
