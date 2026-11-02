export default function Loading() {
  return (
    <main className="p-6" aria-busy="true" aria-live="polite">
      <p className="text-muted-foreground">Loading…</p>
    </main>
  );
}
