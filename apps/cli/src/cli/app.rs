use clap::{CommandFactory, Parser, Subcommand};

use crate::cli::CommonOptions;

#[derive(Parser)]
#[command(
    name = "lomi.",
    bin_name = "lomi",
    about = "Developer CLI for integrating with the hosted lomi. merchant API",
    version,
    after_help = "EXAMPLES:
  lomi quickstart              Guided setup and connectivity checks
  lomi login                     Authenticate via browser
  lomi init                      Scaffold a project with SDK examples
  lomi listen http://localhost:3000/webhooks
                                 Forward sandbox webhooks locally
  lomi checkout create --amount 10000 --currency XOF \\
    --success-url https://example.com/success \\
    --cancel-url https://example.com/cancel --json
  lomi completions generate zsh  Generate shell completions

Learn more: https://docs.lomi.africa/build/cli"
)]
pub struct Cli {
    #[command(flatten)]
    pub common: CommonOptions,

    #[command(subcommand)]
    pub command: Option<Commands>,
}

#[derive(Subcommand)]
pub enum Commands {
    /// Log in to lomi. via browser authentication
    Login(crate::commands::login::LoginArgs),
    /// Log out of lomi.
    Logout(crate::commands::logout::LogoutArgs),
    /// Display the current logged-in account
    Whoami(crate::commands::whoami::WhoamiArgs),
    /// Check login status and API connectivity
    Status(crate::commands::status::StatusArgs),
    /// Initialize a lomi. project with example code
    Init(crate::commands::init::InitArgs),
    /// Start a local webhook development server
    Dev(crate::commands::dev::DevArgs),
    /// Listen for cloud webhook events (sandbox-first)
    Listen(crate::commands::listen::ListenArgs),
    /// Emit a synthetic webhook event (sandbox)
    Trigger(crate::commands::trigger::TriggerArgs),
    /// Print MCP HTTP client configuration
    Mcp(crate::commands::mcp_config::McpArgs),
    /// Run integration health checks
    Probe(crate::commands::probe::ProbeArgs),
    /// Manage checkout sessions
    Checkout(crate::commands::checkout::CheckoutArgs),
    /// Manage payments
    Payments(crate::commands::payments::PaymentsArgs),
    /// Manage webhooks
    Webhooks(crate::commands::webhooks_cmd::WebhooksArgs),
    /// List products and prices
    Products(crate::commands::products::ProductsArgs),
    /// List transactions
    Transactions(crate::commands::transactions::TransactionsArgs),
    /// Manage refunds
    Refunds(crate::commands::refunds::RefundsArgs),
    /// Manage payouts
    Payouts(crate::commands::payouts::PayoutsArgs),
    /// List card disputes
    Disputes(crate::commands::disputes::DisputesArgs),
    /// Payment risk (Radar) assessments
    Radar(crate::commands::radar::RadarArgs),
    /// Golden-path setup checks and next steps
    Quickstart(crate::commands::quickstart::QuickstartArgs),
    /// Install lomi. agent rules for Cursor, Claude, and other AI tools
    InstallRules(crate::commands::install_rules::InstallRulesArgs),
    /// Update @lomi./sdk or show CLI upgrade instructions
    Update(crate::commands::update::UpdateArgs),
    /// Show how to upgrade the lomi. CLI
    Upgrade(crate::commands::upgrade::UpgradeArgs),
    /// Documentation lint and drift checks (monorepo apps/docs)
    #[command(hide = true)]
    Docs(crate::commands::docs_cmd::DocsArgs),
    /// List all CLI profiles
    ListProfiles(crate::commands::list_profiles::ListProfilesArgs),
    /// Switch the default CLI profile
    Switch(crate::commands::switch::SwitchArgs),
    /// Generate shell completion scripts
    Completions(crate::commands::completions::CompletionsArgs),
}

pub fn build_cli() -> clap::Command {
    Cli::command()
}
