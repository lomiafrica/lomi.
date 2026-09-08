/* @proprietary license */

export const API_KEY_PLACEHOLDERS = [
  'lomi_sk_test_…',
  'lomi_sk_test_...',
  'YOUR_API_KEY',
  'LOMI_SECRET_KEY_VALUE',
] as const;

export const SAMPLE_CUSTOMER_ID = 'cus_1234567890abcdef';
export const SAMPLE_PRODUCT_ID = 'prod_1234567890abcdef';
export const SAMPLE_CHECKOUT_ID = 'cs_1234567890abcdef';

export type ApiKeyResolution =
  { kind: 'full'; value: string } | { kind: 'placeholder' };

export type PersonalizeOptions = {
  apiKey: ApiKeyResolution;
  customerId?: string | null;
  productId?: string | null;
  checkoutId?: string | null;
};

function replaceAllLiteral(
  haystack: string,
  needle: string,
  replacement: string,
): string {
  if (!needle || needle === replacement) return haystack;
  return haystack.split(needle).join(replacement);
}

export function resolveTestApiKeyDisplay(
  raw: string | null | undefined,
): ApiKeyResolution {
  const value = raw?.trim() ?? '';
  if (value.startsWith('lomi_sk_test_')) {
    return { kind: 'full', value };
  }
  return { kind: 'placeholder' };
}

export function personalizeSnippet(
  source: string,
  options: PersonalizeOptions,
): string {
  let out = source;

  if (options.apiKey.kind === 'full') {
    for (const placeholder of API_KEY_PLACEHOLDERS) {
      out = replaceAllLiteral(out, placeholder, options.apiKey.value);
    }
    out = out.replace(/lomi_sk_test_[A-Za-z0-9]+/g, options.apiKey.value);
    out = replaceAllLiteral(out, '$LOMI_SECRET_KEY', options.apiKey.value);
    out = replaceAllLiteral(
      out,
      'process.env.LOMI_SECRET_KEY',
      `'${options.apiKey.value}'`,
    );
  }

  if (options.customerId) {
    out = replaceAllLiteral(out, SAMPLE_CUSTOMER_ID, options.customerId);
  }
  if (options.productId) {
    out = replaceAllLiteral(out, SAMPLE_PRODUCT_ID, options.productId);
  }
  if (options.checkoutId) {
    out = replaceAllLiteral(out, SAMPLE_CHECKOUT_ID, options.checkoutId);
  }

  return out;
}
