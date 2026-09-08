use anyhow::Result;
use clap::{Args, Subcommand};
use tokio::time::{sleep, Duration};

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct LogsArgs {
    #[command(subcommand)]
    pub command: LogsCommand,
}

#[derive(Subcommand, Debug)]
pub enum LogsCommand {
    List {
        #[arg(long, default_value = "api_request")]
        r#type: String,
        #[arg(long, default_value_t = 25)]
        limit: u32,
    },
    Tail {
        #[arg(long, default_value = "api_request")]
        r#type: String,
    },
}

pub async fn run(common: &CommonOptions, args: LogsArgs) -> Result<()> {
    match args.command {
        LogsCommand::List { r#type, limit } => list_logs(common, &r#type, limit).await,
        LogsCommand::Tail { r#type } => tail_logs(common, &r#type).await,
    }
}

async fn list_logs(common: &CommonOptions, log_type: &str, limit: u32) -> Result<()> {
    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;
    let payload: serde_json::Value = client
        .get(&format!("/logs?type={log_type}&limit={limit}"))
        .await?;
    cli::output::print_json(&payload)
}

async fn tail_logs(common: &CommonOptions, log_type: &str) -> Result<()> {
    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;
    let mut seen = std::collections::HashSet::new();
    cli::output::print_info("Tailing logs (Ctrl-C to stop)");
    loop {
        let payload: serde_json::Value = client
            .get(&format!("/logs?type={log_type}&limit=25"))
            .await?;
        let rows = payload
            .get("data")
            .and_then(|v| v.as_array())
            .cloned()
            .unwrap_or_default();
        for row in rows.into_iter().rev() {
            let id = row
                .get("id")
                .or_else(|| row.get("event_id"))
                .map(|v| v.to_string())
                .unwrap_or_default();
            if id.is_empty() || !seen.insert(id) {
                continue;
            }
            println!("{}", serde_json::to_string(&row)?);
        }
        sleep(Duration::from_secs(2)).await;
    }
}
