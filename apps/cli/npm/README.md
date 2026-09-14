# lomi. CLI

Command line interface for interacting with the [lomi.](https://lomi.africa) payment platform.

This npm package is a thin wrapper: on install it downloads the native Rust binary from [GitHub Releases](https://github.com/lomiafrica/lomi./releases). Both `lomi` and `lomi.` commands are available.

## Installation

```bash
npm install -g lomi.cli
# or
pnpm add -g lomi.cli
```

### Homebrew (macOS / Linux)

```bash
brew install lomiafrica/tap/lomi
```

### From source

```bash
git clone https://github.com/lomiafrica/lomi.
cd lomi./apps/cli
cargo install --path .
```

## Commands

### `lomi login`

Authenticates the CLI with your lomi. account via a browser flow.

```bash
lomi login
```

1. Initiates device authorization flow
2. Shows a `user_code` and opens the verification URL in your browser
3. Polls for completion and saves the CLI token globally

This token authenticates subsequent `lomi` commands.

### `lomi init`

Initializes a new project in the current directory.

```bash
lomi init
```

Prompts for API key, environment (Production/Sandbox), and language (TS/JS). Creates SDK client, checkout/webhook examples, and `.env`.

Headless mode:

```bash
lomi init --yes --environment sandbox --language ts --api-key lomi_sk_test_xxx
```

### `lomi status`

Checks login status and API connectivity.

```bash
lomi status
```

### `lomi install-rules`

Installs AI agent rules for Cursor, Claude Code, Codex, VS Code, and `llms.txt`.

```bash
lomi install-rules
```

### Other commands

| Command                              | Description                      |
| ------------------------------------ | -------------------------------- |
| `lomi whoami`                        | Show current profile and account |
| `lomi logout`                        | Clear stored credentials         |
| `lomi dev`                           | Local webhook development server |
| `lomi checkout create`               | Create a hosted checkout session |
| `lomi payments create`               | Create a payment link            |
| `lomi list-profiles` / `lomi switch` | Multi-profile auth               |

## Documentation

https://docs.lomi.africa

## License

MIT
