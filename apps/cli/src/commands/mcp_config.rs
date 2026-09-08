use anyhow::{bail, Context, Result};
use clap::{Args, Subcommand};
use colored::Colorize;

use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct McpArgs {
    #[command(subcommand)]
    pub command: McpCommand,
}

#[derive(Subcommand, Debug)]
pub enum McpCommand {
    /// Print HTTP MCP configuration for Cursor or Claude
    Config(McpConfigArgs),
    /// Run the stdio MCP server locally
    Serve(McpServeArgs),
}

#[derive(Args, Debug)]
pub struct McpServeArgs {
    /// Override the merchant secret key (defaults to the CLI login token)
    #[arg(long)]
    pub api_key: Option<String>,
}

#[derive(Args, Debug)]
pub struct McpConfigArgs {
    /// MCP HTTP server URL
    #[arg(long, default_value = "https://mcp.lomi.africa")]
    pub url: String,

    /// Output format: cursor or claude
    #[arg(long, default_value = "cursor")]
    pub target: String,
}

pub async fn run(common: &CommonOptions, args: McpArgs) -> Result<()> {
    match args.command {
        McpCommand::Config(config) => run_config(common, config).await,
        McpCommand::Serve(serve) => run_serve(common, serve).await,
    }
}

async fn run_config(common: &CommonOptions, args: McpConfigArgs) -> Result<()> {
    let json = cli::output::should_use_json(common);
    if !json {
        cli::banner::print_intro("MCP HTTP configuration");
    }

    let api_key = std::env::var("LOMI_SECRET_KEY").ok();

    let key_placeholder = "<your-lomi-secret-key>";

    let snippet = match args.target.as_str() {
        "cursor" => serde_json::json!({
            "mcpServers": {
                "lomi.": {
                    "url": format!("{}/mcp", args.url.trim_end_matches('/')),
                    "headers": {
                        "x-lomi-api-key": api_key.clone().unwrap_or_else(|| key_placeholder.to_string())
                    }
                }
            }
        }),
        "claude" => serde_json::json!({
            "mcpServers": {
                "lomi.": {
                    "type": "http",
                    "url": format!("{}/mcp", args.url.trim_end_matches('/')),
                    "headers": {
                        "x-lomi-api-key": api_key.clone().unwrap_or_else(|| key_placeholder.to_string())
                    }
                }
            }
        }),
        other => {
            anyhow::bail!("Unknown target {other}. Use cursor or claude.");
        }
    };

    if json {
        return cli::output::print_json(&snippet);
    }

    println!("{}", "Paste into your MCP client settings:".bright_black());
    println!("{}", serde_json::to_string_pretty(&snippet)?);
    if api_key.is_none() {
        println!(
            "{}",
            "Tip: set LOMI_SECRET_KEY in your environment to embed your key.".yellow()
        );
    }
    Ok(())
}

async fn run_serve(common: &CommonOptions, args: McpServeArgs) -> Result<()> {
    let auth = ensure_authenticated(common, true, false, false).await?;
    let api_key = args
        .api_key
        .or(std::env::var("LOMI_SECRET_KEY").ok())
        .unwrap_or(auth.cli_token.clone());

    let mut command = if which("lomi-mcp") {
        std::process::Command::new("lomi-mcp")
    } else {
        let mut cmd = std::process::Command::new("npx");
        cmd.args(["-y", "@lomi./mcp"]);
        cmd
    };
    command.env("LOMI_SECRET_KEY", api_key);
    command.env("LOMI_API_URL", auth.api_url);
    if std::env::var_os("LOMI_MCP_DOWNLOAD_DIR").is_none() {
        command.env("LOMI_MCP_DOWNLOAD_DIR", std::env::current_dir()?);
    }
    let status = command
        .status()
        .context("Failed to start stdio MCP (install @lomi./mcp or lomi-mcp)")?;
    if !status.success() {
        bail!("MCP server exited with {status}");
    }
    Ok(())
}

fn which(bin: &str) -> bool {
    std::env::var_os("PATH")
        .is_some_and(|paths| std::env::split_paths(&paths).any(|dir| dir.join(bin).is_file()))
}
