/* @proprietary license */

'use client';

// Self-contained global error boundary. Next 16's default `_global-error`
// page fails to prerender under Turbopack (useContext of null), which breaks
// `next build`. Keep this dependency-free (no providers/contexts/i18n) so it
// prerenders, matching checkout.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafaf9',
          color: '#1c1917',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          padding: '64px 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 384, textAlign: 'left' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              500
            </p>
            <span
              aria-hidden
              style={{
                width: 1,
                height: 36,
                flexShrink: 0,
                backgroundColor: 'rgba(28, 25, 23, 0.15)',
              }}
            />
            <h1
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                lineHeight: 1.35,
              }}
            >
              Something went wrong
            </h1>
          </div>
          <p
            style={{
              margin: '16px 0 0',
              fontSize: 13,
              lineHeight: 1.6,
              color: '#78716c',
            }}
          >
            An unexpected error occurred while loading this page. Please try
            again.
          </p>
          {error?.digest ? (
            <p
              style={{
                margin: '12px 0 0',
                fontSize: 12,
                color: '#a8a29e',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            >
              Reference: {error.digest}
            </p>
          ) : null}
          <div
            style={{
              marginTop: 16,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                cursor: 'pointer',
                border: 0,
                background: 'transparent',
                color: '#78716c',
                borderRadius: 4,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
