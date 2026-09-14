#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const path = require("node:path");

const binary = path.join(
  __dirname,
  "..",
  "lomi" + (process.platform === "win32" ? ".exe" : ""),
);

const result = spawnSync(binary, process.argv.slice(2), { stdio: "inherit" });
process.exit(result.status ?? 1);
