/* @proprietary license */

'use client';

import { Fragment, useCallback, type ReactNode } from 'react';
import {
  ClaudeBrandIcon,
  CursorBrandIcon,
  GrokBrandIcon,
  VscodeBrandIcon,
} from '@/components/docs/ai-brand-icons';
import {
  GROK_BOT_URL,
  buildClaudeOauthInstallUrl,
  buildCursorOauthDeeplink,
  buildVscodeOauthInstallUrl,
  type McpOauthClientId,
} from '@/lib/mcp/oauth-connect';
import { translate } from '@/lib/i18n/translations';
import { useTranslation } from '@/lib/utils/translation-context';
import { cn } from '@lomi./ui/cn';

const buttonClass =
  'inline-flex h-9 touch-manipulation select-none items-center gap-2 rounded-md border border-fd-border bg-fd-background px-3.5 text-[13px] font-medium text-fd-foreground transition-colors hover:bg-fd-muted';

const CLIENT_ORDER: McpOauthClientId[] = ['cursor', 'claude', 'vscode'];

const LABEL_KEY: Record<McpOauthClientId, string> = {
  cursor: 'mcpConnect.addCursor',
  claude: 'mcpConnect.addClaude',
  vscode: 'mcpConnect.addVscode',
};

export function McpOauthConnect({ className }: { className?: string }) {
  const { currentLanguage } = useTranslation();
  const t = useCallback(
    (key: string) => translate(key, currentLanguage),
    [currentLanguage],
  );

  const clientUi: Record<McpOauthClientId, { icon: ReactNode; href: string }> =
    {
      cursor: {
        icon: <CursorBrandIcon className="size-4 shrink-0" />,
        href: buildCursorOauthDeeplink(),
      },
      claude: {
        icon: <ClaudeBrandIcon className="size-4 shrink-0" />,
        href: buildClaudeOauthInstallUrl(),
      },
      vscode: {
        icon: <VscodeBrandIcon className="size-4 shrink-0" />,
        href: buildVscodeOauthInstallUrl(),
      },
    };

  return (
    <div className={cn('not-prose my-4 flex flex-wrap gap-2', className)}>
      {CLIENT_ORDER.map((client) => {
        const ui = clientUi[client];
        return (
          <Fragment key={client}>
            <a
              className={buttonClass}
              href={ui.href}
              {...(ui.href.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {ui.icon}
              {t(LABEL_KEY[client])}
            </a>
            {client === 'cursor' ? (
              <a
                className={buttonClass}
                href={GROK_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GrokBrandIcon className="size-4 shrink-0" />
                {t('mcpConnect.addGrok')}
              </a>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
