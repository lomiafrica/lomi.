#!/usr/bin/env node
/**
 * Confirms the Supabase publishable key a production app actually ships is one
 * Supabase still accepts. Next apps expose GET /api/ready/supabase. Vite apps
 * bake the key into JS, so this script reads it from the live bundle and probes
 * Supabase. The key is never printed.
 *
 * Env: APP (one app name, or "all"). Optional SLACK_WEBHOOK_URL.
 */
const SUPABASE_URL = (
  process.env.SUPABASE_URL || "https://mdswvokxrnfggrujsfjd.supabase.co"
).replace(/\/$/, "");

const HOSTS = {
  website: ["https://lomi.africa"],
  dashboard: ["https://dashboard.lomi.africa"],
  admin: ["https://admin.lomi.africa"],
  checkout: ["https://pay.lomi.africa", "https://checkout.lomi.africa"],
  storefront: ["https://store.lomi.africa"],
  customers: ["https://customers.lomi.africa"],
  docs: ["https://docs.lomi.africa"],
};

const KEY_RE = /sb_publishable_[A-Za-z0-9_-]+/g;
const ATTEMPTS = 4;
const ATTEMPT_DELAY_MS = 8_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(url, init) {
  const response = await fetch(url, {
    ...init,
    redirect: "manual",
    signal: AbortSignal.timeout(20_000),
  });
  const text = await response.text();
  return { response, text };
}

async function probeKey(key) {
  const { response } = await fetchText(`${SUPABASE_URL}/auth/v1/settings`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });
  return response.ok;
}

async function keysInAsset(url) {
  const { text } = await fetchText(url);
  return text.match(KEY_RE) ?? [];
}

async function scrapeKey(origin) {
  const { text } = await fetchText(origin);
  const inline = text.match(KEY_RE);
  if (inline?.[0]) return inline[0];

  const assets = new Set();
  const attr = /(?:src|href)=["']([^"']+)["']/g;
  for (const match of text.matchAll(attr)) {
    const raw = match[1];
    if (!raw || raw.startsWith("data:")) continue;
    const absolute = new URL(raw, origin).href;
    if (absolute.startsWith(origin) && absolute.includes(".js")) {
      assets.add(absolute);
    }
    if (assets.size >= 12) break;
  }

  for (const asset of assets) {
    const found = await keysInAsset(asset);
    if (found[0]) return found[0];
  }
  return null;
}

async function checkHost(origin) {
  const readyUrl = `${origin}/api/ready/supabase`;
  try {
    const { response, text } = await fetchText(readyUrl);
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      let body = null;
      try {
        body = JSON.parse(text);
      } catch {
        body = null;
      }
      if (response.status === 200 && body && body.ok === true) return null;
      if (response.status === 503 || (body && body.ok === false)) {
        return `${origin} ready route rejected the shipped key`;
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `${origin} ready route unreachable (${message})`;
  }

  let key = null;
  try {
    key = await scrapeKey(origin);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `${origin} bundle could not be read (${message})`;
  }
  if (!key) {
    return `${origin} ships no Supabase publishable key`;
  }
  try {
    const accepted = await probeKey(key);
    if (!accepted) return `${origin} bundle key was rejected by Supabase`;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `${origin} Supabase probe failed (${message})`;
  }
  return null;
}

async function checkHostWithRetry(origin) {
  let failure = null;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    failure = await checkHost(origin);
    if (!failure) return null;
    if (failure.includes("ships no")) return failure;
    if (attempt < ATTEMPTS) await sleep(ATTEMPT_DELAY_MS);
  }
  return failure;
}

async function notifySlack(failures) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    console.error("SLACK_WEBHOOK_URL not set; skipping notification");
    return;
  }
  const run = process.env.GITHUB_SERVER_URL
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : "";
  const text = [
    "Shipped Supabase publishable key was rejected.",
    ...failures.map((line) => `• ${line}`),
    run ? `Run: ${run}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    console.error(`Slack webhook failed (${response.status})`);
  }
}

async function main() {
  const app = process.env.APP || "all";
  const names = app === "all" ? Object.keys(HOSTS) : [app];
  const unknown = names.filter((name) => !HOSTS[name]);
  if (unknown.length > 0) {
    console.error(`no production hosts for app "${unknown.join(", ")}"`);
    process.exit(2);
  }

  const failures = [];
  for (const name of names) {
    for (const origin of HOSTS[name]) {
      const failure = await checkHostWithRetry(origin);
      if (failure) {
        console.error(failure);
        failures.push(failure);
      } else {
        console.log(`${origin} accepted the shipped key`);
      }
    }
  }

  if (failures.length === 0) return;
  await notifySlack(failures);
  process.exit(1);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
