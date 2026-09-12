#!/usr/bin/env node
/**
 * Poll Vercel until the production deployment for GITHUB_SHA is READY or ERROR.
 * Used after vercel-action, which can drop the wait socket (~16m) on long builds.
 *
 * Env: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, GITHUB_SHA
 * Optional: VERCEL_WAIT_MS (default 90m), VERCEL_POLL_MS (default 15s)
 */
const token = process.env.VERCEL_TOKEN;
const teamId = process.env.VERCEL_ORG_ID;
const projectId = process.env.VERCEL_PROJECT_ID;
const sha = process.env.GITHUB_SHA;
const timeoutMs = Number(process.env.VERCEL_WAIT_MS || 90 * 60 * 1000);
const findTimeoutMs = Number(process.env.VERCEL_FIND_MS || 12 * 60 * 1000);
const pollMs = Number(process.env.VERCEL_POLL_MS || 15_000);

if (!token || !teamId || !projectId || !sha) {
  console.error(
    "need VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, and GITHUB_SHA",
  );
  process.exit(2);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function vercelGet(path) {
  const url = new URL(`https://api.vercel.com${path}`);
  url.searchParams.set("teamId", teamId);
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Vercel ${response.status} ${path}: ${text.slice(0, 400)}`);
  }
  return JSON.parse(text);
}

async function findDeployment() {
  const data = await vercelGet(
    `/v6/deployments?projectId=${encodeURIComponent(projectId)}&limit=20`,
  );
  const deployments = Array.isArray(data.deployments) ? data.deployments : [];
  const matches = deployments.filter(
    (deployment) =>
      deployment.meta?.githubCommitSha === sha &&
      deployment.target === "production",
  );
  const rank = { READY: 0, BUILDING: 1, INITIALIZING: 2, QUEUED: 3, ERROR: 4 };
  matches.sort(
    (left, right) =>
      (rank[left.readyState || left.state] ?? 9) -
      (rank[right.readyState || right.state] ?? 9),
  );
  return matches[0] ?? null;
}

const started = Date.now();
let deployment = null;

while (Date.now() - started < findTimeoutMs) {
  try {
    deployment = await findDeployment();
    if (deployment) break;
    console.log(`waiting for production deployment of ${sha.slice(0, 7)}…`);
  } catch (error) {
    console.warn(`list deployments retry: ${error.message}`);
  }
  await sleep(pollMs);
}

if (!deployment) {
  console.error(`no production deployment found for ${sha}`);
  process.exit(1);
}

const id = deployment.uid || deployment.id;
console.log(`watching ${id} (${deployment.url || "no url"})`);

while (Date.now() - started < timeoutMs) {
  try {
    const current = await vercelGet(`/v13/deployments/${id}`);
    const state = current.readyState || current.state;
    console.log(`state=${state}`);
    if (state === "READY") {
      process.exit(0);
    }
    if (state === "ERROR" || state === "CANCELED") {
      const message = current.errorMessage || current.errorCode || state;
      console.error(`deployment ${state}: ${message}`);
      process.exit(1);
    }
  } catch (error) {
    console.warn(`inspect retry: ${error.message}`);
  }
  await sleep(pollMs);
}

console.error(`timed out waiting for ${id}`);
process.exit(1);
