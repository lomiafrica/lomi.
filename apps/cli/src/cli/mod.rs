pub mod app;
pub mod banner;
pub mod output;
pub mod prompts;
pub mod update_check;

use clap::{Args, ValueEnum};
use std::str::FromStr;

use crate::config::GlobalConfig;

pub const PRODUCTION_API_URL: &str = "https://api.lomi.africa";
pub const SANDBOX_API_URL: &str = "https://sandbox.api.lomi.africa";
pub const LOCAL_API_URL: &str = "http://localhost:4242";
pub fn cli_auth_base(api_url: &str) -> String {
    format!("{}/cli-auth", api_url.trim_end_matches('/'))
}
pub const DOCS_URL: &str = "https://docs.lomi.africa";
pub const DEFAULT_DEV_PORT: u16 = 4242;

#[derive(Clone, Copy, Debug, Default, Eq, PartialEq, ValueEnum)]
pub enum OutputFormat {
    #[default]
    Human,
    Json,
}

impl FromStr for OutputFormat {
    type Err = String;

    fn from_str(value: &str) -> Result<Self, Self::Err> {
        match value.to_lowercase().as_str() {
            "human" => Ok(Self::Human),
            "json" => Ok(Self::Json),
            _ => Err(format!(
                "Unknown output format: {value}. Use human or json."
            )),
        }
    }
}

#[derive(Clone, Args, Debug)]
pub struct CommonOptions {
    /// The login profile to use (defaults to the switched profile in config)
    #[arg(long, global = true)]
    pub profile: Option<String>,

    /// Override the API URL
    #[arg(short = 'a', long, global = true)]
    pub api_url: Option<String>,

    /// CLI log level (debug, info, warn, error)
    #[arg(short = 'l', long, default_value = "info", global = true)]
    pub log_level: String,

    /// Opt-out of sending telemetry
    #[arg(long, global = true)]
    pub skip_telemetry: bool,

    /// Emit machine-readable JSON to stdout (suppresses banners and spinners)
    #[arg(long, global = true)]
    pub json: bool,

    /// Output format (human or json)
    #[arg(long, global = true, value_enum, hide = true)]
    pub output: Option<OutputFormat>,

    /// Disable colored output
    #[arg(long, global = true)]
    pub no_color: bool,

    /// Suppress non-essential output
    #[arg(short = 'q', long, global = true)]
    pub quiet: bool,
}

impl CommonOptions {
    pub fn use_json(&self) -> bool {
        if self.json {
            return true;
        }
        if let Some(output) = self.output {
            return output == OutputFormat::Json;
        }
        if let Ok(format) = std::env::var("LOMI_OUTPUT") {
            if format.eq_ignore_ascii_case("json") {
                return true;
            }
        }
        // JSON only when stdout is piped, not when stdin alone is non-TTY
        !output::is_stdout_tty()
    }

    pub fn show_ui(&self) -> bool {
        !self.use_json() && !self.quiet
    }

    /// Resolved profile name: explicit `--profile` flag or `current_profile` from config.
    pub fn effective_profile(&self) -> anyhow::Result<String> {
        if let Some(ref profile) = self.profile {
            return Ok(profile.clone());
        }
        Ok(GlobalConfig::load()?.current_profile)
    }
}
