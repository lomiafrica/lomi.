import { describe, expect, it } from 'vitest';
import {
  fingerprintSessionCredential,
  fingerprintsEqual,
} from '../src/session-credential.js';

describe('session credential fingerprints', () => {
  it('binds guest sessions to client IP, ignoring keys', () => {
    const a = fingerprintSessionCredential({
      guest: true,
      clientIp: '1.1.1.1',
      merchantKey: 'lomi_sk_test_a',
      provisioningKey: null,
      partnerKey: null,
      oauthToken: null,
    });
    const b = fingerprintSessionCredential({
      guest: true,
      clientIp: '1.1.1.1',
      merchantKey: null,
      provisioningKey: null,
      partnerKey: null,
      oauthToken: null,
    });
    const otherIp = fingerprintSessionCredential({
      guest: true,
      clientIp: '8.8.8.8',
      merchantKey: null,
      provisioningKey: null,
      partnerKey: null,
      oauthToken: null,
    });
    expect(fingerprintsEqual(a, b)).toBe(true);
    expect(fingerprintsEqual(a, otherIp)).toBe(false);
  });

  it('binds authenticated sessions to the presented secret', () => {
    const a = fingerprintSessionCredential({
      guest: false,
      clientIp: '1.1.1.1',
      merchantKey: 'lomi_sk_test_a',
      provisioningKey: null,
      partnerKey: null,
      oauthToken: null,
    });
    const b = fingerprintSessionCredential({
      guest: false,
      clientIp: '9.9.9.9',
      merchantKey: 'lomi_sk_test_a',
      provisioningKey: null,
      partnerKey: null,
      oauthToken: null,
    });
    const otherKey = fingerprintSessionCredential({
      guest: false,
      clientIp: '1.1.1.1',
      merchantKey: 'lomi_sk_test_b',
      provisioningKey: null,
      partnerKey: null,
      oauthToken: null,
    });
    expect(fingerprintsEqual(a, b)).toBe(true);
    expect(fingerprintsEqual(a, otherKey)).toBe(false);
  });
});
