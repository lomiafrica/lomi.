/**
 * PayoutsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class PayoutsService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Create payout
     * @see OpenAPI `PayoutsUnifiedController_create`
     */
    public async create(body: components['schemas']['CreatePayoutDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['CreatePayoutResponseDto']> {
        return requestWithClient<components['schemas']['CreatePayoutResponseDto']>(this.client, {
            method: 'POST',
            url: '/payouts',
            body,
            ...options,
        });
    }

    /**
     * Get payout
     * @see OpenAPI `PayoutsUnifiedController_findOne`
     */
    public async get(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/payouts/{id}',
            path: { id: id },
            ...options,
        });
    }

    /**
     * List payouts
     * @see OpenAPI `PayoutsUnifiedController_findAll`
     */
    public async list(params?: paths['/payouts']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/payouts',
            query: params,
            ...options,
        });
    }

    /**
     * Auto-paginate all pages from `list`.
     */
    public async *listAll(
        params?: paths['/payouts']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
        options?: import("../../request-options.js").LomiRequestOptions,
    ): AsyncGenerator<unknown, void, undefined> {
        let page = (params as { page?: number } | undefined)?.page ?? 1;
        const pageSize = (params as { pageSize?: number } | undefined)?.pageSize ?? 50;

        while (true) {
            const response = await this.list(
                { ...params, page, pageSize } as paths['/payouts']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
                options,
            );

            const items =
                (response as { data?: unknown[] })?.data ??
                (response as { items?: unknown[] })?.items;

            if (!Array.isArray(items) || items.length === 0) {
                break;
            }

            for (const item of items) {
                yield item;
            }

            if (items.length < pageSize) {
                break;
            }

            page += 1;
        }
    }
}
