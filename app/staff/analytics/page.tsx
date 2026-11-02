import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { getAppName } from '@/lib/env';

export default function AnalyticsPage() {
  const appName = getAppName();

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="staff" />
      <main aria-label="Analytics and reporting" className="mx-auto max-w-5xl flex-1 px-6 py-10">
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight">Analytics — {appName}</h2>
        <p className="mb-6 text-muted-foreground">Claim-state transitions, inspection counts, settlement summaries — server-side only.</p>

        <section aria-label="Key metrics" className="grid gap-4 md:grid-cols-3">
          <article aria-label="Claims submitted" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Claims submitted</h3>
            <p className="text-3xl font-bold">—</p>
            <p className="text-xs text-muted-foreground">(DB connection required — skeleton only)</p>
          </article>
          <article aria-label="Inspections completed" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Inspections completed</h3>
            <p className="text-3xl font-bold">—</p>
            <p className="text-xs text-muted-foreground">(M5 fixtures required for real counts)</p>
          </article>
          <article aria-label="Settlement value (GHS pesewas)" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Settlement (GHS)</h3>
            <p className="text-3xl font-bold">—</p>
            <p className="text-xs text-muted-foreground">DECIMAL integer pesewas — never float</p>
          </article>
        </section>

        <aside aria-label="Access boundary" className="mt-6 rounded-xl border border-border bg-card/60 p-6">
          <h3 className="mb-2 text-base font-semibold">Access boundary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Analytics visible only to authorized staff roles (deny-by-default). All figures computed server-side.
            No production fixtures shown; M5 fixtures will populate metrics when delivered.
          </p>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
