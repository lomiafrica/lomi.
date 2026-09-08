import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import { isFunction } from "@lomi./shared";

export type MerchantAccessLevel = 'read' | 'write' | 'full';

export type SessionRegistryEntry = {
  transport: StreamableHTTPServerTransport;
  lastActivity: number;
  merchantApiKey: string | null;
  provisioningApiKey: string | null;
  partnerApiKey: string | null;
  merchantAccessLevel: MerchantAccessLevel;
  credentialFingerprint: string | null;
  clientIp: string | null;
};

/**
 * Bounded in-memory registry for streamable MCP HTTP sessions.
 */
export class McpSessionRegistry {
  private readonly sessions = new Map<string, SessionRegistryEntry>();
  private pruneTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly maxSessions: number,
    private readonly ttlMs: number,
    private readonly maxSessionsPerKey: number = 8,
    private readonly maxSessionsPerIp: number = 20,
  ) {}

  get size(): number {
    return this.sessions.size;
  }

  /** Start periodic idle session eviction (call once at HTTP server startup). */
  startPeriodicPrune(intervalMs: number = 60_000): void {
    if (this.pruneTimer) return;
    this.pruneTimer = setInterval(() => {
      this.prune();
    }, intervalMs);
    if (isFunction(this.pruneTimer.unref)) {
      this.pruneTimer.unref();
    }
  }

  stopPeriodicPrune(): void {
    if (this.pruneTimer) {
      clearInterval(this.pruneTimer);
      this.pruneTimer = null;
    }
  }

  /** Remove idle sessions past TTL; closes transports. */
  prune(now: number = Date.now()): void {
    for (const [id, entry] of this.sessions) {
      if (now - entry.lastActivity > this.ttlMs) {
        void entry.transport.close();
        this.sessions.delete(id);
      }
    }
  }

  touch(sessionId: string, now: number = Date.now()): void {
    const e = this.sessions.get(sessionId);
    if (e) e.lastActivity = now;
  }

  updateMerchantApiKey(sessionId: string, apiKey: string | null): void {
    const e = this.sessions.get(sessionId);
    if (!e || !apiKey) return;
    e.merchantApiKey = apiKey;
  }

  updateMerchantAccessLevel(
    sessionId: string,
    accessLevel: MerchantAccessLevel,
  ): void {
    const e = this.sessions.get(sessionId);
    if (!e) return;
    e.merchantAccessLevel = accessLevel;
  }

  getMerchantAccessLevel(sessionId: string): MerchantAccessLevel {
    return this.sessions.get(sessionId)?.merchantAccessLevel ?? 'full';
  }

  updateProvisioningApiKey(sessionId: string, apiKey: string | null): void {
    const e = this.sessions.get(sessionId);
    if (!e || !apiKey) return;
    e.provisioningApiKey = apiKey;
  }

  getProvisioningApiKey(sessionId: string): string | null {
    return this.sessions.get(sessionId)?.provisioningApiKey ?? null;
  }

  updatePartnerApiKey(sessionId: string, apiKey: string | null): void {
    const e = this.sessions.get(sessionId);
    if (!e || !apiKey) return;
    e.partnerApiKey = apiKey;
  }

  getPartnerApiKey(sessionId: string): string | null {
    return this.sessions.get(sessionId)?.partnerApiKey ?? null;
  }

  getMerchantApiKey(sessionId: string): string | null {
    return this.sessions.get(sessionId)?.merchantApiKey ?? null;
  }

  countByFingerprint(fingerprint: string): number {
    let n = 0;
    for (const entry of this.sessions.values()) {
      if (entry.credentialFingerprint === fingerprint) n += 1;
    }
    return n;
  }

  countByIp(clientIp: string): number {
    let n = 0;
    for (const entry of this.sessions.values()) {
      if (entry.clientIp === clientIp) n += 1;
    }
    return n;
  }

  canAcceptSessionFor(
    fingerprint: string | null,
    clientIp: string | null,
    now: number = Date.now(),
  ): { ok: true } | { ok: false; reason: 'max_sessions' | 'max_per_key' | 'max_per_ip' } {
    if (!this.canAcceptNewSession(now)) {
      return { ok: false, reason: 'max_sessions' };
    }
    if (fingerprint && this.countByFingerprint(fingerprint) >= this.maxSessionsPerKey) {
      return { ok: false, reason: 'max_per_key' };
    }
    if (clientIp && this.countByIp(clientIp) >= this.maxSessionsPerIp) {
      return { ok: false, reason: 'max_per_ip' };
    }
    return { ok: true };
  }

  drop(sessionId: string): void {
    const entry = this.sessions.get(sessionId);
    if (!entry) return;
    void entry.transport.close();
    this.sessions.delete(sessionId);
  }

  /**
   * After prune: true if a brand-new session may be created.
   */
  canAcceptNewSession(now: number = Date.now()): boolean {
    this.prune(now);
    return this.sessions.size < this.maxSessions;
  }

  has(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }

  get(sessionId: string): SessionRegistryEntry | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Attach transport after session id is assigned (onsessioninitialized).
   */
  attachSession(
    sessionId: string,
    transport: StreamableHTTPServerTransport,
    merchantApiKey: string | null,
    provisioningApiKey: string | null = null,
    merchantAccessLevel: MerchantAccessLevel = 'full',
    partnerApiKey: string | null = null,
    credentialFingerprint: string | null = null,
    clientIp: string | null = null,
  ): void {
    this.sessions.set(sessionId, {
      transport,
      lastActivity: Date.now(),
      merchantApiKey,
      provisioningApiKey,
      partnerApiKey,
      merchantAccessLevel,
      credentialFingerprint,
      clientIp,
    });
    transport.onclose = () => {
      this.sessions.delete(sessionId);
    };
  }
}
