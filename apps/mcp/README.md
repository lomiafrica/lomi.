# `@lomi./mcp`

MCP server that exposes the **lomi. merchant API** to AI clients (Cursor, Claude Desktop, etc.); same public API as the REST docs, as MCP tools.

**For developers building integrations**: not for lomi. platform admin or self-hosted payment ops.

Integration guide: [docs.lomi.africa/build/mcp](https://docs.lomi.africa/build/mcp)

Portable marketplace packaging (Agent Plugins 1.0 + Cursor / Codex manifests) lives in [`../tools/agent-plugin`](../tools/agent-plugin/README.md). The hosted MCP URL works without the plugin.

## Hosted MCP (HTTP)

Most teams use lomi.’s hosted server at `https://mcp.lomi.africa/mcp`.

**Header on every MCP request:**

| What | Header |
|------|--------|
| Your merchant secret key | `x-lomi-api-key: <key>` or `x-api-key: <key>` |

Your API key is all you need, it both unlocks the hosted endpoint and scopes every tool call. A shared transport secret (`Authorization: Bearer <LOMI_MCP_BEARER_TOKEN>`) is still accepted for legacy operator setups, but merchants do not need one.

**Checks (optional):** `GET /health`, `GET /ready` on the same host.

Copy a ready-made config from [`examples/`](./examples/) (`cursor-http.mcp.json`, `claude-desktop-http.mcp.json`).

## stdio (local)

```bash
npx -y @lomi./mcp
```

Example Cursor / Claude Desktop config:

```json
{
  "mcpServers": {
    "lomi.": {
      "command": "npx",
      "args": ["-y", "@lomi./mcp"],
      "env": {
        "LOMI_SECRET_KEY": "your-lomi-secret-key",
        "LOMI_API_URL": "https://api.lomi.africa"
      }
    }
  }
}
```

Use `https://sandbox.api.lomi.africa` for sandbox.

## Tool discovery

Clients that support deferred loading can call **`lomi_search_tools`** with a keyword query.

Merchant tools are **resource tools** named `lomi_<resource>` with a required `action` (for example `lomi_customers` with `action=list`). There are no mechanical `lomi_post_*` / `lomi_get_*` aliases.

MCP **resources** (`lomi://docs/getting-started`, `lomi://docs/authentication`, `lomi://docs/idempotency`, `lomi://docs/pagination`, `lomi://docs/webhooks`, `lomi://docs/money`, `lomi://docs/recipes`, `lomi://docs/finance`, `lomi://docs/errors`, `lomi://tools/index`) and **prompts** (`provision_merchant_from_zero`, `onboard_merchant`, `debug_failed_payment`, `setup_webhook`, `setup_network_operator`, `month_end_close`) ship with the server.

## Get a secret key

1. **Dashboard (recommended):** **Developers → API keys → Connect MCP**: device flow or copy a secret key.
2. **Manual:** any secret API key from **Developers → API keys** in the dashboard, used as **`LOMI_SECRET_KEY`** (stdio) or **`x-lomi-api-key`** (HTTP).

## Contributing

Maintainers: see [CONTRIBUTING.md](./CONTRIBUTING.md).
