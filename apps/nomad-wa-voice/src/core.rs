//! Client for the plugin's core-session service (`core_session.py`, run by
//! `hermes whatsapp-voice serve`): the call's context comes from the owner's WhatsApp DM session,
//! tools run through Hermes in that session, and the call is written back into it.

use std::time::Duration;

use anyhow::{Context, Result, bail};
use serde_json::{Value, json};

pub const DEEP_TOOL: &str = "ask_hermes_deep";

/// Context for one call, as `/voice/start` returns it.
#[derive(Debug, Default)]
pub struct CallContext {
    pub session_id: String,
    pub system_instruction: String,
    pub history: Vec<Value>,
    pub functions: Vec<Value>,
    pub vocabulary: Vec<String>,
}

#[derive(Clone)]
pub struct Core {
    http: reqwest::Client,
    base: String,
    token: String,
    call: String,
}

impl Core {
    pub fn new(base: &str, token: &str, call: &str) -> Self {
        Self {
            // Tool and deep-turn waits are bounded on the service side (2 and 10 minutes).
            http: reqwest::Client::builder()
                .timeout(Duration::from_secs(660))
                .build()
                .expect("http client"),
            base: base.to_string(),
            token: token.to_string(),
            call: call.to_string(),
        }
    }

    async fn post(&self, path: &str, mut body: Value) -> Result<Value> {
        body["call"] = json!(self.call);
        let resp = self
            .http
            .post(format!("{}{path}", self.base))
            .bearer_auth(&self.token)
            .json(&body)
            .send()
            .await
            .with_context(|| format!("core session {path}"))?;
        let status = resp.status();
        let value: Value = resp.json().await.unwrap_or(json!({}));
        if !status.is_success() {
            bail!(
                "core session {path}: {status}: {}",
                value["error"].as_str().unwrap_or("")
            );
        }
        Ok(value)
    }

    pub async fn start(&self, direction: &str, reason: &str, details: &str) -> Result<CallContext> {
        let v = self
            .post(
                "/voice/start",
                json!({"direction": direction, "reason": reason, "details": details}),
            )
            .await?;
        let strings = |key: &str| -> Vec<String> {
            v[key]
                .as_array()
                .into_iter()
                .flatten()
                .filter_map(|s| s.as_str().map(String::from))
                .collect()
        };
        Ok(CallContext {
            session_id: v["session_id"].as_str().unwrap_or_default().to_string(),
            system_instruction: v["system_instruction"]
                .as_str()
                .unwrap_or_default()
                .to_string(),
            history: v["history"].as_array().cloned().unwrap_or_default(),
            functions: v["functions"].as_array().cloned().unwrap_or_default(),
            vocabulary: strings("vocabulary"),
        })
    }

    /// Runs one function call and returns the response for the model.
    pub async fn call_tool(&self, tool_id: &str, name: &str, args: &Value) -> Value {
        let result = match name {
            DEEP_TOOL => {
                self.post(
                    "/voice/deep",
                    json!({"request": args["request"].as_str().unwrap_or_default()}),
                )
                .await
            }
            _ => {
                self.post(
                    "/voice/tool",
                    json!({"id": tool_id, "name": name, "args": args}),
                )
                .await
            }
        };
        result.unwrap_or_else(|e| json!({"error": format!("{e:#}")}))
    }

    /// Sends call events for write-back; returns text-chat news to tell the model, if any.
    pub async fn events(&self, events: Vec<Value>) -> Result<String> {
        let v = self
            .post("/voice/events", json!({"events": events}))
            .await?;
        Ok(v["chat_updates"].as_str().unwrap_or_default().to_string())
    }

    pub async fn end(&self) -> Result<u64> {
        Ok(self.post("/voice/end", json!({})).await?["written"]
            .as_u64()
            .unwrap_or(0))
    }
}

/// The function the bridge adds to the session's own tools.
pub fn bridge_functions() -> Vec<Value> {
    vec![json!({
        "name": DEEP_TOOL,
        "description": "Run a full turn of your normal text self (your main model, with all of \
            your tools) in this same conversation. Use it for multi-step or heavy work, or anything \
            your tools on this call cannot do. Pass a complete, self-contained request.",
        "parameters": {
            "type": "object",
            "properties": {"request": {"type": "string", "description": "What to do, in full."}},
            "required": ["request"],
        },
        "behavior": "NON_BLOCKING",
    })]
}
