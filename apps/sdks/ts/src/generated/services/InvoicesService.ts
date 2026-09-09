/**
 * InvoicesService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class InvoicesService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Create invoice
     * @see OpenAPI `InvoicesController_create`
     */
    public async create(options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['InvoiceResponseDto']> {
        return requestWithClient<components['schemas']['InvoiceResponseDto']>(this.client, {
            method: 'POST',
            url: '/invoices',
            ...options,
        });
    }

    /**
     * Invoice checkout session
     * @see OpenAPI `InvoicesController_createCheckoutSession`
     */
    public async createCheckoutSession(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/invoices/{id}/checkout-session',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Finalize invoice
     * @see OpenAPI `InvoicesController_finalize`
     */
    public async finalize(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/invoices/{id}/finalize',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Get invoice
     * @see OpenAPI `InvoicesController_findOne`
     */
    public async get(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['InvoiceResponseDto']> {
        return requestWithClient<components['schemas']['InvoiceResponseDto']>(this.client, {
            method: 'GET',
            url: '/invoices/{id}',
            path: { id: id },
            ...options,
        });
    }

    /**
     * List invoices
     * @see OpenAPI `InvoicesController_findAll`
     */
    public async list(params?: paths['/invoices']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>, options?: import("../../request-options.js").LomiRequestOptions): Promise<(NonNullable<NonNullable<paths['/invoices']['get']['responses'][200]>['content']>['application/json'])> {
        return requestWithClient<(NonNullable<NonNullable<paths['/invoices']['get']['responses'][200]>['content']>['application/json'])>(this.client, {
            method: 'GET',
            url: '/invoices',
            query: params,
            ...options,
        });
    }

    /**
     * Auto-paginate all pages from `list`.
     */
    public async *listAll(
        params?: paths['/invoices']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
        options?: import("../../request-options.js").LomiRequestOptions,
    ): AsyncGenerator<unknown, void, undefined> {
        let page = (params as { page?: number } | undefined)?.page ?? 1;
        const pageSize = (params as { pageSize?: number } | undefined)?.pageSize ?? 50;

        while (true) {
            const response = await this.list(
                { ...params, page, pageSize } as paths['/invoices']['get']['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>,
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
     * Invoice PDF
     * @see OpenAPI `InvoicesController_pdf`
     */
    public async pdf(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['InvoicePdfResponseDto']> {
        return requestWithClient<components['schemas']['InvoicePdfResponseDto']>(this.client, {
            method: 'GET',
            url: '/invoices/{id}/pdf',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Remind invoice
     * @see OpenAPI `InvoicesController_remind`
     */
    public async remind(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/invoices/{id}/remind',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Send invoice
     * @see OpenAPI `InvoicesController_send`
     */
    public async send(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/invoices/{id}/send',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Update invoice
     * @see OpenAPI `InvoicesController_update`
     */
    public async update(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['InvoiceResponseDto']> {
        return requestWithClient<components['schemas']['InvoiceResponseDto']>(this.client, {
            method: 'PATCH',
            url: '/invoices/{id}',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Void invoice
     * @see OpenAPI `InvoicesController_voidInvoice`
     */
    public async voidInvoice(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/invoices/{id}/void',
            path: { id: id },
            ...options,
        });
    }
}
