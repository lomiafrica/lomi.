import {
  sanitizeLogPayload,
  isHeavyOrSensitiveLogPath,
} from './api-log-payload';

describe('api-log-payload', () => {
  it('redacts card and webhook secrets on sensitive paths', () => {
    const result = sanitizeLogPayload('/charge/card', {
      pan: '4111111111111111',
      cvv: '123',
      amount: 1000,
    });
    expect(result.pan).toBe('[REDACTED]');
    expect(result.cvv).toBe('[REDACTED]');
    expect(result.amount).toBe(1000);
  });

  it('redacts webhook secrets', () => {
    const result = sanitizeLogPayload('/webhooks', {
      url: 'https://example.com',
      secret: 'whsec_abc',
    });
    expect(result.secret).toBe('[REDACTED]');
  });

  it('truncates oversized payloads', () => {
    const result = sanitizeLogPayload('/products', {
      blob: 'x'.repeat(5000),
    });
    expect(result._truncated).toBe(true);
    expect(result.original_length).toBeGreaterThan(4000);
  });

  it('flags heavy paths', () => {
    expect(isHeavyOrSensitiveLogPath('/checkout-sessions')).toBe(true);
    expect(isHeavyOrSensitiveLogPath('/checkout/v1/gim/pay')).toBe(true);
    expect(isHeavyOrSensitiveLogPath('/charge/switch')).toBe(true);
    expect(isHeavyOrSensitiveLogPath('/transactions')).toBe(false);
  });

  it('redacts card fields on switch and gim checkout paths', () => {
    for (const path of ['/charge/switch', '/checkout/v1/gim/pay']) {
      const result = sanitizeLogPayload(path, {
        pan: '4221941234569109',
        cvv: '123',
        amount: 5000,
      });
      expect(result.pan).toBe('[REDACTED]');
      expect(result.cvv).toBe('[REDACTED]');
      expect(result.amount).toBe(5000);
    }
  });
});
