import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { isJsBoolean, isJsPlainObject, isJsString } from "./js-guards.mjs";

const KINDS = new Set(["app", "package", "sdk", "plugin", "tool", "cli"]);
const MANAGERS = new Set(["pnpm", "cargo", "python", "go", "php", "none"]);
const RISKS = new Set(["low", "medium", "high", "ops"]);
const CAPABILITIES = new Set([
  "install",
  "dev",
  "build",
  "start",
  "lint",
  "format",
  "typecheck",
  "knip",
  "test",
  "types:generate",
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function loadTaskRegistry(root) {
  const file = path.join(root, "tooling/tasks.json");
  assert(existsSync(file), `Missing task registry at ${file}`);
  const parsed = JSON.parse(readFileSync(file, "utf8"));
  assert(parsed && isJsPlainObject(parsed), "tasks.json must be an object");
  assert(parsed.version === 1, "tasks.json version must be 1");
  assert(Array.isArray(parsed.projects) && parsed.projects.length > 0, "tasks.json needs projects");

  const ids = new Set();
  const paths = new Set();
  for (const project of parsed.projects) {
    assert(project && isJsPlainObject(project), "project entries must be objects");
    assert(isJsString(project.id) && project.id.length > 0, "project.id is required");
    assert(!ids.has(project.id), `duplicate project id: ${project.id}`);
    ids.add(project.id);
    assert(isJsString(project.path) && project.path.length > 0, `${project.id} path is required`);
    assert(!project.path.startsWith("/") && !project.path.includes(".."), `${project.id} path must be repo-relative`);
    assert(!paths.has(project.path), `duplicate project path: ${project.path}`);
    paths.add(project.path);
    assert(KINDS.has(project.kind), `${project.id} has unknown kind`);
    assert(MANAGERS.has(project.manager), `${project.id} has unknown manager`);
    assert(isJsBoolean(project.workspace), `${project.id} workspace must be boolean`);
    assert(isJsBoolean(project.submodule), `${project.id} submodule must be boolean`);
    assert(isJsBoolean(project.required), `${project.id} required must be boolean`);
    assert(Array.isArray(project.capabilities), `${project.id} capabilities must be an array`);
    for (const capability of project.capabilities) {
      assert(CAPABILITIES.has(capability), `${project.id} has unknown capability ${capability}`);
    }
    assert(isJsString(project.owner) && project.owner.length > 0, `${project.id} owner is required`);
    assert(RISKS.has(project.risk), `${project.id} has unknown risk`);
  }

  return parsed;
}
