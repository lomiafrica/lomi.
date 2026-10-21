use anyhow::{bail, Context, Result};
use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE};
use serde::de::DeserializeOwned;

use crate::api::ApiError;
use crate::auth::AuthContext;

/// Host of a `scheme://` remainder (already lowercased). Empty if the authority is invalid.
fn http_url_host(rest: &str) -> &str {
    let authority = rest.split(['/', '?', '#']).next().unwrap_or(rest);
    if let Some(inside) = authority.strip_prefix('[') {
        return match inside.split_once(']') {
            Some((host, after)) if after.is_empty() || after.starts_with(':') => host,
            _ => "",
        };
    }
    let hostport = match authority.rsplit_once('@') {
        Some((_, hostport)) => hostport,
        None => authority,
    };
    hostport.split(':').next().unwrap_or(hostport)
}

fn allows_cleartext_http(rest: &str) -> bool {
    let authority = rest.split(['/', '?', '#']).next().unwrap_or(rest);
    if authority.contains('@') {
        return false;
    }
    matches!(http_url_host(rest), "localhost" | "127.0.0.1" | "::1")
}

fn request_url(base_url: &str, path: &str) -> Result<String> {
    let base = base_url.trim_end_matches('/');
    let lower = base.to_ascii_lowercase();
    if let Some(rest) = lower.strip_prefix("https://") {
        if rest.is_empty() {
            bail!("The API URL must use https. Only localhost may use http.");
        }
        let host = &base["https://".len()..];
        return Ok(format!("https://{host}{path}"));
    }
    if let Some(rest) = lower.strip_prefix("http://") {
        if allows_cleartext_http(rest) {
            let host = &base["http://".len()..];
            return Ok(format!("http://{host}{path}"));
        }
    }
    bail!("The API URL must use https. Only localhost may use http.");
}

pub struct ApiClient {
    client: reqwest::Client,
    base_url: String,
    token: String,
}

impl ApiClient {
    pub fn new(auth: &AuthContext) -> Result<Self> {
        let mut headers = HeaderMap::new();
        headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
        headers.insert(
            "X-API-KEY",
            HeaderValue::from_str(&auth.cli_token).context("Invalid CLI token")?,
        );

        let client = reqwest::Client::builder()
            .default_headers(headers)
            .build()?;

        let base_url = auth.api_url.trim_end_matches('/').to_string();
        request_url(&base_url, "")?;

        Ok(Self {
            client,
            base_url,
            token: auth.cli_token.clone(),
        })
    }

    pub async fn get<T: DeserializeOwned>(&self, path: &str) -> Result<T> {
        self.request(reqwest::Method::GET, path, None::<&()>, false)
            .await
    }

    pub async fn get_text(&self, path: &str) -> Result<String> {
        let url = request_url(&self.base_url, path)?;
        let response = self
            .client
            .get(&url)
            .send()
            .await
            .with_context(|| format!("Network error connecting to {url}"))?;

        if !response.status().is_success() {
            let status = response.status();
            let text = response.text().await.unwrap_or_default();
            return Err(ApiError::from_response(status, &text).into());
        }

        response.text().await.context("Failed to read API response")
    }

    pub async fn post<T: DeserializeOwned, B: serde::Serialize>(
        &self,
        path: &str,
        body: &B,
    ) -> Result<T> {
        self.request(reqwest::Method::POST, path, Some(body), true)
            .await
    }

    async fn request<T: DeserializeOwned, B: serde::Serialize>(
        &self,
        method: reqwest::Method,
        path: &str,
        body: Option<&B>,
        send_idempotency_key: bool,
    ) -> Result<T> {
        let url = request_url(&self.base_url, path)?;
        let mut request = self.client.request(method, &url);

        if let Some(body) = body {
            request = request.json(body);
        }
        if send_idempotency_key {
            let key = format!(
                "cli-{}-{}",
                chrono::Utc::now().timestamp_millis(),
                std::process::id()
            );
            request = request.header("Idempotency-Key", key);
        }

        let response = request
            .send()
            .await
            .with_context(|| format!("Network error connecting to {url}"))?;

        if !response.status().is_success() {
            let status = response.status();
            let text = response.text().await.unwrap_or_default();
            return Err(ApiError::from_response(status, &text).into());
        }

        if response.status() == reqwest::StatusCode::NO_CONTENT {
            return Ok(serde_json::from_value(serde_json::Value::Null)?);
        }

        response
            .json::<T>()
            .await
            .context("Failed to parse API response")
    }

    pub fn headers(&self) -> HeaderMap {
        let mut headers = HeaderMap::new();
        headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
        if let Ok(value) = HeaderValue::from_str(&self.token) {
            headers.insert("X-API-KEY", value);
        }
        headers
    }
}

pub async fn health_check(auth: &AuthContext) -> Result<()> {
    let client = ApiClient::new(auth)?;

    let _: String = client.get_text("/").await?;
    let _: serde_json::Value = client.get("/me").await?;
    let _: serde_json::Value = client.get("/accounts/balance").await?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn https_api_urls_keep_host_and_path() {
        assert_eq!(
            request_url("https://api.lomi.africa/", "/me").unwrap(),
            "https://api.lomi.africa/me"
        );
        assert_eq!(
            request_url("HTTPS://Sandbox.api.lomi.africa", "/me").unwrap(),
            "https://Sandbox.api.lomi.africa/me"
        );
    }

    #[test]
    fn loopback_http_is_allowed() {
        assert_eq!(
            request_url("http://localhost:3000", "/cli/listen").unwrap(),
            "http://localhost:3000/cli/listen"
        );
        assert_eq!(
            request_url("http://127.0.0.1", "/me").unwrap(),
            "http://127.0.0.1/me"
        );
        assert_eq!(
            request_url("http://[::1]:8080/", "/me").unwrap(),
            "http://[::1]:8080/me"
        );
    }

    #[test]
    fn remote_http_is_rejected() {
        let err = request_url("http://api.lomi.africa", "/me").unwrap_err();
        assert!(err.to_string().contains("must use https"));
        assert!(request_url("http://example.com", "/me").is_err());
        assert!(request_url("ftp://localhost", "/me").is_err());
        assert!(request_url("https://", "/me").is_err());
    }

    #[test]
    fn localhost_lookalikes_cannot_use_http() {
        for url in [
            "http://localhost.evil.com",
            "http://localhost.com",
            "http://127.0.0.1.nip.io",
            "http://[::1]evil",
            "http://localhost@evil.com",
            "http://evil.com@localhost",
            "http://user:pass@127.0.0.1",
            "http://evil.com@[::1]",
        ] {
            assert!(
                request_url(url, "/me").is_err(),
                "cleartext should be rejected for {url}"
            );
        }
    }
}
