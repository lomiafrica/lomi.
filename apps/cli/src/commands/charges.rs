use anyhow::{bail, Result};
use clap::{Args, Subcommand};
use colored::Colorize;
use serde::Serialize;
use serde_json::{json, Value};

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct ChargesArgs {
    #[command(subcommand)]
    pub command: ChargesCommand,
}

#[derive(Subcommand, Debug)]
pub enum ChargesCommand {
    /// Block a card deposit without taking it
    Hold(ChargesHoldArgs),
    /// Read a card charge, including a hold
    Get {
        /// Card payment id (pi_...)
        id: String,
    },
    /// Raise a confirmed hold to a higher total
    Raise(ChargesAmountArgs),
    /// Take some or all of a confirmed hold
    Capture(ChargesCaptureArgs),
    /// Release a hold without taking the money
    Release {
        /// Card payment id (pi_...)
        id: String,
    },
}

#[derive(Args, Debug)]
pub struct ChargesHoldArgs {
    /// Amount to block, in the currency's major units
    #[arg(long)]
    pub amount: i64,

    /// Currency code: XOF, USD, or EUR
    #[arg(long, value_parser = ["XOF", "USD", "EUR"])]
    pub currency: String,

    /// Existing customer id
    #[arg(long)]
    pub customer_id: Option<String>,

    /// Customer email. Required with --name when --customer-id is omitted
    #[arg(long)]
    pub email: Option<String>,

    /// Customer name. Required with --email when --customer-id is omitted
    #[arg(long)]
    pub name: Option<String>,

    /// Description stored on the charge
    #[arg(long)]
    pub description: Option<String>,
}

#[derive(Args, Debug)]
pub struct ChargesAmountArgs {
    /// Card payment id (pi_...)
    pub id: String,

    /// New total to block, in the same currency as the hold
    #[arg(long)]
    pub amount: i64,
}

#[derive(Args, Debug)]
pub struct ChargesCaptureArgs {
    /// Card payment id (pi_...)
    pub id: String,

    /// Amount to take. Omit to capture the full hold
    #[arg(long)]
    pub amount: Option<i64>,
}

#[derive(Serialize)]
struct HoldRequest {
    amount: i64,
    currency_code: String,
    hold: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    customer_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    customer_email: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    customer_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
}

pub async fn run(common: &CommonOptions, args: ChargesArgs) -> Result<()> {
    match args.command {
        ChargesCommand::Hold(hold_args) => hold(common, hold_args).await,
        ChargesCommand::Get { id } => get_charge(common, &id).await,
        ChargesCommand::Raise(raise_args) => raise(common, raise_args).await,
        ChargesCommand::Capture(capture_args) => capture(common, capture_args).await,
        ChargesCommand::Release { id } => release(common, &id).await,
    }
}

fn charge_id(id: &str) -> Result<&str> {
    if id.starts_with("pi_") && id.chars().all(|c| c.is_ascii_alphanumeric() || c == '_') {
        return Ok(id);
    }
    bail!("Card payment id must look like pi_...")
}

async fn client(common: &CommonOptions) -> Result<ApiClient> {
    let auth = ensure_authenticated(common, true, false, false).await?;
    ApiClient::new(&auth)
}

fn print_charge(common: &CommonOptions, title: &str, body: &Value) -> Result<()> {
    if cli::output::should_use_json(common) {
        return cli::output::print_json(body);
    }
    cli::output::print_success(title);
    let data = body.get("data").unwrap_or(body);
    if let Some(id) = data.get("id").and_then(Value::as_str) {
        println!("  {}: {id}", "id".bold());
    }
    if let Some(status) = data.get("status").and_then(Value::as_str) {
        println!("  {}: {status}", "status".bold());
    }
    if let Some(amount) = data.get("amount_capturable") {
        println!("  {}: {amount}", "amount_capturable".bold());
    }
    if let Some(secret) = data.get("client_secret").and_then(Value::as_str) {
        println!("  {}: {secret}", "client_secret".bold());
        println!("Confirm this card in lomi. Elements. Card numbers never go through the CLI.");
    }
    Ok(())
}

async fn hold(common: &CommonOptions, args: ChargesHoldArgs) -> Result<()> {
    if args.amount < 1 {
        bail!("Amount must be at least 1");
    }
    let (customer_id, customer_email, customer_name) = match (
        args.customer_id.as_deref(),
        args.email.as_deref(),
        args.name.as_deref(),
    ) {
        (Some(id), _, _) => (Some(id.to_string()), None, None),
        (None, Some(email), Some(name)) => (None, Some(email.to_string()), Some(name.to_string())),
        _ => bail!("Pass --customer-id, or both --email and --name"),
    };

    let api = client(common).await?;
    let body: Value = api
        .post(
            "/charge/card",
            &HoldRequest {
                amount: args.amount,
                currency_code: args.currency,
                hold: true,
                customer_id,
                customer_email,
                customer_name,
                description: args.description,
            },
        )
        .await?;
    print_charge(common, "Card hold created", &body)
}

async fn get_charge(common: &CommonOptions, id: &str) -> Result<()> {
    let id = charge_id(id)?;
    let api = client(common).await?;
    let body: Value = api.get(&format!("/charge/card/{id}")).await?;
    print_charge(common, "Card charge", &body)
}

async fn raise(common: &CommonOptions, args: ChargesAmountArgs) -> Result<()> {
    if args.amount < 1 {
        bail!("Amount must be at least 1");
    }
    let id = charge_id(&args.id)?;
    let api = client(common).await?;
    let body: Value = api
        .post(
            &format!("/charge/card/{id}/increment"),
            &json!({ "amount": args.amount }),
        )
        .await?;
    print_charge(common, "Card hold raised", &body)
}

async fn capture(common: &CommonOptions, args: ChargesCaptureArgs) -> Result<()> {
    if let Some(amount) = args.amount {
        if amount < 1 {
            bail!("Amount must be at least 1");
        }
    }
    let id = charge_id(&args.id)?;
    let payload = match args.amount {
        Some(amount) => json!({ "amount": amount }),
        None => json!({}),
    };
    let api = client(common).await?;
    let body: Value = api
        .post(&format!("/charge/card/{id}/capture"), &payload)
        .await?;
    print_charge(common, "Card hold captured", &body)
}

async fn release(common: &CommonOptions, id: &str) -> Result<()> {
    let id = charge_id(id)?;
    let api = client(common).await?;
    let body: Value = api
        .post(&format!("/charge/card/{id}/cancel"), &json!({}))
        .await?;
    print_charge(common, "Card hold released", &body)
}
