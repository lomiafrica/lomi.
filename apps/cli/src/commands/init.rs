use anyhow::{bail, Context, Result};
use clap::Args;
use colored::Colorize;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions, DOCS_URL};
use crate::commands::install_rules::{self, InstallRulesArgs};
use crate::config::{Environment, GlobalConfig, Language};

#[derive(Args, Debug)]
#[command(
    after_help = "Example:\n  lomi init\n  lomi init --yes --environment sandbox --language ts --api-key lomi_sk_test_xxx"
)]
pub struct InitArgs {
    /// Project path (default: current directory)
    #[arg(default_value = ".")]
    pub path: String,

    /// Skip all prompts (requires --environment and --language)
    #[arg(short = 'y', long)]
    pub yes: bool,

    /// Target environment
    #[arg(short = 'e', long)]
    pub environment: Option<String>,

    /// Project language (ts or js)
    #[arg(short = 'L', long)]
    pub language: Option<String>,

    /// API key for the project (.env)
    #[arg(long)]
    pub api_key: Option<String>,

    /// Skip installing npm dependencies
    #[arg(long)]
    pub skip_package_install: bool,

    /// Skip agent rules install prompt
    #[arg(long)]
    pub skip_rules_install: bool,

    /// Project template (default, express, nextjs)
    #[arg(long, default_value = "default")]
    pub template: String,
}

pub async fn run(common: &CommonOptions, args: InitArgs) -> Result<()> {
    let _template = &args.template;
    print_logo();
    cli::banner::print_intro("Initializing lomi. project");

    if args.yes {
        if args.environment.is_none() || args.language.is_none() || args.api_key.is_none() {
            bail!("--yes requires --environment, --language, and --api-key");
        }
    } else {
        cli::prompts::require_tty()?;
    }

    let _auth = ensure_authenticated(common, true, true, false).await?;

    let environment = if args.yes {
        Environment::from_str(args.environment.as_ref().unwrap())?
    } else {
        let choices = vec![Environment::Production, Environment::Sandbox];
        cli::prompts::select(
            "Which environment should the examples use?",
            choices,
            Environment::Sandbox,
        )?
    };

    let language = if args.yes {
        Language::from_str(args.language.as_ref().unwrap())?
    } else {
        let choices = vec![Language::TypeScript, Language::JavaScript];
        cli::prompts::select("Generate example code in:", choices, Language::TypeScript)?
    };

    let api_key = if args.yes {
        args.api_key.clone().unwrap()
    } else {
        cli::prompts::password(
            "Enter your API key (from https://lomi.africa/portal/settings/api-keys):",
        )?
    };

    if api_key.trim().is_empty() {
        bail!("API key cannot be empty");
    }

    let project_dir = PathBuf::from(&args.path);
    fs::create_dir_all(&project_dir)?;

    let spinner = indicatif::ProgressBar::new_spinner();
    spinner.set_style(
        indicatif::ProgressStyle::default_spinner()
            .template("{spinner} {msg}")
            .unwrap(),
    );
    spinner.set_message("Setting up your lomi. project...");
    spinner.enable_steady_tick(std::time::Duration::from_millis(100));

    let ext = language.extension();
    let client_dir = project_dir.join("lib").join("lomi.");
    let examples_dir = project_dir.join("examples");
    fs::create_dir_all(&client_dir)?;
    fs::create_dir_all(&examples_dir)?;

    fs::write(
        client_dir.join(format!("client.{ext}")),
        templates::client(&language),
    )?;
    fs::write(
        examples_dir.join(format!("create-checkout-session.{ext}")),
        templates::checkout_example(&language),
    )?;
    fs::write(
        examples_dir.join(format!("webhook-handler.{ext}")),
        templates::webhook_example(&language),
    )?;
    fs::write(
        examples_dir.join("embed-checkout.html"),
        templates::embed_checkout_html(),
    )?;
    fs::write(
        project_dir.join("lomi.config.ts"),
        templates::lomi_config(environment.as_str()),
    )?;

    let env_content = templates::env_file(&api_key, environment.api_url());
    match std::fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(project_dir.join(".env"))
    {
        Ok(mut file) => {
            use std::io::Write;
            file.write_all(env_content.as_bytes())?;
        }
        Err(error) if error.kind() == std::io::ErrorKind::AlreadyExists => {
            spinner.println("  .env already exists — skipped");
        }
        Err(error) => return Err(error.into()),
    }

    if !args.skip_package_install {
        spinner.set_message("Installing dependencies (@lomi./sdk, dotenv)...");
        ensure_package_json(&project_dir)?;
        install_dependencies(&project_dir)?;
    }

    spinner.finish_and_clear();
    cli::output::print_success("lomi. project initialized successfully!");

    println!();
    println!("{}", "Created files:".bold());
    println!("  - lib/lomi./client.{ext}");
    println!("  - examples/create-checkout-session.{ext}");
    println!("  - examples/webhook-handler.{ext}");
    println!("  - examples/embed-checkout.html");
    println!("  - lomi.config.ts");
    println!("  - .env");
    println!();
    println!(
        "{}",
        "Remember to add LOMI_WEBHOOK_SECRET to your .env file.".yellow()
    );

    if !args.skip_rules_install {
        if args.yes {
            install_rules::run(
                common,
                InstallRulesArgs {
                    target: Some(vec!["cursor".to_string(), "llms.txt".to_string()]),
                    force: false,
                },
            )
            .await?;
        } else {
            let install_rules_prompt =
                cli::prompts::confirm("Install lomi. agent rules for Cursor / Claude Code?", true)?;

            if install_rules_prompt {
                install_rules::run(
                    common,
                    InstallRulesArgs {
                        target: None,
                        force: false,
                    },
                )
                .await?;
            } else {
                let mut config = GlobalConfig::load()?;
                config.settings.has_seen_rules_install_prompt = true;
                config.save()?;
            }
        }
    }

    cli::banner::print_next_steps(&[
        "Fill placeholder values (merchant_id, price_xxx) in the example files.",
        "Add your webhook secret to .env.",
        "Run `lomi dev` for local webhook testing.",
        &format!("Read the docs at {DOCS_URL}"),
    ]);
    cli::banner::print_outro("Project initialized. Happy coding!");
    Ok(())
}

fn print_logo() {
    println!();
    println!("{}", templates::LOGO.bright_blue());
    println!();
}

fn ensure_package_json(project_dir: &Path) -> Result<()> {
    let package_json = project_dir.join("package.json");
    if package_json.exists() {
        return Ok(());
    }

    let status = Command::new("npm")
        .args(["init", "-y"])
        .current_dir(project_dir)
        .status()
        .context("Failed to run npm init")?;

    if !status.success() {
        bail!("npm init failed with status {status}");
    }
    Ok(())
}

fn install_dependencies(project_dir: &Path) -> Result<()> {
    let package_manager = detect_package_manager(project_dir);
    let (cmd, args): (&str, Vec<&str>) = match package_manager.as_str() {
        "pnpm" => ("pnpm", vec!["add", "@lomi./sdk", "dotenv"]),
        "yarn" => ("yarn", vec!["add", "@lomi./sdk", "dotenv"]),
        "bun" => ("bun", vec!["add", "@lomi./sdk", "dotenv"]),
        _ => ("npm", vec!["install", "@lomi./sdk", "dotenv"]),
    };

    let status = Command::new(cmd)
        .args(args)
        .current_dir(project_dir)
        .status()
        .with_context(|| format!("Failed to run {cmd}"))?;

    if !status.success() {
        bail!("Dependency installation failed. Run `{cmd} add @lomi./sdk dotenv` manually.");
    }
    Ok(())
}

fn detect_package_manager(project_dir: &Path) -> String {
    for (file, pm) in [
        ("pnpm-lock.yaml", "pnpm"),
        ("yarn.lock", "yarn"),
        ("bun.lockb", "bun"),
        ("bun.lock", "bun"),
    ] {
        if project_dir.join(file).exists() {
            return pm.to_string();
        }
    }

    if which_exists("pnpm") {
        return "pnpm".to_string();
    }
    if which_exists("yarn") {
        return "yarn".to_string();
    }
    if which_exists("bun") {
        return "bun".to_string();
    }
    "npm".to_string()
}

fn which_exists(command: &str) -> bool {
    Command::new("which")
        .arg(command)
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false)
}

mod templates {
    use super::Language;

    pub const LOGO: &str = r"
██╗      ██████╗ ███╗   ███╗██╗
██║     ██╔═══██╗████╗ ████║██║
██║     ██║   ██║██╔████╔██║██║
██║     ██║   ██║██║╚██╔╝██║██║
███████╗╚██████╔╝██║ ╚═╝ ██║██║██╗
╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝";

    pub fn client(language: &Language) -> String {
        if language.is_typescript() {
            r#"import { DefaultService, OpenAPI } from '@lomi./sdk';
import 'dotenv/config';

const apiKey = process.env.LOMI_SECRET_KEY;
const baseUrl = process.env.LOMI_API_URL || undefined;

if (!apiKey) {
  console.error('Error: LOMI_SECRET_KEY not found in environment variables.');
  process.exit(1);
}

OpenAPI.BASE = baseUrl || 'https://api.lomi.africa';
OpenAPI.HEADERS = {
  Authorization: `Bearer ${apiKey}`,
};

export const lomiApi = DefaultService;
export default lomiApi;
"#
            .to_string()
        } else {
            r#"const { DefaultService, OpenAPI } = require('@lomi./sdk');
require('dotenv').config();

const apiKey = process.env.LOMI_SECRET_KEY;
const baseUrl = process.env.LOMI_API_URL || undefined;

if (!apiKey) {
  console.error('Error: LOMI_SECRET_KEY not found in environment variables.');
  process.exit(1);
}

OpenAPI.BASE = baseUrl || 'https://api.lomi.africa';
OpenAPI.HEADERS = {
  Authorization: `Bearer ${apiKey}`,
};

const lomiApi = DefaultService;
module.exports = { lomiApi };
"#
            .to_string()
        }
    }

    pub fn checkout_example(language: &Language) -> String {
        let ext = language.extension();
        if language.is_typescript() {
            format!(
                r#"import {{ lomiApi }} from '../lib/lomi./client.{ext}';
import type {{ CreateCheckoutSession }} from '@lomi./sdk';
import 'dotenv/config';

async function createCheckout() {{
  console.log('Creating checkout session...');

  const payload: CreateCheckoutSession = {{
    merchant_id: 'your_merchant_id',
    success_url: 'https://your-site.com/success?session_id={{CHECKOUT_SESSION_ID}}',
    cancel_url: 'https://your-site.com/cancel',
    line_items: [{{ price: 'price_xxxxxxxxxxxx', quantity: 1 }}],
  }};

  const session = await lomiApi.createCheckoutSession(payload);
  console.log('Checkout session:', session.id);
  console.log('Redirect URL:', session.url);
}}

createCheckout().catch(console.error);
"#
            )
        } else {
            format!(
                r#"const {{ lomiApi }} = require('../lib/lomi./client.{ext}');
require('dotenv').config();

async function createCheckout() {{
  console.log('Creating checkout session...');

  const payload = {{
    merchant_id: 'your_merchant_id',
    success_url: 'https://your-site.com/success?session_id={{CHECKOUT_SESSION_ID}}',
    cancel_url: 'https://your-site.com/cancel',
    line_items: [{{ price: 'price_xxxxxxxxxxxx', quantity: 1 }}],
  }};

  const session = await lomiApi.createCheckoutSession(payload);
  console.log('Checkout session:', session.id);
  console.log('Redirect URL:', session.url);
}}

createCheckout().catch(console.error);
"#
            )
        }
    }

    pub fn webhook_example(language: &Language) -> String {
        if language.is_typescript() {
            r#"import http from 'http';
import {{ Buffer }} from 'node:buffer';
import crypto from 'node:crypto';
import 'dotenv/config';

const webhookSecret = process.env.LOMI_WEBHOOK_SECRET;
if (!webhookSecret) {{
  console.error('Error: LOMI_WEBHOOK_SECRET not found in .env');
  process.exit(1);
}}

function verifySignature(rawBody: string, signature: string, secret: string) {{
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))) {{
    throw new Error('Signature mismatch');
  }}
  return JSON.parse(rawBody);
}}

const server = http.createServer(async (req, res) => {{
  if (req.method !== 'POST' || req.url !== '/webhook') {{
    res.writeHead(404);
    res.end('Not Found');
    return;
  }}

  const chunks: Buffer[] = [];
  for await (const chunk of req) {{
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }}
  const rawBody = Buffer.concat(chunks).toString('utf8');

  try {{
    const signature = req.headers['x-lomi-signature'] as string;
    if (!signature) throw new Error('Missing X-Lomi-Signature header');

    const event = verifySignature(rawBody, signature, webhookSecret);
    const eventType = (req.headers['x-lomi-event'] as string) || event.event;
    console.log('Verified webhook:', eventType);

    res.writeHead(200, {{ 'Content-Type': 'application/json' }});
    res.end(JSON.stringify({{ received: true }}));
  }} catch (error) {{
    const message = error instanceof Error ? error.message : 'Webhook error';
    res.writeHead(400);
    res.end(JSON.stringify({{ error: message }}));
  }}
}});

const PORT = process.env.PORT || 4242;
server.listen(PORT, () => console.log(`Webhook server listening on http://localhost:${{PORT}}/webhook`));
"#
            .to_string()
        } else {
            r#"const http = require('http');
const {{ Buffer }} = require('node:buffer');
const crypto = require('node:crypto');
require('dotenv').config();

const webhookSecret = process.env.LOMI_WEBHOOK_SECRET;
if (!webhookSecret) {{
  console.error('Error: LOMI_WEBHOOK_SECRET not found in .env');
  process.exit(1);
}}

function verifySignature(rawBody, signature, secret) {{
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))) {{
    throw new Error('Signature mismatch');
  }}
  return JSON.parse(rawBody);
}}

const server = http.createServer(async (req, res) => {{
  if (req.method !== 'POST' || req.url !== '/webhook') {{
    res.writeHead(404);
    res.end('Not Found');
    return;
  }}

  const chunks = [];
  for await (const chunk of req) {{
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }}
  const rawBody = Buffer.concat(chunks).toString('utf8');

  try {{
    const signature = req.headers['x-lomi-signature'];
    if (!signature) throw new Error('Missing X-Lomi-Signature header');

    const event = verifySignature(rawBody, signature, webhookSecret);
    const eventType = req.headers['x-lomi-event'] || event.event;
    console.log('Verified webhook:', eventType);

    res.writeHead(200, {{ 'Content-Type': 'application/json' }});
    res.end(JSON.stringify({{ received: true }}));
  }} catch (error) {{
    const message = error instanceof Error ? error.message : 'Webhook error';
    res.writeHead(400);
    res.end(JSON.stringify({{ error: message }}));
  }}
}});

const PORT = process.env.PORT || 4242;
server.listen(PORT, () => console.log(`Webhook server listening on http://localhost:${{PORT}}/webhook`));
"#
            .to_string()
        }
    }

    pub fn embed_checkout_html() -> String {
        r#"<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>lomi. Embed checkout</title>
  </head>
  <body>
    <!--
      1. Run: lomi checkout create
      2. Replace CHECKOUT_URL below with the printed checkout_url
      3. npm install @lomi./embed (or copy node_modules/@lomi./embed/dist/lomi.js)
    -->
    <button id="pay">Pay with lomi.</button>
    <script type="module">
      import { loadLomiCheckout } from '@lomi./embed';

      const CHECKOUT_URL = 'CHECKOUT_URL';

      document.getElementById('pay').addEventListener('click', () => {
        loadLomiCheckout({
          checkoutUrl: CHECKOUT_URL,
          mode: 'modal',
          onComplete: (payload) => console.log('Paid', payload),
        });
      });
    </script>
  </body>
</html>
"#
        .to_string()
    }

    pub fn lomi_config(environment: &str) -> String {
        format!(
            r#"export default {{
  environment: '{environment}',
  projectName: process.env.LOMI_PROJECT_NAME || 'lomi-project',
}};
"#
        )
    }

    pub fn env_file(api_key: &str, api_url: &str) -> String {
        format!(
            r#"# lomi. environment variables
LOMI_SECRET_KEY={api_key}
# Run `lomi listen` to receive your webhook secret, or copy from the dashboard
LOMI_WEBHOOK_SECRET=whsec_your_webhook_secret_here
LOMI_API_URL={api_url}
"#
        )
    }
}
