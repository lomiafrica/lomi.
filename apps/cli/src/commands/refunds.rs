use anyhow::{bail, Result};
use clap::{Args, Subcommand};
use colored::Colorize;
use serde::Serialize;

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct RefundsArgs {
    #[command(subcommand)]
    pub command: RefundsCommand,
}

#[derive(Subcommand, Debug)]
pub enum RefundsCommand {
    /// Create a refund for a completed transaction
    Create(RefundsCreateArgs),
    /// List refunds
    List(RefundsListArgs),
    /// Get a refund by ID
    Get {
        /// Refund ID
        id: String,
    },
}

#[derive(Args, Debug)]
pub struct RefundsCreateArgs {
    /// Transaction ID to refund
    #[arg(long)]
    pub transaction_id: Option<String>,

    /// Amount to refund (same currency as the transaction)
    #[arg(long)]
    pub amount: Option<f64>,

    /// Reason for the refund
    #[arg(long)]
    pub reason: Option<String>,

    /// Refund type: full or partial
    #[arg(long, value_parser = ["full", "partial"])]
    pub refund_type: Option<String>,

    /// Return the confirmation preview without executing
    #[arg(long)]
    pub preview: bool,
}

#[derive(Args, Debug)]
pub struct RefundsListArgs {
    /// Filter by refund status
    #[arg(long)]
    pub status: Option<String>,

    /// Maximum number of refunds to return
    #[arg(long, default_value_t = 50)]
    pub limit: u32,

    /// Offset for pagination
    #[arg(long, default_value_t = 0)]
    pub offset: u32,
}

#[derive(Serialize, Clone)]
struct CreateRefundRequest {
    transaction_id: String,
    amount: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    reason: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    refund_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    confirmation_token: Option<String>,
}

pub async fn run(common: &CommonOptions, args: RefundsArgs) -> Result<()> {
    match args.command {
        RefundsCommand::Create(create_args) => create_refund(common, create_args).await,
        RefundsCommand::List(list_args) => list_refunds(common, list_args).await,
        RefundsCommand::Get { id } => get_refund(common, &id).await,
    }
}

async fn create_refund(common: &CommonOptions, args: RefundsCreateArgs) -> Result<()> {
    let json = cli::output::should_use_json(common);
    if !json {
        cli::banner::print_intro("Create a refund");
    }

    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;

    let (transaction_id, amount, reason, refund_type) =
        if let (Some(transaction_id), Some(amount)) = (&args.transaction_id, args.amount) {
            (
                transaction_id.clone(),
                amount,
                args.reason.clone(),
                args.refund_type.clone(),
            )
        } else if args.transaction_id.is_some() || args.amount.is_some() {
            bail!("Headless mode requires --transaction-id and --amount");
        } else {
            let transaction_id = cli::prompts::text("Enter transaction ID:")?;
            let amount_text = cli::prompts::text("Enter refund amount:")?;
            let amount: f64 = amount_text
                .parse()
                .map_err(|_| anyhow::anyhow!("Amount must be a number"))?;
            let reason_input = cli::prompts::text("Reason (optional, press Enter to skip):")?;
            let reason = if reason_input.trim().is_empty() {
                None
            } else {
                Some(reason_input)
            };
            let refund_type = if cli::prompts::confirm("Is this a partial refund?", false)? {
                Some("partial".to_string())
            } else {
                Some("full".to_string())
            };
            (transaction_id, amount, reason, refund_type)
        };

    let spinner = if json {
        None
    } else {
        let spinner = indicatif::ProgressBar::new_spinner();
        spinner.set_message("Creating refund...");
        spinner.enable_steady_tick(std::time::Duration::from_millis(100));
        Some(spinner)
    };

    let body = CreateRefundRequest {
        transaction_id,
        amount,
        reason,
        refund_type,
        confirmation_token: None,
    };
    let mut response: serde_json::Value = client.post("/refunds", &body).await?;

    if let Some(spinner) = spinner {
        spinner.finish_and_clear();
    }

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
                "/refunds",
                &CreateRefundRequest {
                    confirmation_token: token,
                    ..body
                },
            )
            .await?;
    }

    if json {
        return cli::output::print_json(&response);
    }

    cli::output::print_success("Refund created successfully!");
    println!(
        "{}",
        serde_json::to_string_pretty(&response).unwrap_or_default()
    );
    Ok(())
}

async fn list_refunds(common: &CommonOptions, args: RefundsListArgs) -> Result<()> {
    let json = cli::output::should_use_json(common);
    if !json {
        cli::banner::print_intro("Refunds");
    }

    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;

    let mut path = format!("/refunds?limit={}&offset={}", args.limit, args.offset);
    if let Some(status) = &args.status {
        path.push_str(&format!("&status={status}"));
    }

    let rows: serde_json::Value = client.get(&path).await?;

    if json {
        return cli::output::print_json(&rows);
    }

    let items = rows
        .as_array()
        .or_else(|| rows.get("data").and_then(|v| v.as_array()));

    match items {
        Some(rows) if !rows.is_empty() => {
            for row in rows {
                print_refund_row(row);
            }
        }
        _ => println!("{} No refunds found.", "○".bright_black()),
    }
    Ok(())
}

async fn get_refund(common: &CommonOptions, id: &str) -> Result<()> {
    let json = cli::output::should_use_json(common);
    if !json {
        cli::banner::print_intro("Refund details");
    }

    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;

    let row: serde_json::Value = client.get(&format!("/refunds/{id}")).await?;

    if json {
        return cli::output::print_json(&row);
    }

    print_refund_row(&row);
    Ok(())
}

fn print_refund_row(row: &serde_json::Value) {
    let id = row
        .get("refund_id")
        .or_else(|| row.get("id"))
        .and_then(|v| v.as_str())
        .unwrap_or("-");
    let status = row
        .get("status")
        .and_then(|v| v.as_str())
        .unwrap_or("unknown");
    let amount = row.get("amount").and_then(|v| v.as_f64()).unwrap_or(0.0);
    let currency = row
        .get("currency_code")
        .and_then(|v| v.as_str())
        .unwrap_or("XOF");
    println!(
        "{} {} {}",
        id.cyan(),
        status.yellow(),
        format!("{amount} {currency}").bright_black(),
    );
}
