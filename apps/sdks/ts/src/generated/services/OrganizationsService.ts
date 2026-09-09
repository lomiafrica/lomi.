/**
 * OrganizationsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class OrganizationsService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Create organization
     * @see OpenAPI `OrganizationsController_create`
     */
    public async create(body: components['schemas']['CreateOrganizationDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/organizations',
            body,
            ...options,
        });
    }

    /**
     * Mint organization secret
     * @see OpenAPI `OrganizationsController_createKey`
     */
    public async createKey(id: string, body: components['schemas']['CreateOrganizationKeyDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/organizations/{id}/keys',
            path: { id: id },
            body,
            ...options,
        });
    }

    /**
     * Retrieve organization
     * @see OpenAPI `OrganizationsController_findOne`
     */
    public async get(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['OrganizationResponseDto']> {
        return requestWithClient<components['schemas']['OrganizationResponseDto']>(this.client, {
            method: 'GET',
            url: '/organizations/{id}',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Organization metrics
     * @see OpenAPI `OrganizationsController_getMetrics`
     */
    public async getMetrics(options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['OrganizationMetricsResponseDto']> {
        return requestWithClient<components['schemas']['OrganizationMetricsResponseDto']>(this.client, {
            method: 'GET',
            url: '/organizations/metrics',
            ...options,
        });
    }

    /**
     * Get Radar settings
     * @see OpenAPI `OrganizationsController_getRadarSettings`
     */
    public async getRadarSettings(options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/organizations/radar-settings',
            ...options,
        });
    }

    /**
     * List organizations
     * @see OpenAPI `OrganizationsController_findAll`
     */
    public async list(options?: import("../../request-options.js").LomiRequestOptions): Promise<(NonNullable<NonNullable<paths['/organizations']['get']['responses'][200]>['content']>['application/json'])> {
        return requestWithClient<(NonNullable<NonNullable<paths['/organizations']['get']['responses'][200]>['content']>['application/json'])>(this.client, {
            method: 'GET',
            url: '/organizations',
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
            const response = await requestWithClient<(NonNullable<NonNullable<paths['/organizations']['get']['responses'][200]>['content']>['application/json'])>(this.client, {
                method: 'GET',
                url: '/organizations',
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
     * Update Radar settings
     * @see OpenAPI `OrganizationsController_updateRadarSettings`
     */
    public async updateRadarSettings(body: components['schemas']['UpdateRadarSettingsDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'PATCH',
            url: '/organizations/radar-settings',
            body,
            ...options,
        });
    }
}
