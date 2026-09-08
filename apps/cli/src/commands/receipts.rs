use anyhow::{bail, Result};
use clap::{Args, Subcommand};
use serde::Serialize;
use std::path::PathBuf;

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct ReceiptsArgs {
    #[command(subcommand)]
    pub command: ReceiptsCommand,
}

#[derive(Subcommand, Debug)]
pub enum ReceiptsCommand {
    Pdf(ReceiptPdfArgs),
}

#[derive(Args, Debug)]
pub struct ReceiptPdfArgs {
    pub id: String,
    #[arg(long)]
    pub out: Option<PathBuf>,
}

#[derive(Serialize)]
struct DownloadMeta {
    path: String,
    download_url: Option<String>,
}

pub async fn run(common: &CommonOptions, args: ReceiptsArgs) -> Result<()> {
    match args.command {
        ReceiptsCommand::Pdf(pdf) => download_pdf(common, pdf).await,
    }
}

async fn download_pdf(common: &CommonOptions, args: ReceiptPdfArgs) -> Result<()> {
    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;
    let meta: serde_json::Value = client
        .get(&format!("/transactions/{}/receipt.pdf", args.id))
        .await?;
    let url = meta
        .get("download_url")
        .or_else(|| meta.get("hosted_url"))
        .and_then(|v| v.as_str())
        .ok_or_else(|| anyhow::anyhow!("Receipt URL missing from API response"))?;
    let filename = meta
        .get("filename")
        .and_then(|v| v.as_str())
        .unwrap_or("receipt.pdf");
    let out = args.out.unwrap_or_else(|| PathBuf::from(filename));
    let bytes = reqwest::get(url).await?.bytes().await?.to_vec();
    if bytes.is_empty() {
        bail!("Could not download PDF bytes. Open {url}");
    }
    std::fs::write(&out, bytes)?;
    if cli::output::should_use_json(common) {
        return cli::output::print_json(&DownloadMeta {
            path: out.display().to_string(),
            download_url: Some(url.to_string()),
        });
    }
    cli::output::print_success(&format!("Wrote {}", out.display()));
    Ok(())
}
