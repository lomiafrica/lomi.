#!/usr/bin/env node
/**
 * Block until the named check run on GITHUB_SHA succeeds.
 * Deploy workflows call this so a red lomi · check never publishes.
 */
const name = process.argv[2];
const sha = process.env.GITHUB_SHA;
const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const waitMs = Number(process.env.CHECK_WAIT_MS || 45 * 60 * 1000);
const pollMs = 15_000;

if (!name || !sha || !repo || !token) {
  console.error("need a check name, GITHUB_SHA, GITHUB_REPOSITORY, and GH_TOKEN");
  process.exit(2);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkRuns() {
  const url = `https://api.github.com/repos/${repo}/commits/${sha}/check-runs?per_page=100`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`GitHub ${response.status}: ${text.slice(0, 300)}`);
  }
  const data = JSON.parse(text);
  return (data.check_runs || []).filter((run) => run.name === name);
}

const started = Date.now();
while (Date.now() - started < waitMs) {
  let runs = [];
  try {
    runs = await checkRuns();
  } catch (error) {
    console.warn(error.message);
    await sleep(pollMs);
    continue;
  }
  const completed = runs.find((run) => run.status === "completed");
  if (completed) {
    console.log(`${name}: ${completed.conclusion}`);
    if (completed.conclusion === "success") process.exit(0);
    process.exit(1);
  }
  const status = runs[0]?.status || "not started";
  console.log(`waiting for ${name} (${status}) on ${sha.slice(0, 7)}`);
  await sleep(pollMs);
}

console.error(`timed out waiting for ${name}`);
process.exit(1);
