use anyhow::Result;
use clap::Args;

use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct OpenArgs {
    /// Dashboard path, e.g. invoicing or settings
    #[arg(default_value = "")]
    pub path: String,
}

pub async fn run(common: &CommonOptions, args: OpenArgs) -> Result<()> {
    let url = if args.path.is_empty() {
        "https://dashboard.lomi.africa".to_string()
    } else {
        format!(
            "https://dashboard.lomi.africa/{}",
            args.path.trim_start_matches('/')
        )
    };
    if cli::output::should_use_json(common) {
        return cli::output::print_json(&serde_json::json!({ "url": url }));
    }
    cli::output::print_info(&format!("Opening {url}"));
    let _ = open::that(&url);
    Ok(())
}
