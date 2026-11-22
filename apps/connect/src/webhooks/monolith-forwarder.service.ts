import { Injectable, Logger } from '@nestjs/common';

/**
 * Payment-domain events (payment_intent.*, charge.*, dispute) are forwarded
 * verbatim to the monolith, which runs the same handlers as the aggregate
 * rail. The platform signature was already verified here; the monolith trusts
 * the shared internal key instead.
 */
@Injectable()
export class MonolithForwarderService {
  private readonly logger = new Logger(MonolithForwarderService.name);

  async forward(rawBody: Buffer, eventType: string): Promise<void> {
    const baseUrl = process.env.MONOLITH_INTERNAL_URL?.trim();
    const key = process.env.CONNECT_INTERNAL_KEY?.trim();
    if (!baseUrl || !key) {
      this.logger.error(
        `MONOLITH_INTERNAL_URL/CONNECT_INTERNAL_KEY unset; dropping ${eventType}`,
      );
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/webhooks/connect-events`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-connect-key': key,
        },
        body: rawBody.toString('utf8'),
      });
      if (!res.ok) {
        this.logger.error(
          `monolith forward failed for ${eventType}: HTTP ${res.status}`,
        );
      }
    } catch (err) {
      this.logger.error(
        `monolith forward error for ${eventType}: ${(err as Error).message}`,
      );
    }
  }
}
