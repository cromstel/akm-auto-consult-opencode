'use client';

/**
 * Root error boundary — replaces the entire document when the root layout
 * itself throws. Inline styles only: stylesheets may not have loaded.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Something went wrong</h2>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
          Reference: {error.digest ?? 'n/a'}
        </p>
        <button type="button" onClick={reset} style={{ padding: '0.5rem 1rem' }}>
          Try again
        </button>
      </body>
    </html>
  );
}
