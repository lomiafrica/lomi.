use anyhow::{Context, Result};
use serde::Deserialize;

pub const MANIFEST_JSON: &str = include_str!("../utils/rules/manifest.json");
pub const MANIFEST_VERSION: &str = "1.1.0";

#[derive(Debug, Clone, Deserialize)]
pub struct RuleOptionMeta {
    pub name: String,
    pub title: String,
    pub label: String,
    pub path: String,
    #[serde(default)]
    pub apply_to: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
struct ManifestVersion {
    options: Vec<RuleOptionMeta>,
}

#[derive(Debug, Clone, Deserialize)]
struct RulesManifest {
    pub current_version: String,
    pub versions: std::collections::HashMap<String, ManifestVersion>,
}

#[derive(Debug, Clone)]
pub struct RuleOption {
    pub name: String,
    pub title: String,
    pub label: String,
    pub contents: String,
    pub apply_to: String,
}

pub fn load_current_rules() -> Result<Vec<RuleOption>> {
    let manifest: RulesManifest =
        serde_json::from_str(MANIFEST_JSON).context("Failed to parse rules manifest")?;

    let version = manifest
        .versions
        .get(&manifest.current_version)
        .with_context(|| format!("Manifest version {} not found", manifest.current_version))?;

    version
        .options
        .iter()
        .map(|option| {
            let contents = load_rule_file(&option.path)?;
            Ok(RuleOption {
                name: option.name.clone(),
                title: option.title.clone(),
                label: option.label.clone(),
                contents,
                apply_to: option
                    .apply_to
                    .clone()
                    .unwrap_or_else(|| "**/*.{ts,tsx,js,jsx}".to_string()),
            })
        })
        .collect()
}

fn load_rule_file(relative_path: &str) -> Result<String> {
    let contents = match relative_path {
        "sdk-basics.md" => include_str!("../utils/rules/sdk-basics.md"),
        "checkout-sessions.md" => include_str!("../utils/rules/checkout-sessions.md"),
        "webhooks.md" => include_str!("../utils/rules/webhooks.md"),
        "charges.md" => include_str!("../utils/rules/charges.md"),
        "subscriptions.md" => include_str!("../utils/rules/subscriptions.md"),
        "api-reference.md" => include_str!("../utils/rules/api-reference.md"),
        "embed-checkout.md" => include_str!("../utils/rules/embed-checkout.md"),
        "ecommerce-plugins.md" => include_str!("../utils/rules/ecommerce-plugins.md"),
        "docs-writing.md" => include_str!("../utils/rules/docs-writing.md"),
        "llms.txt" => include_str!("../utils/rules/llms.txt"),
        other => anyhow::bail!("Unknown rule file: {other}"),
    };
    Ok(contents.to_string())
}
