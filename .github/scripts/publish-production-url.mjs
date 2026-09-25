#!/usr/bin/env node
import { appendFileSync } from "node:fs";

const aliases = {
  website: "https://lomi.africa",
  dashboard: "https://dashboard.lomi.africa",
  admin: "https://admin.lomi.africa",
  checkout: "https://pay.lomi.africa",
  storefront: "https://store.lomi.africa",
  customers: "https://customers.lomi.africa",
  docs: "https://docs.lomi.africa",
};

const app = process.env.APP || "";
const url = aliases[app];
const summary = process.env.GITHUB_STEP_SUMMARY;
const sha = (process.env.GITHUB_SHA || "").slice(0, 7);

if (!url || !summary) {
  console.error(`no production alias for app "${app}"`);
  process.exit(1);
}

appendFileSync(
  summary,
  `### Production\n\n${url}\n\nCommit \`${sha}\` is the deployment on that alias.\n`,
);
console.log(url);
