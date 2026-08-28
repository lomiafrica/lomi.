use anyhow::{Context, Result};
use std::fs;
use std::path::PathBuf;

use super::global::config_dir;

const SERVICE: &str = "lomi-cli";

fn fallback_path(profile: &str) -> Result<PathBuf> {
    Ok(config_dir()?.join(format!(".credentials-{profile}")))
}

fn prefer_file_backend() -> bool {
    std::env::var("LOMI_CONFIG_DIR").is_ok()
}

pub fn store_cli_token(profile: &str, token: &str) -> Result<()> {
    if !prefer_file_backend() {
        if let Ok(entry) = keyring::Entry::new(SERVICE, profile) {
            if entry.set_password(token).is_ok() {
                return Ok(());
            }
        }
    }
    write_fallback_file(profile, token)
}

pub fn read_cli_token(profile: &str) -> Result<Option<String>> {
    if !prefer_file_backend() {
        if let Ok(entry) = keyring::Entry::new(SERVICE, profile) {
            if let Ok(password) = entry.get_password() {
                if !password.is_empty() {
                    return Ok(Some(password));
                }
            }
        }
    }
    read_fallback_file(profile)
}

pub fn delete_cli_token(profile: &str) -> Result<()> {
    if let Ok(entry) = keyring::Entry::new(SERVICE, profile) {
        let _ = entry.delete_credential();
    }
    delete_fallback_file(profile)
}

fn write_fallback_file(profile: &str, token: &str) -> Result<()> {
    let path = fallback_path(profile)?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }
    fs::write(&path, token)
        .with_context(|| format!("Failed to write credential file {}", path.display()))?;
    chmod_private(&path)?;
    Ok(())
}

fn read_fallback_file(profile: &str) -> Result<Option<String>> {
    let path = fallback_path(profile)?;
    if !path.exists() {
        return Ok(None);
    }
    let contents = fs::read_to_string(&path)
        .with_context(|| format!("Failed to read credential file {}", path.display()))?;
    let trimmed = contents.trim();
    if trimmed.is_empty() {
        return Ok(None);
    }
    Ok(Some(trimmed.to_string()))
}

fn delete_fallback_file(profile: &str) -> Result<()> {
    let path = fallback_path(profile)?;
    if path.exists() {
        fs::remove_file(&path)
            .with_context(|| format!("Failed to remove credential file {}", path.display()))?;
    }
    Ok(())
}

#[cfg(unix)]
fn chmod_private(path: &PathBuf) -> Result<()> {
    use std::os::unix::fs::PermissionsExt;
    let mut perms = fs::metadata(path)?.permissions();
    perms.set_mode(0o600);
    fs::set_permissions(path, perms)?;
    Ok(())
}

#[cfg(not(unix))]
fn chmod_private(_path: &PathBuf) -> Result<()> {
    Ok(())
}
