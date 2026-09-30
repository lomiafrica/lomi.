/**
 * CustomersService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class CustomersService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Block a customer
     * @see OpenAPI `CustomersController_block`
     */
    public async block(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['CustomerRadarBlockResponseDto']> {
        return requestWithClient<components['schemas']['CustomerRadarBlockResponseDto']>(this.client, {
            method: 'POST',
            url: '/customers/{id}/block',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Create a customer
     * @see OpenAPI `CustomersController_create`
     */
    public async create(body: NonNullable<paths['/customers']['post']['requestBody']>['content']['application/json'], options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['CustomerResponseDto']> {
        return requestWithClient<components['schemas']['CustomerResponseDto']>(this.client, {
            method: 'POST',
            url: '/customers',
            body,
            ...options,
        });
    }

    /**
     * Create customer portal session
     * @see OpenAPI `CustomersController_createPortalSession`
     */
    public async createPortalSession(id: string, body: NonNullable<paths['/customers/{id}/portal']['post']['requestBody']>['content']['application/json'], options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['PortalLaunchSessionResponseDto']> {
        return requestWithClient<components['schemas']['PortalLaunchSessionResponseDto']>(this.client, {
            method: 'POST',
            url: '/customers/{id}/portal',
            path: { id: id },
            body,
            ...options,
        });
    }

    /**
     * Remove a customer
     * @see OpenAPI `CustomersController_remove`
     */
    public async delete(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<(NonNullable<NonNullable<paths['/customers/{id}']['delete']['responses'][200]>['content']>['application/json'])> {
        return requestWithClient<(NonNullable<NonNullable<paths['/customers/{id}']['delete']['responses'][200]>['content']>['application/json'])>(this.client, {
            method: 'DELETE',
            url: '/customers/{id}',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Retrieve a customer
     * @see OpenAPI `CustomersController_findOne`
     */
    public async get(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['CustomerResponseDto']> {
        return requestWithClient<components['schemas']['CustomerResponseDto']>(this.client, {
            method: 'GET',
            url: '/customers/{id}',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Customer portal audit log
     * @see OpenAPI `CustomersController_getPortalAudit`
     */
    public async getPortalAudit(id: string, params?: paths['/customers/{id}/portal-audit']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/customers/{id}/portal-audit',
            path: { id: id },
            query: params,
            ...options,
        });
    }

    /**
     * List subscriptions for customer
     * @see OpenAPI `CustomersController_getSubscriptions`
     */
    public async getSubscriptions(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<(NonNullable<NonNullable<paths['/customers/{id}/subscriptions']['get']['responses'][200]>['content']>['application/json'])> {
        return requestWithClient<(NonNullable<NonNullable<paths['/customers/{id}/subscriptions']['get']['responses'][200]>['content']>['application/json'])>(this.client, {
            method: 'GET',
            url: '/customers/{id}/subscriptions',
            path: { id: id },
            ...options,
        });
    }

    /**
     * List customer transactions
     * @see OpenAPI `CustomersController_getTransactions`
     */
    public async getTransactions(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<(NonNullable<NonNullable<paths['/customers/{id}/transactions']['get']['responses'][200]>['content']>['application/json'])> {
        return requestWithClient<(NonNullable<NonNullable<paths['/customers/{id}/transactions']['get']['responses'][200]>['content']>['application/json'])>(this.client, {
            method: 'GET',
            url: '/customers/{id}/transactions',
            path: { id: id },
            ...options,
        });
    }

    /**
     * List customers
     * @see OpenAPI `CustomersController_findAll`
     */
    public async list(params?: paths['/customers']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<(NonNullable<NonNullable<paths['/customers']['get']['responses'][200]>['content']>['application/json'])> {
        return requestWithClient<(NonNullable<NonNullable<paths['/customers']['get']['responses'][200]>['content']>['application/json'])>(this.client, {
            method: 'GET',
            url: '/customers',
            query: params,
            ...options,
        });
    }

    /**
     * Auto-paginate all pages from `list`.
     */
    public async *listAll(
        params?: paths['/customers']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
        options?: import("../../request-options.js").LomiRequestOptions,
    ): AsyncGenerator<unknown, void, undefined> {
        let page = (params as { page?: number } | undefined)?.page ?? 1;
        const pageSize = (params as { pageSize?: number } | undefined)?.pageSize ?? 50;

        while (true) {
            const response = await this.list(
                { ...params, page, pageSize } as paths['/customers']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
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
     * Top customers by spend
     * @see OpenAPI `CustomersController_topBySpend`
     */
    public async topBySpend(params?: paths['/customers/top']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<(NonNullable<NonNullable<paths['/customers/top']['get']['responses'][200]>['content']>['application/json'])> {
        return requestWithClient<(NonNullable<NonNullable<paths['/customers/top']['get']['responses'][200]>['content']>['application/json'])>(this.client, {
            method: 'GET',
            url: '/customers/top',
            query: params,
            ...options,
        });
    }

    /**
     * Unblock a customer
     * @see OpenAPI `CustomersController_unblock`
     */
    public async unblock(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['CustomerRadarBlockResponseDto']> {
        return requestWithClient<components['schemas']['CustomerRadarBlockResponseDto']>(this.client, {
            method: 'POST',
            url: '/customers/{id}/unblock',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Update a customer
     * @see OpenAPI `CustomersController_update`
     */
    public async update(id: string, body: NonNullable<paths['/customers/{id}']['patch']['requestBody']>['content']['application/json'], options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['CustomerResponseDto']> {
        return requestWithClient<components['schemas']['CustomerResponseDto']>(this.client, {
            method: 'PATCH',
            url: '/customers/{id}',
            path: { id: id },
            body,
            ...options,
        });
    }
}
