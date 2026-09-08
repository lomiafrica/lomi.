import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { McpSessionRegistry } from '../src/session-registry.js';

type MockTransport = {
  close: ReturnType<typeof vi.fn>;
  onclose: (() => void) | undefined;
};

function mockTransport(): StreamableHTTPServerTransport {
  const transport: MockTransport = {
    close: vi.fn().mockResolvedValue(undefined),
    onclose: undefined,
  };
  // SAFETY: Test double implements the transport methods used by the registry.
  return transport as StreamableHTTPServerTransport;
}

describe('McpSessionRegistry', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: 0 });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('prunes idle sessions past TTL', () => {
    const registry = new McpSessionRegistry(10, 60_000);
    const t1 = mockTransport();
    const t2 = mockTransport();
    registry.attachSession('s1', t1, null);
    registry.attachSession('s2', t2, null);
    expect(registry.size).toBe(2);

    vi.advanceTimersByTime(61_000);
    registry.prune();
    expect(t1.close).toHaveBeenCalled();
    expect(t2.close).toHaveBeenCalled();
    expect(registry.size).toBe(0);
  });

  it('canAcceptNewSession is false when at capacity', () => {
    const registry = new McpSessionRegistry(2, 60_000);
    registry.attachSession('a', mockTransport(), null);
    registry.attachSession('b', mockTransport(), null);
    expect(registry.canAcceptNewSession()).toBe(false);
  });

  it('touch updates activity and prevents prune', () => {
    const registry = new McpSessionRegistry(10, 60_000);
    const t = mockTransport();
    registry.attachSession('s1', t, null);
    vi.advanceTimersByTime(50_000);
    registry.touch('s1');
    vi.advanceTimersByTime(50_000);
    registry.prune();
    expect(t.close).not.toHaveBeenCalled();
    expect(registry.has('s1')).toBe(true);
  });

  it('periodic prune evicts idle sessions', () => {
    const registry = new McpSessionRegistry(10, 60_000);
    const t = mockTransport();
    registry.attachSession('s1', t, null);
    registry.startPeriodicPrune(1_000);
    vi.advanceTimersByTime(61_000);
    vi.advanceTimersByTime(1_000);
    expect(t.close).toHaveBeenCalled();
    registry.stopPeriodicPrune();
  });

  it('stores and updates merchant API key', () => {
    const registry = new McpSessionRegistry(10, 60_000);
    registry.attachSession('s1', mockTransport(), 'key-a');
    expect(registry.getMerchantApiKey('s1')).toBe('key-a');
    registry.updateMerchantApiKey('s1', 'key-b');
    expect(registry.getMerchantApiKey('s1')).toBe('key-b');
  });

  it('rejects a new session when the per-key cap is reached', () => {
    const registry = new McpSessionRegistry(10, 60_000, 1, 20);
    registry.attachSession(
      's1',
      mockTransport(),
      'key-a',
      null,
      'full',
      null,
      'fp-a',
      '127.0.0.1',
    );
    expect(registry.canAcceptSessionFor('fp-a', '10.0.0.2').ok).toBe(false);
    expect(registry.canAcceptSessionFor('fp-b', '10.0.0.2').ok).toBe(true);
  });
});
