/**
 * TransactionsService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class TransactionsService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Retrieve transaction
     * @see OpenAPI `TransactionsController_findOne`
     */
    public async get(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['TransactionResponseDto']> {
        return requestWithClient<components['schemas']['TransactionResponseDto']>(this.client, {
            method: 'GET',
            url: '/transactions/{id}',
            path: { id: id },
            ...options,
        });
    }

    /**
     * List transactions
     * @see OpenAPI `TransactionsController_findAll`
     */
    public async list(params?: paths['/transactions']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['TransactionResponseDto']> {
        return requestWithClient<components['schemas']['TransactionResponseDto']>(this.client, {
            method: 'GET',
            url: '/transactions',
            query: params,
            ...options,
        });
    }

    /**
     * Auto-paginate all pages from `list`.
     */
    public async *listAll(
        params?: paths['/transactions']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
        options?: import("../../request-options.js").LomiRequestOptions,
    ): AsyncGenerator<unknown, void, undefined> {
        let page = (params as { page?: number } | undefined)?.page ?? 1;
        const pageSize = (params as { pageSize?: number } | undefined)?.pageSize ?? 50;

        while (true) {
            const response = await this.list(
                { ...params, page, pageSize } as paths['/transactions']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
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
     * Receipt PDF
     * @see OpenAPI `TransactionsController_receiptPdf`
     */
    public async receiptPdf(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['InvoicePdfResponseDto']> {
        return requestWithClient<components['schemas']['InvoicePdfResponseDto']>(this.client, {
            method: 'GET',
            url: '/transactions/{id}/receipt.pdf',
            path: { id: id },
            ...options,
        });
    }
}
