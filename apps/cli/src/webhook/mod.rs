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

#[cfg(test)]
mod tests {
    use super::*;
    use hmac::{Hmac, Mac};
    use sha2::Sha256;

    fn sign(secret: &str, payload: &str) -> String {
        type HmacSha256 = Hmac<Sha256>;
        let mut mac = HmacSha256::new_from_slice(secret.as_bytes()).unwrap();
        mac.update(payload.as_bytes());
        hex::encode(mac.finalize().into_bytes())
    }

    #[test]
    fn accepts_matching_hmac() {
        let secret = "whsec_test";
        let body = r#"{"id":"evt_1","type":"payment.succeeded"}"#;
        let signature = sign(secret, body);
        assert!(verify_lomi_signature(body, &signature, secret).is_ok());
    }

    #[test]
    fn rejects_tampered_body_or_secret() {
        let secret = "whsec_test";
        let body = r#"{"id":"evt_1"}"#;
        let signature = sign(secret, body);
        assert_eq!(
            verify_lomi_signature(r#"{"id":"evt_2"}"#, &signature, secret).unwrap_err(),
            "Signature mismatch"
        );
        assert_eq!(
            verify_lomi_signature(body, &signature, "whsec_other").unwrap_err(),
            "Signature mismatch"
        );
    }

    #[test]
    fn rejects_invalid_hex() {
        assert_eq!(
            verify_lomi_signature("{}", "not-hex", "whsec_test").unwrap_err(),
            "Invalid signature encoding"
        );
    }

    #[test]
    fn verifies_v1_header_over_timestamp_and_body() {
        let secret = "whsec_test";
        let body = r#"{"id":"evt_1"}"#;
        let timestamp = "1710000000";
        let signature = sign(secret, &format!("{timestamp}.{body}"));
        let header = format!("t={timestamp},v1={signature}");
        assert!(verify_v1_signature(body, &header, secret).is_ok());
        assert!(verify_v1_signature(body, "v1=only", secret).is_err());
        assert!(verify_v1_signature(body, &format!("t={timestamp},v1=00"), secret).is_err());
    }

    #[test]
    fn verifies_legacy_s_header() {
        let secret = "whsec_test";
        let body = "{}";
        let timestamp = "1710000000";
        let signature = sign(secret, &format!("{timestamp}.{body}"));
        let header = format!("t={timestamp},s={signature}");
        assert!(verify_legacy_signature(body, &header, secret).is_ok());
        assert!(verify_legacy_signature(body, &format!("t={timestamp}"), secret).is_err());
    }
}
