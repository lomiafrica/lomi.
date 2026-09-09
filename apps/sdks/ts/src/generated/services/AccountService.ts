/**
 * AccountService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class AccountService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Delete merchant account
     * @see OpenAPI `AccountController_deleteAccount`
     */
    public async deleteAccount(body: components['schemas']['DeleteAccountDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/account/delete',
            body,
            ...options,
        });
    }

    /**
     * Export account data
     * @see OpenAPI `AccountController_export`
     */
    public async export(options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/account/export',
            ...options,
        });
    }
}
