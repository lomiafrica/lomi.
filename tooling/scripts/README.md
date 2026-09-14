# Monorepo scripts

Shared automation lives here. App-specific work stays in `apps/<app>/scripts/` or `packages/<pkg>/scripts/`. GitHub Actions adapters stay in `.github/scripts/`.

## Registry

[`tooling/tasks.json`](../tasks.json) is the source of truth for project paths, package managers, workspace membership, capabilities, and risk. [`workspace.mjs`](workspace.mjs) reads it. Do not add parallel hardcoded app lists.

```bash
pnpm install:apps
pnpm packages:build
pnpm check
pnpm typecheck
node tooling/scripts/workspace.mjs list
```

`pnpm packages:build` (watch: `pnpm packages:watch`) compiles `@lomi./shared` and `@lomi./queries` to `dist/`. Next, Nest, and Metro load that JavaScript. After editing those packages, rebuild once; `file:` consumers hard-link `dist/`, so you do not need to reinstall apps.

## Command contract

| Command                   | Meaning                                         |
| ------------------------- | ----------------------------------------------- |
| `dev`                     | Watch-mode development                          |
| `start`                   | Run the built artifact                          |
| `build`                   | Produce deployable output                       |
| `typecheck`               | Static checking (`tsc --noEmit` or Cargo check) |
| `types:generate`          | Write generated database/API types              |
| `lint` / `format`         | Check only                                      |
| `lint:fix` / `format:fix` | Apply fixes                                     |
| `check:*`                 | Read-only gate                                  |
| `generate:*`              | Deterministic repository output                 |
| `ops:*`                   | External side effects; dry-run by default       |
| `release:*` / `publish:*` | Publish artifacts                               |

## Layout

```
.github/scripts/          Actions adapters and repo gates
tooling/scripts/          Cross-app orchestration and shared i18n
apps/<app>/scripts/       App-owned automation
  build/ check/ db/ ops/ release/ smoke/ i18n/
packages/<pkg>/scripts/   Package-owned codegen
```

Do not add executable automation under `apps/*/src/**/scripts`. Docs build hooks may stay in `apps/docs/lib/scripts/`. SDK, plugin, and standalone tool `scripts/` folders stay with those packages.

`scripts/ops/` and `scripts/db/` require an owner README (inputs, outputs, safety, examples). Operations default to dry-run and need an explicit target environment.
