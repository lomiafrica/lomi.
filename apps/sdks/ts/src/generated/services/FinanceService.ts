/**
 * FinanceService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class FinanceService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Receivables aging
     * @see OpenAPI `FinanceController_aging`
     */
    public async getAging(options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/finance/aging',
            ...options,
        });
    }

    /**
     * Cashflow
     * @see OpenAPI `FinanceController_cashflow`
     */
    public async getCashflow(params?: paths['/finance/cashflow']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/finance/cashflow',
            query: params,
            ...options,
        });
    }

    /**
     * Reconcile
     * @see OpenAPI `FinanceController_reconcile`
     */
    public async getReconcile(options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/finance/reconcile',
            ...options,
        });
    }

    /**
     * Finance summary
     * @see OpenAPI `FinanceController_summary`
     */
    public async getSummary(options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/finance/summary',
            ...options,
        });
    }
}
