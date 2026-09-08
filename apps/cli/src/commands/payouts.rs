use anyhow::{bail, Result};
use clap::{Args, Subcommand};
use serde::Serialize;

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct PayoutsArgs {
    #[command(subcommand)]
    pub command: PayoutsCommand,
}

#[derive(Subcommand, Debug)]
pub enum PayoutsCommand {
    /// List payouts
    List(PayoutsListArgs),
    /// Get a payout by ID
    Get { id: String },
    /// Create a payout
    Create(PayoutsCreateArgs),
}

#[derive(Args, Debug)]
pub struct PayoutsListArgs {
    #[arg(long)]
    pub status: Option<String>,
    #[arg(long)]
    pub cursor: Option<String>,
    #[arg(long, default_value_t = 20)]
    pub limit: u32,
}

#[derive(Args, Debug)]
pub struct PayoutsCreateArgs {
    #[arg(long, value_parser = ["self", "beneficiary"])]
    pub destination: Option<String>,
    #[arg(long, value_parser = ["wave", "mtn", "spi", "bank"])]
    pub rail: Option<String>,
    #[arg(long)]
    pub amount: Option<i64>,
    #[arg(long, default_value = "XOF")]
    pub currency: String,
    #[arg(long)]
    pub payout_method_id: Option<String>,
    #[arg(long)]
    pub recipient_name: Option<String>,
    #[arg(long)]
    pub recipient_phone: Option<String>,
    #[arg(long)]
    pub reason: Option<String>,
    /// Return the confirmation preview without executing
    #[arg(long)]
    pub preview: bool,
}

#[derive(Serialize, Clone)]
struct CreatePayoutRequest {
    destination: String,
    rail: String,
    amount: i64,
    currency_code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    payout_method_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    recipient: Option<Recipient>,
    #[serde(skip_serializing_if = "Option::is_none")]
    reason: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    confirmation_token: Option<String>,
}

#[derive(Serialize, Clone)]
struct Recipient {
    name: String,
    phone: String,
}

pub async fn run(common: &CommonOptions, args: PayoutsArgs) -> Result<()> {
    match args.command {
        PayoutsCommand::List(list_args) => list_payouts(common, list_args).await,
        PayoutsCommand::Get { id } => get_payout(common, &id).await,
        PayoutsCommand::Create(create_args) => create_payout(common, create_args).await,
    }
}

async fn list_payouts(common: &CommonOptions, args: PayoutsListArgs) -> Result<()> {
    let json = cli::output::should_use_json(common);
    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;

    let mut path = format!("/payouts?limit={}", args.limit);
    if let Some(cursor) = &args.cursor {
        path.push_str(&format!("&cursor={cursor}"));
    }
    if let Some(status) = &args.status {
        path.push_str(&format!("&status={status}"));
    }

    let rows: serde_json::Value = client.get(&path).await?;
    if json {
        return cli::output::print_json(&rows);
    }

    println!(
        "{}",
        serde_json::to_string_pretty(&rows).unwrap_or_default()
    );
    Ok(())
}

async fn get_payout(common: &CommonOptions, id: &str) -> Result<()> {
    let json = cli::output::should_use_json(common);
    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;
    let row: serde_json::Value = client.get(&format!("/payouts/{id}")).await?;
    if json {
        return cli::output::print_json(&row);
    }
    println!("{}", serde_json::to_string_pretty(&row).unwrap_or_default());
    Ok(())
}

async fn create_payout(common: &CommonOptions, args: PayoutsCreateArgs) -> Result<()> {
    let json = cli::output::should_use_json(common);
    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;

    let destination = match args.destination {
        Some(v) => v,
        None => bail!("--destination is required (self|beneficiary)"),
    };
    let rail = match args.rail {
        Some(v) => v,
        None => bail!("--rail is required (wave|mtn|spi|bank)"),
    };
    let amount = args
        .amount
        .ok_or_else(|| anyhow::anyhow!("--amount is required"))?;

    let recipient = if destination == "beneficiary" {
        let name = args.recipient_name.ok_or_else(|| {
            anyhow::anyhow!("--recipient-name is required for beneficiary payouts")
        })?;
        let phone = args.recipient_phone.ok_or_else(|| {
            anyhow::anyhow!("--recipient-phone is required for beneficiary payouts")
        })?;
        Some(Recipient { name, phone })
    } else {
        None
    };

    if destination == "self" && args.payout_method_id.is_none() {
        bail!("--payout-method-id is required for self payouts");
    }

    let body = CreatePayoutRequest {
        destination,
        rail,
        amount,
        currency_code: args.currency,
        payout_method_id: args.payout_method_id,
        recipient,
        reason: args.reason,
        confirmation_token: None,
    };
    let mut response: serde_json::Value = client.post("/payouts", &body).await?;
    if response
        .get("requires_confirmation")
        .and_then(|v| v.as_bool())
        == Some(true)
    {
        if args.preview || json {
            if json {
                return cli::output::print_json(&response);
            }
            cli::output::print_info("Confirmation required. Re-run without --preview to execute.");
            println!(
                "{}",
                serde_json::to_string_pretty(&response).unwrap_or_default()
            );
            return Ok(());
        }
        let token = response
            .get("confirmation_token")
            .and_then(|v| v.as_str())
            .map(str::to_string);
        response = client
            .post(
                "/payouts",
                &CreatePayoutRequest {
                    confirmation_token: token,
                    ..body
                },
            )
            .await?;
    }

    if json {
        return cli::output::print_json(&response);
    }

    cli::output::print_success("Payout created");
    println!(
        "{}",
        serde_json::to_string_pretty(&response).unwrap_or_default()
    );
    Ok(())
}
