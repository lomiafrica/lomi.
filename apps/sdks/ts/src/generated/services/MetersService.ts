/**
 * MetersService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class MetersService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Create a meter
     * @see OpenAPI `MetersController_create`
     */
    public async create(body: components['schemas']['CreateMeterDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['MeterResponseDto']> {
        return requestWithClient<components['schemas']['MeterResponseDto']>(this.client, {
            method: 'POST',
            url: '/meters',
            body,
            ...options,
        });
    }

    /**
     * Get a meter
     * @see OpenAPI `MetersController_findOne`
     */
    public async get(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['MeterResponseDto']> {
        return requestWithClient<components['schemas']['MeterResponseDto']>(this.client, {
            method: 'GET',
            url: '/meters/{id}',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Get meter balance for a customer
     * @see OpenAPI `MetersController_getBalance`
     */
    public async getCustomerBalance(id: string, customerId: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['MeterBalanceResponseDto']> {
        return requestWithClient<components['schemas']['MeterBalanceResponseDto']>(this.client, {
            method: 'GET',
            url: '/meters/{id}/balances/{customerId}',
            path: { id: id, customerId: customerId },
            ...options,
        });
    }

    /**
     * List meters
     * @see OpenAPI `MetersController_findAll`
     */
    public async list(params?: paths['/meters']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<(NonNullable<NonNullable<paths['/meters']['get']['responses'][200]>['content']>['application/json'])> {
        return requestWithClient<(NonNullable<NonNullable<paths['/meters']['get']['responses'][200]>['content']>['application/json'])>(this.client, {
            method: 'GET',
            url: '/meters',
            query: params,
            ...options,
        });
    }

    /**
     * Auto-paginate all pages from `list`.
     */
    public async *listAll(
        params?: paths['/meters']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
        options?: import("../../request-options.js").LomiRequestOptions,
    ): AsyncGenerator<unknown, void, undefined> {
        let page = (params as { page?: number } | undefined)?.page ?? 1;
        const pageSize = (params as { pageSize?: number } | undefined)?.pageSize ?? 50;

        while (true) {
            const response = await this.list(
                { ...params, page, pageSize } as paths['/meters']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
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
     * Update a meter
     * @see OpenAPI `MetersController_update`
     */
    public async update(id: string, body: components['schemas']['UpdateMeterDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['MeterResponseDto']> {
        return requestWithClient<components['schemas']['MeterResponseDto']>(this.client, {
            method: 'PATCH',
            url: '/meters/{id}',
            path: { id: id },
            body,
            ...options,
        });
    }
}
