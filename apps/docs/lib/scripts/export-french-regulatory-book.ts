/* @proprietary license */

/**
 * Export French regulatory documentation packs (3 books):
 * 1. Merchant REST API reference
 * 2. Services / product overview (Network, products, channels, platform, MoR)
 * 3. Agent platform (MCP, OAuth, provisioning, partner API)
 *
 * Run from apps/docs:
 *   pnpm docs:export-fr-book -- --pdf
 *   pnpm docs:export-fr-book -- --book api --pdf
 *   pnpm docs:export-fr-book -- --book services --pdf
 *   pnpm docs:export-fr-book -- --book agent --pdf
 *   pnpm docs:export-fr-book -- --book all --pdf
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { REST_API_SECTION_ORDER } from '@/lib/scripts/manual-api/constants';
import {
  type BookSection,
  existingFiles,
  renderBook,
  writeBookArtifacts,
} from '@/lib/scripts/export-french-book-shared';

const DOCS_ROOT = join(process.cwd(), 'content/docs');
const DEFAULT_OUT_DIR = join(process.cwd(), '../../docs/compliance/exports');

const BOOK_IDS = ['api', 'services', 'agent', 'all'] as const;
type BookId = (typeof BOOK_IDS)[number];
type ConcreteBookId = Exclude<BookId, 'all'>;

const API_CONCEPT_PAGES = [
  'authentication.fr.mdx',
  'errors.fr.mdx',
  'data-models.fr.mdx',
  'payment-state-machine.fr.mdx',
] as const;

const EXTRA_API_SECTIONS = ['organization'] as const;

const ADVANCED_GUIDE_ORDER = [
  'index.fr.mdx',
  'handling-webhooks.fr.mdx',
  'webhook-reliability.fr.mdx',
  'idempotency-keys.fr.mdx',
  'error-handling.fr.mdx',
  'security-best-practices.fr.mdx',
  'testing.fr.mdx',
  'ci-cd.fr.mdx',
] as const;

type CliOptions = {
  book: BookId;
  pdf: boolean;
  outDir: string;
};

function parseArgs(): CliOptions {
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  const bookIdx = args.indexOf('--book');
  const outIdx = args.indexOf('--out-dir');
  const bookRaw = bookIdx === -1 ? 'all' : args[bookIdx + 1];
  // SAFETY: Boundary value matches the asserted domain type at this call site.
  if (!bookRaw || !BOOK_IDS.includes(bookRaw as BookId)) {
    throw new Error(
      `Invalid --book value. Expected one of: ${BOOK_IDS.join(', ')}`,
    );
  }
  const outDir =
    outIdx === -1
      ? DEFAULT_OUT_DIR
      : (() => {
          const value = args[outIdx + 1];
          if (!value) throw new Error('Missing path after --out-dir');
          return value;
        })();
  // SAFETY: Boundary value matches the asserted domain type at this call site.
  return { book: bookRaw as BookId, pdf: args.includes('--pdf'), outDir };
}

function listSectionOperationPages(sectionDir: string): string[] {
  if (!existsSync(sectionDir)) {
    return [];
  }
  return readdirSync(sectionDir)
    .filter((name) => name.endsWith('.fr.mdx'))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => join(sectionDir, name));
}

function docsPath(...parts: string[]): string {
  return join(DOCS_ROOT, ...parts);
}

function buildApiSections(): BookSection[] {
  const apiRoot = docsPath('api');
  const apiFiles: string[] = [];

  const overview = join(apiRoot, 'index.fr.mdx');
  if (existsSync(overview)) {
    apiFiles.push(overview);
  }

  for (const name of API_CONCEPT_PAGES) {
    const path = join(apiRoot, name);
    if (existsSync(path)) apiFiles.push(path);
  }

  for (const section of REST_API_SECTION_ORDER) {
    apiFiles.push(...listSectionOperationPages(join(apiRoot, section)));
  }

  for (const section of EXTRA_API_SECTIONS) {
    apiFiles.push(...listSectionOperationPages(join(apiRoot, section)));
  }

  const guideFiles = ADVANCED_GUIDE_ORDER.map((name) =>
    docsPath('build/reliability', name),
  ).filter((path) => existsSync(path));

  return [
    { title: 'Référence API REST lomi.', files: apiFiles },
    { title: 'Guides d’intégration avancés', files: guideFiles },
  ];
}

function buildServicesSections(): BookSection[] {
  return [
    {
      title: 'Vue d’ensemble plateforme',
      files: existingFiles([
        docsPath('start/overview.fr.mdx'),
        docsPath('start/integration-journey.fr.mdx'),
        docsPath('build/platform/organizations.fr.mdx'),
        docsPath('build/platform/merchants.fr.mdx'),
        docsPath('build/platform/customers.fr.mdx'),
      ]),
    },
    {
      title: 'lomi. Network',
      files: existingFiles([
        docsPath('resources/network.fr.mdx'),
      ]),
    },
    {
      title: 'Produits et catalogue',
      files: existingFiles([
        docsPath('build/billing/products.fr.mdx'),
        docsPath('build/accept/digital-products.fr.mdx'),
        docsPath('build/billing/subscriptions.fr.mdx'),
        docsPath('build/billing/usage-billing.fr.mdx'),
        docsPath('build/billing/discount-coupons.fr.mdx'),
      ]),
    },
    {
      title: 'Paiements et canaux',
      files: existingFiles([
        docsPath('build/payment-channels.fr.mdx'),
        docsPath('build/payment-methods/cards.fr.mdx'),
        docsPath('build/payment-methods/wave.fr.mdx'),
        docsPath('build/payment-methods/mtn-momo.fr.mdx'),
        docsPath('build/payment-methods/spi.fr.mdx'),
        docsPath('build/mobile-money.fr.mdx'),
        docsPath('build/accept/checkout.fr.mdx'),
        docsPath('build/accept/payment-links.fr.mdx'),
        docsPath('build/accept/payment-requests.fr.mdx'),
        docsPath('build/accept/direct-charges.fr.mdx'),
        docsPath('build/accept/checkout-behavior.fr.mdx'),
        docsPath('build/reliability/payment-lifecycle.fr.mdx'),
      ]),
    },
    {
      title: 'Cycle de vie et opérations',
      files: existingFiles([
        docsPath('build/reliability/payment-lifecycle.fr.mdx'),
        docsPath('build/reliability/verify-payments.fr.mdx'),
        docsPath('build/money/transactions.fr.mdx'),
        docsPath('build/reliability/index.fr.mdx'),
        docsPath('build/money/refunds.fr.mdx'),
        docsPath('build/money/disputes.fr.mdx'),
        docsPath('build/money/payouts.fr.mdx'),
        docsPath('build/money/balance-and-settlement.fr.mdx'),
        docsPath('build/money/radar.fr.mdx'),
        docsPath('build/billing/customer-portal.fr.mdx'),
      ]),
    },
    {
      title: 'Merchant of Record',
      files: existingFiles([
        docsPath('start/merchant-of-record/pricing.fr.mdx'),
        docsPath('start/merchant-of-record/acceptable-use.fr.mdx'),
        docsPath('start/merchant-of-record/account-reviews.fr.mdx'),
      ]),
    },
  ].filter((section) => section.files.length > 0);
}

type AgentOpenApi = {
  paths?: Record<
    string,
    Record<
      string,
      {
        summary?: string;
        description?: string;
        operationId?: string;
        tags?: string[];
        parameters?: Array<{
          name?: string;
          in?: string;
          required?: boolean;
          description?: string;
        }>;
        requestBody?: { description?: string };
        responses?: Record<string, { description?: string }>;
        security?: Array<Record<string, string[]>>;
      }
    >
  >;
};

function renderAgentOpenApiReference(): string {
  const agentPath = join(process.cwd(), 'agent-openapi.json');
  if (!existsSync(agentPath)) {
    return '_Contrat agent-openapi.json introuvable._';
  }

  // SAFETY: Boundary value matches the asserted domain type at this call site.
  const spec = JSON.parse(readFileSync(agentPath, 'utf-8')) as AgentOpenApi;
  const paths = spec.paths ?? {};
  const lines: string[] = [
    'Référence machine des surfaces agent, partner et provisioning. Contrat source : `apps/docs/agent-openapi.json`.',
    '',
  ];

  for (const route of Object.keys(paths).sort()) {
    const methods = paths[route] ?? {};
    for (const method of Object.keys(methods).sort()) {
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
      const op = methods[method];
      if (!op) continue;
      const title =
        op.summary?.trim() || op.operationId || `${method} ${route}`;
      lines.push(`### ${method.toUpperCase()} \`${route}\``, '');
      lines.push(`**${title}**`, '');
      if (op.description?.trim()) {
        lines.push(op.description.trim(), '');
      }
      if (op.tags?.length) {
        lines.push(`Tags : ${op.tags.join(', ')}`, '');
      }
      if (op.security?.length) {
        const schemes = op.security
          .flatMap((entry) => Object.keys(entry))
          .join(', ');
        lines.push(`Sécurité : ${schemes || 'déclarée'}`, '');
      } else {
        lines.push('Sécurité : non authentifiée ou selon contrat', '');
      }
      if (op.parameters?.length) {
        lines.push('Paramètres :', '');
        for (const param of op.parameters) {
          const req = param.required ? 'requis' : 'optionnel';
          lines.push(
            `- \`${param.name ?? '?'}\` (${param.in ?? 'n/a'}, ${req})${param.description ? ` - ${param.description}` : ''}`,
          );
        }
        lines.push('');
      }
      if (op.requestBody?.description) {
        lines.push(`Corps : ${op.requestBody.description}`, '');
      }
      if (op.responses) {
        const codes = Object.keys(op.responses).sort();
        lines.push(
          `Réponses : ${codes.map((code) => `${code}${op.responses?.[code]?.description ? ` (${op.responses[code].description})` : ''}`).join(', ')}`,
          '',
        );
      }
    }
  }

  return lines.join('\n').trim();
}

function buildAgentCredentialOverview(): string {
  return [
    'Cette section décrit les identifiants et flux utilisés pour l’onboarding agent (0→1), MCP et Partner API.',
    '',
    '### Types d’identifiants',
    '',
    '| Identifiant | Rôle |',
    '| --- | --- |',
    '| `lomi_partner_*` | Clé de gestion plateforme (émise par lomi.). Sert à créer des clés de provisioning par utilisateur externe. |',
    '| `lomi_prov_*` | Clé de provisioning pour `/provisioning/*` et les outils MCP d’onboarding (`x-lomi-provisioning-key`). |',
    '| `lomi_oat_*` | Jeton OAuth MCP; introspecté vers une session scoped provisioning / marchande. |',
    '| `lomi_sk_*` / `lomi_sk_test_*` | Clé secrète marchande (API REST publique et outils MCP marchands). |',
    '',
    '### Partner API',
    '',
    'En-tête : `x-lomi-partner-key` ou `Authorization: Bearer lomi_partner_*`.',
    '',
    '- `POST /partners/provisioning-keys` : créer une clé `lomi_prov_*` pour un `external_user_ref`',
    '- `GET /partners/provisioning-keys` : lister',
    '- `DELETE /partners/provisioning-keys/{id}` : révoquer',
    '- `GET /partners/usage` : résumé d’usage',
    '',
    '### OAuth MCP (self-service)',
    '',
    '1. `GET https://mcp.lomi.africa/.well-known/oauth-protected-resource/mcp`',
    '2. `POST https://api.lomi.africa/oauth/register` (DCR optionnel)',
    '3. `GET https://api.lomi.africa/oauth/authorize` (PKCE + `resource`); approbation humaine sur `https://dashboard.lomi.africa/connect/agent-connect`',
    '4. `POST https://api.lomi.africa/oauth/token` → `lomi_oat_*`',
    '5. Connexion MCP avec `Authorization: Bearer <access_token>`',
    '',
    '### Test → live (validation humaine)',
    '',
    '- `POST /provisioning/merchants/{id}/live-activation/request` : l’agent demande le passage en live',
    '- `GET /provisioning/merchants/{id}/live-activation/status` : suivi jusqu’à approbation',
    '- Le marchand approuve sur `https://dashboard.lomi.africa/connect/go-live` et récupère la clé live `lomi_sk_*` (jamais via l’API de provisioning)',
    '',
  ].join('\n');
}

function buildAgentSections(): BookSection[] {
  return [
    {
      title: 'Identifiants et flux agent',
      files: [],
      inlinePages: [
        {
          title: 'Vue d’ensemble des identifiants agent',
          body: buildAgentCredentialOverview(),
        },
      ],
    },
    {
      title: 'MCP et accès développeur',
      files: existingFiles([
        docsPath('build/mcp/index.fr.mdx'),
        docsPath('start/api-keys.fr.mdx'),
        docsPath('start/go-live.fr.mdx'),
      ]),
    },
    {
      title: 'Contrat OpenAPI agent / partner / provisioning',
      files: [],
      inlinePages: [
        {
          title: 'Référence des opérations agent-openapi.json',
          body: renderAgentOpenApiReference(),
        },
      ],
    },
  ];
}

type BookMetaEntry = {
  title: string;
  fileStem: string;
  build: () => BookSection[];
};
type BookMetaById = { [Id in ConcreteBookId]: BookMetaEntry };

const BOOK_META: BookMetaById = {
  api: {
    title: 'Documentation technique lomi.',
    fileStem: 'lomi-reference-api-fr',
    build: buildApiSections,
  },
  services: {
    title: 'Vue d’ensemble des services lomi.',
    fileStem: 'lomi-services-overview-fr',
    build: buildServicesSections,
  },
  agent: {
    title: 'Plateforme agent lomi.',
    fileStem: 'lomi-agent-platform-fr',
    build: buildAgentSections,
  },
};

function countPages(sections: BookSection[]): number {
  return sections.reduce(
    (sum, section) =>
      sum + section.files.length + (section.inlinePages?.length ?? 0),
    0,
  );
}

function exportBook(
  bookId: ConcreteBookId,
  outDir: string,
  pdf: boolean,
): void {
  const meta = BOOK_META[bookId];
  const sections = meta.build();
  const total = countPages(sections);
  if (total === 0) {
    throw new Error(`No French pages found for book "${bookId}".`);
  }

  const markdown = renderBook({
    title: meta.title,
    sections,
  });
  const outPath = join(outDir, `${meta.fileStem}.md`);
  writeBookArtifacts({ outPath, title: meta.title, markdown, pdf });

  console.log(`Book ${bookId}: ${total} pages`);
  for (const section of sections) {
    const n = section.files.length + (section.inlinePages?.length ?? 0);
    console.log(`  - ${section.title}: ${n}`);
  }
}

async function main(): Promise<void> {
  const { book, pdf, outDir } = parseArgs();
  const targets: ConcreteBookId[] =
    book === 'all' ? ['api', 'services', 'agent'] : [book];

  for (const target of targets) {
    console.log(`\n=== Export ${target} ===`);
    exportBook(target, outDir, pdf);
  }

  if (!pdf) {
    console.log('\nTip: add --pdf to also generate Chrome headless PDFs.');
  }
}

main().catch((error: Error) => {
  console.error(error);
  process.exit(1);
});
