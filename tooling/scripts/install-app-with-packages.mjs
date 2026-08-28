#!/usr/bin/env node

/**
 * Install a monorepo app plus `@lomi./` packages for Vercel/CI.
 *
 * Root `package.json` / `pnpm-lock.yaml` are gitignored (local anti-slop),
 * so Git clones and umbrella uploads cannot `pnpm install` at the repo root.
 * Docs/website use `file:../../packages/*` and must pass `--ignore-workspace`
 * so the parent `pnpm-workspace.yaml` does not swallow the install.
 * Admin/dashboard use `workspace:*`; the installer rewrites those to `file:`
 * for this run so Vercel does not need a root workspace.
 *
 * Umbrella Vercel uploads (website/admin) use npm so they can keep the
 * project Node version (24.x). pnpm on those uploads hits ERR_INVALID_THIS
 * talking to the registry. Do not pin engines.node or a root .node-version
 * to 22: Vercel treats that as an override of the project 24.x setting.
 * Docs keeps pnpm on its own project Node 22.x.
 * Website also links apps/website/node_modules/next to the upload root:
 * @vercel/next resolves next/package.json from cwd, not the app directory.
 *
 * Usage: node tooling/scripts/install-app-with-packages.mjs <app-dir>
 *   e.g. node tooling/scripts/install-app-with-packages.mjs apps/docs
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const PACKAGE_INSTALL_ORDER = [
  "packages/shared",
  "packages/ui",
  "packages/queries",
  "packages/receipt-pdf",
];

const FILE_SPEC_TO_DIR = {
  "@lomi./shared": "packages/shared",
  "@lomi./ui": "packages/ui",
  "@lomi./queries": "packages/queries",
  "@lomi./receipt-pdf": "packages/receipt-pdf",
};

function run(command, args, cwd) {
  console.log(`==> (${path.relative(ROOT, cwd) || "."}) ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });
  const status = result.status ?? 1;
  if (status !== 0) process.exit(status);
}

function readPackage(dir) {
  return JSON.parse(readFileSync(path.join(dir, "package.json"), "utf8"));
}

function dependencyMap(pkg) {
  return { ...pkg.dependencies, ...pkg.devDependencies };
}

function neededPackageDirs(pkg) {
  const deps = dependencyMap(pkg);
  return PACKAGE_INSTALL_ORDER.filter((dir) => {
    const name = Object.keys(FILE_SPEC_TO_DIR).find(
      (key) => FILE_SPEC_TO_DIR[key] === dir,
    );
    return Boolean(name && deps[name]);
  });
}

function useNpm(appRel) {
  return Boolean(process.env.VERCEL) && appRel !== "apps/docs";
}

function rewritePnpmScriptsForNpm(appDir) {
  const pkgPath = path.join(appDir, "package.json");
  const pkg = readPackage(appDir);
  if (!pkg.scripts) return;
  let changed = false;
  for (const [name, script] of Object.entries(pkg.scripts)) {
    if (typeof script !== "string" || !/\bpnpm\s/.test(script)) continue;
    pkg.scripts[name] = script.replace(/\bpnpm\s+/g, "npm run ");
    changed = true;
  }
  if (!changed) return;
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(
    `==> rewrote pnpm scripts to npm run in ${path.relative(ROOT, pkgPath)}`,
  );
}

function hoistNextForVercelBuilder(appRel) {
  const from = path.join(ROOT, appRel, "node_modules", "next");
  if (!existsSync(path.join(from, "package.json"))) {
    console.error(`next was not installed at ${path.relative(ROOT, from)}`);
    process.exit(1);
  }
  const toDir = path.join(ROOT, "node_modules");
  const to = path.join(toDir, "next");
  mkdirSync(toDir, { recursive: true });
  rmSync(to, { recursive: true, force: true });
  symlinkSync(from, to);
  console.log(`==> linked node_modules/next -> ${path.relative(ROOT, from)}`);
}

function excludeAdminGrowthAgentFromTsc(appDir) {
  const tsconfigPath = path.join(appDir, "tsconfig.json");
  let tsconfig;
  try {
    tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf8"));
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    throw error;
  }
  const exclude = new Set(tsconfig.exclude ?? []);
  exclude.add("src/growth/agent");
  tsconfig.exclude = [...exclude];
  const tmp = `${tsconfigPath}.${process.pid}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(tsconfig, null, 2)}\n`);
  renameSync(tmp, tsconfigPath);
  console.log(
    `==> excluded src/growth/agent from ${path.relative(ROOT, tsconfigPath)}`,
  );
}

function installDeps(appRel, dir, { frozen }) {
  if (useNpm(appRel)) {
    run("npm", ["install", "--ignore-scripts", "--include=dev"], dir);
    return;
  }
  const args = ["install", "--ignore-workspace"];
  if (frozen && existsSync(path.join(dir, "pnpm-lock.yaml"))) {
    args.push("--frozen-lockfile");
  }
  run("pnpm", args, dir);
}

function runBuildScript(appRel, dir) {
  if (useNpm(appRel)) {
    run("npm", ["run", "build"], dir);
    return;
  }
  run("pnpm", ["run", "build"], dir);
}

function rewriteWorkspaceSpecsToFile(appDir) {
  const pkgPath = path.join(appDir, "package.json");
  const pkg = readPackage(appDir);
  let changed = false;
  for (const field of ["dependencies", "devDependencies"]) {
    const deps = pkg[field];
    if (!deps) continue;
    for (const [name, spec] of Object.entries(deps)) {
      if (!String(spec).startsWith("workspace:")) continue;
      const dir = FILE_SPEC_TO_DIR[name];
      if (!dir) {
        console.error(`no file: mapping for workspace dep ${name}`);
        process.exit(1);
      }
      let rel = path.relative(appDir, path.join(ROOT, dir));
      if (!rel.startsWith(".")) rel = `./${rel}`;
      deps[name] = `file:${rel}`;
      changed = true;
    }
  }
  if (!changed) return { pkg, rewritten: false };
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(
    `==> rewrote workspace:* to file: in ${path.relative(ROOT, pkgPath)}`,
  );
  return { pkg, rewritten: true };
}

function installFileApp(appRel, pkg, { frozen }) {
  const appDir = path.join(ROOT, appRel);
  for (const rel of neededPackageDirs(pkg)) {
    const dir = path.join(ROOT, rel);
    installDeps(appRel, dir, { frozen: false });
    const packageJson = readPackage(dir);
    if (packageJson.scripts?.build) {
      runBuildScript(appRel, dir);
    }
  }

  installDeps(appRel, appDir, { frozen });
}

function main() {
  const appRel = process.argv[2];
  if (!appRel) {
    console.error(
      "usage: node tooling/scripts/install-app-with-packages.mjs <app-dir>",
    );
    process.exit(2);
  }

  const appDir = path.join(ROOT, appRel);
  if (!existsSync(path.join(appDir, "package.json"))) {
    console.error(`missing ${appRel}/package.json`);
    process.exit(1);
  }

  const { pkg, rewritten } = rewriteWorkspaceSpecsToFile(appDir);
  if (useNpm(appRel) && appRel === "apps/admin") {
    excludeAdminGrowthAgentFromTsc(appDir);
  }
  if (useNpm(appRel) && appRel === "apps/website") {
    rewritePnpmScriptsForNpm(appDir);
  }
  installFileApp(appRel, pkg, { frozen: !rewritten });
  if (useNpm(appRel) && appRel === "apps/website") {
    hoistNextForVercelBuilder(appRel);
  }
}

main();
