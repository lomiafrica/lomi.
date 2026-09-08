/* @proprietary license */

'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'fumadocs-ui/provider/base';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Activity,
  AppWindow,
  Github,
  Globe,
  Languages,
  PlugZap,
  SunMoon,
} from 'lucide-react';
import { DitherAvatar } from '@lomi./ui/dither-avatar';
import {
  ClaudeBrandIcon,
  CursorBrandIcon,
  GrokBrandIcon,
  McpBrandIcon,
  VscodeBrandIcon,
} from '@/components/docs/ai-brand-icons';
import { useDocsWorkspace } from '@/lib/docs/workspace-context';
import { languages, type Language } from '@/lib/i18n/config';
import {
  GROK_BOT_URL,
  buildClaudeOauthInstallUrl,
  buildCursorOauthDeeplink,
  buildVscodeOauthInstallUrl,
} from '@/lib/mcp/oauth-connect';
import { t as translate } from '@/lib/i18n/translations';
import { useTranslation } from '@/lib/utils/translation-context';
import { cn } from '@lomi./ui/cn';

const r = 'rounded-[0.3rem]';
const CLOSE_MS = 80;

type SubmenuId = 'language' | 'theme' | 'mcp';
type ThemeId = 'light' | 'dark' | 'system';

const THEMES: readonly ThemeId[] = ['light', 'dark', 'system'];

const BACKLINKS = [
  {
    href: 'https://lomi.africa',
    labelKey: 'docs.shell.website',
    Icon: Globe,
  },
  {
    href: 'https://github.com/lomiafrica/lomi.',
    labelKey: 'docs.shell.github',
    Icon: Github,
  },
  {
    href: 'https://status.lomi.africa',
    labelKey: 'docs.shell.status',
    Icon: Activity,
  },
] as const;

function canHover() {
  return (
    'matchMedia' in globalThis &&
    globalThis.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}

function itemClass(mobile: boolean, extra?: string) {
  return cn(
    'flex w-full items-center gap-2 text-left text-fd-muted-foreground transition-colors',
    r,
    mobile
      ? 'min-h-10 px-3 py-2 text-[15px] leading-snug'
      : 'px-2.5 py-1.5 text-[13px]',
    'hover:bg-[var(--docs-sidebar-well)] hover:text-fd-foreground',
    extra,
  );
}

function SubmenuChevron({ open, mobile }: { open: boolean; mobile: boolean }) {
  const Icon = mobile ? ChevronDown : ChevronRight;
  return (
    <Icon
      className={cn(
        'size-3.5 shrink-0 opacity-70',
        mobile && 'transition-transform',
        mobile && open && 'rotate-180',
      )}
      aria-hidden
    />
  );
}

/**
 * Full-width Beecargo-style user nav for the docs sidebar.
 * Hover opens instantly; Language / Theme / MCP fly out to the right on desktop.
 */
export function DocsSidebarLocaleAndTheme({
  mobile = false,
}: {
  /** Fumadocs passes chrome classes we do not want on the full-width row. */
  className?: string;
  mobile?: boolean;
}) {
  const router = useRouter();
  const { currentLanguage, setLanguage } = useTranslation();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { signedIn, organizations, selectedOrganizationId } =
    useDocsWorkspace();
  const t = (key: string) => translate(key, currentLanguage);
  const selectedOrg =
    organizations.find((org) => org.id === selectedOrganizationId) ??
    organizations[0];
  const orgName = signedIn ? selectedOrg?.name.trim() || null : null;
  const avatarSeed = orgName ? (selectedOrg?.id ?? orgName) : 'docs-guest';
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<SubmenuId | null>(null);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openMenu() {
    clearCloseTimer();
    setOpen(true);
  }

  function closeAll() {
    clearCloseTimer();
    setOpen(false);
    setSubmenu(null);
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer.current = setTimeout(closeAll, CLOSE_MS);
  }

  useEffect(() => () => clearCloseTimer(), []);

  useEffect(() => {
    if (!mobile || !open || !submenu) return;
    const panel = rootRef.current?.querySelector(
      `[data-submenu-panel="${submenu}"]`,
    );
    panel?.scrollIntoView({ block: 'end', inline: 'nearest' });
  }, [mobile, open, submenu]);

  useEffect(() => {
    if (!open) return;
    function dismiss() {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
      setOpen(false);
      setSubmenu(null);
    }
    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (
        target instanceof Node &&
        rootRef.current?.contains(target)
      ) {
        return;
      }
      dismiss();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') dismiss();
    }
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [open]);

  function chooseLanguage(lang: Language) {
    if (lang !== currentLanguage) {
      setLanguage(lang);
      router.refresh();
    }
    closeAll();
  }

  function chooseTheme(next: ThemeId) {
    setTheme(next);
    closeAll();
  }

  function toggleSubmenu(id: SubmenuId) {
    setSubmenu((current) => (current === id ? null : id));
  }

  const activeTheme: ThemeId = mounted
    ? theme === 'system'
      ? 'system'
      : resolvedTheme === 'dark'
        ? 'dark'
        : 'light'
    : 'light';

  const mcpItems = [
    {
      href: buildCursorOauthDeeplink(),
      label: t('mcpConnect.addCursor'),
      icon: <CursorBrandIcon className="size-4 shrink-0" />,
      external: false,
    },
    {
      href: GROK_BOT_URL,
      label: t('mcpConnect.addGrok'),
      icon: <GrokBrandIcon className="size-4 shrink-0" />,
      external: true,
    },
    {
      href: buildClaudeOauthInstallUrl(),
      label: t('mcpConnect.addClaude'),
      icon: <ClaudeBrandIcon className="size-4 shrink-0" />,
      external: true,
    },
    {
      href: buildVscodeOauthInstallUrl(),
      label: t('mcpConnect.addVscode'),
      icon: <VscodeBrandIcon className="size-4 shrink-0" />,
      external: false,
    },
    {
      href: '/build/mcp',
      label: t('docs.shell.mcpSetup'),
      icon: <PlugZap className="size-4 shrink-0" />,
      external: false,
    },
  ];

  function flyout(id: SubmenuId, panel: ReactNode) {
    if (submenu !== id) return null;
    if (mobile) {
      return (
        <div data-submenu-panel={id} className="mt-0.5 space-y-0.5 ps-6">
          {panel}
        </div>
      );
    }
    return (
      <div
        role="menu"
        className={cn(
          'absolute start-full top-0 z-[90] ms-1 min-w-44',
          r,
          'border border-[color:var(--docs-sidebar-hairline)] bg-[var(--sidebar)] p-1 shadow-[var(--docs-sidebar-float)]',
        )}
      >
        {panel}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative min-w-0 w-full"
      data-sidebar-locale-theme
      data-sidebar-user-nav
      onMouseEnter={() => {
        if (!mobile && canHover()) openMenu();
      }}
      onMouseLeave={() => {
        if (!mobile && canHover()) scheduleClose();
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          if (open) closeAll();
          else openMenu();
        }}
        onFocus={() => {
          if (!mobile && canHover()) openMenu();
        }}
        className={cn(
          'docs-user-nav-trigger flex w-full min-w-0 items-center gap-2 text-left',
          r,
          mobile
            ? 'min-h-10 px-3 py-2 text-[15px]'
            : 'px-2.5 py-1.5 text-[13px]',
          'text-fd-muted-foreground transition-colors',
          'hover:bg-[var(--docs-sidebar-well)] hover:text-fd-foreground',
          open && 'bg-[var(--docs-sidebar-well)] text-fd-foreground',
        )}
      >
        <span className="relative flex size-4 shrink-0 overflow-hidden rounded-full">
          <DitherAvatar
            seed={avatarSeed}
            size={16}
            gridCells={24}
            fill
            rounded="full"
            title={orgName ?? t('docs.shell.accountMenu')}
          />
        </span>
        {orgName ? (
          <span className="min-w-0 flex-1 truncate" title={orgName}>
            {orgName}
          </span>
        ) : (
          <span className="min-w-0 flex-1" />
        )}
        <ChevronDown
          className={cn(
            'size-3.5 shrink-0 text-fd-muted-foreground/70 transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={t('docs.shell.accountMenu')}
          className={cn(
            mobile
              ? 'relative mt-1 w-full space-y-0.5'
              : cn(
                  'absolute inset-x-0 bottom-full z-[80] mb-1 space-y-0.5 p-1',
                  r,
                  'border border-[color:var(--docs-sidebar-hairline)] bg-[var(--sidebar)] shadow-[var(--docs-sidebar-float)]',
                ),
          )}
        >
          <a
            href="https://dashboard.lomi.africa"
            role="menuitem"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeAll}
            onMouseEnter={() => {
              if (!mobile && canHover()) setSubmenu(null);
            }}
            className={itemClass(mobile)}
          >
            <AppWindow className="size-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">
              {t('docs.shell.dashboard')}
            </span>
          </a>

          <div
            className="relative"
            onMouseEnter={() => {
              if (!mobile && canHover()) setSubmenu('language');
            }}
          >
            <button
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={submenu === 'language'}
              onClick={() => toggleSubmenu('language')}
              className={itemClass(mobile)}
            >
              <Languages className="size-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">
                {t('docs.shell.language')}
              </span>
              <SubmenuChevron open={submenu === 'language'} mobile={mobile} />
            </button>
            {flyout(
              'language',
              languages.map((lang) => {
                const active = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => chooseLanguage(lang.code)}
                    className={itemClass(mobile)}
                  >
                    <span className="min-w-0 flex-1 truncate">{lang.name}</span>
                    <Check
                      className={cn(
                        'size-3.5 shrink-0 text-fd-primary',
                        !active && 'invisible',
                      )}
                    />
                  </button>
                );
              }),
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => {
              if (!mobile && canHover()) setSubmenu('theme');
            }}
          >
            <button
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={submenu === 'theme'}
              onClick={() => toggleSubmenu('theme')}
              className={itemClass(mobile)}
            >
              <SunMoon className="size-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">
                {t('docs.shell.theme')}
              </span>
              <SubmenuChevron open={submenu === 'theme'} mobile={mobile} />
            </button>
            {flyout(
              'theme',
              THEMES.map((id) => {
                const active = activeTheme === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => chooseTheme(id)}
                    className={itemClass(mobile)}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {t(`docs.shell.theme.${id}`)}
                    </span>
                    <Check
                      className={cn(
                        'size-3.5 shrink-0 text-fd-primary',
                        !active && 'invisible',
                      )}
                    />
                  </button>
                );
              }),
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => {
              if (!mobile && canHover()) setSubmenu('mcp');
            }}
          >
            <button
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={submenu === 'mcp'}
              onClick={() => toggleSubmenu('mcp')}
              className={itemClass(mobile)}
            >
              <McpBrandIcon className="size-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">
                {t('docs.shell.mcp')}
              </span>
              <SubmenuChevron open={submenu === 'mcp'} mobile={mobile} />
            </button>
            {flyout(
              'mcp',
              mcpItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={closeAll}
                  className={itemClass(mobile)}
                  {...(item.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {item.icon}
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </a>
              )),
            )}
          </div>

          <div
            role="separator"
            className="my-1 h-px bg-[color:var(--docs-sidebar-hairline)]"
          />

          {BACKLINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              role="menuitem"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeAll}
              onMouseEnter={() => {
                if (!mobile && canHover()) setSubmenu(null);
              }}
              className={itemClass(mobile)}
            >
              <link.Icon className="size-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">
                {t(link.labelKey)}
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
