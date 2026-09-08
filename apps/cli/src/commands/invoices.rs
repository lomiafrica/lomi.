use anyhow::{bail, Result};
use clap::{Args, Subcommand};
use serde::Serialize;
use std::path::PathBuf;

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct InvoicesArgs {
    #[command(subcommand)]
    pub command: InvoicesCommand,
}

#[derive(Subcommand, Debug)]
pub enum InvoicesCommand {
    List(InvoicesListArgs),
    Get { id: String },
    Pdf(InvoicePdfArgs),
}

#[derive(Args, Debug)]
pub struct InvoicesListArgs {
    #[arg(long, default_value_t = 20)]
    pub limit: u32,
}

#[derive(Args, Debug)]
pub struct InvoicePdfArgs {
    pub id: String,
    #[arg(long)]
    pub out: Option<PathBuf>,
}

#[derive(Serialize)]
struct DownloadMeta {
    path: String,
    download_url: Option<String>,
}

pub async fn run(common: &CommonOptions, args: InvoicesArgs) -> Result<()> {
    match args.command {
        InvoicesCommand::List(list) => list_invoices(common, list).await,
        InvoicesCommand::Get { id } => get_invoice(common, &id).await,
        InvoicesCommand::Pdf(pdf) => download_pdf(common, pdf).await,
    }
}

async fn list_invoices(common: &CommonOptions, args: InvoicesListArgs) -> Result<()> {
    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;
    let payload: serde_json::Value = client
        .get(&format!("/invoices?limit={}", args.limit))
        .await?;
    print_rows(
        common,
        "Invoices",
        &payload,
        &["customer_invoice_id", "invoice_number", "status", "amount"],
    )
}

async fn get_invoice(common: &CommonOptions, id: &str) -> Result<()> {
    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;
    let row: serde_json::Value = client.get(&format!("/invoices/{id}")).await?;
    if cli::output::should_use_json(common) {
        return cli::output::print_json(&row);
    }
    cli::output::print_json(&row)
}

async fn download_pdf(common: &CommonOptions, args: InvoicePdfArgs) -> Result<()> {
    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;
    let meta: serde_json::Value = client.get(&format!("/invoices/{}/pdf", args.id)).await?;
    let url = meta
        .get("download_url")
        .or_else(|| meta.get("hosted_url"))
        .and_then(|v| v.as_str())
        .ok_or_else(|| anyhow::anyhow!("PDF URL missing from API response"))?;
    let filename = meta
        .get("filename")
        .and_then(|v| v.as_str())
        .unwrap_or("invoice.pdf");
    let out = args.out.unwrap_or_else(|| PathBuf::from(filename));
    let bytes = if url.starts_with("http") {
        reqwest::get(url).await?.bytes().await?.to_vec()
    } else {
        vec![]
    };
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

fn print_rows(
    common: &CommonOptions,
    title: &str,
    payload: &serde_json::Value,
    columns: &[&str],
) -> Result<()> {
    if cli::output::should_use_json(common) {
        return cli::output::print_json(payload);
    }
    if common.show_ui() {
        cli::banner::print_intro(title);
    }
    let rows = payload
        .get("data")
        .and_then(|v| v.as_array())
        .cloned()
        .or_else(|| payload.as_array().cloned())
        .unwrap_or_default();
    if common.use_table() {
        let table_rows = rows
            .iter()
            .map(|row| {
                columns
                    .iter()
                    .map(|col| {
                        row.get(*col)
                            .map(|v| match v {
                                serde_json::Value::String(s) => s.clone(),
                                other => other.to_string(),
                            })
                            .unwrap_or_else(|| "-".to_string())
                    })
                    .collect::<Vec<_>>()
            })
            .collect::<Vec<_>>();
        cli::output::print_table(columns, &table_rows);
        return Ok(());
    }
    for row in rows {
        let id = columns
            .first()
            .and_then(|col| row.get(*col))
            .and_then(|v| v.as_str())
            .unwrap_or("-");
        println!("{id}");
    }
    Ok(())
}
