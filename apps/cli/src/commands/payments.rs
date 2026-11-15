use anyhow::{bail, Result};
use clap::{Args, Subcommand};
use colored::Colorize;
use serde::{Deserialize, Serialize};

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct PaymentsArgs {
    #[command(subcommand)]
    pub command: PaymentsCommand,
}

#[derive(Subcommand, Debug)]
pub enum PaymentsCommand {
    /// Create a new payment link
    Create(PaymentsCreateArgs),
}

#[derive(Args, Debug)]
pub struct PaymentsCreateArgs {
    /// Payment link title
    #[arg(long)]
    pub title: Option<String>,

    /// Amount
    #[arg(long)]
    pub amount: Option<f64>,

    /// Currency code (e.g. XOF, USD, EUR, GBP, CAD)
    #[arg(long)]
    pub currency: Option<String>,
}

#[derive(Serialize)]
struct CreatePaymentLinkRequest {
    title: String,
    amount: f64,
    currency_code: String,
    link_type: &'static str,
}

#[derive(Deserialize, Serialize)]
struct PaymentLinkResponse {
    url: String,
    title: String,
    amount: f64,
    currency_code: String,
}

pub async fn run(common: &CommonOptions, args: PaymentsArgs) -> Result<()> {
    match args.command {
        PaymentsCommand::Create(create_args) => create_payment_link(common, create_args).await,
    }
}

async fn create_payment_link(common: &CommonOptions, args: PaymentsCreateArgs) -> Result<()> {
    let json = cli::output::should_use_json(common);
    if !json {
        cli::banner::print_intro("Create a payment link");
    }

    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;

    let (title, amount, currency) = if let (Some(title), Some(amount), Some(currency)) =
        (&args.title, args.amount, &args.currency)
    {
        (title.clone(), amount, currency.clone())
    } else if args.title.is_some() || args.amount.is_some() || args.currency.is_some() {
        bail!("Headless mode requires --title, --amount, and --currency");
    } else {
        let title = cli::prompts::text("Enter payment link title:")?;
        let amount_text = cli::prompts::text("Enter amount:")?;
        let amount: f64 = amount_text
            .parse()
            .map_err(|_| anyhow::anyhow!("Amount must be a number"))?;
        let currency = cli::prompts::select(
            "Select currency:",
            vec![
                "XOF".to_string(),
                "USD".to_string(),
                "EUR".to_string(),
                "XAF".to_string(),
                "GHS".to_string(),
                "KES".to_string(),
                "MAD".to_string(),
                "ZAR".to_string(),
                "GBP".to_string(),
                "CAD".to_string(),
            ],
            "XOF".to_string(),
        )?;
        (title, amount, currency)
    };

    let spinner = if json {
        None
    } else {
        let spinner = indicatif::ProgressBar::new_spinner();
        spinner.set_message("Creating payment link...");
        spinner.enable_steady_tick(std::time::Duration::from_millis(100));
        Some(spinner)
    };

    let response: PaymentLinkResponse = client
        .post(
            "/payment-links",
            &CreatePaymentLinkRequest {
                title: title.clone(),
                amount,
                currency_code: currency.clone(),
                link_type: "instant",
            },
        )
        .await?;

    if let Some(spinner) = spinner {
        spinner.finish_and_clear();
    }

    if json {
        return cli::output::print_json(&response);
    }

    cli::output::print_success("Payment link created successfully!");

    println!();
    println!("{}", "Payment Link Details:".bold());
    println!("URL:    {}", response.url.bright_blue());
    println!("Title:  {}", response.title);
    println!("Amount: {} {}", response.amount, response.currency_code);
    println!();
    println!("Share this link with your customers to accept payments.");
    Ok(())
}
