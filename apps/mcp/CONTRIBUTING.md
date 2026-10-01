# Contributing to lomi. MCP

This guide is for **lomi. maintainers and operators** deploying or developing `apps/mcp`. Integrators should use [docs.lomi.africa/build/mcp](https://docs.lomi.africa/build/mcp) and the hosted server at `https://mcp.lomi.africa`: not deploy their own instance unless they work on lomi. engineering.

## Deploy

Environment variables are listed in [`.env.example`](./.env.example).

```bash
cd apps/mcp
pnpm install
pnpm run start:http
```

See [`railway.json`](./railway.json) for Railway deployment.

Key operator settings:

- `LOMI_MCP_BEARER_TOKEN`: optional/legacy shared transport gate for HTTP MCP. Merchants authenticate with their API key alone (`x-lomi-api-key`); a valid lomi. credential gates the transport on its own. Keep this set only for legacy operator setups.
- `LOMI_OPENAI_APPS_CHALLENGE`: token from the OpenAI plugin portal. When set, `GET /.well-known/openai-apps-challenge` returns that string alone.
- `LOMI_API_URL`: default merchant API base URL for tool calls

## Regenerate tools

After public API or allowlist changes:

```bash
cd apps/mcp
pnpm run generate
```

Commit `src/generated/tools-manifest.json`, `src/generated/provisioning-tools-manifest.json`, and any updated groups in `config/mcp-tool-policy.json`.

## Tests

```bash
cd apps/mcp
pnpm test
```

## Related

- [Maintaining CLI and MCP](https://docs.lomi.africa/resources/contributing/maintaining-cli-mcp), roles and boundaries
- Marketplace packaging: [`apps/tools/agent-plugin`](../tools/agent-plugin) ([lomiafrica/agent-plugin](https://github.com/lomiafrica/agent-plugin))
- Monorepo [CONTRIBUTING.md](https://github.com/lomiafrica/lomi./blob/master/CONTRIBUTING.md)
