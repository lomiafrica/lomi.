/**
 * TeamService
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';

export class TeamService {
    constructor(private readonly client: LomiClient) {}

    /**
     * Invite team member
     * @see OpenAPI `TeamController_invite`
     */
    public async invite(body: components['schemas']['InviteTeamMemberDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'POST',
            url: '/team/invitations',
            body,
            ...options,
        });
    }

    /**
     * List team
     * @see OpenAPI `TeamController_list`
     */
    public async list(options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/team',
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
            const response = await requestWithClient<unknown>(this.client, {
                method: 'GET',
                url: '/team',
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
     * List team roles
     * @see OpenAPI `TeamController_listRoles`
     */
    public async listRoles(options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'GET',
            url: '/team/roles',
            ...options,
        });
    }

    /**
     * Remove team member
     * @see OpenAPI `TeamController_remove`
     */
    public async remove(memberId: string, options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'DELETE',
            url: '/team/members/{memberId}',
            path: { memberId: memberId },
            ...options,
        });
    }

    /**
     * Revoke invitation
     * @see OpenAPI `TeamController_revokeInvite`
     */
    public async revokeInvite(options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'DELETE',
            url: '/team/invitations',
            ...options,
        });
    }

    /**
     * Update member role
     * @see OpenAPI `TeamController_updateRole`
     */
    public async updateRole(memberId: string, body: components['schemas']['UpdateTeamMemberRoleDto'], options?: import("../../request-options.js").LomiRequestOptions): Promise<unknown> {
        return requestWithClient<unknown>(this.client, {
            method: 'PATCH',
            url: '/team/members/{memberId}',
            path: { memberId: memberId },
            body,
            ...options,
        });
    }
}
