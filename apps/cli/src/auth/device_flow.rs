use anyhow::{bail, Context, Result};
use colored::Colorize;
use reqwest::StatusCode;
use serde::Deserialize;
use std::time::{Duration, Instant};

use crate::api::{request_url, ApiClient, MeResponse};
use crate::cli::PRODUCTION_API_URL;
use crate::config::{GlobalConfig, ProfileMetadata};

fn auth_client() -> Result<reqwest::Client> {
    Ok(reqwest::Client::builder().build()?)
}

#[derive(Debug, Deserialize)]
struct DeviceAuthResponse {
    device_code: String,
    user_code: String,
    verification_uri: String,
    interval: u64,
    expires_in: u64,
}

#[derive(Debug, Deserialize)]
struct TokenSuccessResponse {
    api_key: String,
}

#[derive(Debug, Deserialize)]
struct TokenErrorResponse {
    error: Option<String>,
    message: Option<String>,
}

#[derive(Debug, Clone)]
pub struct LoginOptions {
    pub profile: String,
    pub api_url: String,
    pub open_browser: bool,
    pub embedded: bool,
    pub silent: bool,
}

pub async fn login(options: LoginOptions) -> Result<String> {
    let device_auth_url = request_url(&options.api_url, "/cli-auth/device-auth")?;
    let token_url = request_url(&options.api_url, "/cli-auth/token")?;
    let client = auth_client()?;

    let device_auth = client
        .post(&device_auth_url)
        .send()
        .await
        .context("Failed to connect to authentication service")?
        .error_for_status()
        .context("Device auth request failed")?
        .json::<DeviceAuthResponse>()
        .await
        .context("Invalid device auth response")?;

    if !options.silent && !options.embedded {
        crate::cli::banner::print_intro("Logging in to lomi.");
    }

    if !options.silent {
        println!();
        println!(
            "  {} {}",
            "Code:".bold(),
            device_auth.user_code.yellow().bold()
        );
        println!();
        println!(
            "  Opening {} in your browser...",
            device_auth.verification_uri.cyan()
        );
        println!(
            "  {} Paste the code above if prompted.",
            "Tip:".bright_black()
        );
        println!();
    }

    if options.open_browser {
        if let Err(error) = open::that(&device_auth.verification_uri) {
            crate::cli::output::print_error(&format!(
                "Could not open browser: {error}. Visit {}",
                device_auth.verification_uri
            ));
        }
    } else if !options.silent {
        println!("  Visit manually: {}", device_auth.verification_uri.cyan());
    }

    if !options.silent {
        println!();
        println!("  Waiting for authorization...");
    }

    let spinner = if options.silent {
        None
    } else {
        Some(indicatif::ProgressBar::new_spinner())
    };
    if let Some(spinner) = &spinner {
        spinner.set_style(
            indicatif::ProgressStyle::default_spinner()
                .template("{spinner} {msg}")
                .unwrap(),
        );
        spinner.set_message("Waiting for authorization in browser...");
        spinner.enable_steady_tick(Duration::from_millis(100));
    }

    let expiry = Instant::now() + Duration::from_secs(device_auth.expires_in);
    let poll_interval = Duration::from_secs(device_auth.interval.max(1));
    let mut token: Option<String> = None;

    while Instant::now() < expiry {
        tokio::time::sleep(poll_interval).await;

        let environment = environment_for_profile(&options.profile);
        let response = client
            .post(&token_url)
            .json(&serde_json::json!({
                "device_code": device_auth.device_code,
                "environment": environment,
            }))
            .send()
            .await
            .context("Failed to poll for authorization token")?;

        if response.status().is_success() {
            let body = response
                .json::<TokenSuccessResponse>()
                .await
                .context("Invalid token response")?;
            token = Some(body.api_key);
            break;
        }

        let status = response.status();
        let body = response
            .json::<TokenErrorResponse>()
            .await
            .unwrap_or(TokenErrorResponse {
                error: None,
                message: None,
            });

        match body.error.as_deref() {
            Some("authorization_pending") => continue,
            Some("expired_token") => bail!("Login failed: The authorization code expired."),
            Some("access_denied") => {
                bail!("Login failed: Authorization was denied in the browser.")
            }
            _ if status == StatusCode::BAD_REQUEST => {
                bail!(
                    "Login failed: {}",
                    body.message
                        .unwrap_or_else(|| "Unknown polling error".to_string())
                );
            }
            _ => bail!("Login failed: Could not connect to authentication service."),
        }
    }

    if let Some(spinner) = spinner {
        spinner.finish_and_clear();
    }

    let token = token.context("Login failed: Timed out waiting for authorization.")?;

    let mut config = GlobalConfig::load()?;
    config.set_token(&options.profile, token.clone(), options.api_url.clone())?;

    let auth = crate::auth::AuthContext {
        profile: options.profile.clone(),
        cli_token: token.clone(),
        api_url: options.api_url.clone(),
    };

    if let Ok(api_client) = ApiClient::new(&auth) {
        if let Ok(identity) = api_client.get::<MeResponse>("/me").await {
            let mut config = GlobalConfig::load()?;
            config.update_profile_metadata(
                &options.profile,
                ProfileMetadata {
                    organization_name: Some(identity.organization_name.clone()),
                    organization_id: Some(identity.organization_id.clone()),
                    environment: Some(identity.environment.clone()),
                    expires_at: None,
                },
            )?;

            if !options.silent && !options.embedded {
                crate::cli::output::print_success(&format!(
                    "Logged in as {} ({})",
                    identity.organization_name, identity.environment
                ));
            }
        }
    }

    if !options.silent && !options.embedded {
        crate::cli::banner::print_outro("You're all set!");
        println!();
        crate::cli::output::print_hint("Run `lomi quickstart` to verify and see next steps.");
    }

    Ok(token)
}

pub fn environment_for_profile(profile: &str) -> &'static str {
    if profile == "sandbox" {
        "test"
    } else {
        "live"
    }
}

pub fn api_url_for_profile(profile: &str, override_url: Option<&str>) -> String {
    override_url.map(str::to_string).unwrap_or_else(|| {
        if profile == "local" {
            crate::cli::LOCAL_API_URL.to_string()
        } else if profile == "sandbox" {
            crate::cli::SANDBOX_API_URL.to_string()
        } else {
            PRODUCTION_API_URL.to_string()
        }
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn login_builds_https_and_loopback_auth_urls() {
        assert_eq!(
            request_url("https://api.lomi.africa/", "/cli-auth/device-auth").unwrap(),
            "https://api.lomi.africa/cli-auth/device-auth"
        );
        assert_eq!(
            request_url("http://localhost:4242", "/cli-auth/token").unwrap(),
            "http://localhost:4242/cli-auth/token"
        );
        assert_eq!(
            request_url("https://sandbox.api.lomi.africa", "/cli-auth/revoke").unwrap(),
            "https://sandbox.api.lomi.africa/cli-auth/revoke"
        );
    }

    #[test]
    fn login_rejects_remote_http_and_userinfo_before_polling() {
        for url in [
            "http://api.lomi.africa",
            "http://localhost@evil.example",
            "http://evil.example@localhost",
            "http://user:pass@127.0.0.1",
        ] {
            assert!(
                request_url(url, "/cli-auth/device-auth").is_err(),
                "device login should reject {url} before polling"
            );
            assert!(
                request_url(url, "/cli-auth/token").is_err(),
                "token poll should reject {url}"
            );
            assert!(
                request_url(url, "/cli-auth/revoke").is_err(),
                "revoke should reject {url}"
            );
        }
    }
}
