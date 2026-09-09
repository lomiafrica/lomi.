/**
 * Adds agent-readiness fields to committed OpenAPI without a full Nest regen.
 * Run: node apps/docs/lib/scripts/enrich-openapi-agent-readiness.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsRoot = join(__dirname, '..', '..');
const websitePublic = join(docsRoot, '..', 'website', 'public');

const ERROR_SCHEMA = {
  type: 'object',
  required: ['error', 'request_id'],
  properties: {
    error: {
      type: 'object',
      required: ['code', 'message'],
      properties: {
        code: { type: 'string', example: 'validation_failed' },
        message: { type: 'string' },
        details: {},
      },
    },
    request_id: { type: 'string', format: 'uuid' },
  },
};

const ERROR_STATUSES = {
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict (including idempotency_key_reused / idempotency_in_progress)',
  429: 'Too many requests',
  500: 'Internal server error',
};

const MONEY_MOVING = [
  'POST /checkout-sessions',
  'POST /payment-requests',
  'POST /refunds',
  'POST /payouts',
];

function isMoneyMoving(method, pathKey) {
  const key = `${method.toUpperCase()} ${pathKey}`;
  if (MONEY_MOVING.includes(key)) return true;
  return method.toUpperCase() === 'POST' && pathKey.startsWith('/charge/');
}

function errorResponse(description) {
  return {
    description,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
      },
    },
    headers: {
      RateLimit: {
        description:
          'IETF rate limit remaining (draft-ietf-httpapi-ratelimit-headers)',
        schema: { type: 'string' },
      },
      'RateLimit-Policy': {
        description: 'IETF rate limit policy',
        schema: { type: 'string' },
      },
      'X-RateLimit-Limit': { schema: { type: 'string' } },
      'X-RateLimit-Remaining': { schema: { type: 'string' } },
      'Retry-After': { schema: { type: 'string' } },
    },
  };
}

function enrichMerchantSpec(spec) {
  spec.info = spec.info ?? {};
  spec.info.version = '1.2.0';
  spec.info.contact = {
    name: 'lomi.',
    url: 'https://docs.lomi.africa',
    email: 'hello@lomi.africa',
  };
  spec.info.description =
    `${spec.info.description ?? ''}\n\nRoutes stay unversioned. OpenAPI info.version is the schema release. Send optional Lomi-Version to pin a known schema. Compatibility is additive.`.trim();

  spec.components = spec.components ?? {};
  spec.components.schemas = spec.components.schemas ?? {};
  spec.components.schemas.ErrorResponse = ERROR_SCHEMA;
  spec.components.parameters = spec.components.parameters ?? {};
  spec.components.parameters.LomiVersion = {
    name: 'Lomi-Version',
    in: 'header',
    required: false,
    description:
      'Optional schema version pin. Echoes OpenAPI info.version (currently 1.2.0). Routes stay unversioned.',
    schema: { type: 'string', example: '1.2.0' },
  };
  spec.components.parameters.IdempotencyKey = {
    name: 'Idempotency-Key',
    in: 'header',
    required: true,
    description:
      'Required unique key for money-moving writes. Replays return the original response.',
    schema: { type: 'string', format: 'uuid' },
  };
  spec.components.securitySchemes = spec.components.securitySchemes ?? {};
  spec.components.securitySchemes.oauth2 = {
    type: 'oauth2',
    description:
      'Agent OAuth for MCP and Connect. Merchant REST still uses X-API-KEY by default.',
    flows: {
      authorizationCode: {
        authorizationUrl: 'https://api.lomi.africa/oauth/authorize',
        tokenUrl: 'https://api.lomi.africa/oauth/token',
        refreshUrl: 'https://api.lomi.africa/oauth/token',
        scopes: {
          'provisioning.onboard': 'Create and complete merchant onboarding',
          'merchant.read': 'Read merchant resources',
          'merchant.write': 'Write merchant resources',
        },
      },
    },
  };

  function isPlainObject(value) {
    return value instanceof Object && !Array.isArray(value);
  }

  const methods = ['get', 'post', 'put', 'patch', 'delete'];
  for (const [pathKey, pathItem] of Object.entries(spec.paths ?? {})) {
    for (const method of methods) {
      const op = pathItem[method];
      if (!isPlainObject(op)) continue;
      op.parameters = Array.isArray(op.parameters) ? op.parameters : [];
      const hasLomiVersion = op.parameters.some(
        (param) =>
          param.$ref === '#/components/parameters/LomiVersion' ||
          param.name === 'Lomi-Version',
      );
      if (!hasLomiVersion) {
        op.parameters.push({ $ref: '#/components/parameters/LomiVersion' });
      }
      if (isMoneyMoving(method, pathKey)) {
        const hasIdempotency = op.parameters.some(
          (param) =>
            param.$ref === '#/components/parameters/IdempotencyKey' ||
            param.name === 'Idempotency-Key',
        );
        if (!hasIdempotency) {
          op.parameters.push({
            $ref: '#/components/parameters/IdempotencyKey',
          });
        }
      }
      op.responses = op.responses ?? {};
      for (const [status, description] of Object.entries(ERROR_STATUSES)) {
        if (!op.responses[status] || !op.responses[status].content) {
          op.responses[status] = errorResponse(description);
        }
      }
      if (pathKey === '/usage/events' && method === 'post') {
        op.responses['202'] = op.responses['202'] ?? {
          description:
            'Accepted. Poll GET /usage/events/{id} until processing_status is processed or failed.',
        };
        op.responses['202'].headers = {
          ...(op.responses['202'].headers ?? {}),
          Location: {
            description: 'Poll this URL for processing_status',
            schema: { type: 'string', example: '/usage/events/evt_123' },
          },
        };
      }
    }
  }
  return spec;
}

function enrichAgentSpec(spec) {
  spec.paths = spec.paths ?? {};
  spec.paths['/.well-known/oauth-authorization-server'] = {
    get: {
      tags: ['OAuth'],
      summary: 'OAuth 2.1 authorization server metadata (RFC 8414)',
      operationId: 'OAuthController_authorizationServerMetadata',
      responses: {
        200: { description: 'Authorization server metadata' },
      },
    },
  };
  spec.paths['/.well-known/openid-configuration'] = {
    get: {
      tags: ['OAuth'],
      summary: 'OpenID Provider metadata alias of RFC 8414',
      operationId: 'OAuthController_openIdConfiguration',
      responses: {
        200: { description: 'OIDC discovery document' },
      },
    },
  };
  spec.paths['/oauth/register'] = {
    post: {
      tags: ['OAuth'],
      summary: 'Dynamic client registration (RFC 7591)',
      operationId: 'OAuthController_registerClient',
      responses: {
        201: { description: 'Registered client' },
      },
    },
  };
  spec.paths['/oauth/token'] = {
    post: {
      tags: ['OAuth'],
      summary: 'OAuth token endpoint',
      operationId: 'OAuthController_token',
      responses: {
        200: { description: 'Token response' },
      },
    },
  };
  return spec;
}

const merchantPath = join(docsRoot, 'openapi.json');
const agentPath = join(docsRoot, 'agent-openapi.json');
const merchant = enrichMerchantSpec(
  JSON.parse(readFileSync(merchantPath, 'utf-8')),
);
const agent = enrichAgentSpec(JSON.parse(readFileSync(agentPath, 'utf-8')));
writeFileSync(merchantPath, `${JSON.stringify(merchant, null, 2)}\n`);
writeFileSync(agentPath, `${JSON.stringify(agent, null, 2)}\n`);
writeFileSync(
  join(websitePublic, 'openapi.json'),
  `${JSON.stringify(merchant, null, 2)}\n`,
);
writeFileSync(
  join(websitePublic, 'agent-openapi.json'),
  `${JSON.stringify(agent, null, 2)}\n`,
);
console.log('enrich-openapi-agent-readiness: ok');
