/* @proprietary license */

import { createSecureOpenApiProxyHandlers } from '@/lib/openapi-secure-proxy';
import { resolveTestSecretApiKey } from '@/lib/resolve-test-api-key';
import { resolveTryitInjectionContext } from '@/lib/tryit/injection-context';

const handlers = createSecureOpenApiProxyHandlers({
  getInjectionContext: resolveTryitInjectionContext,
  async resolveTestKey({ activeOrganizationId }) {
    return resolveTestSecretApiKey({
      activeOrganizationId,
    });
  },
});

export const GET = handlers.GET;
export const HEAD = handlers.HEAD;
export const PUT = handlers.PUT;
export const POST = handlers.POST;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
