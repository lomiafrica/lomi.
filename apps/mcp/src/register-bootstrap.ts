import {
  isJsonObject,
  isString,
  parseJson,
  readNumber,
  readString,
  solveAgentRegisterPow,
  type JsonValue,
} from '@lomi./shared';
import { getLomiApiBaseUrl } from './env-config.js';

const REGISTER_ATTEMPTS = 3;

type JsonObjectLike = { [key: string]: string };

export type RegisterHttpResult = {
  ok: boolean;
  status: number;
  body: JsonValue;
};

function isRetryablePowFailure(status: number, body: JsonValue): boolean {
  if (status === 429) return false;
  if (status !== 400) return false;
  if (!isJsonObject(body)) return true;
  const nested = isJsonObject(body.error) ? body.error : null;
  const code =
    (nested ? readString(nested, 'code') : undefined) ??
    readString(body, 'error_code') ??
    readString(body, 'code');
  if (!code) return true;
  return (
    code === 'pow_required' ||
    code === 'invalid_challenge' ||
    code === 'expired_challenge' ||
    code === 'insufficient_work' ||
    code === 'pow_reused' ||
    code === 'ip_mismatch'
  );
}

async function postJson(
  path: string,
  body?: JsonObjectLike,
): Promise<RegisterHttpResult> {
  const url = `${getLomiApiBaseUrl()}${path}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : '{}',
  });
  const text = await response.text();
  let parsed: JsonValue;
  try {
    parsed = parseJson(text);
  } catch {
    parsed = text;
  }
  return {
    ok: response.ok,
    status: response.status,
    body: parsed,
  };
}

/** Challenge + easy PoW + register, with a few fresh-challenge retries. */
export async function registerBootstrapAgent(
  label: string,
): Promise<RegisterHttpResult> {
  let last: RegisterHttpResult = {
    ok: false,
    status: 500,
    body: { error: 'Register failed' },
  };

  for (let attempt = 0; attempt < REGISTER_ATTEMPTS; attempt += 1) {
    const challenge = await postJson('/agent/register/challenge');
    if (!challenge.ok || !isJsonObject(challenge.body)) {
      last = challenge;
      if (challenge.status === 429) return challenge;
      continue;
    }

    const challengeId = readString(challenge.body, 'challenge_id');
    const difficulty = readNumber(challenge.body, 'difficulty');
    if (!challengeId || difficulty === undefined) {
      last = {
        ok: false,
        status: challenge.status,
        body: { error: 'Invalid register challenge response' },
      };
      continue;
    }

    let nonce: string;
    try {
      nonce = solveAgentRegisterPow(challengeId, difficulty);
    } catch {
      last = {
        ok: false,
        status: 500,
        body: { error: 'Failed to solve register proof-of-work' },
      };
      continue;
    }

    const result = await postJson('/agent/register', {
      label,
      challenge_id: challengeId,
      nonce,
    });
    last = result;
    if (result.ok) return result;
    if (!isRetryablePowFailure(result.status, result.body)) return result;
  }

  return last;
}

export function extractBootstrapProvisioningKey(body: JsonValue): string | null {
  if (!isJsonObject(body)) return null;
  const key = readString(body, 'key');
  if (key && key.startsWith('lomi_prov_')) return key;
  return isString(key) ? key : null;
}
