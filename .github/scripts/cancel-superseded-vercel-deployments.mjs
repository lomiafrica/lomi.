#!/usr/bin/env node
/**
 * Cancel in-flight Vercel deployments for this project before a new CLI
 * deploy. GitHub `cancel-in-progress` only kills the runner; the Vercel
 * build that already started keeps going and is billed.
 *
 * Env: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
 * Optional: VERCEL_TARGET (default production; also matches untargeted
 * production CLI deploys), VERCEL_KEEP_SHA (leave this commit running)
 */
const token = process.env.VERCEL_TOKEN;
const teamId = process.env.VERCEL_ORG_ID;
const projectId = process.env.VERCEL_PROJECT_ID;
const target = process.env.VERCEL_TARGET || "production";
const keepSha = process.env.VERCEL_KEEP_SHA || "";

if (!token || !teamId || !projectId) {
  console.error("need VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID");
  process.exit(2);
}

const inFlight = new Set(["BUILDING", "QUEUED", "INITIALIZING", "PENDING"]);

async function vercel(method, path) {
  const url = new URL(`https://api.vercel.com${path}`);
  url.searchParams.set("teamId", teamId);
  const response = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Vercel ${response.status} ${path}: ${text.slice(0, 400)}`);
  }
  return text ? JSON.parse(text) : {};
}

function matchesTarget(deployment) {
  const deploymentTarget = deployment.target || "production";
  return deploymentTarget === target;
}

const data = await vercel(
  "GET",
  `/v6/deployments?projectId=${encodeURIComponent(projectId)}&limit=40`,
);
const deployments = Array.isArray(data.deployments) ? data.deployments : [];
const superseded = deployments.filter((deployment) => {
  const state = deployment.readyState || deployment.state;
  if (!inFlight.has(state)) return false;
  if (!matchesTarget(deployment)) return false;
  const sha = deployment.meta?.githubCommitSha || "";
  if (keepSha && sha === keepSha) return false;
  return true;
});

if (superseded.length === 0) {
  console.log(`no in-flight ${target} deployments to cancel`);
  process.exit(0);
}

let failed = 0;
for (const deployment of superseded) {
  const id = deployment.uid || deployment.id;
  const state = deployment.readyState || deployment.state;
  const sha = (deployment.meta?.githubCommitSha || "").slice(0, 7) || "no-sha";
  try {
    await vercel("PATCH", `/v12/deployments/${id}/cancel`);
    console.log(`canceled ${id} (${state}, ${sha})`);
  } catch (error) {
    failed += 1;
    console.warn(`could not cancel ${id}: ${error.message}`);
  }
}

if (failed > 0 && failed === superseded.length) {
  process.exit(1);
}
