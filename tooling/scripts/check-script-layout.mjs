#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadTaskRegistry } from "./lib/task-registry.mjs";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const ALLOWED_SRC_SCRIPT_PREFIXES = ["apps/docs/lib/scripts/"];

function walkApps(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".git" ||
      entry.name === "dist" ||
      entry.name === ".next" ||
      entry.name === "coverage" ||
      entry.name === "apps"
    ) {
      continue;
    }
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walkApps(abs, files);
    else files.push(abs);
  }
  return files;
}

function isExecutableScript(file) {
  return /\.(mjs|cjs|js|ts|sh|py)$/.test(file);
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function collectErrors() {
  const errors = [];
  const registry = loadTaskRegistry(ROOT);
  const ids = new Set();

  for (const project of registry.projects) {
    if (ids.has(project.id)) errors.push(`duplicate project id ${project.id}`);
    ids.add(project.id);
  }

  const appRoots = existsSync(path.join(ROOT, "apps"))
    ? readdirSync(path.join(ROOT, "apps"), { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(ROOT, "apps", entry.name))
    : [];

  for (const appRoot of appRoots) {
    for (const file of walkApps(appRoot)) {
      const relative = rel(file);
      const forbidden =
        /(?:^|\/)src\/(?:lib\/)?scripts\//.test(relative) ||
        /(?:^|\/)src\/utils\/scripts\//.test(relative);
      if (!forbidden || !isExecutableScript(file)) continue;
      if (
        ALLOWED_SRC_SCRIPT_PREFIXES.some((prefix) =>
          relative.startsWith(prefix),
        )
      ) {
        continue;
      }
      errors.push(`executable automation under src: ${relative}`);
    }
  }

  for (const project of registry.projects) {
    const abs = path.join(ROOT, project.path);
    const present =
      project.manager === "cargo"
        ? existsSync(path.join(abs, "Cargo.toml"))
        : existsSync(path.join(abs, "package.json"));
    if (!present) continue;

    for (const folder of ["scripts/ops", "scripts/db"]) {
      const dir = path.join(abs, folder);
      if (!existsSync(dir) || !statSync(dir).isDirectory()) continue;
      const readme = path.join(dir, "README.md");
      if (!existsSync(readme)) {
        errors.push(`${project.path}/${folder} needs README.md`);
      }
    }

    if (project.manager !== "pnpm") continue;
    const pkg = JSON.parse(
      readFileSync(path.join(abs, "package.json"), "utf8"),
    );
    const scripts = pkg.scripts ?? {};
    if (scripts.lint && / --fix\b/.test(scripts.lint) && !scripts["lint:fix"]) {
      errors.push(`${project.path} lint mutates files; move --fix to lint:fix`);
    }
    if (
      scripts.format &&
      / --write\b/.test(scripts.format) &&
      !scripts["format:fix"]
    ) {
      errors.push(
        `${project.path} format mutates files; move --write to format:fix`,
      );
    }
    if (
      scripts.slop &&
      scripts["anti-slop"] &&
      scripts.slop === scripts["anti-slop"]
    ) {
      errors.push(`${project.path} has duplicate slop/anti-slop aliases`);
    }

    for (const [name, command] of Object.entries(scripts)) {
      const match = String(command).match(
        /(?:node|tsx|pnpx tsx|pnpm exec tsx)\s+(\S+\.(?:mjs|js|ts|cjs))/,
      );
      if (!match) continue;
      const scriptPath = match[1].replace(/^\.\//, "");
      if (scriptPath.startsWith("-")) continue;
      if (
        scriptPath.startsWith("dist/") ||
        scriptPath.startsWith("build/") ||
        scriptPath.includes("/dist/") ||
        scriptPath.includes("/build/")
      ) {
        continue;
      }
      const resolved = path.resolve(abs, scriptPath);
      if (!existsSync(resolved)) {
        errors.push(
          `${project.path} script "${name}" points at missing ${scriptPath}`,
        );
      }
    }
  }

  return errors;
}

try {
  const errors = collectErrors();
  if (errors.length > 0) {
    console.error(`Script layout check failed (${errors.length}):`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  console.log("Script layout check passed.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
