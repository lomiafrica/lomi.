/**
 * ChargesService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class ChargesService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Cancel embedded card charge
     * @see OpenAPI `ChargesController_cancelCardCharge`
     */
    public async cancelCardCharge(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/charge/card/{id}/cancel',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Capture card hold
     * @see OpenAPI `ChargesController_captureCardCharge`
     */
    public async captureCardCharge(id: string, body: components['schemas']['CaptureCardChargeDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/charge/card/{id}/capture',
            path: { id: id },
            body,
            ...options,
        });
    }

    /**
     * Create embedded card charge
     * @see OpenAPI `ChargesController_createCardCharge`
     */
    public async createCardCharge(body: components['schemas']['CreateCardChargeDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['CardChargeResponseDto']> {
        return requestWithClient<components['schemas']['CardChargeResponseDto']>(this.client, {
            method: 'POST',
            url: '/charge/card',
            body,
            ...options,
        });
    }

    /**
     * Create MTN charge
     * @see OpenAPI `ChargesController_createMtnCharge`
     */
    public async createMtnCharge(body: components['schemas']['CreateMtnChargeDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['MtnChargeResponseDto']> {
        return requestWithClient<components['schemas']['MtnChargeResponseDto']>(this.client, {
            method: 'POST',
            url: '/charge/mtn',
            body,
            ...options,
        });
    }

    /**
     * Create Switch charge
     * @see OpenAPI `ChargesController_createSwitchCharge`
     */
    public async createSwitchCharge(body: components['schemas']['CreateSwitchChargeDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['SwitchChargeResponseDto']> {
        return requestWithClient<components['schemas']['SwitchChargeResponseDto']>(this.client, {
            method: 'POST',
            url: '/charge/switch',
            body,
            ...options,
        });
    }

    /**
     * Create direct mobile-money charge
     * @see OpenAPI `ChargesController_createWaveCharge`
     */
    public async createWaveCharge(body: components['schemas']['CreateWaveChargeDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['WaveChargeResponseDto']> {
        return requestWithClient<components['schemas']['WaveChargeResponseDto']>(this.client, {
            method: 'POST',
            url: '/charge/wave',
            body,
            ...options,
        });
    }

    /**
     * Get embedded card charge
     * @see OpenAPI `ChargesController_getCardCharge`
     */
    public async getCardCharge(id: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<components['schemas']['CardChargeResponseDto']> {
        return requestWithClient<components['schemas']['CardChargeResponseDto']>(this.client, {
            method: 'GET',
            url: '/charge/card/{id}',
            path: { id: id },
            ...options,
        });
    }

    /**
     * Raise card hold
     * @see OpenAPI `ChargesController_incrementCardHold`
     */
    public async incrementCardHold(id: string, body: components['schemas']['IncrementCardHoldDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/charge/card/{id}/increment',
            path: { id: id },
            body,
            ...options,
        });
    }
}
