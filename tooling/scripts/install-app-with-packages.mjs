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
 * Source-only packages (@lomi./ui) still get their own install: Next compiles
 * those package sources and cannot see the app node_modules tree. Docs keeps
 * pnpm for that install (npm 10 `--omit=peer` crashes with edgesOut on Node
 * 22, and a restored `.pnpm` tree from cache makes it worse). Website/admin
 * npm deploys still use `npm install --omit=dev --omit=peer`. @lomi./pay
 * installs with the same omit flags so it does not pull a second Next.
 *
 * Usage: node tooling/scripts/install-app-with-packages.mjs <app-dir>
 *   e.g. node tooling/scripts/install-app-with-packages.mjs apps/docs
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
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
  "packages/pay",
];

const FILE_SPEC_TO_DIR = {
  "@lomi./shared": "packages/shared",
  "@lomi./ui": "packages/ui",
  "@lomi./queries": "packages/queries",
  "@lomi./receipt-pdf": "packages/receipt-pdf",
  "@lomi./pay": "packages/pay",
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

function hoistNodeModules(fromDir) {
  const fromNm = path.join(fromDir, "node_modules");
  if (!existsSync(fromNm)) return;
  const toNm = path.join(ROOT, "node_modules");
  mkdirSync(toNm, { recursive: true });
  for (const name of readdirSync(fromNm)) {
    if (name.startsWith(".")) continue;
    const from = path.join(fromNm, name);
    const to = path.join(toNm, name);
    if (name.startsWith("@")) {
      mkdirSync(to, { recursive: true });
      for (const child of readdirSync(from)) {
        const childTo = path.join(to, child);
        if (existsSync(childTo)) continue;
        symlinkSync(path.join(from, child), childTo);
      }
      continue;
    }
    if (existsSync(to)) continue;
    symlinkSync(from, to);
  }
  console.log(
    `==> hoisted ${path.relative(ROOT, fromNm) || "node_modules"} -> node_modules`,
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

function wipeCachedNodeModules(dir) {
  if (!process.env.VERCEL && !process.env.CI) return;
  const nm = path.join(dir, "node_modules");
  if (!existsSync(nm)) return;
  rmSync(nm, { recursive: true, force: true });
  console.log(`==> removed cached ${path.relative(ROOT, nm)}`);
}

/**
 * Vercel restores `apps/<app>/node_modules` from a lockfile-keyed cache.
 * `file:` specs do not change when a new module is added to `@lomi./ui`,
 * so npm keeps the stale copy and Turbopack cannot resolve it. Drop the
 * scoped packages so the next install recopies them from `packages/`.
 */
function wipeCachedLomiPackages(dir) {
  if (!process.env.VERCEL && !process.env.CI) return;
  const scoped = path.join(dir, "node_modules", "@lomi.");
  if (!existsSync(scoped)) return;
  rmSync(scoped, { recursive: true, force: true });
  console.log(`==> removed cached ${path.relative(ROOT, scoped)}`);
}

function installDeps(appRel, dir, { frozen }) {
  if (useNpm(appRel)) {
    run("npm", ["install", "--ignore-scripts", "--include=dev"], dir);
    return;
  }
  const args = ["install", "--ignore-workspace"];
  if (frozen && existsSync(path.join(dir, "pnpm-lock.yaml"))) {
    args.push("--frozen-lockfile");
  } else if (!existsSync(path.join(dir, "pnpm-lock.yaml"))) {
    args.push("--no-frozen-lockfile");
  }
  run("pnpm", args, dir);
}

function installSourceOnlyPackage(appRel, dir) {
  wipeCachedNodeModules(dir);
  if (useNpm(appRel)) {
    run("npm", ["install", "--ignore-scripts", "--omit=dev", "--omit=peer"], dir);
    return;
  }
  const args = [
    "install",
    "--ignore-workspace",
    "--ignore-scripts",
    "--prod",
    "--config.auto-install-peers=false",
  ];
  if (!existsSync(path.join(dir, "pnpm-lock.yaml"))) {
    args.push("--no-frozen-lockfile");
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

function linkNestedFilePackages(appDir) {
  const pkg = readPackage(appDir);
  const deps = dependencyMap(pkg);
  for (const spec of Object.values(deps)) {
    const match = /^file:packages\/([^/]+)$/.exec(String(spec));
    if (!match) continue;
    const pkgName = match[1];
    const target = path.join(ROOT, "packages", pkgName);
    if (!existsSync(path.join(target, "package.json"))) {
      console.error(
        `missing ${path.relative(ROOT, target)} for nested file: spec`,
      );
      process.exit(1);
    }
    const destDir = path.join(appDir, "packages");
    const dest = path.join(destDir, pkgName);
    mkdirSync(destDir, { recursive: true });
    rmSync(dest, { recursive: true, force: true });
    symlinkSync(target, dest);
    console.log(
      `==> linked ${path.relative(ROOT, dest)} -> ${path.relative(ROOT, target)}`,
    );
  }
}

/**
 * npm `file:` copies can stay stale (lockfile-keyed Vercel cache, or a
 * packed tarball keyed by package version). Point every `@lomi.` file:
 * dep at the uploaded `packages/` tree so Turbopack sees new modules.
 */
function linkFilePackagesIntoNodeModules(destDir, pkg) {
  const deps = dependencyMap(pkg);
  for (const [name, spec] of Object.entries(deps)) {
    const rel = FILE_SPEC_TO_DIR[name];
    if (!rel) continue;
    const specText = String(spec);
    if (!specText.startsWith("file:") && !specText.startsWith("workspace:")) {
      continue;
    }
    const target = path.join(ROOT, rel);
    if (!existsSync(path.join(target, "package.json"))) {
      console.error(`missing ${path.relative(ROOT, target)} for ${name}`);
      process.exit(1);
    }
    const dest = path.join(destDir, "node_modules", name);
    mkdirSync(path.dirname(dest), { recursive: true });
    rmSync(dest, { recursive: true, force: true });
    symlinkSync(target, dest);
    console.log(
      `==> linked ${path.relative(ROOT, dest)} -> ${path.relative(ROOT, target)}`,
    );
  }
}

function installFileApp(appRel, pkg, { frozen }) {
  const appDir = path.join(ROOT, appRel);
  for (const rel of neededPackageDirs(pkg)) {
    const dir = path.join(ROOT, rel);
    const packageJson = readPackage(dir);
    if (packageJson.scripts?.build) {
      installDeps(appRel, dir, { frozen: false });
      runBuildScript(appRel, dir);
    } else {
      // Source-only packages such as @lomi./ui still need runtime deps
      // (clsx, radix). Omit dev and peers so React 18 types / a second
      // Next (pay) do not leak into the consuming app.
      installSourceOnlyPackage(appRel, dir);
    }
    hoistNodeModules(dir);
  }

  // pnpm resolves file:packages/* before preinstall, so the nested
  // folders must exist before the app install starts.
  linkNestedFilePackages(appDir);
  wipeCachedLomiPackages(appDir);
  wipeCachedLomiPackages(ROOT);
  installDeps(appRel, appDir, { frozen });
  linkFilePackagesIntoNodeModules(appDir, pkg);
  linkFilePackagesIntoNodeModules(ROOT, pkg);
  hoistNodeModules(appDir);
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
  if (
    useNpm(appRel) &&
    (appRel === "apps/website" ||
      appRel === "apps/checkout" ||
      appRel === "apps/storefront" ||
      appRel === "apps/customers")
  ) {
    hoistNextForVercelBuilder(appRel);
  }
}

main();
