/* @proprietary license */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getTryItOperation, resolvePathTemplate } from './operation-tryit';

test('builds a sandbox Try-it operation from OpenAPI JSON', () => {
  const operation = getTryItOperation(
    {
      paths: {
        '/checkout-sessions': {
          post: {
            requestBody: {
              content: {
                'application/json': {
                  example: { product_id: 'prod_1' },
                },
              },
            },
          },
        },
      },
    },
    'POST',
    '/checkout-sessions',
  );
  assert.ok(operation);
  assert.equal(operation.method, 'post');
  assert.equal(operation.hasBody, true);
  assert.equal(operation.sandboxOrigin, 'https://sandbox.api.lomi.africa');
  assert.match(operation.exampleBody ?? '', /prod_1/);
});

test('builds a different body from each operation schema', () => {
  const document = {
    components: {
      schemas: {
        CreateRefund: {
          type: 'object',
          required: ['transaction_id', 'amount'],
          properties: {
            transaction_id: { type: 'string', format: 'uuid' },
            amount: { type: 'number' },
            confirmation_token: { type: 'string' },
          },
        },
        CreateWebhook: {
          type: 'object',
          required: ['url', 'events'],
          properties: {
            url: {
              type: 'string',
              example: 'https://example.com/webhooks/lomi',
            },
            events: {
              type: 'array',
              example: ['PAYMENT_SUCCEEDED'],
              items: { type: 'string' },
            },
          },
        },
      },
    },
    paths: {
      '/refunds': {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateRefund' },
              },
            },
          },
        },
      },
      '/webhooks': {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateWebhook' },
              },
            },
          },
        },
      },
    },
  };
  const refund = getTryItOperation(document, 'POST', '/refunds');
  const webhook = getTryItOperation(document, 'POST', '/webhooks');
  assert.ok(refund?.exampleBody);
  assert.ok(webhook?.exampleBody);
  assert.match(refund.exampleBody, /transaction_id/);
  assert.match(refund.exampleBody, /10000/);
  assert.doesNotMatch(refund.exampleBody, /confirmation_token/);
  assert.match(webhook.exampleBody, /PAYMENT_SUCCEEDED/);
  assert.notEqual(refund.exampleBody, webhook.exampleBody);
});

test('resolves path templates without leaving the sandbox origin', () => {
  assert.equal(
    resolvePathTemplate('/customers/{id}', { id: 'cus_1' }),
    '/customers/cus_1',
  );
  const operation = getTryItOperation(
    {
      paths: {
        '/customers/{id}': {
          get: {},
        },
      },
    },
    'get',
    '/customers/{id}',
  );
  assert.ok(operation);
  assert.deepEqual(operation.pathParams, ['id']);
  assert.equal(operation.hasBody, false);
});
