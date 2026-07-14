<p align="center">
	<img src="apps/docs/public/company/monorepo-icon.webp" width="200" height="112" alt="lomi. icon">
<p align="center">
    Helping West African ventures sell online
  </p>
</p>

<div align="center">

<a href="https://lomi.africa">Website</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://docs.lomi.africa">Docs</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://lomi.africa/blog">Blog</a>

<p align="center">
<p align="center">
  <a href="https://github.com/lomiafrica/lomi./blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/yb4FnBmh">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=lomiafrica">
    <img src="https://img.shields.io/twitter/follow/lomiafrica.svg?label=Follow%20@lomiafrica" alt="Follow @lomiafrica" />
  </a>
  <a href="https://www.linkedin.com/company/lomiafri">
    <img src="https://img.shields.io/badge/LinkedIn-lomiafrica-blue?style=flat&logo=linkedin" alt="LinkedIn" />
  </a>
  <a href="https://join.slack.com/t/lomi-a/shared_invite/zt-3hezykfvo-eW1jX6IkXAqht875Y1wUOw">
    <img src="https://img.shields.io/badge/Slack-lomi--a-4A154B?style=flat&logo=slack" alt="Join us on Slack" />
  </a>
</p>

</div>
<hr />

## About lomi.

lomi. is a **hosted** payment platform that integrates multiple payment service providers and provides a seamless experience for merchants and their customers across West Africa and beyond. We publish integrator tooling (API, SDKs, CLI, plugins) as open source; **production payment processing is not self-hostable today** — merchants use [lomi.africa](https://lomi.africa/sign-up).

Our platform simplifies product, services, usage, and subscription billing while ensuring the highest levels of security, reliability, and compliance.

## Roadmap

We are progressively open-sourcing the monorepo toward **eventual self-hosting** for operators with their own provider and compliance setup. That is not available in production today. See [docs.lomi.africa/resources/open-source/codebase](https://docs.lomi.africa/resources/open-source/codebase) for the current public tree.

- **Currently open-source**:
  - Documentation website: **[apps/docs](./apps/docs)**
  - CLI: **[apps/cli](./apps/cli)**
  - API service: **[apps/api](./apps/api)**
  - SDKs: **[apps/sdks](./apps/sdks)**
  - E-commerce plugins: **[apps/plugins](./apps/plugins)**
  - MCP server: **[apps/mcp](./apps/mcp)**
  - Events boilerplate (separate repo): **[lomiafrica/events](https://github.com/lomiafrica/events/)**

- **Opening soon**:
  - Merchant dashboard: **[apps/dashboard](./apps/dashboard)**
  - Shopify extension: **[apps/plugins/shopify](./apps/plugins/shopify)**

- **Proprietary**:
  - Admin dashboard: **[apps/admin](./apps/admin)**

All open-source repositories will be merged into the monorepo in the coming months.

## Payment infrastructure

lomi. integrates with the **SPI**, the official Central Bank-backed payment interoperability platform. With lomi., you can accept payments across 8 UEMOA countries (Benin, Burkina Faso, Côte d'Ivoire, Guinea-Bissau, Mali, Niger, Senegal, Togo). Our platform enables Bank-to-Bank, Bank-to-Wallet, Wallet-to-Bank, and Wallet-to-Wallet transactions through our suite of APIs.

The platform provides instant payment confirmation and settlement, allowing you to send payments using SHID, MCOD, or MBNO aliases without ever sharing account numbers. We offer native support for the West African CFA Franc (XOF).

For fellow fintechs, we built an SDK around this infrastructure: `pi-spi-sdk` - a community TypeScript SDK for the PI-SPI Business API ([apps/sdks/pi-spi-sdk](./apps/sdks/pi-spi-sdk)).

## Documentation

For comprehensive documentation, visit [docs.lomi.africa](https://docs.lomi.africa)

## License

This project is dual-licensed:

1. The majority of the codebase is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). This means you can freely use, modify, and distribute this code while ensuring that any modifications you make are also open-source.

2. Certain files marked with `/* @proprietary license */` are under lomi.africa's LLC Commercial License. These files require a valid commercial license from lomi. for production use.

See the [LICENSE](https://github.com/lomiafrica/lomi.?tab=License-1-ov-file) file for the complete terms of both licenses.

## Contributing

We welcome contributions to lomi.! This document outlines how to submit changes and which conventions to follow.

### Prerequisites

You should be familiar with GitHub issues and pull requests, have read our [documentation](https://docs.lomi.africa), and have cloned the monorepo for local development (`git clone https://github.com/lomiafrica/lomi./`) or installed the CLI via `npm install -g lomi.cli`. Local setup is for **contributors** — not for running your own payment processor.

### Contribution process

1. **Issues First**: Before working on a change, make sure there's an issue for it. Find an [existing issue](https://github.com/lomiafrica/lomi./issues) or [open a new one](https://github.com/lomiafrica/lomi./issues/new).

2. **Fork & Branch**: Fork the repository and create a branch from `develop` with a descriptive prefix:
   - `fix/` for bug fixes
   - `feat/` for features
   - `docs/` for documentation changes

3. **Make changes**: Keep your commits small and focused and ensure that your contribution doesn't modify files marked with `/* @proprietary license *

4. **Submit PR**: Open a pull request against the `develop` branch. Include a clear description following the What-Why-How-Testing structure.

5. **Code review**: A team member will review your PR within a few hours/days.

For detailed contribution guidelines, please see our [CONTRIBUTING.md](https://github.com/lomiafrica/lomi./blob/master/CONTRIBUTING.md).

### Community & support

Join our [community Discord](https://discord.gg/yb4FnBmh) for discussions and help, follow [@lomiafrica](https://twitter.com/lomiafrica) on Twitter for updates, or connect with us on [Slack](https://join.slack.com/t/lomi-a/shared_invite/zt-3hezykfvo-eW1jX6IkXAqht875Y1wUOw). Submit [issues](https://github.com/lomiafrica/lomi./issues) on GitHub for bug reports and feature requests, or contact us directly at [hello@lomi.africa](mailto:hello@lomi.africa).

### Security

For security vulnerabilities, please follow our [Security Policy](https://github.com/lomiafrica/lomi.?tab=security-ov-file). Please do not report security vulnerabilities through public GitHub issues.