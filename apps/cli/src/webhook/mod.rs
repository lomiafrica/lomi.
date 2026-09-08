use hmac::{Hmac, Mac};
use sha2::Sha256;

pub fn verify_lomi_signature(raw_body: &str, signature: &str, secret: &str) -> Result<(), String> {
    type HmacSha256 = Hmac<Sha256>;
    let mut mac = HmacSha256::new_from_slice(secret.as_bytes())
        .map_err(|_| "Invalid webhook secret".to_string())?;
    mac.update(raw_body.as_bytes());
    let sig_bytes = hex::decode(signature).map_err(|_| "Invalid signature encoding".to_string())?;
    mac.verify_slice(&sig_bytes)
        .map_err(|_| "Signature mismatch".to_string())?;
    Ok(())
}

pub fn verify_from_headers(
    raw_body: &str,
    headers: &[(String, String)],
) -> Result<Option<String>, String> {
    let mut lomi_sig_v1 = None;
    let mut lomi_sig = None;
    let mut legacy_sig = None;
    let mut event_type = None;

    for (key, value) in headers {
        let lower = key.to_ascii_lowercase();
        match lower.as_str() {
            "x-lomi-signature-v1" => lomi_sig_v1 = Some(value.clone()),
            "x-lomi-signature" => lomi_sig = Some(value.clone()),
            "x-lomi-event" => event_type = Some(value.clone()),
            "lomi-signature" => legacy_sig = Some(value.clone()),
            _ => {}
        }
    }

    let secret = std::env::var("LOMI_WEBHOOK_SECRET")
        .map_err(|_| "LOMI_WEBHOOK_SECRET not set".to_string())?;

    if let Some(signature_header) = lomi_sig_v1 {
        verify_v1_signature(raw_body, &signature_header, &secret)?;
        return Ok(event_type);
    }

    if let Some(signature) = lomi_sig {
        verify_lomi_signature(raw_body, &signature, &secret)?;
        return Ok(event_type);
    }

    if let Some(signature_header) = legacy_sig {
        eprintln!(
            "Warning: lomi-signature is deprecated. Production webhooks use X-Lomi-Signature-V1."
        );
        verify_legacy_signature(raw_body, &signature_header, &secret)?;
        return Ok(event_type);
    }

    Err("Missing X-Lomi-Signature-V1 header".to_string())
}

fn verify_v1_signature(raw_body: &str, signature_header: &str, secret: &str) -> Result<(), String> {
    let mut timestamp = None;
    let mut signature = None;
    for part in signature_header.split(',') {
        let part = part.trim();
        if let Some(value) = part.strip_prefix("t=") {
            timestamp = Some(value);
        } else if let Some(value) = part.strip_prefix("v1=") {
            signature = Some(value);
        }
    }

    let timestamp = timestamp.ok_or_else(|| "Invalid V1 signature header".to_string())?;
    let signature = signature.ok_or_else(|| "Invalid V1 signature header".to_string())?;
    let signed_payload = format!("{timestamp}.{raw_body}");
    verify_lomi_signature(&signed_payload, signature, secret)
}

fn verify_legacy_signature(
    raw_body: &str,
    signature_header: &str,
    secret: &str,
) -> Result<(), String> {
    let mut timestamp = None;
    let mut signature = None;
    for part in signature_header.split(',') {
        if let Some(value) = part.strip_prefix("t=") {
            timestamp = Some(value);
        } else if let Some(value) = part.strip_prefix("s=") {
            signature = Some(value);
        }
    }

    let timestamp = timestamp.ok_or_else(|| "Invalid signature header".to_string())?;
    let signature = signature.ok_or_else(|| "Invalid signature header".to_string())?;
    let signed_payload = format!("{timestamp}.{raw_body}");
    verify_lomi_signature(&signed_payload, signature, secret)
}
