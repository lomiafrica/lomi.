/**
 * SubscriptionsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class SubscriptionsService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Cancel subscription
     * @see OpenAPI `SubscriptionsController_cancel`
     */
    public async cancel(id: string, body: NonNullable<paths['/subscriptions/{id}/cancel']['post']['requestBody']>['content']['application/json'], options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['SubscriptionResponseDto']> {
        return requestWithClient<components['schemas']['SubscriptionResponseDto']>(this.client, {
            method: 'POST',
            url: '/subscriptions/{id}/cancel',
            path: { id: id },
            body,
            ...options,
        });
    }

    /**
     * Change subscription plan
     * @see OpenAPI `SubscriptionsController_changePlan`
     */
    public async changePlan(id: string, body: NonNullable<paths['/subscriptions/{id}/change-plan']['post']['requestBody']>['content']['application/json'], options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['SubscriptionResponseDto']> {
        return requestWithClient<components['schemas']['SubscriptionResponseDto']>(this.client, {
            method: 'POST',
            url: '/subscriptions/{id}/change-plan',
            path: { id: id },
            body,
            ...options,
        });
    }

    /**
     * Retrieve subscription
     * @see OpenAPI `SubscriptionsController_findOne`
     */
    public async get(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['SubscriptionResponseDto']> {
        return requestWithClient<components['schemas']['SubscriptionResponseDto']>(this.client, {
            method: 'GET',
            url: '/subscriptions/{id}',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Get meter usage for a subscription
     * @see OpenAPI `SubscriptionsController_getUsage`
     */
    public async getUsage(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/subscriptions/{id}/usage',
            path: { id: id },
            ...options,
        });
    }

    /**
     * List subscriptions
     * @see OpenAPI `SubscriptionsController_findAll`
     */
    public async list(params?: paths['/subscriptions']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<(NonNullable<NonNullable<paths['/subscriptions']['get']['responses'][200]>['content']>['application/json'])> {
        return requestWithClient<(NonNullable<NonNullable<paths['/subscriptions']['get']['responses'][200]>['content']>['application/json'])>(this.client, {
            method: 'GET',
            url: '/subscriptions',
            query: params,
            ...options,
        });
    }

    /**
     * Auto-paginate all pages from `list`.
     */
    public async *listAll(
        params?: paths['/subscriptions']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
        options?: import("../../request-options.js").LomiRequestOptions,
    ): AsyncGenerator<unknown, void, undefined> {
        let page = (params as { page?: number } | undefined)?.page ?? 1;
        const pageSize = (params as { pageSize?: number } | undefined)?.pageSize ?? 50;

        while (true) {
            const response = await this.list(
                { ...params, page, pageSize } as paths['/subscriptions']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
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
     * Resume subscription
     * @see OpenAPI `SubscriptionsController_resume`
     */
    public async resume(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['SubscriptionResponseDto']> {
        return requestWithClient<components['schemas']['SubscriptionResponseDto']>(this.client, {
            method: 'POST',
            url: '/subscriptions/{id}/resume',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Update subscription
     * @see OpenAPI `SubscriptionsController_update`
     */
    public async update(id: string, body: components['schemas']['UpdateSubscriptionDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['SubscriptionResponseDto']> {
        return requestWithClient<components['schemas']['SubscriptionResponseDto']>(this.client, {
            method: 'PATCH',
            url: '/subscriptions/{id}',
            path: { id: id },
            body,
            ...options,
        });
    }
}
