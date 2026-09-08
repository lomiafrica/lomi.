use anyhow::{bail, Result};
use clap::{Args, Subcommand};
use std::path::PathBuf;

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct ExportsArgs {
    #[command(subcommand)]
    pub command: ExportsCommand,
}

#[derive(Subcommand, Debug)]
pub enum ExportsCommand {
    Create {
        #[arg(long)]
        r#type: String,
    },
    Get {
        id: String,
    },
    Download {
        id: String,
        #[arg(long)]
        out: Option<PathBuf>,
    },
}

pub async fn run(common: &CommonOptions, args: ExportsArgs) -> Result<()> {
    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;
    match args.command {
        ExportsCommand::Create { r#type } => {
            let body = serde_json::json!({ "type": r#type });
            let payload: serde_json::Value = client.post("/exports", &body).await?;
            cli::output::print_json(&payload)
        }
        ExportsCommand::Get { id } => {
            let payload: serde_json::Value = client.get(&format!("/exports/{id}")).await?;
            cli::output::print_json(&payload)
        }
        ExportsCommand::Download { id, out } => {
            let payload: serde_json::Value = client.get(&format!("/exports/{id}")).await?;
            let url = payload
                .get("download_url")
                .and_then(|v| v.as_str())
                .ok_or_else(|| anyhow::anyhow!("Export is not ready yet"))?;
            let filename = payload
                .get("filename")
                .and_then(|v| v.as_str())
                .unwrap_or("export.bin");
            let dest = out.unwrap_or_else(|| PathBuf::from(filename));
            let bytes = reqwest::get(url).await?.bytes().await?;
            if bytes.is_empty() {
                bail!("Empty download");
            }
            std::fs::write(&dest, bytes)?;
            cli::output::print_success(&format!("Wrote {}", dest.display()));
            Ok(())
        }
    }
}
