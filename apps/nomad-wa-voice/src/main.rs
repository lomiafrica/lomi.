//! hermes-wa-voice: WhatsApp voice-call sidecar for Hermes.
//!
//!   hermes-wa-voice pair [--phone <number>]   Link to the bot's WhatsApp number (QR or pair code)
//!   hermes-wa-voice serve                      Answer the owner's calls and place calls on request
//!
//! Normally started through `hermes whatsapp-voice ...`, which supplies the environment.

mod audio;
mod calls;
mod config;
mod core;
mod gemini;
mod hermes;
mod server;

use std::sync::Arc;
use std::time::Duration;

use anyhow::{Context, Result, anyhow, bail};
use qrcode::QrCode;
use qrcode::render::unicode::Dense1x2;
use whatsapp_rust::pair_code::PairCodeOptions;
use whatsapp_rust::prelude::*;
use whatsapp_rust::wacore::types::call::CallAction;

use crate::calls::{Bridge, Signal};
use crate::config::{Config, digits};

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::Builder::from_env(
        env_logger::Env::default().default_filter_or("info,whatsapp_rust=warn,wacore=warn"),
    )
    .init();
    let args: Vec<String> = std::env::args().skip(1).collect();
    match args.first().map(String::as_str) {
        Some("pair") => {
            let phone = match args.get(1).map(String::as_str) {
                Some("--phone") => Some(digits(args.get(2).context("--phone needs a number")?)),
                Some(other) => bail!("unknown argument {other}"),
                None => None,
            };
            pair(phone).await
        }
        Some("serve") => serve().await,
        Some("--version") => {
            println!("{}", env!("CARGO_PKG_VERSION"));
            Ok(())
        }
        _ => bail!("usage: hermes-wa-voice pair [--phone <number>] | serve"),
    }
}

async fn open_store() -> Result<SqliteStore> {
    let dir = Config::data_dir()?;
    std::fs::create_dir_all(&dir)?;
    SqliteStore::open(&Config::store_path(&dir))
        .await
        .map_err(|e| anyhow!("opening session store: {e}"))
}

async fn pair(phone: Option<String>) -> Result<()> {
    let (done_tx, mut done_rx) = tokio::sync::mpsc::channel::<()>(1);
    // The dashboard's Pair button shows this file, refreshed on every QR rotation.
    let qr_file = Config::data_dir()?.join("pair-qr.svg");
    let qr_path = qr_file.clone();
    let mut builder = Bot::builder()
        .with_backend(open_store().await?)
        .on_qr_code(move |code, timeout| {
            let qr_path = qr_path.clone();
            async move {
                match QrCode::new(code.as_bytes()) {
                    Ok(qr) => {
                        println!("\n{}", qr.render::<Dense1x2>().quiet_zone(true).build());
                        let svg = qr.render::<qrcode::render::svg::Color>().min_dimensions(320, 320).build();
                        let tmp = qr_path.with_extension("svg.tmp");
                        if std::fs::write(&tmp, svg).and_then(|_| std::fs::rename(&tmp, &qr_path)).is_err() {
                            log::warn!("could not write {}", qr_path.display());
                        }
                    }
                    Err(_) => println!("\n{code}"),
                }
            println!(
                "On the bot's phone: WhatsApp > Linked devices > Link a device, then scan (valid {}s).",
                    timeout.as_secs()
                );
            }
        })
        .on_pair_code(|code, timeout| async move {
            println!("\nPair code: {code}  (valid {}s)", timeout.as_secs());
            println!("On the bot's phone: WhatsApp > Linked devices > Link a device > Link with phone number instead.");
        })
        .on_connected(move |_client| {
            let done = done_tx.clone();
            async move {
                let _ = done.send(()).await;
            }
        });
    if let Some(phone_number) = phone {
        builder = builder.with_pair_code(PairCodeOptions {
            phone_number,
            ..Default::default()
        });
    }
    let mut bot = builder
        .build()
        .await
        .map_err(|e| anyhow!("starting WhatsApp client: {e}"))?
        .spawn();
    tokio::select! {
        reason = &mut bot => bail!("WhatsApp client stopped before linking: {reason:?}"),
        _ = done_rx.recv() => {}
    }
    // Let post-login setup finish, then shut down cleanly: only shutdown() saves the new session.
    tokio::time::sleep(Duration::from_secs(5)).await;
    bot.shutdown().await;
    let _ = std::fs::remove_file(&qr_file);
    println!("Linked. Start the sidecar with: hermes whatsapp-voice serve");
    Ok(())
}

struct CallObserver {
    bridge: Arc<Bridge>,
}

impl EventHandler for CallObserver {
    fn handle_event(&self, event: Arc<Event>) {
        let Event::IncomingCall(call) = &*event else {
            return;
        };
        let (call_creator, caller_pn) = match &call.action {
            CallAction::Offer {
                call_creator,
                caller_pn,
                group_jid: None,
                ..
            } => (call_creator, caller_pn),
            CallAction::PreAccept { call_id, .. } => {
                return self.bridge.ring_signals.send(call_id, Signal::Ringing);
            }
            CallAction::Accept { call_id, .. } => {
                return self.bridge.ring_signals.send(call_id, Signal::Accepted);
            }
            // `busy`/`enc` mean one device could not take the call; the others keep ringing.
            CallAction::Reject {
                call_id,
                reason: None,
                ..
            } => return self.bridge.ring_signals.send(call_id, Signal::Declined),
            _ => return,
        };
        if !self.bridge.cfg.answer_inbound {
            return;
        }
        let (bridge, call) = (self.bridge.clone(), (**call).clone());
        let (creator, caller_pn) = (call_creator.clone(), caller_pn.clone());
        tokio::spawn(async move {
            // Anyone but the owner is left alone: the bot's other devices can still pick up.
            if !bridge.is_owner(&call, &creator, caller_pn.as_ref()).await {
                log::info!("ignoring call from {creator}: not the owner");
                return;
            }
            bridge.run_inbound(call).await;
        });
    }
}

async fn serve() -> Result<()> {
    let cfg = Config::from_env()?;
    let link_qr = Arc::new(std::sync::Mutex::new(None));
    let qr_slot = link_qr.clone();
    let linked = link_qr.clone();
    let mut bot = Bot::builder()
        .with_backend(open_store().await?)
        .on_qr_code(move |code, timeout| {
            let qr_slot = qr_slot.clone();
            async move {
                *qr_slot.lock().unwrap() = Some(code.to_string());
                log::info!(
                    "waiting for the bot phone to scan the WhatsApp link (valid {}s)",
                    timeout.as_secs()
                );
            }
        })
        .on_connected(move |_| {
            let linked = linked.clone();
            async move {
                *linked.lock().unwrap() = None;
                log::info!("connected to WhatsApp");
            }
        })
        .on_logged_out(|info| async move {
            log::error!("logged out of WhatsApp ({info:?}); scan the link from Nomad settings");
            std::process::exit(0);
        })
        .build()
        .await
        .map_err(|e| anyhow!("starting WhatsApp client: {e}"))?
        .spawn();
    let bridge = Arc::new(
        Bridge::new(cfg, Some(bot.client())).use_link_qr(link_qr),
    );
    let _subscription = bot.client().subscribe_handler(Arc::new(CallObserver {
        bridge: bridge.clone(),
    }));
    if bridge.cfg.hermes_api_key.is_empty() {
        log::warn!("HERMES_API_KEY not set: calls work, but the voice cannot reach Nomad");
    }
    tokio::spawn({
        let bridge = bridge.clone();
        async move { bridge.refresh_persona().await }
    });

    let res = tokio::select! {
        reason = &mut bot => bail!("WhatsApp client stopped: {reason:?}"),
        res = server::serve(bridge) => res,
        _ = shutdown_signal() => Ok(()),
    };
    // Saves the device session and encryption state; exiting without it can lose them.
    bot.shutdown().await;
    res
}
