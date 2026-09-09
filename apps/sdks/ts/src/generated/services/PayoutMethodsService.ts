/**
 * PayoutMethodsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class PayoutMethodsService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Add payout method
     * @see OpenAPI `PayoutMethodsController_create`
     */
    public async create(options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/payout-methods',
            ...options,
        });
    }

    /**
     * List payout methods
     * @see OpenAPI `PayoutMethodsController_list`
     */
    public async list(options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/payout-methods',
            ...options,
        });
    }

    /**
     * Auto-paginate all pages from `list`.
     */
    public async *listAll(
        options?: import("../../request-options.js").LomiRequestOptions,
    ): AsyncGenerator<unknown, void, undefined> {
        let page = 1;
        const pageSize = 50;

        while (true) {
            const response = await requestWithClient<unknown>(this.client, {
                method: 'GET',
                url: '/payout-methods',
                query: { page, pageSize },
                ...options,
            });

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
