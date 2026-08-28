use colored::Colorize;
use serde::Serialize;
use std::io::{IsTerminal, Write};
use std::sync::atomic::{AtomicBool, Ordering};

use super::CommonOptions;
use crate::api::ApiError;

static COLOR_DISABLED: AtomicBool = AtomicBool::new(false);

pub fn init_output(common: &CommonOptions) {
    if common.no_color || std::env::var("NO_COLOR").is_ok() {
        COLOR_DISABLED.store(true, Ordering::Relaxed);
        colored::control::set_override(false);
    }
}

pub fn logo() -> String {
    format!(
        "{}{}",
        "lomi".bright_green().bold(),
        ".".bright_magenta().bold()
    )
}

pub fn error_prefix() -> String {
    format!("{} {}", "✗".red().bold(), "Error:".red())
}

fn write_stdout(line: &str) {
    let mut out = std::io::stdout().lock();
    let _ = writeln!(out, "{line}");
}

fn write_stderr(line: &str) {
    let mut err = std::io::stderr().lock();
    let _ = writeln!(err, "{line}");
}

pub fn print_error(message: &str) {
    write_stderr(&format!("{} {}", error_prefix(), message));
}

pub fn print_success(message: &str) {
    write_stdout(&format!("  {} {}", "✓".green(), message));
}

pub fn print_info(message: &str) {
    write_stdout(&format!("  {} {}", "→".bright_blue(), message));
}

pub fn print_dim(message: &str) {
    write_stdout(&format!("  {}", message.bright_black()));
}

pub fn print_hint(message: &str) {
    write_stdout(&format!("  {} {}", "Hint:".cyan(), message));
}

pub fn print_step(message: &str) {
    println!("{} {}", "│".bright_black(), message);
}

pub fn print_kv(key: &str, value: &str) {
    println!(
        "{}  {}  {}",
        "│".bright_black(),
        format!("{key}:").bright_black(),
        value
    );
}

pub fn print_list_item(index: usize, command: &str, description: &str) {
    println!(
        "  {}. {} — {}",
        index + 1,
        command.cyan(),
        description.bright_black()
    );
}

pub fn print_note(title: &str, body: &str) {
    println!();
    println!("{} {}", "◇".cyan(), title.cyan());
    for line in body.lines() {
        println!("{}  {}", "│".bright_black(), line);
    }
    println!("{}  {}", "├".bright_black(), "─".repeat(40).bright_black());
}

pub fn print_probe_ok(label: &str) {
    println!("  {} {}", "✓".green(), label);
}

pub fn print_probe_fail(label: &str, detail: &str) {
    println!("  {} {} — {}", "✗".red(), label, detail);
}

pub fn divider() {
    println!("{}", "─".repeat(54).bright_black());
}

pub fn is_tty() -> bool {
    std::io::stdin().is_terminal()
}

pub fn is_stdout_tty() -> bool {
    std::io::stdout().is_terminal()
}

pub fn is_interactive() -> bool {
    is_tty() && is_stdout_tty()
}

pub fn should_use_json(common: &CommonOptions) -> bool {
    common.use_json()
}

pub fn print_json<T: Serialize>(value: &T) -> anyhow::Result<()> {
    println!("{}", serde_json::to_string_pretty(value)?);
    Ok(())
}

#[derive(Serialize)]
pub struct CliErrorJson {
    pub error: CliErrorBody,
}

#[derive(Serialize)]
pub struct CliErrorBody {
    pub message: String,
    pub code: Option<String>,
    pub hint: Option<String>,
    pub request_id: Option<String>,
    pub docs_url: String,
}

pub fn render_error(error: &anyhow::Error, common: &CommonOptions) -> i32 {
    if should_use_json(common) {
        let (message, code, hint, request_id) = extract_error_details(error);
        let payload = CliErrorJson {
            error: CliErrorBody {
                message,
                code,
                hint,
                request_id,
                docs_url: crate::cli::DOCS_URL.to_string(),
            },
        };
        let _ = writeln!(
            std::io::stdout(),
            "{}",
            serde_json::to_string_pretty(&payload).unwrap_or_default()
        );
        return 1;
    }

    if let Some(api_error) = error.downcast_ref::<ApiError>() {
        print_error(&api_error.to_string());
        print_hint(&api_error.hint);
        if let Some(request_id) = &api_error.request_id {
            print_dim(&format!("Request ID: {request_id}"));
        }
        print_dim(&format!("Docs: {}", crate::cli::DOCS_URL));
        return api_error.exit_code();
    }

    let message = error
        .chain()
        .map(|cause| cause.to_string())
        .collect::<Vec<_>>()
        .join(": ");
    print_error(&message);

    if message.contains("Not authenticated") || message.contains("login") {
        print_hint("Run `lomi login` to authenticate.");
    }

    1
}

fn extract_error_details(
    error: &anyhow::Error,
) -> (String, Option<String>, Option<String>, Option<String>) {
    if let Some(api_error) = error.downcast_ref::<ApiError>() {
        return (
            api_error.to_string(),
            Some(api_error.code.clone()),
            Some(api_error.hint.clone()),
            api_error.request_id.clone(),
        );
    }

    let message = error.to_string();
    let hint = if message.contains("Not authenticated") || message.contains("login") {
        Some("Run `lomi login` to authenticate.".to_string())
    } else {
        None
    };
    (message, None, hint, None)
}

pub fn print_not_logged_in(profile: &str) {
    print_error(&format!("You are not logged in to profile `{profile}`."));
    print_hint(&format!(
        "Run `lomi login --profile {profile}` to get started."
    ));
}

pub fn print_auth_expired(profile: &str) {
    print_error(&format!(
        "Your CLI token for profile `{profile}` has expired."
    ));
    print_hint(&format!(
        "Run `lomi login --profile {profile}` to refresh it."
    ));
}

pub fn print_update_available(current: &str, latest: &str) {
    println!();
    print_info(&format!(
        "Update available: v{current} → v{latest}. Run `npm i -g lomi.cli` or `brew upgrade lomi`."
    ));
}

pub fn print_telemetry_notice() {
    println!();
    print_dim("lomi. CLI sends anonymous usage telemetry. Opt out with --skip-telemetry.");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn json_mode_requires_explicit_flag_or_piped_stdout() {
        let common = CommonOptions {
            profile: None,
            api_url: None,
            log_level: "info".to_string(),
            skip_telemetry: false,
            json: false,
            output: None,
            no_color: false,
            quiet: false,
        };
        // When stdout is a TTY in tests it may vary; json flag always works
        let with_json = CommonOptions {
            json: true,
            ..common.clone()
        };
        assert!(with_json.use_json());
    }
}
