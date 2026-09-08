use anyhow::{bail, Context, Result};
use std::env;

use crate::api::{ApiClient, MeResponse};
use crate::auth::device_flow::{api_url_for_profile, login, LoginOptions};
use crate::cli::CommonOptions;
use crate::config::{GlobalConfig, ProfileMetadata};

#[derive(Debug, Clone)]
pub struct AuthContext {
    pub profile: String,
    pub cli_token: String,
    pub api_url: String,
}

#[derive(Debug, Clone)]
pub enum AuthResult {
    Authenticated(AuthContext),
    Failed(String),
    Expired(String),
}

pub fn token_from_env() -> Option<String> {
    env::var("LOMI_ACCESS_TOKEN")
        .ok()
        .filter(|value| !value.is_empty())
}

pub fn resolve_auth(common: &CommonOptions) -> Result<Option<AuthContext>> {
    let profile = common.effective_profile()?;

    if let Some(token) = token_from_env() {
        return Ok(Some(AuthContext {
            profile: profile.clone(),
            cli_token: token,
            api_url: api_url_for_profile(&profile, common.api_url.as_deref()),
        }));
    }

    let config = GlobalConfig::load()?;
    if let Some(token) = config.cli_token(&profile)? {
        if let Some(profile_settings) = config.profile(&profile) {
            if GlobalConfig::is_token_expired(profile_settings) {
                return Ok(None);
            }
            let api_url = profile_settings
                .api_url
                .clone()
                .unwrap_or_else(|| api_url_for_profile(&profile, common.api_url.as_deref()));
            return Ok(Some(AuthContext {
                profile,
                cli_token: token,
                api_url,
            }));
        }
        return Ok(Some(AuthContext {
            profile: profile.clone(),
            cli_token: token,
            api_url: api_url_for_profile(&profile, common.api_url.as_deref()),
        }));
    }

    Ok(None)
}

pub async fn verify_and_refresh_metadata(auth: &AuthContext) -> Result<MeResponse> {
    let client = ApiClient::new(auth)?;
    let identity = client.get::<MeResponse>("/me").await?;

    let mut config = GlobalConfig::load()?;
    config.update_profile_metadata(
        &auth.profile,
        ProfileMetadata {
            organization_name: Some(identity.organization_name.clone()),
            organization_id: Some(identity.organization_id.clone()),
            environment: Some(identity.environment.clone()),
            expires_at: None,
        },
    )?;

    Ok(identity)
}

pub async fn ensure_authenticated(
    common: &CommonOptions,
    open_browser: bool,
    embedded: bool,
    silent: bool,
) -> Result<AuthContext> {
    if let Some(auth) = resolve_auth(common)? {
        return Ok(auth);
    }

    let profile = common.effective_profile()?;
    let config = GlobalConfig::load()?;
    if let Some(settings) = config.profile(&profile) {
        if config.cli_token(&profile)?.is_some() && GlobalConfig::is_token_expired(settings) {
            if !embedded && !silent && !common.use_json() {
                crate::cli::output::print_auth_expired(&profile);
            }
            bail!("CLI token expired for profile `{profile}`. Run `lomi login`.");
        }
    }

    if !embedded && !silent {
        let profile = common.effective_profile()?;
        if common.use_json() {
            bail!("Not authenticated for profile `{profile}`. Run `lomi login`.");
        }
        crate::cli::output::print_not_logged_in(&profile);
        bail!("Not authenticated for profile `{profile}`");
    }

    if !crate::cli::output::is_interactive() && embedded {
        bail!("Authentication required. Set LOMI_ACCESS_TOKEN or run `lomi login` in a TTY.");
    }

    let profile = common.effective_profile()?;
    let api_url = api_url_for_profile(&profile, common.api_url.as_deref());
    login(LoginOptions {
        profile: profile.clone(),
        api_url: api_url.clone(),
        open_browser,
        embedded,
        silent,
    })
    .await?;

    resolve_auth(common)?.context("Authentication succeeded but token was not saved")
}

pub fn try_authenticated(common: &CommonOptions) -> AuthResult {
    match resolve_auth(common) {
        Ok(Some(auth)) => AuthResult::Authenticated(auth),
        Ok(None) => {
            let profile = common.effective_profile().unwrap_or_default();
            let config = GlobalConfig::load().ok();
            if config.as_ref().is_some_and(|c| {
                c.profile(&profile)
                    .is_some_and(GlobalConfig::is_token_expired)
                    && c.cli_token(&profile).ok().flatten().is_some()
            }) {
                AuthResult::Expired(format!(
                    "CLI token expired for profile `{profile}`. Run `lomi login`."
                ))
            } else {
                AuthResult::Failed(format!(
                    "Not logged in for profile `{profile}`. Run `lomi login`."
                ))
            }
        }
        Err(error) => AuthResult::Failed(error.to_string()),
    }
}

pub async fn handle_auth_api_error(common: &CommonOptions, error: &anyhow::Error) -> Result<()> {
    if let Some(api_error) = error.downcast_ref::<crate::api::ApiError>() {
        if api_error.is_unauthorized() {
            let profile = common.effective_profile()?;
            let mut config = GlobalConfig::load()?;
            config.clear_token(&profile)?;
        }
    }
    Ok(())
}
