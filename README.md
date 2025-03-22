<p align="center">
	<img src="https://res.cloudinary.com/dzrdlevfn/image/upload/v1742680937/transparent_g2ffjo.webp" width="200" height="200" alt="lomi. icon">
	<h1 align="center"><b>lomi.</b></h1>
<p align="center">
    The open-source payment orchestration platform powering West African businesses.
    <br />
    <br />
    <a href="https://discord.gg/lomi">Discord</a>
    ·
    <a href="https://lomi.africa">Website</a>
    ·
    <a href="https://github.com/lomiafrica/website/issues">Issues</a>
  </p>
</p>

<div align="center">

<a href="https://lomi.africa">Website</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://developers.lomi.africa">Docs</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://developers.lomi.africa/reference/core/overview">API Reference</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://lomi.africa/blog">Blog</a>

<p align="center">
<p align="center">
  <a href="https://github.com/lomiafrica/lomi./blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/yb4FnBmh">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=lomiafrica">
    <img src="https://img.shields.io/twitter/follow/lomiafrica.svg?label=Follow%20@lomiafrica" alt="Follow @lomiafrica" />
  </a>
  <a href="https://www.linkedin.com/company/lomiafri">
    <img src="https://img.shields.io/badge/LinkedIn-lomiafrica-blue?style=flat&logo=linkedin" alt="lomi. LinkedIn" />
  </a>
</p>

<p align="center">
  <a href="https://www.producthunt.com/posts/lomi?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-lomi" target="_blank">
    <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=720260&theme=dark&t=1736800231403" 
    alt="lomi. - Simplifying payments across francophone West Africa | Product Hunt"
    width="250" height="54" />
  </a>
</p>

</div>
<hr />

## About lomi.

lomi. is a unified payment orchestration platform that integrates multiple payment service providers and provides a seamless experience for merchants and their customers across West Africa and beyond. Our platform simplifies product and subscriptions billing while ensuring the highest levels of security, reliability, and compliance.

## Features

<div align="left">
  <p>
    <strong>🔌 Multiple Payment Providers</strong><br/>
    Seamlessly integrate with various payment providers (Wave, MTN, Orange Money, Stripe) through a single API.
  </p>
  
  <p>
    <strong>💱 Multi-Currency Support</strong><br/>
    Process transactions in multiple currencies with automatic conversion and settlement.
  </p>
  
  <p>
    <strong>🎨 Customizable Checkout</strong><br/>
    Create beautiful, branded checkout experiences that work across all devices.
  </p>
  
  <p>
    <strong>👤 End-Customer Portal</strong><br/>
    Provide customers with a self-service portal to manage their payment methods, view transaction history, request refunds, update subscription and account details.
  </p>
  
  <p>
    <strong>📊 Comprehensive Analytics</strong><br/>
    Gain valuable insights into your customers payment behavior, conversion rates, and payment trends.
  </p>
  
  <p>
    <strong>🛡️ Fraud Detection</strong><br/>
    Advanced fraud prevention tools to protect your business and customers.
  </p>
  
  <p>
    <strong>🔔 Webhook Management</strong><br/>
    Real-time notifications for payment events to keep your systems in sync.
  </p>
  
  <p>
    <strong>🔒 Secure Tokenization</strong><br/>
    Safely store payment details for future transactions without handling sensitive data.
  </p>
  
  <p>
    <strong>👥 Role-Based Access Control</strong><br/>
    Manage team permissions with granular control over who can access what.
  </p>
</div>

## Open Source Roadmap

We are progressively open-sourcing the entire lomi. project:

- **Currently Open Source**:
  - Merchant dashboard : **[apps/website](https://github.com/lomiafrica/website)**
  - Documentation website: **[apps/developers](https://github.com/lomiafrica/developers.lomi.africa)**

- **Opening Soon**:
  - API service:  **[apps/api](https://github.com/lomiafrica/api.lomi.africa)** - API service – Node.js / TypeScript / Express
  - Boilerplate templates: **[apps/store](https://github.com/lomiafrica/store.lomi.africa)** – Medusa + Next.js / TypeScript; **[apps/commerce](https://github.com/lomiafrica/commerce.lomi.africa)** – Boilerplate - Medusa + Vite / TypeScript

  - Shopify extension: **[apps/shopify](https://github.com/lomiafrica/shopify.lomi.africa)** – Vite / TypeScript
  - CLI tool: **[apps/cli](https://github.com/lomiafrica/cli.lomi.africa)** - Node.js

  - Jumbo online IDE (Online IDE) * **[apps/jumbo](https://github.com/lomiafrica/jumbo.lomi.africa)** - Remix + Vite + Expo / TypeScript 

Everything will be made available in the coming weeks and all separate repositories will be merge in the monorepo. Stay tuned for updates!

## Core Infrastructure

- Microservices architecture
- TypeScript
- Node.js
- Vite
- Nextjs
- React
- Shadcn UI
- Radix UI
- PostgreSQL via Supabase
- Resend
- Upstash (Redis)
- Anthropic
- Infobip
- Tailwind CSS

## Payment Service Providers (PSPs)
- Wave
- Orange
- Crypto via NP
- MTN (upcoming)
- Stripe (upcoming)
- Airtel Money (upcoming)
- More integration coming soon!

## Quick Start

### Prerequisites
- Node.js 18+
- Bun
- Supabase

### Local development (via merchant dashboard)
```bash
# Clone the repository
git clone https://github.com/lomiafrica/website.git

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Start the development server
bun run dev
```

## Documentation

For comprehensive documentation, visit [developers.lomi.africa](https://developers.lomi.africa)

## Use Cases

- **E-commerce and SaaS**: Accept payments on your website, application or online store with a customized checkout experience
- **Subscription services**: Manage recurring payments with automated billing
- **Mobile apps**: Integrate payment capabilities into your iOS and Android applications

## License

This project is dual-licensed:

1. The majority of the codebase is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). This means you can freely use, modify, and distribute this code while ensuring that any modifications you make are also open source.

2. Certain files marked with `/* @proprietary license */` are under lomi.africa's LLC Commercial License. These files require a valid commercial license from lomi. for production use.

See the [LICENSE](https://github.com/lomiafrica/lomi.?tab=License-1-ov-file) file for the complete terms of both licenses.

## Contributing

We welcome contributions to lomi. ! This document outlines how to submit changes and which conventions to follow.

### Prerequisites
- You're familiar with GitHub Issues and Pull Requests
- You've read the [documentation](https://developers.lomi.africa)
- You've already set up your local instance with `git clone https://github.com/lomiafrica/website` or via `bun install lomi.cli`

### Contribution process

1. **Issues First**: Before working on a change, make sure there's an issue for it. Find an [existing issue](https://github.com/lomiafrica/lomi./issues) or [open a new one](https://github.com/lomiafrica/lomi./issues/new).

2. **Fork & Branch**: Fork the repository and create a branch from `develop` with a descriptive prefix:
   - `fix/` for bug fixes
   - `feat/` for features
   - `docs/` for documentation changes

3. **Make Changes**: Keep your commits small and focused and ensure that your contribution doesn't modify files marked with `/* @proprietary license *

4. **Submit PR**: Open a pull request against the `develop` branch. Include a clear description following the What-Why-How-Testing structure.

5. **Code Review**: A team member will review your PR within a few hours/days.

For detailed contribution guidelines, please see our [CONTRIBUTING.md](https://github.com/lomiafrica/lomi./blob/master/CONTRIBUTING.md).

## Community & Support

- **Discord**: Join our [community Discord](https://discord.gg/yb4FnBmh) for discussions and help
- **Twitter**: Follow [@lomiafrica](https://twitter.com/lomiafrica) for updates
- **GitHub**: Submit [issues](https://github.com/lomiafrica/lomi./issues) for bug reports and feature requests
- **Email**: Contact [hello@lomi.africa](mailto:hello@lomi.africa) for direct support

## Security

- For security vulnerabilities, please follow our [Security Policy](https://github.com/lomiafrica/lomi.?tab=security-ov-file)
- Kindly do not report security vulnerabilities through public GitHub issues