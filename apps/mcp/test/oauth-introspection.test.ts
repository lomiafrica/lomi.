import { describe, expect, it, vi } from 'vitest';
import {
  buildProtectedResourceMetadata,
  getProtectedResourceMetadataUrl,
  introspectOAuthAccessToken,
  looksLikeOAuthAccessToken,
} from '../src/oauth-introspection.js';

describe('oauth-introspection', () => {
  it('detects OAuth access tokens', () => {
    expect(looksLikeOAuthAccessToken('lomi_oat_abc')).toBe(true);
    expect(looksLikeOAuthAccessToken('lomi_prov_abc')).toBe(false);
  });

  it('builds protected resource metadata with authorization server', () => {
    process.env.LOMI_MCP_RESOURCE_URL = 'https://mcp.lomi.africa/mcp';
    process.env.LOMI_OAUTH_ISSUER = 'https://api.lomi.africa';
    const metadata = buildProtectedResourceMetadata();
    expect(metadata.resource).toBe('https://mcp.lomi.africa/mcp');
    expect(metadata.authorization_servers).toContain('https://api.lomi.africa');
    expect(metadata.scopes_supported).toContain('provisioning.onboard');
    expect(metadata.scopes_supported).toContain('merchant.read');
    expect(metadata.scopes_supported).toContain('merchant.write');
    expect(metadata.scopes_supported).toContain('merchant.money');
  });

  it('builds path-scoped protected resource metadata URL', () => {
    process.env.LOMI_MCP_RESOURCE_URL = 'https://mcp.lomi.africa/mcp';
    expect(getProtectedResourceMetadataUrl()).toBe(
      'https://mcp.lomi.africa/.well-known/oauth-protected-resource/mcp',
    );
  });

  it('returns inactive when internal key is missing', async () => {
    delete process.env.INTERNAL_API_KEY;
    delete process.env.CRON_SECRET;
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await introspectOAuthAccessToken('lomi_oat_missing_key_test');
    expect(result.active).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
