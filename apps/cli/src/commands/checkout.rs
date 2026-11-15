use anyhow::{bail, Result};
use clap::{Args, Subcommand};
use colored::Colorize;
use serde::{Deserialize, Serialize};

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

type CheckoutFields = (
    Option<String>,
    Option<f64>,
    String,
    String,
    String,
    Option<String>,
);

#[derive(Args, Debug)]
pub struct CheckoutArgs {
    #[command(subcommand)]
    pub command: CheckoutCommand,
}

#[derive(Subcommand, Debug)]
pub enum CheckoutCommand {
    /// Create a hosted checkout session
    Create(CheckoutCreateArgs),
}

#[derive(Args, Debug)]
#[command(
    after_help = "Example:\n  lomi checkout create --amount 10000 --currency XOF \\\n    --success-url https://example.com/success \\\n    --cancel-url https://example.com/cancel --json"
)]
pub struct CheckoutCreateArgs {
    /// Checkout amount (omit when using --price-id)
    #[arg(long)]
    pub amount: Option<f64>,

    /// Product price ID (omit when using --amount)
    #[arg(long)]
    pub price_id: Option<String>,

    /// Currency code (e.g. XOF, USD, EUR, GBP, CAD)
    #[arg(long)]
    pub currency: Option<String>,

    /// Success redirect URL
    #[arg(long)]
    pub success_url: Option<String>,

    /// Cancel redirect URL
    #[arg(long)]
    pub cancel_url: Option<String>,

    /// Customer email (optional)
    #[arg(long)]
    pub customer_email: Option<String>,
}

#[derive(Serialize)]
struct CreateCheckoutSessionRequest {
    currency_code: String,
    success_url: String,
    cancel_url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    price_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    amount: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    customer_email: Option<String>,
}

#[derive(Deserialize, Serialize)]
struct CheckoutSessionResponse {
    checkout_session_id: String,
    checkout_url: String,
}

pub async fn run(common: &CommonOptions, args: CheckoutArgs) -> Result<()> {
    match args.command {
        CheckoutCommand::Create(create_args) => create_checkout_session(common, create_args).await,
    }
}

async fn create_checkout_session(common: &CommonOptions, args: CheckoutCreateArgs) -> Result<()> {
    let json = cli::output::should_use_json(common);
    if !json {
        cli::banner::print_intro("Create a checkout session");
    }

    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;

    let (price_id, amount, currency, success_url, cancel_url, customer_email) =
        if is_headless(&args) {
            resolve_headless(&args)?
        } else {
            resolve_interactive(&args)?
        };

    let spinner = if json {
        None
    } else {
        let spinner = indicatif::ProgressBar::new_spinner();
        spinner.set_message("Creating checkout session...");
        spinner.enable_steady_tick(std::time::Duration::from_millis(100));
        Some(spinner)
    };

    let response: CheckoutSessionResponse = client
        .post(
            "/checkout-sessions",
            &CreateCheckoutSessionRequest {
                currency_code: currency,
                success_url,
                cancel_url,
                price_id,
                amount,
                customer_email,
            },
        )
        .await?;

    if let Some(spinner) = spinner {
        spinner.finish_and_clear();
    }

    if json {
        return cli::output::print_json(&response);
    }

    cli::output::print_success("Checkout session created!");

    println!();
    println!("{}", "Session Details:".bold());
    println!("ID:  {}", response.checkout_session_id.cyan());
    println!("URL: {}", response.checkout_url.bright_blue());
    println!();
    println!("Redirect your customer to the URL above to complete payment.");
    println!();
    println!("{}", "Embed snippet (paste into your site):".bold());
    println!();
    print_embed_snippet(&response.checkout_url);
    Ok(())
}

fn is_headless(args: &CheckoutCreateArgs) -> bool {
    args.currency.is_some()
        && args.success_url.is_some()
        && args.cancel_url.is_some()
        && (args.price_id.is_some() || args.amount.is_some())
}

fn resolve_headless(args: &CheckoutCreateArgs) -> Result<CheckoutFields> {
    if args.price_id.is_some() && args.amount.is_some() {
        bail!("Provide either --price-id or --amount, not both");
    }
    if args.price_id.is_none() && args.amount.is_none() {
        bail!("Headless mode requires --price-id or --amount (with --currency, --success-url, --cancel-url)");
    }

    Ok((
        args.price_id.clone(),
        args.amount,
        args.currency.clone().unwrap(),
        args.success_url.clone().unwrap(),
        args.cancel_url.clone().unwrap(),
        args.customer_email.clone(),
    ))
}

fn resolve_interactive(args: &CheckoutCreateArgs) -> Result<CheckoutFields> {
    if is_headless(args) {
        return resolve_headless(args);
    }

    let (price_id, amount) = if let Some(price_id) = &args.price_id {
        (Some(price_id.clone()), None)
    } else if let Some(amount) = args.amount {
        (None, Some(amount))
    } else {
        let use_price = cli::prompts::confirm("Do you have a price ID?", true)?;
        if use_price {
            let price_id = cli::prompts::text("Enter price ID:")?;
            (Some(price_id), None)
        } else {
            let amount_text = cli::prompts::text("Enter amount:")?;
            let amount: f64 = amount_text
                .parse()
                .map_err(|_| anyhow::anyhow!("Amount must be a number"))?;
            (None, Some(amount))
        }
    };

    let currency = if let Some(currency) = &args.currency {
        currency.clone()
    } else {
        cli::prompts::select(
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
        )?
    };

    let success_url = if let Some(url) = &args.success_url {
        url.clone()
    } else {
        cli::prompts::text("Success URL:")?
    };

    let cancel_url = if let Some(url) = &args.cancel_url {
        url.clone()
    } else {
        cli::prompts::text("Cancel URL:")?
    };

    let customer_email = if let Some(email) = &args.customer_email {
        Some(email.clone())
    } else {
        let email: String = cli::prompts::text("Customer email (optional, press Enter to skip):")?;
        if email.trim().is_empty() {
            None
        } else {
            Some(email)
        }
    };

    Ok((
        price_id,
        amount,
        currency,
        success_url,
        cancel_url,
        customer_email,
    ))
}

fn print_embed_snippet(checkout_url: &str) {
    println!(
        r#"<!-- npm install @lomi./embed -->
<script type="module">
  import {{ loadLomiCheckout }} from '@lomi./embed';
  document.getElementById('pay').addEventListener('click', () => {{
    loadLomiCheckout({{
      checkoutUrl: '{checkout_url}',
      mode: 'modal',
      onComplete: (p) => console.log(p),
    }});
  }});
</script>
<button id="pay">Pay</button>"#
    );
}
