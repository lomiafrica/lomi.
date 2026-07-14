import axios, { type AxiosRequestConfig } from 'axios';
import type { HttpMethod, HttpResponse } from './types';

export interface EdgeFunctionsClientOptions {
  supabaseUrl: string;
  anonKey: string;
  timeoutMs?: number;
}

export class EdgeFunctionsClient {
  private readonly baseUrl: string;
  private readonly anonKey: string;
  private readonly timeoutMs: number;

  constructor(options: EdgeFunctionsClientOptions) {
    this.baseUrl = options.supabaseUrl.replace(/\/$/, '');
    this.anonKey = options.anonKey;
    this.timeoutMs = options.timeoutMs ?? 30_000;
  }

  functionUrl(functionName: string): string {
    return `${this.baseUrl}/functions/v1/${functionName}`;
  }

  async invoke(
    functionName: string,
    method: HttpMethod,
    options?: {
      body?: unknown;
      headers?: Record<string, string>;
      auth?: boolean;
    },
  ): Promise<HttpResponse> {
    const url = this.functionUrl(functionName);
    const auth = options?.auth !== false;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      apikey: this.anonKey,
      ...(options?.body !== undefined
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(options?.headers ?? {}),
    };

    if (auth) {
      headers.Authorization = `Bearer ${this.anonKey}`;
    }

    const config: AxiosRequestConfig = {
      method,
      url,
      headers,
      data: options?.body,
      timeout: this.timeoutMs,
      validateStatus: () => true,
    };

    const started = Date.now();
    const response = await axios.request(config);
    const latencyMs = Date.now() - started;

    const responseHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(response.headers)) {
      if (typeof value === 'string') {
        responseHeaders[key.toLowerCase()] = value;
      }
    }

    return {
      status: response.status,
      data: response.data,
      latencyMs,
      headers: responseHeaders,
    };
  }
}
