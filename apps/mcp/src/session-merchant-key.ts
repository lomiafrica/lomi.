import type { Request } from "express";

import { isMcpTransportBearerToken } from "./env-config.js";

export type IsTransportBearerFn = (token: string) => boolean;

export function firstHeaderValue(
  value: string | string[] | undefined,
): string | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0]?.trim() || null;
  return value.trim() || null;
}

/** True for keys issued by our flows (REST secret keys, CLI/MCP connect tokens). */
export function looksLikeLomiApiCredential(token: string): boolean {
  const t = token.trim();
  // OAuth access tokens, provisioning keys, and partner keys have their own extractors.
  if (
    t.startsWith("lomi_oat_") ||
    t.startsWith("lomi_prov_") ||
    t.startsWith("lomi_partner_")
  ) {
    return false;
  }
  return t.startsWith("lomi_") && t.length >= 16;
}

export function looksLikeProvisioningCredential(token: string): boolean {
  return token.trim().startsWith("lomi_prov_");
}

export function looksLikePartnerCredential(token: string): boolean {
  return token.trim().startsWith("lomi_partner_");
}

export function extractSessionProvisioningKey(
  req: Request,
  isTransportBearer: IsTransportBearerFn = isMcpTransportBearerToken,
): string | null {
  const headerKey = firstHeaderValue(req.headers["x-lomi-provisioning-key"]);
  if (headerKey && looksLikeProvisioningCredential(headerKey)) {
    return headerKey;
  }

  const auth = firstHeaderValue(req.headers.authorization);
  if (!auth?.startsWith("Bearer ")) return null;
  const bearer = auth.slice("Bearer ".length).trim();
  if (!bearer || isTransportBearer(bearer)) return null;
  if (looksLikeProvisioningCredential(bearer)) return bearer;
  return null;
}

export function extractSessionPartnerKey(
  req: Request,
  isTransportBearer: IsTransportBearerFn = isMcpTransportBearerToken,
): string | null {
  const headerKey = firstHeaderValue(req.headers["x-lomi-partner-key"]);
  if (headerKey && looksLikePartnerCredential(headerKey)) {
    return headerKey;
  }

  const auth = firstHeaderValue(req.headers.authorization);
  if (!auth?.startsWith("Bearer ")) return null;
  const bearer = auth.slice("Bearer ".length).trim();
  if (!bearer || isTransportBearer(bearer)) return null;
  if (looksLikePartnerCredential(bearer)) return bearer;
  return null;
}

/** Bearer token that may be an OAuth access token (resolved via introspection in HTTP layer). */
export function extractOAuthAccessToken(
  req: Request,
  isTransportBearer: IsTransportBearerFn = isMcpTransportBearerToken,
): string | null {
  const auth = firstHeaderValue(req.headers.authorization);
  if (!auth?.startsWith("Bearer ")) return null;
  const bearer = auth.slice("Bearer ".length).trim();
  if (!bearer || isTransportBearer(bearer)) return null;
  if (bearer.startsWith("lomi_oat_")) return bearer;
  return null;
}

/**
 * Resolves the merchant REST credential for this MCP HTTP session.
 *
 * Precedence:
 * 1. `x-lomi-api-key` / `x-api-key`
 * 2. `Authorization: Bearer <credential>` only when it is **not** one of the hosted MCP
 *    transport bearer secrets (`LOMI_MCP_BEARER_TOKEN`, comma-separated when rotating)
 *    and looks like a `lomi_*` API credential.
 *
 * When transport bearer token(s) are set, clients should prefer headers for the merchant key
 * because `Authorization` is reserved for the MCP transport gate.
 */
export function extractSessionMerchantApiKey(
  req: Request,
  isTransportBearer: IsTransportBearerFn = isMcpTransportBearerToken,
): string | null {
  const headerKey =
    firstHeaderValue(req.headers["x-lomi-api-key"]) ??
    firstHeaderValue(req.headers["x-api-key"]);
  // Reject arbitrary header strings — only accept shaped lomi. credentials.
  if (headerKey && looksLikeLomiApiCredential(headerKey)) return headerKey;

  const auth = firstHeaderValue(req.headers.authorization);
  if (!auth?.startsWith("Bearer ")) return null;
  const bearer = auth.slice("Bearer ".length).trim();
  if (!bearer) return null;
  if (isTransportBearer(bearer)) return null;
  if (looksLikeLomiApiCredential(bearer)) return bearer;
  return null;
}
