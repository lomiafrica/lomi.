/**
 * ApiKeysService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class ApiKeysService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Create API key
     * @see OpenAPI `ApiKeysController_create`
     */
    public async create(body: components['schemas']['CreateApiKeyDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/api-keys',
            body,
            ...options,
        });
    }

    /**
     * List API keys
     * @see OpenAPI `ApiKeysController_list`
     */
    public async list(options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/api-keys',
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
                url: '/api-keys',
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

    /**
     * Revoke API key
     * @see OpenAPI `ApiKeysController_remove`
     */
    public async revoke(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'DELETE',
            url: '/api-keys/{id}',
            path: { id: id },
            ...options,
        });
    }
}
