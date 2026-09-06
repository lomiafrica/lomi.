/* @proprietary license */

import { DocsAppLayout, DocsMobileSectionSwitch } from '@/components/docs/docs-sidebar';
import { DocsHashScroll } from '@/components/docs/docs-hash-scroll';
import { DocsMobileSearchBanner } from '@/components/docs/docs-mobile-search-banner';
import { DocsSidebarLocaleAndTheme } from '@/components/docs/sidebar-locale-theme';
import { baseOptions, linkItems, logo } from '@/lib/utils/layout.shared';
import { source } from '@/lib/utils/source';
import { getDocsLocale } from '@/lib/utils/docs-locale';
import { isString } from '@lomi./shared';
import type { CSSProperties, ReactNode } from 'react';
import type { LayoutTab } from 'fumadocs-ui/layouts/shared';
import type { Folder, Node, Root } from 'fumadocs-core/page-tree';
import { t as translate } from '@/lib/i18n/translations';
import type { Language } from '@/lib/i18n/config';
import 'katex/dist/katex.min.css';

function getFirstPageUrl(node: Folder): string | undefined {
  if (node.index?.url) return node.index.url;

  for (const child of node.children) {
    if (child.type === 'page') return child.url;
    if (child.type === 'folder') {
      const nested = getFirstPageUrl(child);
      if (nested) return nested;
    }
  }

  return undefined;
}

const SECTION_LABEL_KEYS = {
  Start: 'section.start',
  Build: 'section.build',
  Resources: 'section.resources',
  'First steps': 'section.firstSteps',
  'API reference': 'section.apiReference',
  'REST API': 'section.restApi',
  'API': 'section.restApi',
  'Référence API': 'section.restApi',
  Basics: 'section.basics',
  Implementation: 'section.implementation',
  Community: 'section.community',
  Management: 'section.management',
} as const;

const SECTION_DESCRIPTION_KEYS = {
  'Create your account, get API keys, make a test payment, and go live.':
    'sectionDescription.start',
  'Créer un compte, tester un paiement et passer en production.':
    'sectionDescription.start',
  'Choose an integration path and build checkout, subscriptions, and tools.':
    'sectionDescription.build',
  'Choisir une intégration et construire checkout, abonnements et outils.':
    'sectionDescription.build',
  'Authentication, errors, data models, and endpoint reference for the lomi. API.':
    'sectionDescription.apiReference',
  'Support, merchant policies, open-source material, and contributor documentation.':
    'sectionDescription.resources',
  'Developers use lomi. to reliably accept payments in West Africa.':
    'sectionDescription.firstSteps',
  'Complete reference to building with lomi. API.':
    'sectionDescription.apiReference',
  'Payment and commerce endpoints.': 'sectionDescription.restApi',
  'Endpoints de paiement et de commerce.': 'sectionDescription.restApi',
} as const;

function isSectionLabelKey(
  value: string,
): value is keyof typeof SECTION_LABEL_KEYS {
  return Object.hasOwn(SECTION_LABEL_KEYS, value);
}

function isSectionDescriptionKey(
  value: string,
): value is keyof typeof SECTION_DESCRIPTION_KEYS {
  return Object.hasOwn(SECTION_DESCRIPTION_KEYS, value);
}

function localizeTreeLabel(value: ReactNode, locale: Language): ReactNode {
  if (!isString(value)) return value;

  const key = isSectionLabelKey(value) ? SECTION_LABEL_KEYS[value] : undefined;
  if (!key) return value;

  return translate(key, locale);
}

function localizeTreeDescription(
  value: ReactNode,
  locale: Language,
): ReactNode {
  if (!isString(value)) return value;

  const key = isSectionDescriptionKey(value)
    ? SECTION_DESCRIPTION_KEYS[value]
    : undefined;
  if (!key) return value;

  return translate(key, locale);
}

function localizeNode(node: Node, locale: Language): Node {
  if (node.type === 'folder') {
    return {
      ...node,
      name: localizeTreeLabel(node.name, locale),
      children: node.children.map((child) => localizeNode(child, locale)),
    };
  }

  if (node.type === 'separator') {
    return {
      ...node,
      name: localizeTreeLabel(node.name, locale),
    };
  }

  return node;
}

function localizeTree(root: Root, locale: Language): Root {
  return {
    ...root,
    name: localizeTreeLabel(root.name, locale),
    children: root.children.map((node) => localizeNode(node, locale)),
  };
}

export default async function Layout({ children }: { children: ReactNode }) {
  const locale = await getDocsLocale();
  const requestedTree = source.getPageTree(locale);
  const fallbackLocale: Language = locale === 'fr' ? 'en' : 'fr';
  const treeLocale =
    requestedTree.children.length > 0 ? locale : fallbackLocale;
  const pageTree = localizeTree(source.getPageTree(treeLocale), treeLocale);
  const base = baseOptions();
  const tabs: LayoutTab[] = pageTree.children.flatMap((node) => {
    if (node.type !== 'folder') return [];

    const url = getFirstPageUrl(node);
    if (!url) return [];

    const meta = source.getNodeMeta(node, locale);
    const color = meta
      ? `var(--${meta.path.split('/')[0]}-color, var(--color-fd-foreground))`
      : 'var(--color-fd-foreground)';

    return [
      {
        title: node.name,
        description: localizeTreeDescription(node.description, locale),
        url,
        $folder: node,
        icon: node.icon ? (
          <div
            className="[&_svg]:size-full rounded-sm size-full text-(--tab-color)"
            style={
              // SAFETY: Boundary value matches the asserted domain type at this call site.
              {
                '--tab-color': color,
              } as CSSProperties
            }
          >
            {node.icon}
          </div>
        ) : undefined,
      },
    ];
  });

  return (
    <DocsAppLayout
      {...base}
      i18n={false}
      tree={pageTree}
      tabs={tabs}
      sidebar={{
        defaultOpenLevel: 0,
        banner: (
          <div key="docs-mobile-chrome" className="contents">
            <DocsMobileSearchBanner />
            <DocsMobileSectionSwitch />
          </div>
        ),
        footer: (
          <div
            key="docs-mobile-locale-theme"
            className="docs-mobile-locale-theme-footer md:hidden"
          >
            <DocsSidebarLocaleAndTheme />
          </div>
        ),
      }}
      // just icon items
      links={linkItems?.filter((item) => item.type === 'icon') ?? []}
      nav={{
        ...base.nav,
        title: <>{logo}</>,
      }}
    >
      <DocsHashScroll />
      {children}
    </DocsAppLayout>
  );
}
