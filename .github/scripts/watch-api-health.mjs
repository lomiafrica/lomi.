#!/usr/bin/env node
/**
 * Probe the live API over HTTP. Railway keeps TLS up when the Node process
 * stops writing responses, so a TCP or status-page check stays green.
 *
 * Exit 0 when both hosts answer /health with HTTP 200.
 * Exit 1 and post an urgent Slack message when either does not.
 */
const HOSTS = [
  "https://api.lomi.africa/health",
  "https://sandbox.api.lomi.africa/health",
];
const TIMEOUT_MS = 8_000;
const RETRY_DELAY_MS = 10_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function probe(url) {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const elapsed = Date.now() - started;
    if (response.status !== 200) {
      return { url, ok: false, detail: `HTTP ${response.status} in ${elapsed}ms` };
    }
    const text = await response.text();
    if (!text.includes('"ok":true')) {
      return { url, ok: false, detail: `HTTP 200 without ok:true in ${elapsed}ms` };
    }
    return { url, ok: true, detail: `HTTP 200 in ${elapsed}ms` };
  } catch (error) {
    const elapsed = Date.now() - started;
    const message = error instanceof Error ? error.message : String(error);
    return { url, ok: false, detail: `${message} after ${elapsed}ms` };
  }
}

async function probeTwice(url) {
  const first = await probe(url);
  if (first.ok) return first;
  await sleep(RETRY_DELAY_MS);
  const second = await probe(url);
  if (second.ok) return second;
  return {
    url,
    ok: false,
    detail: `${first.detail}; retry: ${second.detail}`,
  };
}

async function notify(failures) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    console.error("SLACK_WEBHOOK_URL not set; skipping notification");
    return;
  }
  const run = process.env.GITHUB_SERVER_URL
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : "";
  const lines = failures.map((failure) => `• ${failure.url} — ${failure.detail}`);
  const text = [
    ":rotating_light: *URGENT* — the lomi. API is not answering HTTP.",
    "TLS can still succeed. Restart the Railway API service.",
    ...lines,
    run,
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
  const results = await Promise.all(HOSTS.map((url) => probeTwice(url)));
  for (const result of results) {
    console.log(`${result.ok ? "ok" : "FAIL"} ${result.url} ${result.detail}`);
  }
  const failures = results.filter((result) => !result.ok);
  if (failures.length === 0) return;
  await notify(failures);
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
