/**
 * SettingsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class SettingsService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Get checkout settings
     * @see OpenAPI `SettingsController_getCheckout`
     */
    public async getCheckout(options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/settings/checkout',
            ...options,
        });
    }

    /**
     * Get storefront settings
     * @see OpenAPI `SettingsController_getStorefront`
     */
    public async getStorefront(options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/settings/storefront',
            ...options,
        });
    }

    /**
     * Update checkout settings
     * @see OpenAPI `SettingsController_updateCheckout`
     */
    public async updateCheckout(body: components['schemas']['UpdateCheckoutSettingsDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'PATCH',
            url: '/settings/checkout',
            body,
            ...options,
        });
    }

    /**
     * Update storefront settings
     * @see OpenAPI `SettingsController_updateStorefront`
     */
    public async updateStorefront(body: components['schemas']['UpdateStorefrontSettingsDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'PATCH',
            url: '/settings/storefront',
            body,
            ...options,
        });
    }
}
