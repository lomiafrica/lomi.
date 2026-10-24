use anyhow::{bail, Context, Result};
use clap::Args;
use colored::Colorize;
use futures_util::StreamExt;
use serde::Deserialize;

use crate::api::{ApiClient, MeResponse};
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
#[command(after_help = "Example:\n  lomi listen http://localhost:3000/webhooks")]
pub struct ListenArgs {
    /// Forward webhook events to this URL (e.g. http://localhost:3000/webhooks)
    pub forward_url: Option<String>,

    /// Allow listening on production (requires API CLI_LISTEN_ALLOW_PRODUCTION=true)
    #[arg(long)]
    pub allow_production: bool,
}

#[derive(Debug, Deserialize)]
struct StreamEvent {
    #[serde(rename = "type")]
    event_type: String,
    organization_id: Option<String>,
    webhook_secret: Option<String>,
    event: Option<String>,
    headers: Option<serde_json::Map<String, serde_json::Value>>,
    payload: Option<serde_json::Value>,
}

pub async fn run(common: &CommonOptions, args: ListenArgs) -> Result<()> {
    let auth = ensure_authenticated(common, true, true, true).await?;
    let client = ApiClient::new(&auth)?;

    let me: MeResponse = client.get("/me").await?;
    cli::banner::print_intro("Listening for lomi. webhooks");
    println!(
        "{} {} ({})",
        "Connected to".bright_black(),
        me.organization_name.cyan(),
        me.environment.bright_black()
    );

    if live_listen_blocked(&me.environment, args.allow_production) {
        bail!(
            "CLI listen is sandbox-first. Use profile `sandbox` or pass --allow-production (requires API CLI_LISTEN_ALLOW_PRODUCTION=true)."
        );
    }

    let mut url = format!("{}/cli/listen", auth.api_url.trim_end_matches('/'));
    if args.allow_production {
        url.push_str("?allow_production=true");
    }

    let http = reqwest::Client::builder()
        .default_headers(client.headers())
        .build()?;

    let response = http
        .get(&url)
        .send()
        .await
        .context("Failed to connect to CLI listen stream")?;

    if !response.status().is_success() {
        let status = response.status();
        let text = response.text().await.unwrap_or_default();
        bail!("CLI listen failed ({status}): {text}");
    }

    if let Some(forward) = &args.forward_url {
        println!(
            "{} {}",
            "Forwarding to".bright_black(),
            forward.bright_blue()
        );
    }
    println!("{} Press Ctrl+C to stop.", "○".bright_black());
    cli::output::divider();

    let mut stream = response.bytes_stream();
    let mut buffer = String::new();

    while let Some(chunk) = stream.next().await {
        let chunk = chunk.context("Stream read error")?;
        buffer.push_str(&String::from_utf8_lossy(&chunk));

        while let Some(pos) = buffer.find("\n\n") {
            let block = buffer.drain(..pos + 2).collect::<String>();
            if let Some(event) = parse_sse_block(&block) {
                handle_event(&event, args.forward_url.as_deref()).await?;
            }
        }
    }

    Ok(())
}

fn parse_sse_block(block: &str) -> Option<StreamEvent> {
    for line in block.lines() {
        if let Some(data) = line.strip_prefix("data:") {
            let data = data.trim();
            if data.is_empty() {
                continue;
            }
            return serde_json::from_str(data).ok();
        }
    }
    None
}

/// Build the outbound webhook replay. Uses a fresh client so the listen
/// stream's default `X-API-KEY` is never attached to the merchant URL.
fn forward_webhook_request(
    url: &str,
    headers: &serde_json::Map<String, serde_json::Value>,
    payload: &serde_json::Value,
) -> reqwest::RequestBuilder {
    let mut req = reqwest::Client::new().post(url).json(payload);
    for (key, value) in headers {
        if let Some(s) = value.as_str() {
            req = req.header(key, s);
        }
    }
    req
}

async fn handle_event(event: &StreamEvent, forward_url: Option<&str>) -> Result<()> {
    match event.event_type.as_str() {
        "ping" => {}
        "connected" => {
            println!();
            cli::output::print_success("Stream connected");
            if let Some(org_id) = &event.organization_id {
                println!("{} {}", "Organization:".bright_black(), org_id.cyan());
            }
            if let Some(notice) = webhook_secret_notice(event.webhook_secret.as_deref()) {
                println!("{} {}", "○".bright_black(), notice);
            }
            cli::output::divider();
        }
        "webhook" => {
            let event_name = event.event.as_deref().unwrap_or("WEBHOOK");
            let timestamp = chrono::Local::now().format("%b %d %H:%M:%S");
            println!();
            println!(
                "{} {} {}",
                timestamp.to_string().bright_black(),
                event_name.yellow().bold(),
                "received".bright_black()
            );

            if let Some(payload) = &event.payload {
                println!(
                    "{}",
                    serde_json::to_string_pretty(payload).unwrap_or_default()
                );
            }

            if let Some(url) = forward_url {
                if let (Some(headers), Some(payload)) = (&event.headers, &event.payload) {
                    match forward_webhook_request(url, headers, payload).send().await {
                        Ok(resp) => {
                            println!(
                                "{} {} {}",
                                "○".bright_black(),
                                "Forwarded".green(),
                                format!("({})", resp.status()).bright_black()
                            );
                        }
                        Err(error) => {
                            println!(
                                "{} {} {}",
                                "○".bright_black(),
                                "Forward failed".red(),
                                error.to_string().bright_black()
                            );
                        }
                    }
                }
            }
        }
        other => {
            println!("{} Unknown event type: {}", "○".bright_black(), other);
        }
    }
    Ok(())
}

fn live_listen_blocked(environment: &str, allow_production: bool) -> bool {
    environment == "live" && !allow_production
}

const WEBHOOK_SECRET_NOTICE: &str =
    "Webhook secret received. Store it as LOMI_WEBHOOK_SECRET (value not printed).";

fn webhook_secret_notice(secret: Option<&str>) -> Option<&'static str> {
    secret
        .filter(|value| !value.is_empty())
        .map(|_| WEBHOOK_SECRET_NOTICE)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sandbox_listen_is_allowed_without_flag() {
        assert!(!live_listen_blocked("sandbox", false));
        assert!(!live_listen_blocked("test", false));
        assert!(!live_listen_blocked("live", true));
    }

    #[test]
    fn live_listen_requires_allow_production() {
        assert!(live_listen_blocked("live", false));
    }

    #[test]
    fn connected_notice_does_not_include_the_secret() {
        let secret = "whsec_should_never_print";
        let notice = webhook_secret_notice(Some(secret)).unwrap();
        assert!(!notice.contains(secret));
        assert!(notice.contains("LOMI_WEBHOOK_SECRET"));
        assert!(webhook_secret_notice(None).is_none());
        assert!(webhook_secret_notice(Some("")).is_none());
    }

    #[test]
    fn parses_sse_data_line() {
        let block = "event: message\ndata: {\"type\":\"connected\",\"organization_id\":\"org_1\",\"webhook_secret\":\"whsec_secret\"}\n\n";
        let event = parse_sse_block(block).unwrap();
        assert_eq!(event.event_type, "connected");
        assert_eq!(event.organization_id.as_deref(), Some("org_1"));
        assert_eq!(event.webhook_secret.as_deref(), Some("whsec_secret"));
    }

    #[test]
    fn skips_empty_or_invalid_sse_data() {
        assert!(parse_sse_block("event: ping\n\n").is_none());
        assert!(parse_sse_block("data: not-json\n\n").is_none());
        assert!(parse_sse_block("data:\n\n").is_none());
    }

    #[test]
    fn forwarded_webhook_omits_cli_api_key_and_keeps_signature() {
        let mut headers = serde_json::Map::new();
        headers.insert(
            "X-Lomi-Signature-V1".to_string(),
            serde_json::Value::String("t=1,v1=abc".to_string()),
        );
        let payload = serde_json::json!({ "id": "evt_1" });
        let request = forward_webhook_request("https://example.test/webhooks", &headers, &payload)
            .build()
            .expect("forward request should build");

        assert!(
            request.headers().get("x-api-key").is_none(),
            "CLI API key must not be sent to the forward URL"
        );
        assert_eq!(
            request
                .headers()
                .get("x-lomi-signature-v1")
                .and_then(|value| value.to_str().ok()),
            Some("t=1,v1=abc")
        );
    }
}
