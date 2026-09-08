/* @proprietary license */

'use client';

import {
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Sidebar as FumadocsSidebar,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  type SidebarProps,
} from 'fumadocs-ui/layouts/docs/slots/sidebar';
import {
  DocsLayout,
  useDocsLayout,
  type DocsLayoutProps,
} from 'fumadocs-ui/layouts/docs';
import { isLayoutTabActive, type LayoutTab } from 'fumadocs-ui/layouts/shared';
import { TreeContextProvider, useTreeContext } from 'fumadocs-ui/contexts/tree';
import type { Root } from 'fumadocs-core/page-tree';
import { useTranslation } from '@/lib/utils/translation-context';
import { t as translate } from '@/lib/i18n/translations';
import { cn } from '@lomi./ui/cn';
import { DocsMobileHeader } from '@/components/docs/docs-mobile-header';
import { isString } from '@lomi./shared';

type PreviewContextValue = {
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  tabs: LayoutTab[];
};

const MobileSectionPreviewContext = createContext<PreviewContextValue | null>(
  null,
);

function useMobileSectionPreview() {
  return use(MobileSectionPreviewContext);
}

function lastMatchingTab(
  tabs: LayoutTab[],
  pathname: string,
): LayoutTab | undefined {
  for (let i = tabs.length - 1; i >= 0; i -= 1) {
    if (isLayoutTabActive(tabs[i], pathname)) return tabs[i];
  }
  return undefined;
}

function folderTree(folder: LayoutTab['$folder'], previewUrl: string): Root {
  return {
    name: isString(folder?.name) ? folder.name : 'docs',
    children: folder?.children ?? [],
    $id: `mobile-section:${previewUrl}`,
  };
}

function MobileSectionPreviewRoot({ children }: { children: ReactNode }) {
  const { full } = useTreeContext();
  const {
    props: { tabs },
  } = useDocsLayout();
  const { open, mode } = useSidebar();
  const pathname = usePathname();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setPreviewUrl(null);
  }, [pathname]);

  useEffect(() => {
    if (!open || mode !== 'drawer') setPreviewUrl(null);
  }, [mode, open]);

  useEffect(() => {
    const root = document.querySelector(
      '#nd-sidebar-mobile > .overflow-hidden.min-h-0.flex-1',
    );
    if (root) root.scrollTop = 0;
  }, [previewUrl]);

  const previewTab = useMemo(
    () => tabs.find((tab) => tab.url === previewUrl && tab.$folder),
    [previewUrl, tabs],
  );

  const tree = useMemo(() => {
    if (mode !== 'drawer' || !previewTab?.$folder || !previewUrl) return full;
    return folderTree(previewTab.$folder, previewUrl);
  }, [full, mode, previewTab, previewUrl]);

  const value = useMemo(
    () => ({ previewUrl, setPreviewUrl, tabs }),
    [previewUrl, tabs],
  );

  return (
    <MobileSectionPreviewContext.Provider value={value}>
      <TreeContextProvider tree={tree}>{children}</TreeContextProvider>
    </MobileSectionPreviewContext.Provider>
  );
}

export function DocsSidebar(props: SidebarProps) {
  return (
    <MobileSectionPreviewRoot>
      <FumadocsSidebar {...props} />
    </MobileSectionPreviewRoot>
  );
}

export function DocsAppLayout({ slots, ...props }: DocsLayoutProps) {
  return (
    <DocsLayout
      {...props}
      slots={{
        ...slots,
        header: DocsMobileHeader,
        sidebar: {
          provider: SidebarProvider,
          root: DocsSidebar,
          trigger: SidebarTrigger,
          useSidebar,
        },
      }}
    />
  );
}

export function DocsMobileSectionSwitch() {
  const preview = useMobileSectionPreview();
  const pathname = usePathname();
  const { currentLanguage } = useTranslation();
  const { open: drawerOpen, mode } = useSidebar();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const t = (key: string) => translate(key, currentLanguage);

  useEffect(() => {
    if (!drawerOpen || mode !== 'drawer') setOpen(false);
  }, [drawerOpen, mode]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        rootRef.current.contains(event.target)
      ) {
        return;
      }
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!preview || preview.tabs.length === 0) return null;

  const selected =
    preview.tabs.find((tab) => tab.url === preview.previewUrl) ??
    lastMatchingTab(preview.tabs, pathname) ??
    preview.tabs[0];
  const sectionNav = t('docs.shell.sectionNav');

  return (
    <div ref={rootRef} className="docs-mobile-section-switch-root md:hidden">
      <button
        type="button"
        className="docs-mobile-section-switch flex items-center gap-2 rounded-lg border"
        title={sectionNav}
        aria-label={sectionNav}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
      >
        {selected?.icon ? (
          <div className="docs-mobile-section-icon size-4 shrink-0">
            {selected.icon}
          </div>
        ) : null}
        <span className="min-w-0 flex-1 truncate text-start text-sm font-medium">
          {selected?.title}
        </span>
        <ChevronsUpDown className="ms-auto size-4 shrink-0 text-fd-muted-foreground" />
      </button>
      {open ? (
        <div
          role="listbox"
          aria-label={sectionNav}
          className="docs-mobile-section-menu"
        >
          {preview.tabs.map((tab) => {
            const isActive = selected?.url === tab.url;
            return (
              <button
                key={tab.url}
                type="button"
                role="option"
                aria-selected={isActive}
                data-active={isActive}
                className="docs-mobile-section-option"
                onClick={() => {
                  preview.setPreviewUrl(tab.url);
                  setOpen(false);
                }}
              >
                {tab.icon ? (
                  <div className="docs-mobile-section-icon size-4 shrink-0">
                    {tab.icon}
                  </div>
                ) : null}
                <span className="min-w-0 flex-1 truncate text-start text-sm font-medium">
                  {tab.title}
                </span>
                <Check
                  className={cn(
                    'ms-auto size-4 shrink-0 text-fd-muted-foreground',
                    !isActive && 'invisible',
                  )}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
