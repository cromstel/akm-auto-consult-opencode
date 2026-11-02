'use client';

/**
 * Route-segment error boundary (client). Shows a generic message only —
 * error internals never render to users.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="p-6" role="alert">
      <h2 className="mb-2 text-lg font-semibold">Something went wrong</h2>
      <p className="mb-4 text-muted-foreground">
        An unexpected error occurred. Reference: {error.digest ?? 'n/a'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg border border-border px-4 py-2 hover:bg-card transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
