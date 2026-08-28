import {
  isJsonObject,
  isString,
  readString,
  validateJsonValue,
  type JsonInputObject,
  type JsonValue,
} from "@lomi./shared";

export class ProviderApiError extends Error {
  code?: string;
}

function trimTrailingSlashes(url: string): string {
  let end = url.length;
  while (end > 0 && url.charCodeAt(end - 1) === 47) {
    end -= 1;
  }
  return url.slice(0, end);
}

export type ProviderAuthClient = {
  auth: {
    getSession: () => Promise<{
      data: { session: { access_token: string } | null };
    }>;
  };
};

type ProviderRequestHeaders = {
  "Content-Type": string;
  apikey?: string;
  Authorization?: string;
};

async function authHeaders(
  supabase: ProviderAuthClient,
  publishableKey: string,
): Promise<ProviderRequestHeaders> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const headers: ProviderRequestHeaders = {
    "Content-Type": "application/json",
  };
  if (publishableKey) {
    headers.apikey = publishableKey;
  }
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  } else if (publishableKey) {
    headers.Authorization = `Bearer ${publishableKey}`;
  }
  return headers;
}

function errorFromPayload(payload: JsonValue | null, status: number): string {
  if (isJsonObject(payload)) {
    const nested = payload.error;
    if (isString(nested)) return nested;
    if (isJsonObject(nested)) {
      const message = readString(nested, "message");
      if (message) return message;
    }
    const message = readString(payload, "message");
    if (message) return message;
  }
  return `Provider request failed (${status})`;
}

export async function postLomiProvider(
  provider: "wave" | "mtn" | "mtn-sync",
  body: JsonInputObject,
  deps: {
    supabase: ProviderAuthClient;
    publishableKey?: string;
    apiBaseUrl?: string;
  },
): Promise<JsonValue> {
  const apiBaseUrl = trimTrailingSlashes(
    deps.apiBaseUrl ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://api.lomi.africa",
  );
  const publishableKey = deps.publishableKey ?? "";

  const response = await fetch(`${apiBaseUrl}/providers/${provider}`, {
    method: "POST",
    headers: await authHeaders(deps.supabase, publishableKey),
    body: JSON.stringify(body),
  });
  const raw = await response.text();
  let payload: JsonValue | null = null;
  if (raw) {
    try {
      payload = validateJsonValue(JSON.parse(raw));
    } catch {
      payload = raw;
    }
  }
  if (!response.ok) {
    const err = new ProviderApiError(
      errorFromPayload(payload, response.status),
    );
    if (isJsonObject(payload)) {
      err.code = readString(payload, "code");
    }
    throw err;
  }
  if (payload === null) {
    throw new ProviderApiError("Empty provider response");
  }
  return payload;
}
