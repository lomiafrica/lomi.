import { describe, expect, it } from 'vitest';

import manifestJson from '../src/generated/tools-manifest.json' with { type: 'json' };
import { parseManifest } from '../src/manifest-parse.js';
import { validateJsonValue } from '@lomi./shared';

describe('merchant completeness manifest', () => {
  const manifest = parseManifest(validateJsonValue(manifestJson));

  it('includes generated lomi_team and lomi_settings', () => {
    const names = manifest.tools.map((tool) => tool.name);
    expect(names).toContain('lomi_team');
    expect(names).toContain('lomi_settings');
  });

  it('exposes organization create/use and product archive', () => {
    const org = manifest.tools.find((tool) => tool.name === 'lomi_organization');
    const products = manifest.tools.find((tool) => tool.name === 'lomi_products');
    expect(org?.actions.create?.operationKey).toBe('POST /organizations');
    expect(org?.actions.use?.operationKey).toBe('POST /organizations/{id}/keys');
    expect(products?.actions.update?.operationKey).toBe('PATCH /products/{id}');
    expect(products?.actions.archive?.operationKey).toBe('DELETE /products/{id}');
  });
});
