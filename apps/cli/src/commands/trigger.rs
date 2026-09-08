use anyhow::{bail, Result};
use clap::Args;
use colored::Colorize;

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

pub const WEBHOOK_EVENTS: &[&str] = &[
    "PAYMENT_CREATED",
    "PAYMENT_SUCCEEDED",
    "PAYMENT_FAILED",
    "PURCHASE_FULFILLED",
    "REFUND_CREATED",
    "REFUND_COMPLETED",
    "REFUND_FAILED",
    "SUBSCRIPTION_CREATED",
    "SUBSCRIPTION_UPDATED",
    "SUBSCRIPTION_RENEWED",
    "SUBSCRIPTION_CANCELLED",
    "NETWORK_ENROLLMENT_CREATED",
    "NETWORK_ENROLLMENT_COMPLETED",
    "NETWORK_MEMBERSHIP_ACTIVE",
    "NETWORK_MEMBERSHIP_RESTRICTED",
    "NETWORK_MEMBERSHIP_TERMINATED",
    "NETWORK_PAYMENT_CREATED",
    "NETWORK_OPERATOR_FEE_CREATED",
    "NETWORK_OPERATOR_FEE_REVERSED",
    "USAGE_RECORDED",
    "USAGE_INVOICE_CREATED",
    "USAGE_INVOICE_PAID",
    "USAGE_INVOICE_OVERDUE",
    "SUBSCRIPTION_USAGE_PERIOD_CLOSED",
    "DISPUTE_CREATED",
    "DISPUTE_UPDATED",
    "DISPUTE_CLOSED",
    "PAYMENT_RISK_FLAGGED",
    "PAYMENT_RISK_BLOCKED",
    "PAYOUT_CREATED",
    "PAYOUT_COMPLETED",
    "PAYOUT_FAILED",
];

#[derive(Args, Debug)]
pub struct TriggerArgs {
    /// Webhook event type to emit (sandbox synthetic payload)
    pub event: Option<String>,

    /// Optional webhook ID to scope delivery
    #[arg(long)]
    pub webhook_id: Option<String>,

    /// List available event types and sample payload shape
    #[arg(long)]
    pub list: bool,
}

pub async fn run(common: &CommonOptions, args: TriggerArgs) -> Result<()> {
    let json = cli::output::should_use_json(common);

    if args.list || args.event.is_none() {
        let catalog: Vec<serde_json::Value> = WEBHOOK_EVENTS
            .iter()
            .map(|event| {
                serde_json::json!({
                    "event": event,
                    "sample": {
                        "id": "evt_sample",
                        "type": event,
                        "data": { "object": "example" }
                    }
                })
            })
            .collect();
        if json {
            return cli::output::print_json(&catalog);
        }
        if common.show_ui() {
            cli::banner::print_intro("Webhook event catalog");
        }
        for event in WEBHOOK_EVENTS {
            println!("{event}");
        }
        if args.event.is_none() && !args.list {
            cli::output::print_hint("Pass an event name, e.g. lomi trigger PAYMENT_SUCCEEDED");
        }
        if args.event.is_none() {
            return Ok(());
        }
    }

    let event = args.event.as_deref().unwrap();
    if !WEBHOOK_EVENTS.contains(&event) {
        bail!("Unknown event {event}. Run `lomi trigger --list`.");
    }
    if !json {
        cli::banner::print_intro("Trigger synthetic webhook event");
    }

    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;

    let body = serde_json::json!({
        "event": event,
        "webhook_id": args.webhook_id,
    });

    let response: serde_json::Value = client.post("/cli/trigger", &body).await?;

    if json {
        return cli::output::print_json(&response);
    }

    cli::output::print_success(&format!("Triggered {}", event.cyan()));
    Ok(())
}
