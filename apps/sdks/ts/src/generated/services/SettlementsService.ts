/**
 * SettlementsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class SettlementsService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Request an instant settlement (Nitro)
     * @see OpenAPI `SettlementsController_createInstant`
     */
    public async createInstant(body: components['schemas']['CreateInstantSettlementDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/settlements/instant',
            body,
            ...options,
        });
    }

    /**
     * List settlement periods
     * @see OpenAPI `SettlementsController_findAll`
     */
    public async findAll(params?: paths['/settlements']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/settlements',
            query: params,
            ...options,
        });
    }

    /**
     * Auto-paginate all pages from `findAll`.
     */
    public async *findAllAll(
        params?: paths['/settlements']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
        options?: import("../../request-options.js").LomiRequestOptions,
    ): AsyncGenerator<unknown, void, undefined> {
        let page = (params as { page?: number } | undefined)?.page ?? 1;
        const pageSize = (params as { pageSize?: number } | undefined)?.pageSize ?? 50;

        while (true) {
            const response = await this.findAll(
                { ...params, page, pageSize } as paths['/settlements']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
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

    /**
     * List settlement transactions
     * @see OpenAPI `SettlementsController_findTransactions`
     */
    public async findTransactions(id: string, params?: paths['/settlements/{id}/transactions']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/settlements/{id}/transactions',
            path: { id: id },
            query: params,
            ...options,
        });
    }

    /**
     * Get an instant settlement (Nitro request)
     * @see OpenAPI `SettlementsController_getInstant`
     */
    public async getInstant(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/settlements/instant/{id}',
            path: { id: id },
            ...options,
        });
    }
}
