/* @proprietary license */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDocsInternalLocalePath,
  docsLocaleFromCookieValue,
  isDocsInternalLocalePath,
  isDocsMachinePath,
  parseDocsInternalLocalePath,
  docsLocaleForRequest,
  docsLocaleFromAcceptLanguage,
  parseDocsLang,
} from './docs-routing';

test('parseDocsLang defaults to en', () => {
  assert.equal(parseDocsLang(undefined), 'en');
  assert.equal(parseDocsLang('en'), 'en');
  assert.equal(parseDocsLang('fr'), 'fr');
  assert.equal(parseDocsLang('de'), 'en');
});

test('docsLocaleFromCookieValue', () => {
  assert.equal(docsLocaleFromCookieValue('en'), 'en');
  assert.equal(docsLocaleFromCookieValue('fr'), 'fr');
  assert.equal(docsLocaleFromCookieValue(null), 'en');
});

test('docsLocaleForRequest prefers the cookie, then Accept-Language', () => {
  assert.equal(docsLocaleForRequest('fr', 'en'), 'fr');
  assert.equal(docsLocaleForRequest(null, null), 'en');
  assert.equal(docsLocaleForRequest(undefined, 'fr-FR,fr;q=0.9'), 'fr');
  assert.equal(docsLocaleForRequest(null, 'en-US,en;q=0.9,fr;q=0.8'), 'en');
  assert.equal(docsLocaleFromAcceptLanguage('de, zh;q=0.5'), null);
});

test('internal locale paths', () => {
  assert.equal(
    buildDocsInternalLocalePath('fr', '/start/overview'),
    '/l/fr/start/overview',
  );
  assert.equal(buildDocsInternalLocalePath('en', '/'), '/l/en/start/overview');
  assert.equal(isDocsInternalLocalePath('/l/fr/api'), true);
  assert.equal(isDocsInternalLocalePath('/api'), false);
  assert.deepEqual(parseDocsInternalLocalePath('/l/en/build/cli'), {
    locale: 'en',
    pathname: '/build/cli',
  });
});

test('app route handlers skip the locale rewrite, docs pages under /api do not', () => {
  assert.equal(isDocsMachinePath('/api/ready/supabase'), true);
  assert.equal(isDocsMachinePath('/api/search'), true);
  assert.equal(isDocsMachinePath('/api/readiness'), false);
  assert.equal(isDocsMachinePath('/api/refunds'), false);
});
