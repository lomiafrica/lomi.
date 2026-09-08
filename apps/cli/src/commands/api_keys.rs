use anyhow::Result;
use clap::{Args, Subcommand};

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct ApiKeysArgs {
    #[command(subcommand)]
    pub command: ApiKeysCommand,
}

#[derive(Subcommand, Debug)]
pub enum ApiKeysCommand {
    List,
}

pub async fn run(common: &CommonOptions, args: ApiKeysArgs) -> Result<()> {
    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;
    match args.command {
        ApiKeysCommand::List => {
            let payload: serde_json::Value = client.get("/api-keys").await?;
            if common.show_ui() {
                cli::banner::print_intro("API keys");
            }
            cli::output::print_json(&payload)
        }
    }
}
