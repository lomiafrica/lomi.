#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isJsPlainObject } from "./lib/js-guards.mjs";
import { loadTaskRegistry } from "./lib/task-registry.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const COMMANDS = [
  "list",
  "install",
  "update",
  "lint",
  "lint:fix",
  "format",
  "format:fix",
  "typecheck",
  "knip",
  "test",
  "check",
];

function relOf(abs) {
  return path.relative(ROOT, abs) || ".";
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });
  return result.status ?? 1;
}

function runPnpm(cwd, args, ignoreWorkspace) {
  const fullArgs = ignoreWorkspace ? ["--ignore-workspace", ...args] : args;
  return run("pnpm", fullArgs, cwd);
}

function packageScripts(relDir) {
  const file = path.join(ROOT, relDir, "package.json");
  if (!existsSync(file)) return null;
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8"));
    return parsed.scripts && isJsPlainObject(parsed.scripts)
      ? parsed.scripts
      : {};
  } catch {
    return {};
  }
}

function presentProjects(registry) {
  const present = [];
  const missingRequired = [];
  const missingOptional = [];

  for (const project of registry.projects) {
    const abs = path.join(ROOT, project.path);
    const presentOnDisk =
      project.manager === "cargo"
        ? existsSync(path.join(abs, "Cargo.toml"))
        : existsSync(path.join(abs, "package.json"));

    if (presentOnDisk) {
      present.push(project);
      continue;
    }

    if (project.required) missingRequired.push(project);
    else missingOptional.push(project);
  }

  return { present, missingRequired, missingOptional };
}

function reportMissing(missingRequired, missingOptional) {
  for (const project of missingOptional) {
    console.log(`==> skip ${project.path} (not checked out, optional)`);
  }
  for (const project of missingRequired) {
    console.error(`==> missing ${project.path} (required ${project.manager} project)`);
  }
}

function failIfRequiredMissing(missingRequired) {
  if (missingRequired.length === 0) return;
  console.error(
    `\nrequired projects not checked out:\n${missingRequired
      .map((project) => `- ${project.path}`)
      .join("\n")}`,
  );
  process.exit(1);
}

function exitIfFailed(label, failures) {
  if (failures.length === 0) return;
  console.error(
    `\n${label} failed:\n${failures.map((dir) => `- ${dir}`).join("\n")}`,
  );
  process.exit(1);
}

function listProjects(registry) {
  const { present, missingRequired, missingOptional } = presentProjects(registry);
  console.log("id\tpath\tmanager\tworkspace\tstatus");
  for (const project of registry.projects) {
    const checkedOut = present.some((item) => item.id === project.id);
    const status = checkedOut
      ? "present"
      : project.required
        ? "missing-required"
        : "missing-optional";
    console.log(
      `${project.id}\t${project.path}\t${project.manager}\t${project.workspace}\t${status}`,
    );
  }
  reportMissing(missingRequired, missingOptional);
  if (missingRequired.length > 0) process.exit(1);
}

function installOrUpdate(registry, command) {
  const { present, missingRequired, missingOptional } = presentProjects(registry);
  reportMissing(missingRequired, missingOptional);
  failIfRequiredMissing(missingRequired);

  console.log(`\n==> workspace (${command})`);
  const rootStatus = runPnpm(ROOT, [command], false);
  if (rootStatus !== 0) process.exit(rootStatus);

  const failures = [];
  const pnpmProjects = present.filter(
    (project) => project.manager === "pnpm" && !project.workspace,
  );
  for (const project of pnpmProjects) {
    console.log(`\n==> ${project.path} (${command})`);
    const status = runPnpm(path.join(ROOT, project.path), [command], true);
    if (status !== 0) failures.push(project.path);
  }

  const cargoCommand = command === "update" ? "update" : "fetch";
  for (const project of present.filter((item) => item.manager === "cargo")) {
    console.log(`\n==> ${project.path} (cargo ${cargoCommand})`);
    const status = run("cargo", [cargoCommand], path.join(ROOT, project.path));
    if (status !== 0) failures.push(project.path);
  }

  exitIfFailed(command, failures);
}

function runPnpmScript(registry, capability, scriptName) {
  const { present, missingRequired, missingOptional } = presentProjects(registry);
  reportMissing(missingRequired, missingOptional);
  failIfRequiredMissing(missingRequired);

  const failures = [];
  for (const project of present.filter((item) => item.manager === "pnpm")) {
    if (!project.capabilities.includes(capability)) continue;
    const scripts = packageScripts(project.path);
    if (!scripts?.[scriptName]) {
      console.error(
        `==> ${project.path} lists ${capability} but has no "${scriptName}" script`,
      );
      failures.push(project.path);
      continue;
    }
    console.log(`\n==> ${project.path} (${scriptName})`);
    const status = runPnpm(
      path.join(ROOT, project.path),
      [scriptName],
      !project.workspace,
    );
    if (status !== 0) failures.push(project.path);
  }
  return failures;
}

function runCargo(registry, capability, args, label) {
  const { present } = presentProjects(registry);
  const failures = [];
  for (const project of present.filter((item) => item.manager === "cargo")) {
    if (!project.capabilities.includes(capability)) continue;
    console.log(`\n==> ${project.path} (${label})`);
    const status = run("cargo", args, path.join(ROOT, project.path));
    if (status !== 0) failures.push(project.path);
  }
  return failures;
}

function lintAll(registry, fix) {
  const scriptName = fix ? "lint:fix" : "lint";
  const failures = [
    ...runPnpmScript(registry, "lint", scriptName),
    ...runCargo(
      registry,
      "lint",
      fix
        ? ["clippy", "--all-targets", "--fix", "--allow-dirty", "--allow-staged"]
        : ["clippy", "--all-targets"],
      fix ? "cargo clippy --fix" : "cargo clippy",
    ),
  ];
  exitIfFailed(scriptName, failures);
}

function formatAll(registry, fix) {
  const scriptName = fix ? "format:fix" : "format";
  const failures = [
    ...runPnpmScript(registry, "format", scriptName),
    ...runCargo(
      registry,
      "format",
      fix ? ["fmt", "--all"] : ["fmt", "--all", "--", "--check"],
      fix ? "cargo fmt" : "cargo fmt --check",
    ),
  ];
  exitIfFailed(scriptName, failures);
}

function typecheckAll(registry) {
  const { present, missingRequired, missingOptional } = presentProjects(registry);
  reportMissing(missingRequired, missingOptional);
  failIfRequiredMissing(missingRequired);

  const failures = [];
  for (const project of present.filter((item) => item.manager === "pnpm")) {
    if (!project.capabilities.includes("typecheck")) continue;
    const scripts = packageScripts(project.path);
    const abs = path.join(ROOT, project.path);
    console.log(`\n==> ${project.path} (typecheck)`);
    let status;
    if (scripts?.typecheck) {
      status = runPnpm(abs, ["typecheck"], !project.workspace);
    } else if (existsSync(path.join(abs, "tsconfig.json"))) {
      status = runPnpm(
        abs,
        ["exec", "tsc", "--noEmit", "--incremental", "false"],
        !project.workspace,
      );
    } else {
      console.error(`==> ${project.path} lists typecheck but has no typecheck script or tsconfig`);
      failures.push(project.path);
      continue;
    }
    if (status !== 0) failures.push(project.path);
  }

  failures.push(
    ...runCargo(registry, "typecheck", ["check", "--all-targets"], "cargo check"),
  );
  exitIfFailed("typecheck", failures);
}

function knipAll(registry) {
  const { present, missingRequired, missingOptional } = presentProjects(registry);
  reportMissing(missingRequired, missingOptional);
  failIfRequiredMissing(missingRequired);

  const failures = [];
  for (const project of present.filter((item) => item.manager === "pnpm")) {
    if (!project.capabilities.includes("knip")) continue;
    const abs = path.join(ROOT, project.path);
    if (!existsSync(path.join(abs, "knip.json"))) {
      console.error(`==> ${project.path} lists knip but knip.json is missing`);
      failures.push(project.path);
      continue;
    }
    const scripts = packageScripts(project.path);
    if (!scripts?.knip) {
      console.error(`==> ${project.path} lists knip but has no knip script`);
      failures.push(project.path);
      continue;
    }
    console.log(`\n==> ${project.path} (knip)`);
    const status = runPnpm(abs, ["knip"], !project.workspace);
    if (status !== 0) failures.push(project.path);
  }
  exitIfFailed("knip", failures);
}

function testAll(registry) {
  const failures = [
    ...runPnpmScript(registry, "test", "test"),
    ...runCargo(registry, "test", ["test", "--all-targets"], "cargo test"),
  ];
  exitIfFailed("test", failures);
}

function checkAll(registry) {
  const layout = path.join(ROOT, "tooling/scripts/check-script-layout.mjs");
  console.log("\n==> tooling (script layout)");
  const layoutStatus = run(process.execPath, [layout], ROOT);
  if (layoutStatus !== 0) process.exit(layoutStatus);
  lintAll(registry, false);
  formatAll(registry, false);
  typecheckAll(registry);
  knipAll(registry);
}

const registry = loadTaskRegistry(ROOT);
const command = process.argv[2];

switch (command) {
  case "list":
    listProjects(registry);
    break;
  case "install":
    installOrUpdate(registry, "install");
    break;
  case "update":
    installOrUpdate(registry, "update");
    break;
  case "lint":
    lintAll(registry, false);
    break;
  case "lint:fix":
    lintAll(registry, true);
    break;
  case "format":
    formatAll(registry, false);
    break;
  case "format:fix":
    formatAll(registry, true);
    break;
  case "typecheck":
    typecheckAll(registry);
    break;
  case "knip":
    knipAll(registry);
    break;
  case "test":
    testAll(registry);
    break;
  case "check":
    checkAll(registry);
    break;
  default:
    console.error(
      `usage: node ${relOf(fileURLToPath(import.meta.url))} <${COMMANDS.join("|")}>`,
    );
    process.exit(1);
}
