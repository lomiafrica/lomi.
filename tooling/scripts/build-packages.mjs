#!/usr/bin/env node

/**
 * Emit JS for the TypeScript source packages that Node, Next, and Metro
 * consume at runtime (`@lomi./shared`, `@lomi./queries`).
 *
 * pnpm file: copies hard-link `dist/`, so one build updates every app.
 */

import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const PACKAGES = ["packages/shared", "packages/queries"];

function runBuild(relDir) {
  console.log(`\n==> ${relDir} (build)`);
  const result = spawnSync("pnpm", ["run", "build"], {
    cwd: path.join(ROOT, relDir),
    stdio: "inherit",
    env: process.env,
  });
  const status = result.status ?? 1;
  if (status !== 0) process.exit(status);
}

function watchAll() {
  const children = PACKAGES.map((relDir) => {
    console.log(`==> ${relDir} (watch)`);
    return spawn(
      "pnpm",
      ["exec", "tsc", "-p", "tsconfig.build.json", "--watch"],
      {
        cwd: path.join(ROOT, relDir),
        stdio: "inherit",
        env: process.env,
      },
    );
  });

  const stop = () => {
    for (const child of children) child.kill("SIGTERM");
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);

  for (const child of children) {
    child.on("exit", (code) => {
      if (code && code !== 0) process.exit(code);
    });
  }
}

if (process.argv.includes("--watch")) {
  watchAll();
} else {
  for (const relDir of PACKAGES) runBuild(relDir);
}
