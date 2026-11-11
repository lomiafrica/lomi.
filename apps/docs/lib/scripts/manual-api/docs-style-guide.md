# lomi. docs style guide

## Voice and tone

- **Direct and practical**: lead with what the merchant or developer can do, not platform internals.
- **Confident but not salesy**: state capabilities plainly; avoid superlatives and filler.
- **Bilingual parity**: French pages mirror English structure; translate `title` and `description`, keep API paths and code samples aligned.

## Structure

### Guide pages (`start/`, `build/`)

1. One H1 matching the page title (from frontmatter).
2. Short intro paragraph (1–3 sentences) stating the outcome.
3. H2 sections for each major step or concept.
4. Link to REST reference with relative paths: `/api/...`, `/start/...`, `/build/...`.
5. Code fences with language tags (`ts`, `bash`, `json`).

### API reference pages (`api/**`)

Frontmatter must include (non-translatable):

- `method`, `path`, `operationId`: must match OpenAPI exactly.
- `title`, `description`: translatable; French siblings use natural French titles.

Body sections typically include: overview, request, response, errors, related links.

## French (`.fr.mdx`) conventions

- Filename: `page.fr.mdx` sibling of `page.mdx` (not a `[locale]/` folder).
- Translate prose and headings; **do not** translate `method`, `path`, `operationId`, or string literals in code.
- Keep the same heading count and internal link targets as EN.

## Links and cross-references

- Internal links: `](/start/...)`, `](/build/...)`, `](/api/...)`, `](/resources/...)`.
- Prefer linking to the canonical REST operation page rather than duplicating full request schemas in guides.

## Anchor pages (reference quality)

When drafting or reviewing, compare against:

- `apps/docs/content/docs/start/sandbox-payments.mdx`
- `apps/docs/content/docs/build/billing/usage-billing.mdx`
- `apps/docs/content/docs/api/organizations/OrganizationsController_updateRadarSettings.mdx`

## CI and tooling

From `apps/docs`: `pnpm lint`, `pnpm docs:drift`, and `pnpm screenshots:verify`. `docs:drift` checks English/French page pairing.
