import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="p-6">
      <h2 className="mb-2 text-lg font-semibold">Page not found</h2>
      <p className="mb-4 text-muted-foreground">
        The page you requested does not exist or is outside your scope.
      </p>
      <Link href="/" className="underline">
        Back to home
      </Link>
    </main>
  );
}
