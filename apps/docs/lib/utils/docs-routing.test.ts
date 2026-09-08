/* @proprietary license */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDocsInternalLocalePath,
  docsLocaleFromCookieValue,
  isDocsInternalLocalePath,
  parseDocsInternalLocalePath,
  parseDocsLang,
} from './docs-routing';

test('parseDocsLang defaults to fr', () => {
  assert.equal(parseDocsLang(undefined), 'fr');
  assert.equal(parseDocsLang('en'), 'en');
  assert.equal(parseDocsLang('de'), 'fr');
});

test('docsLocaleFromCookieValue', () => {
  assert.equal(docsLocaleFromCookieValue('en'), 'en');
  assert.equal(docsLocaleFromCookieValue(null), 'fr');
});

test('internal locale paths', () => {
  assert.equal(
    buildDocsInternalLocalePath('fr', '/start/overview'),
    '/l/fr/start/overview',
  );
  assert.equal(
    buildDocsInternalLocalePath('en', '/'),
    '/l/en/start/overview',
  );
  assert.equal(isDocsInternalLocalePath('/l/fr/api'), true);
  assert.equal(isDocsInternalLocalePath('/api'), false);
  assert.deepEqual(parseDocsInternalLocalePath('/l/en/build/cli'), {
    locale: 'en',
    pathname: '/build/cli',
  });
});
