//! Loopback HTTP API used by the Hermes plugin.

use std::sync::Arc;

use axum::extract::{Path, Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use serde::Deserialize;
use serde_json::json;

use crate::calls::Bridge;

type ApiResult = Result<Response, (StatusCode, Json<serde_json::Value>)>;

fn error(status: StatusCode, msg: impl Into<String>) -> (StatusCode, Json<serde_json::Value>) {
    (status, Json(json!({"error": msg.into()})))
}

fn authorize(
    bridge: &Bridge,
    headers: &HeaderMap,
) -> Result<(), (StatusCode, Json<serde_json::Value>)> {
    let expected = format!("Bearer {}", bridge.cfg.token);
    match headers.get("authorization").and_then(|v| v.to_str().ok()) {
        Some(got) if constant_time_eq(got.as_bytes(), expected.as_bytes()) => Ok(()),
        _ => Err(error(StatusCode::UNAUTHORIZED, "bad or missing token")),
    }
}

fn constant_time_eq(a: &[u8], b: &[u8]) -> bool {
    a.len() == b.len() && a.iter().zip(b).fold(0u8, |acc, (x, y)| acc | (x ^ y)) == 0
}

async fn pair_state(State(bridge): State<Arc<Bridge>>, headers: HeaderMap) -> ApiResult {
    authorize(&bridge, &headers)?;
    let qr = bridge.link_qr.lock().unwrap().clone();
    Ok(Json(json!({
        "qr": qr,
        "logged_in": bridge.client.as_ref().is_some_and(|c| c.is_logged_in()),
    }))
    .into_response())
}

async fn health(State(bridge): State<Arc<Bridge>>, headers: HeaderMap) -> ApiResult {
    authorize(&bridge, &headers)?;
    Ok(Json(json!({
        "ok": true,
        "version": env!("CARGO_PKG_VERSION"),
        "logged_in": bridge.client.as_ref().is_some_and(|c| c.is_logged_in()),
        "active_call": bridge.calls.active(),
        "hermes_connected": !bridge.cfg.hermes_api_key.is_empty(),
    }))
    .into_response())
}

#[derive(Deserialize)]
struct StartCall {
    reason: String,
    #[serde(default)]
    details: String,
}

async fn start_call(
    State(bridge): State<Arc<Bridge>>,
    headers: HeaderMap,
    Json(body): Json<StartCall>,
) -> ApiResult {
    authorize(&bridge, &headers)?;
    let reason = body.reason.trim().to_string();
    if reason.is_empty() {
        return Err(error(StatusCode::BAD_REQUEST, "reason is required"));
    }
    if !bridge.client.as_ref().is_some_and(|c| c.is_logged_in()) {
        return Err(error(
            StatusCode::SERVICE_UNAVAILABLE,
            "not connected to WhatsApp",
        ));
    }
    let record = bridge
        .begin_outbound(&reason)
        .map_err(|e| error(StatusCode::CONFLICT, e.to_string()))?;
    tokio::spawn(bridge.clone().run_outbound(
        record.id.clone(),
        reason,
        body.details.trim().to_string(),
    ));
    Ok((StatusCode::ACCEPTED, Json(record)).into_response())
}

#[derive(Deserialize)]
struct CallText {
    text: String,
}

/// A WhatsApp text from the owner, for the active call (the plugin's gateway hook sends it).
async fn call_text(
    State(bridge): State<Arc<Bridge>>,
    headers: HeaderMap,
    Json(body): Json<CallText>,
) -> ApiResult {
    authorize(&bridge, &headers)?;
    let text = body.text.trim();
    if text.is_empty() || !bridge.deliver_text(text) {
        return Err(error(StatusCode::NOT_FOUND, "no active call takes texts"));
    }
    Ok(Json(json!({"delivered": true})).into_response())
}

#[derive(Deserialize)]
struct ListQuery {
    limit: Option<usize>,
}

async fn list_calls(
    State(bridge): State<Arc<Bridge>>,
    headers: HeaderMap,
    Query(q): Query<ListQuery>,
) -> ApiResult {
    authorize(&bridge, &headers)?;
    let calls = bridge.calls.recent(q.limit.unwrap_or(5).min(50));
    Ok(Json(json!({"calls": calls})).into_response())
}

async fn get_call(
    State(bridge): State<Arc<Bridge>>,
    headers: HeaderMap,
    Path(id): Path<String>,
) -> ApiResult {
    authorize(&bridge, &headers)?;
    match bridge.calls.get(&id) {
        Some(record) => Ok(Json(record).into_response()),
        None => Err(error(StatusCode::NOT_FOUND, "no such call")),
    }
}

pub async fn serve(bridge: Arc<Bridge>) -> anyhow::Result<()> {
    let addr = bridge.cfg.listen.clone();
    let app = Router::new()
        .route("/health", get(health))
        .route("/pair", get(pair_state))
        .route("/calls", get(list_calls).post(start_call))
        .route("/calls/active/text", post(call_text))
        .route("/calls/{id}", get(get_call))
        .with_state(bridge);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    log::info!("API listening on http://{addr}");
    axum::serve(listener, app).await?;
    Ok(())
}
