use anyhow::Result;
use clap::{Args, Subcommand};

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct CustomersArgs {
    #[command(subcommand)]
    pub command: CustomersCommand,
}

#[derive(Subcommand, Debug)]
pub enum CustomersCommand {
    List {
        #[arg(long, default_value_t = 20)]
        limit: u32,
    },
    Get {
        id: String,
    },
}

pub async fn run(common: &CommonOptions, args: CustomersArgs) -> Result<()> {
    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;
    match args.command {
        CustomersCommand::List { limit } => {
            let payload: serde_json::Value = client.get(&format!("/customers?limit={limit}")).await?;
            if cli::output::should_use_json(common) {
                return cli::output::print_json(&payload);
            }
            cli::banner::print_intro("Customers");
            cli::output::print_json(&payload)
        }
        CustomersCommand::Get { id } => {
            let row: serde_json::Value = client.get(&format!("/customers/{id}")).await?;
            cli::output::print_json(&row)
        }
    }
}
