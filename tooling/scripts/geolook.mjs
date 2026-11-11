import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const dest = path.join(root, "apps/tools/geolook");
const repo = "https://github.com/aigclink/geolook.git";

if (!existsSync(path.join(dest, "scripts/geo.py"))) {
  const clone = spawnSync(
    "git",
    ["clone", "--depth", "1", repo, dest],
    { stdio: "inherit" },
  );
  if (clone.status !== 0) process.exit(clone.status ?? 1);
} else {
  const pull = spawnSync("git", ["-C", dest, "pull", "--ff-only"], {
    stdio: "inherit",
  });
  if (pull.status !== 0) process.exit(pull.status ?? 1);
}

const args = process.argv.slice(2);
const run = spawnSync("python3", ["scripts/geo.py", ...args], {
  cwd: dest,
  stdio: "inherit",
});
process.exit(run.status ?? 1);
