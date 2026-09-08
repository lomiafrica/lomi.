/* @proprietary license */

import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { DocsSidebarLocaleAndTheme } from '@/components/docs/sidebar-locale-theme';
import { Logo } from './logo';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/(docs)/l/[lang]/layout.tsx
 */
export const logo = <Logo priority />;

export const linkItems: BaseLayoutProps['links'] = [];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: logo,
      // `/` 301s to the overview; link straight there so the logo never bounces.
      url: '/start/overview',
    },
    // see fumadocs-ui navigation links
    links: linkItems,
    themeSwitch: {
      // Full-width Beecargo-style user nav (Dashboard, Language, Theme, MCP, backlinks)
      component: <DocsSidebarLocaleAndTheme />,
    },
  };
}
