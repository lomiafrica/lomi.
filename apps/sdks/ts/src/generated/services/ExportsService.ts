/**
 * ExportsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class ExportsService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Create export
     * @see OpenAPI `MerchantExportsController_create`
     */
    public async create(options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['ExportResponseDto']> {
        return requestWithClient<components['schemas']['ExportResponseDto']>(this.client, {
            method: 'POST',
            url: '/exports',
            ...options,
        });
    }

    /**
     * Get export
     * @see OpenAPI `MerchantExportsController_findOne`
     */
    public async get(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['ExportResponseDto']> {
        return requestWithClient<components['schemas']['ExportResponseDto']>(this.client, {
            method: 'GET',
            url: '/exports/{id}',
            path: { id: id },
            ...options,
        });
    }

    /**
     * List exports
     * @see OpenAPI `MerchantExportsController_findAll`
     */
    public async list(options?: import("../../request-options.js").LomiRequestOptions): Promise<(NonNullable<NonNullable<paths['/exports']['get']['responses'][200]>['content']>['application/json'])> {
        return requestWithClient<(NonNullable<NonNullable<paths['/exports']['get']['responses'][200]>['content']>['application/json'])>(this.client, {
            method: 'GET',
            url: '/exports',
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
            const response = await requestWithClient<(NonNullable<NonNullable<paths['/exports']['get']['responses'][200]>['content']>['application/json'])>(this.client, {
                method: 'GET',
                url: '/exports',
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
