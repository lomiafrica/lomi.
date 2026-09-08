# lomi. CLI

Native Rust command-line interface for the [lomi.](https://lomi.africa) payment platform.

Full documentation: [docs.lomi.africa/build/cli](https://docs.lomi.africa/build/cli)

## Install

### npm (recommended)

```bash
npm install -g lomi.cli
lomi login
```

The npm package downloads the native binary from GitHub Releases. Requires a published release (`cli-v*` tag).

### Homebrew

```bash
brew install lomiafrica/tap/lomi
```

### From source

```bash
cd apps/cli
cargo install --path .
```

## Quick start

```bash
lomi quickstart
lomi login
lomi status
lomi init
lomi listen http://localhost:3000/webhooks
lomi checkout create --amount 10000 --currency XOF \
  --success-url https://example.com/success \
  --cancel-url https://example.com/cancel --json
```

## Commands

| Command | Description |
| --- | --- |
| `login` | Browser authentication via device flow |
| `logout` | Clear stored credentials for a profile |
| `whoami` | Show current account and profile |
| `status` | Verify login and API connectivity |
| `init` | Initialize project with SDK, examples, and `.env` |
| `quickstart` | Golden-path checks and next steps |
| `listen` | Cloud webhook relay (sandbox-first); prints signing secret on connect |
| `trigger <event>` | Emit synthetic sandbox webhook event (`--list` for the catalog) |
| `probe` | Integration health checks |
| `webhooks list` / `webhooks test` / `webhooks resend` | Manage, test, and replay webhook deliveries |
| `mcp config` / `mcp serve` | Print HTTP MCP config, or run stdio MCP locally |
| `products list` | List products and prices |
| `customers list` / `customers get` | List or retrieve customers |
| `invoices list` / `invoices get` / `invoices pdf` | Invoices, including `pdf --out ./INV-0001.pdf` |
| `receipts pdf <id>` | Download a transaction receipt PDF |
| `balance` | Show account balance |
| `api-keys list` | List API keys (prefix and last4 only) |
| `exports create` / `get` / `download` | Create and download CSV/PDF exports |
| `logs list` / `logs tail` | List or poll API logs |
| `open [path]` | Open the merchant dashboard |
| `transactions list` / `transactions get` | List or retrieve transactions |
| `refunds create` / `list` / `get` | Create, list, or retrieve refunds |
| `payouts list` / `get` / `create` | Manage payouts |
| `disputes list` / `get` | List card disputes |
| `fraud alerts` | List fraud alerts |
| `checkout create` | Create a hosted checkout session |
| `dev` | Local webhook receiver for development |
| `install-rules` | AI setup wizard: Cursor, Claude Code, Codex, llms.txt |
| `payments create` | Create a payment link interactively |
| `update` | Update `@lomi./sdk` in the current project |
| `list-profiles` | List CLI auth profiles |
| `switch` | Set the default profile |

## Profiles

```bash
lomi login --profile sandbox
lomi switch sandbox
lomi init --profile sandbox
```

Global config: `~/.config/lomi/config.json` (Linux) or `~/Library/Application Support/lomi/config.json` (macOS).

## Headless / CI

```bash
export LOMI_ACCESS_TOKEN=your_cli_token
lomi status

lomi init --yes --environment sandbox --language ts --api-key lomi_sk_test_xxx
lomi login --no-browser
lomi install-rules --target cursor
```

## Agent rules

`lomi install-rules` installs Cursor rules, `CLAUDE.md`, `AGENTS.md`, VS Code instructions, and `llms.txt` from [docs.lomi.africa/llms.txt](https://docs.lomi.africa/llms.txt).

## Contributing

Maintainers: see [CONTRIBUTING.md](./CONTRIBUTING.md) and the monorepo [CONTRIBUTING.md](https://github.com/lomiafrica/lomi./blob/master/CONTRIBUTING.md).

## License

MIT
