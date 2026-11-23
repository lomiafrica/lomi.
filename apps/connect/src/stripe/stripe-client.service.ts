import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import Stripe from "stripe";

export type ConnectEnvironment = "live" | "test";

const STRIPE_API_VERSION =
  // SAFETY: pinned Stripe API version string narrowed to the SDK's version union.
  "2025-11-17.clover" as Stripe.StripeConfig["apiVersion"];

export function normalizeEnvironment(
  value?: string | null,
): ConnectEnvironment {
  return value === "live" ? "live" : "test";
}

/**
 * Dual keys like apps/api: test mode prefers STRIPE_CONNECT_SECRET_KEY_TEST,
 * live mode prefers STRIPE_CONNECT_SECRET_KEY. In production, test mode does
 * not fall back to the live secret. These keys belong to the platform account
 * (lomi. Inc) only — never the aggregate rail's keys.
 */
export function resolveConnectSecretKey(
  environment?: string | null,
): string | undefined {
  const env = normalizeEnvironment(environment);
  const testKey = process.env.STRIPE_CONNECT_SECRET_KEY_TEST?.trim();
  const liveKey = process.env.STRIPE_CONNECT_SECRET_KEY?.trim();

  if (env === "test") {
    if (testKey) {
      return testKey;
    }
    if (process.env.NODE_ENV === "production") {
      return undefined;
    }
    return liveKey;
  }
  return liveKey || testKey;
}

export function resolveConnectWebhookSecrets(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of [
    process.env.STRIPE_CONNECT_WEBHOOK_SECRET,
    process.env.STRIPE_CONNECT_WEBHOOK_SECRET_TEST,
  ]) {
    const secret = raw?.trim();
    if (secret && !seen.has(secret)) {
      seen.add(secret);
      out.push(secret);
    }
  }
  return out;
}

@Injectable()
export class StripeClientService {
  private readonly logger = new Logger(StripeClientService.name);
  private readonly clients = new Map<ConnectEnvironment, Stripe>();

  getClient(environment?: string | null): Stripe {
    const env = normalizeEnvironment(environment);
    const cached = this.clients.get(env);
    if (cached) {
      return cached;
    }

    const secretKey = resolveConnectSecretKey(env);
    if (!secretKey) {
      this.logger.error(
        `Platform card credentials are missing for the "${env}" environment on this connect instance.`,
      );
      throw new ServiceUnavailableException(
        "Card onboarding is temporarily unavailable.",
      );
    }

    const client = new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION });
    this.clients.set(env, client);
    return client;
  }

  /** Webhook follow-up calls after signature verify (uses event.livemode). */
  getClientForLivemode(livemode: boolean): Stripe | undefined {
    try {
      return this.getClient(livemode ? "live" : "test");
    } catch {
      this.logger.warn(
        `Platform secret not configured for livemode=${livemode}`,
      );
      return undefined;
    }
  }

  constructWebhookEvent(
    rawBody: Buffer | string,
    signature: string,
  ): Stripe.Event {
    const secrets = resolveConnectWebhookSecrets();
    if (secrets.length === 0) {
      throw new Error("No platform webhook secrets configured");
    }

    let lastError: unknown;
    for (const secret of secrets) {
      try {
        return Stripe.webhooks.constructEvent(rawBody, signature, secret);
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error("Platform webhook signature verification failed");
  }
}
