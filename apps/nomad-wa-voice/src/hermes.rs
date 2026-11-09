//! Hermes API server client (`/v1/runs`): how the voice agent hands real work to Hermes.

use std::time::{Duration, Instant};

use anyhow::{Context, Result, bail};
use serde_json::{Value, json};

const TERMINAL: [&str; 4] = ["completed", "failed", "cancelled", "interrupted"];

#[derive(Clone)]
pub struct Hermes {
    http: reqwest::Client,
    base: String,
    key: String,
}

/// Stops the run unless disarmed, so a run whose caller gave up (timeout, cancelled tool call,
/// call ended) does not keep acting on the owner's behalf with nobody listening.
struct StopOnDrop {
    hermes: Hermes,
    run_id: String,
    armed: bool,
}

impl Drop for StopOnDrop {
    fn drop(&mut self) {
        if !self.armed {
            return;
        }
        let (hermes, run_id) = (self.hermes.clone(), self.run_id.clone());
        if let Ok(rt) = tokio::runtime::Handle::try_current() {
            rt.spawn(async move {
                let _ = hermes
                    .http
                    .post(format!("{}/v1/runs/{run_id}/stop", hermes.base))
                    .bearer_auth(&hermes.key)
                    .send()
                    .await;
            });
        }
    }
}

impl Hermes {
    pub fn new(base: &str, key: &str) -> Self {
        Self {
            http: reqwest::Client::builder()
                .timeout(Duration::from_secs(30))
                .build()
                .expect("http client"),
            base: base.to_string(),
            key: key.to_string(),
        }
    }

    async fn poll(&self, run_id: &str) -> Result<Value> {
        Ok(self
            .http
            .get(format!("{}/v1/runs/{run_id}", self.base))
            .bearer_auth(&self.key)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?)
    }

    /// Start a run and wait for its final answer.
    pub async fn run(
        &self,
        input: &str,
        instructions: &str,
        session_id: &str,
        timeout: Duration,
    ) -> Result<String> {
        let started: Value = self
            .http
            .post(format!("{}/v1/runs", self.base))
            .bearer_auth(&self.key)
            .json(&json!({"input": input, "instructions": instructions, "session_id": session_id}))
            .send()
            .await
            .context("Hermes API server unreachable")?
            .error_for_status()
            .context("Hermes rejected the run")?
            .json()
            .await?;
        let run_id = started["run_id"]
            .as_str()
            .context("no run_id in response")?
            .to_string();
        let mut guard = StopOnDrop {
            hermes: self.clone(),
            run_id: run_id.clone(),
            armed: true,
        };

        let deadline = Instant::now() + timeout;
        loop {
            tokio::time::sleep(Duration::from_secs(1)).await;
            match self.poll(&run_id).await {
                Ok(run) => {
                    let status = run["status"].as_str().unwrap_or("unknown");
                    if TERMINAL.contains(&status) {
                        guard.armed = false;
                        if status != "completed" {
                            bail!("Hermes run {status}: {}", run["error"]);
                        }
                        return Ok(run["output"].as_str().unwrap_or_default().to_string());
                    }
                }
                // Transient (Hermes restarting, a slow response): keep trying until the deadline.
                Err(e) => log::warn!("polling Hermes run {run_id}: {e:#}"),
            }
            if Instant::now() >= deadline {
                bail!("Hermes did not finish within {}s", timeout.as_secs());
            }
        }
    }
}
