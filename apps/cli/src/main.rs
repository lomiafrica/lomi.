mod api;
mod auth;
mod cli;
mod commands;
mod config;
mod monorepo;
mod rules;
mod webhook;

use clap::Parser;
use cli::app::Cli;

#[tokio::main]
async fn main() {
    let exit_code = run().await;
    std::process::exit(exit_code);
}

async fn run() -> i32 {
    let cli = match Cli::try_parse() {
        Ok(cli) => cli,
        Err(error) => {
            error.print().expect("failed to write clap error");
            return error.exit_code();
        }
    };

    init_runtime_from_common(&cli.common);
    cli::output::init_output(&cli.common);

    if cli.common.show_ui() {
        if let Err(error) = cli::banner::print_banner(&cli.common).await {
            return cli::output::render_error(&error, &cli.common);
        }
        maybe_show_first_run_notice(&cli.common);
        let _ = cli::update_check::maybe_notify_update(&cli.common).await;
    }

    let result = match cli.command {
        None => commands::home::run(&cli.common, commands::home::HomeArgs {}).await,
        Some(commands) => dispatch(commands, &cli.common).await,
    };

    match result {
        Ok(()) => 0,
        Err(error) => {
            let _ = auth::session::handle_auth_api_error(&cli.common, &error).await;
            cli::output::render_error(&error, &cli.common)
        }
    }
}

async fn dispatch(command: cli::app::Commands, common: &cli::CommonOptions) -> anyhow::Result<()> {
    use cli::app::Commands;
    match command {
        Commands::Login(args) => commands::login::run(common, args).await,
        Commands::Logout(args) => commands::logout::run(common, args).await,
        Commands::Whoami(args) => commands::whoami::run(common, args).await,
        Commands::Status(args) => commands::status::run(common, args).await,
        Commands::Init(args) => commands::init::run(common, args).await,
        Commands::Dev(args) => commands::dev::run(common, args).await,
        Commands::Listen(args) => commands::listen::run(common, args).await,
        Commands::Trigger(args) => commands::trigger::run(common, args).await,
        Commands::Mcp(args) => commands::mcp_config::run(common, args).await,
        Commands::Probe(args) => commands::probe::run(common, args).await,
        Commands::Checkout(args) => commands::checkout::run(common, args).await,
        Commands::Payments(args) => commands::payments::run(common, args).await,
        Commands::Webhooks(args) => commands::webhooks_cmd::run(common, args).await,
        Commands::Products(args) => commands::products::run(common, args).await,
        Commands::Transactions(args) => commands::transactions::run(common, args).await,
        Commands::Refunds(args) => commands::refunds::run(common, args).await,
        Commands::Payouts(args) => commands::payouts::run(common, args).await,
        Commands::Disputes(args) => commands::disputes::run(common, args).await,
        Commands::Radar(args) => commands::radar::run(common, args).await,
        Commands::Quickstart(args) => commands::quickstart::run(common, args).await,
        Commands::InstallRules(args) => commands::install_rules::run(common, args).await,
        Commands::Update(args) => commands::update::run(common, args).await,
        Commands::Upgrade(args) => commands::upgrade::run(common, args).await,
        Commands::Docs(args) => commands::docs_cmd::run(common, args).await,
        Commands::ListProfiles(args) => commands::list_profiles::run(common, args).await,
        Commands::Switch(args) => commands::switch::run(common, args).await,
        Commands::Completions(args) => commands::completions::run(common, args),
    }
}

fn init_runtime_from_common(common: &cli::CommonOptions) {
    if common.skip_telemetry {
        std::env::set_var("LOMI_SKIP_TELEMETRY", "1");
    }
    std::env::set_var("LOMI_LOG_LEVEL", common.log_level.as_str());
}

fn maybe_show_first_run_notice(common: &cli::CommonOptions) {
    if common.skip_telemetry {
        return;
    }
    if let Ok(mut config) = config::GlobalConfig::load() {
        if !config.settings.has_seen_telemetry_notice {
            cli::output::print_telemetry_notice();
            config.settings.has_seen_telemetry_notice = true;
            let _ = config.save();
        }
    }
}
