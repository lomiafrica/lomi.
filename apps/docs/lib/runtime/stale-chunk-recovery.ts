import { isString } from '@lomi./shared';

const RELOAD_FLAG_KEY = 'docs:chunk-reload';

function isStaleChunkMessage(message: string): boolean {
  return (
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('error loading dynamically imported module') ||
    message.includes('Importing a module script failed') ||
    message.includes('Failed to load module script') ||
    message.includes('ChunkLoadError') ||
    message.includes('MIME type of "text/html"')
  );
}

function reloadOnce(reason: string): boolean {
  try {
    if (sessionStorage.getItem(RELOAD_FLAG_KEY) === '1') return false;
    sessionStorage.setItem(RELOAD_FLAG_KEY, '1');
  } catch {
    return false;
  }
  console.warn('Detected stale docs assets, reloading once:', reason);
  window.location.reload();
  return true;
}

export function registerDocsStaleChunkRecovery(): void {
  window.addEventListener(
    'error',
    (event) => {
      const message = event.message || '';
      const target = event.target;
      const fromScript =
        target instanceof HTMLScriptElement &&
        (target.type === 'module' || Boolean(target.src));
      if (fromScript || (message && isStaleChunkMessage(message))) {
        if (reloadOnce(message || 'script')) {
          event.preventDefault();
        }
      }
    },
    true,
  );

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message =
      reason instanceof Error ? reason.message : isString(reason) ? reason : '';
    if (message && isStaleChunkMessage(message) && reloadOnce(message)) {
      event.preventDefault();
    }
  });
}
