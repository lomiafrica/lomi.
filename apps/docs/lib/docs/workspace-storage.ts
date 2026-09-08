/* @proprietary license */

const ORG_KEY = 'lomi.docs.selected-org';

export function readStoredOrgId(): string | null {
  if (!('localStorage' in globalThis)) return null;
  try {
    return window.localStorage.getItem(ORG_KEY);
  } catch {
    return null;
  }
}

export function writeStoredOrgId(id: string | null): void {
  if (!('localStorage' in globalThis)) return;
  try {
    if (id) window.localStorage.setItem(ORG_KEY, id);
    else window.localStorage.removeItem(ORG_KEY);
  } catch {
    /* ignore quota / private mode */
  }
}
