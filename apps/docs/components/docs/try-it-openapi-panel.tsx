/* @proprietary license */

'use client';

import { usePathname } from 'next/navigation';
import { Label } from '@lomi./ui/label';
import { cn } from '@lomi./ui/cn';
import { useDocsWorkspace } from '@/lib/docs/workspace-context';
import { isDocsApiOperationPath } from '@/lib/tryit/gating';
import { t as translate } from '@/lib/i18n/translations';
import { useTranslation } from '@/lib/utils/translation-context';

type TryItOpenApiPanelProps = {
  enabled?: boolean;
};

export function TryItOpenApiPanel({ enabled }: TryItOpenApiPanelProps) {
  const pathname = usePathname();
  const { currentLanguage } = useTranslation();
  const t = (key: string) => translate(key, currentLanguage);
  const workspace = useDocsWorkspace();
  const visible = enabled ?? isDocsApiOperationPath(pathname ?? '');

  if (!visible) {
    return null;
  }

  if (!workspace.ready) {
    return (
      <div
        className={cn(
          'mb-4 rounded-md border border-fd-border bg-fd-card px-3 py-2 text-sm text-fd-muted-foreground',
        )}
      >
        {t('tryit.loading')}
      </div>
    );
  }

  if (!workspace.signedIn) {
    const dashboard =
      process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://dashboard.lomi.africa';
    const next = pathname || '/api';
    return (
      <div
        className={cn(
          'mb-4 rounded-md border border-fd-border bg-fd-card px-3 py-2 text-sm text-fd-muted-foreground',
        )}
      >
        <a
          className="docs-text-link"
          href={`${dashboard.replace(/\/$/, '')}/docs-handoff?next=${encodeURIComponent(next)}`}
        >
          {t('tryit.connect')}
        </a>{' '}
        {t('tryit.connectHint')}
      </div>
    );
  }

  if (workspace.organizations.length === 0) {
    return (
      <div
        className={cn(
          'mb-4 rounded-md border border-fd-border bg-fd-card px-3 py-2 text-sm',
        )}
      >
        <p className="text-amber-700 dark:text-amber-400">
          {t('tryit.noTestKey')}
        </p>
      </div>
    );
  }

  if (workspace.organizations.length === 1) {
    return null;
  }

  const needsOrganizationChoice = workspace.selectedOrganizationId === null;

  return (
    <div
      className={cn(
        'mb-6 rounded-lg border border-fd-border bg-fd-card px-4 py-3 text-sm shadow-sm',
      )}
    >
      <div className="flex flex-col gap-1.5 sm:min-w-[220px]">
        <Label htmlFor="tryit-org">{t('tryit.organization')}</Label>
        <select
          id="tryit-org"
          className={cn(
            'rounded-md border border-fd-border bg-fd-background px-2 py-1.5 text-fd-foreground',
          )}
          value={workspace.selectedOrganizationId ?? ''}
          onChange={(event) => {
            const orgId = event.target.value;
            if (!orgId) return;
            void workspace.selectOrganization(orgId);
          }}
          disabled={workspace.pending}
        >
          <option value="">
            {needsOrganizationChoice
              ? t('tryit.selectOrganization')
              : t('tryit.chooseOrganization')}
          </option>
          {workspace.organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
