# Contributing to lomi. CLI

This guide is for **lomi. maintainers** working on `apps/cli`. Merchant developers integrating lomi. should use the [CLI documentation](https://docs.lomi.africa/build/cli) — not this file.

For monorepo-wide contribution rules, see [CONTRIBUTING.md](https://github.com/lomiafrica/lomi./blob/master/CONTRIBUTING.md).

## Development

```bash
cd apps/cli
cargo build
cargo test
cargo run -- --help
cargo run -- status
```

## Agent rules generation

Topic rules (checkout, webhooks, etc.) are bundled in the binary. Refresh from OpenAPI + docs:

```bash
./scripts/generate-rules.sh
```

## Docs checks

From `apps/docs`:

```bash
pnpm lint && pnpm docs:drift && pnpm screenshots:verify
```

See [Writing for lomi. docs](https://docs.lomi.africa/resources/contributing/writing-for-lomi-docs).

## Publishing a release

1. Bump version in `apps/cli/Cargo.toml` and `apps/cli/npm/package.json`
2. Run `./scripts/generate/generate-rules.sh` to refresh `src/utils/rules/llms.txt` and API reference
3. Update SHA256 checksums in `apps/cli/homebrew/lomi.rb`
4. Tag and push: `git tag cli-v3.0.0 && git push origin cli-v3.0.0`
5. GitHub Actions builds binaries, creates a release, and publishes `lomi.cli` to npm (requires `NPM_TOKEN` secret)

## Auth backend

Login uses Nest `POST /cli-auth/*` on the API (`apps/api/src/device-auth/`) and DB schema ([`20250226000075_cli_tool.sql`](../dashboard/supabase/migrations/20250226000075_cli_tool.sql)):

1. `POST /cli-auth/device-auth` → user code + verification URI
2. Browser authorization in dashboard
3. `POST /cli-auth/token` → CLI API key stored in `~/.config/lomi/config.json`
