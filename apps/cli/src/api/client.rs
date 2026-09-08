use anyhow::{Context, Result};
use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE};
use serde::de::DeserializeOwned;

use crate::api::ApiError;
use crate::auth::AuthContext;

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

        Ok(Self {
            client,
            base_url: auth.api_url.trim_end_matches('/').to_string(),
            token: auth.cli_token.clone(),
        })
    }

    pub async fn get<T: DeserializeOwned>(&self, path: &str) -> Result<T> {
        self.request(reqwest::Method::GET, path, None::<&()>, false)
            .await
    }

    pub async fn get_text(&self, path: &str) -> Result<String> {
        let url = format!("{}{}", self.base_url, path);
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
        let url = format!("{}{}", self.base_url, path);
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
