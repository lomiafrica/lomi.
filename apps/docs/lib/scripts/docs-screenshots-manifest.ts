/* @proprietary license */

/** Relative to `apps/docs/public/docs/images/`. */
export const DOCS_SCREENSHOT_BASE = 'public/docs/images';

export const DOCS_SCREENSHOT_WIDTH = 1280;
export const DOCS_SCREENSHOT_HEIGHT = 720;

/** Screen slug → used as `{slug}-light.webp` and `{slug}-dark.webp`. */
export const DOCS_SCREENSHOT_SCREENS = [
  'start/create-account',
  'start/api-keys',
  'start/hosted-checkout',
  'build/choose-integration',
  'build/payment-links',
  'build/mobile-money',
  'build/cards',
  'build/balance',
  'build/payouts',
  'build/subscriptions',
  'build/customer-portal',
  'build/woocommerce-upload',
  'build/woocommerce-payments',
  'build/woocommerce-webhook-url',
  'build/woocommerce-webhook-dashboard',
  'build/woocommerce-checkout',
] as const;

export type DocsScreenshotTheme = 'light' | 'dark';

export function docsScreenshotFilename(
  screen: (typeof DOCS_SCREENSHOT_SCREENS)[number],
  theme: DocsScreenshotTheme,
): string {
  return `${screen}-${theme}.webp`;
}

export function expectedDocsScreenshotPaths(): string[] {
  const themes: DocsScreenshotTheme[] = ['light', 'dark'];
  return DOCS_SCREENSHOT_SCREENS.flatMap((screen) =>
    themes.map((theme) => docsScreenshotFilename(screen, theme)),
  );
}
