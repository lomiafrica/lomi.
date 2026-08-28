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

    if me.environment == "live" && !args.allow_production {
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
                handle_event(&event, args.forward_url.as_deref(), &http).await?;
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

async fn handle_event(
    event: &StreamEvent,
    forward_url: Option<&str>,
    http: &reqwest::Client,
) -> Result<()> {
    match event.event_type.as_str() {
        "ping" => {}
        "connected" => {
            println!();
            cli::output::print_success("Stream connected");
            if let Some(org_id) = &event.organization_id {
                println!("{} {}", "Organization:".bright_black(), org_id.cyan());
            }
            if event
                .webhook_secret
                .as_deref()
                .is_some_and(|secret| !secret.is_empty())
            {
                println!(
                    "{} Webhook secret received. Store it as LOMI_WEBHOOK_SECRET (value not printed).",
                    "○".bright_black()
                );
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
                    let mut req = http.post(url).json(payload);
                    for (key, value) in headers {
                        if let Some(s) = value.as_str() {
                            req = req.header(key, s);
                        }
                    }
                    match req.send().await {
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
