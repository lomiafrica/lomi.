import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role client. This service is the only writer of the acquiring
 * tables; the monolith reads them through RPCs. Never expose this key.
 */
@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !key) {
      throw new ServiceUnavailableException(
        'connect service is not configured',
      );
    }
    this.client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  from(table: string) {
    return this.client.from(table);
  }

  async rpcJson<T = unknown>(fn: string, args: Record<string, unknown>) {
    const { data, error } = await this.client.rpc(fn, args);
    if (error) {
      throw new Error(`${fn}: ${error.message}`);
    }
    return data as T;
  }
}
