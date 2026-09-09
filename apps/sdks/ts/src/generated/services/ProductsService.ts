/**
 * ProductsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class ProductsService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Add product price
     * @see OpenAPI `ProductsController_addPrice`
     */
    public async addPrice(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['PriceResponseDto']> {
        return requestWithClient<components['schemas']['PriceResponseDto']>(this.client, {
            method: 'POST',
            url: '/products/{id}/prices',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Archive product
     * @see OpenAPI `ProductsController_archive`
     */
    public async archive(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'DELETE',
            url: '/products/{id}',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Create product
     * @see OpenAPI `ProductsController_create`
     */
    public async create(options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['ProductResponseDto']> {
        return requestWithClient<components['schemas']['ProductResponseDto']>(this.client, {
            method: 'POST',
            url: '/products',
            ...options,
        });
    }

    /**
     * Retrieve product
     * @see OpenAPI `ProductsController_findOne`
     */
    public async get(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['ProductResponseDto']> {
        return requestWithClient<components['schemas']['ProductResponseDto']>(this.client, {
            method: 'GET',
            url: '/products/{id}',
            path: { id: id },
            ...options,
        });
    }

    /**
     * List products
     * @see OpenAPI `ProductsController_findAll`
     */
    public async list(params?: paths['/products']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<(NonNullable<NonNullable<paths['/products']['get']['responses'][200]>['content']>['application/json'])> {
        return requestWithClient<(NonNullable<NonNullable<paths['/products']['get']['responses'][200]>['content']>['application/json'])>(this.client, {
            method: 'GET',
            url: '/products',
            query: params,
            ...options,
        });
    }

    /**
     * Auto-paginate all pages from `list`.
     */
    public async *listAll(
        params?: paths['/products']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
        options?: import("../../request-options.js").LomiRequestOptions,
    ): AsyncGenerator<unknown, void, undefined> {
        let page = (params as { page?: number } | undefined)?.page ?? 1;
        const pageSize = (params as { pageSize?: number } | undefined)?.pageSize ?? 50;

        while (true) {
            const response = await this.list(
                { ...params, page, pageSize } as paths['/products']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
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
     * Set default price
     * @see OpenAPI `ProductsController_setDefaultPrice`
     */
    public async setDefaultPrice(id: string, priceId: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['ProductResponseDto']> {
        return requestWithClient<components['schemas']['ProductResponseDto']>(this.client, {
            method: 'POST',
            url: '/products/{id}/prices/{priceId}/default',
            path: { id: id, priceId: priceId },
            ...options,
        });
    }

    /**
     * Update product
     * @see OpenAPI `ProductsController_update`
     */
    public async update(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['ProductResponseDto']> {
        return requestWithClient<components['schemas']['ProductResponseDto']>(this.client, {
            method: 'PATCH',
            url: '/products/{id}',
            path: { id: id },
            ...options,
        });
    }
}
