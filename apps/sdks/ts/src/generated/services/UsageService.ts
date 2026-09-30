/**
 * UsageService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class UsageService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Check customer entitlement
     * @see OpenAPI `UsageBillingController_checkEntitlement`
     */
    public async checkEntitlement(params?: paths['/usage/entitlements']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/usage/entitlements',
            query: params,
            ...options,
        });
    }

    /**
     * Record a usage event
     * @see OpenAPI `UsageEventsController_ingest`
     */
    public async create(options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['UsageEventResponseDto']> {
        return requestWithClient<components['schemas']['UsageEventResponseDto']>(this.client, {
            method: 'POST',
            url: '/usage/events',
            ...options,
        });
    }

    /**
     * Create or update an entitlement
     * @see OpenAPI `UsageBillingController_createEntitlement`
     */
    public async createEntitlement(body: NonNullable<paths['/usage/entitlements']['post']['requestBody']>['content']['application/json'], options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/usage/entitlements',
            body,
            ...options,
        });
    }

    /**
     * Create a usage subscription
     * @see OpenAPI `UsageEventsController_createUsageSubscription`
     */
    public async createSubscription(body: components['schemas']['CreateUsageSubscriptionDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['UsageSubscriptionResponseDto']> {
        return requestWithClient<components['schemas']['UsageSubscriptionResponseDto']>(this.client, {
            method: 'POST',
            url: '/usage/subscriptions',
            body,
            ...options,
        });
    }

    /**
     * Get a usage event
     * @see OpenAPI `UsageEventsController_findOne`
     */
    public async get(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['UsageEventListItemDto']> {
        return requestWithClient<components['schemas']['UsageEventListItemDto']>(this.client, {
            method: 'GET',
            url: '/usage/events/{id}',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Combined revenue metrics
     * @see OpenAPI `UsageBillingController_getRevenue`
     */
    public async getRevenue(params?: paths['/usage/revenue']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/usage/revenue',
            query: params,
            ...options,
        });
    }

    /**
     * Credit prepaid usage units
     * @see OpenAPI `UsageBillingController_creditWallet`
     */
    public async grantCredits(body: components['schemas']['CreditWalletDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/usage/credits',
            body,
            ...options,
        });
    }

    /**
     * List usage events
     * @see OpenAPI `UsageEventsController_findAll`
     */
    public async list(params?: paths['/usage/events']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<(NonNullable<NonNullable<paths['/usage/events']['get']['responses'][200]>['content']>['application/json'])> {
        return requestWithClient<(NonNullable<NonNullable<paths['/usage/events']['get']['responses'][200]>['content']>['application/json'])>(this.client, {
            method: 'GET',
            url: '/usage/events',
            query: params,
            ...options,
        });
    }

    /**
     * Auto-paginate all pages from `list`.
     */
    public async *listAll(
        params?: paths['/usage/events']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
        options?: import("../../request-options.js").LomiRequestOptions,
    ): AsyncGenerator<unknown, void, undefined> {
        let page = (params as { page?: number } | undefined)?.page ?? 1;
        const pageSize = (params as { pageSize?: number } | undefined)?.pageSize ?? 50;

        while (true) {
            const response = await this.list(
                { ...params, page, pageSize } as paths['/usage/events']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
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
     * List usage billing periods
     * @see OpenAPI `UsageBillingController_listPeriods`
     */
    public async listPeriods(params?: paths['/usage/periods']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/usage/periods',
            query: params,
            ...options,
        });
    }
}
