'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  personalizeSnippet as applyPersonalize,
  resolveTestApiKeyDisplay,
  type ApiKeyResolution,
} from '@/lib/docs/personalize';
import {
  readStoredOrgId,
  writeStoredOrgId,
} from '@/lib/docs/workspace-storage';
import { canSendSandbox } from '@/lib/tryit/gating';

export type DocsWorkspaceOrg = { id: string; name: string };

export type DocsPricingPlan = 'fixed' | 'dynamic' | 'custom' | null;
export type DocsVolumeTier =
  'starter' | 'growth' | 'professional' | 'enterprise' | null;

type TryitContextResponse = {
  signedIn: boolean;
  organizations: DocsWorkspaceOrg[];
  selectedOrganizationId: string | null;
  testApiKey?: string | null;
  pricingPlan?: DocsPricingPlan;
  volumeTier?: DocsVolumeTier;
};

type DocsWorkspaceValue = {
  ready: boolean;
  pending: boolean;
  signedIn: boolean;
  organizations: DocsWorkspaceOrg[];
  selectedOrganizationId: string | null;
  apiKeyResolution: ApiKeyResolution;
  canSendSandbox: boolean;
  pricingPlan: DocsPricingPlan;
  volumeTier: DocsVolumeTier;
  personalizeSnippet: (source: string) => string;
  selectOrganization: (organizationId: string) => Promise<void>;
};

const DocsWorkspaceContext = createContext<DocsWorkspaceValue | null>(null);

async function fetchTryitContext(): Promise<TryitContextResponse | null> {
  const response = await fetch('/api/tryit-context', {
    credentials: 'include',
  });
  if (!response.ok) return null;
  return (await response.json()) as TryitContextResponse;
}

async function persistTryitOrg(organizationId: string): Promise<boolean> {
  const res = await fetch('/api/tryit-prefs', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ useTestKey: true, organizationId }),
  });
  return res.ok;
}

export function DocsWorkspaceProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [ctx, setCtx] = useState<TryitContextResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const stored = readStoredOrgId();
        const body = await fetchTryitContext();
        if (cancelled) return;
        if (!body) {
          setReady(true);
          return;
        }
        if (
          stored &&
          body.organizations.some((org) => org.id === stored) &&
          body.selectedOrganizationId !== stored
        ) {
          const saved = await persistTryitOrg(stored);
          if (cancelled) return;
          if (saved) {
            const refreshed = await fetchTryitContext();
            if (cancelled) return;
            if (refreshed) {
              setCtx(refreshed);
              setReady(true);
              return;
            }
          }
          body.selectedOrganizationId = stored;
        }
        setCtx(body);
      } catch {
        /* signed-out / offline */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectOrganization = useCallback(async (organizationId: string) => {
    setPending(true);
    try {
      writeStoredOrgId(organizationId);
      const saved = await persistTryitOrg(organizationId);
      if (!saved) return;
      const refreshed = await fetchTryitContext();
      if (refreshed) setCtx(refreshed);
    } finally {
      setPending(false);
    }
  }, []);

  const apiKeyResolution = resolveTestApiKeyDisplay(ctx?.testApiKey);
  const personalizeSnippet = useCallback(
    (source: string) => applyPersonalize(source, { apiKey: apiKeyResolution }),
    [apiKeyResolution],
  );

  const value = useMemo<DocsWorkspaceValue>(
    () => ({
      ready,
      pending,
      signedIn: Boolean(ctx?.signedIn),
      organizations: ctx?.organizations ?? [],
      selectedOrganizationId: ctx?.selectedOrganizationId ?? null,
      apiKeyResolution,
      canSendSandbox: canSendSandbox({
        signedIn: Boolean(ctx?.signedIn),
        organizations: ctx?.organizations ?? [],
        selectedOrganizationId: ctx?.selectedOrganizationId ?? null,
        hasTestApiKey: apiKeyResolution.kind === 'full',
      }),
      pricingPlan: ctx?.pricingPlan ?? null,
      volumeTier: ctx?.volumeTier ?? null,
      personalizeSnippet,
      selectOrganization,
    }),
    [
      ready,
      pending,
      ctx,
      apiKeyResolution,
      personalizeSnippet,
      selectOrganization,
    ],
  );

  return (
    <DocsWorkspaceContext.Provider value={value}>
      {children}
    </DocsWorkspaceContext.Provider>
  );
}

const EMPTY_WORKSPACE: DocsWorkspaceValue = {
  ready: true,
  pending: false,
  signedIn: false,
  organizations: [],
  selectedOrganizationId: null,
  apiKeyResolution: { kind: 'placeholder' },
  canSendSandbox: false,
  pricingPlan: null,
  volumeTier: null,
  personalizeSnippet: (source) => source,
  selectOrganization: async () => undefined,
};

export function useDocsWorkspace(): DocsWorkspaceValue {
  return useContext(DocsWorkspaceContext) ?? EMPTY_WORKSPACE;
}

export function persistWorkspaceOrg(id: string | null): void {
  writeStoredOrgId(id);
}
