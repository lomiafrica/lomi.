/* @proprietary license */

import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as FilesComponents from 'fumadocs-ui/components/files';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import * as icons from 'lucide-react';
import { DocsScreenshot } from '@/components/docs/docs-screenshot';
import { DocsAgentIndex } from '@/components/docs/docs-agent-index';
import { InlineCommand } from '@/components/docs/inline-command';
import { Callout } from '@/components/docs/docs-callout';
import { McpOauthConnect } from '@/components/docs/mcp-oauth-connect';
import { DocsDownloadButton } from '@/components/docs/docs-download-button';
import {
  IntegrationSurface,
  IntegrationSurfaceGroup,
} from '@/components/docs/integration-surface-group';
import { McpOperationIndex } from '@/components/docs/mcp-operation-index';
import {
  DocsContactForm,
  DocsSecurityForm,
} from '@/components/docs/docs-support-form';
import { DocsTierCallout } from '@/components/docs/docs-tier-callout';
import { DocsNextStep, DocsNextSteps } from '@/components/docs/docs-next-steps';
import { PricingTable } from '@/components/docs/pricing-table';
import { TaskSurfaces } from '@/components/docs/task-surfaces';
import { DocsHighlightedPre } from '@/components/docs/docs-highlighted-pre';
import { isFunction } from '@lomi./shared';

function lucideIconsAsMdx(): MDXComponents {
  const components: MDXComponents = {};
  for (const [name, icon] of Object.entries(icons)) {
    if (!isFunction(icon) || icon.length > 1) continue;
    // SAFETY: Lucide named exports with arity <= 1 are SVG React components; createLucideIcon (arity 2) is excluded.
    const component = icon as NonNullable<MDXComponents[string]>;
    components[name] = component;
  }
  return components;
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...lucideIconsAsMdx(),
    ...defaultMdxComponents,
    pre: DocsHighlightedPre,
    Callout,
    DocsDownloadButton,
    McpOauthConnect,
    ...TabsComponents,
    ...FilesComponents,
    Accordion,
    Accordions,
    Step,
    Steps,
    DocsScreenshot,
    DocsAgentIndex,
    InlineCommand,
    IntegrationSurfaceGroup,
    IntegrationSurface,
    McpOperationIndex,
    DocsContactForm,
    DocsSecurityForm,
    DocsTierCallout,
    DocsNextSteps,
    DocsNextStep,
    PricingTable,
    TaskSurfaces,
    ...components,
  } satisfies MDXComponents;
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
