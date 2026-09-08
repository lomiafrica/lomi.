use anyhow::Result;
use clap::Args;

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct BalanceArgs {}

pub async fn run(common: &CommonOptions, _args: BalanceArgs) -> Result<()> {
    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;
    let payload: serde_json::Value = client.get("/accounts/balance").await?;
    if common.show_ui() {
        cli::banner::print_intro("Balance");
    }
    cli::output::print_json(&payload)
}
