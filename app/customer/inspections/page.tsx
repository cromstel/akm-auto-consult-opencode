import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';
import Link from 'next/link';

export default function CustomerInspectionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="customer" />
      <main aria-label="Customer inspections" className="mx-auto max-w-5xl flex-1 px-6 py-10">
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight">Inspections</h2>
        <p className="text-muted-foreground mb-6">Schedule assessments and review results. Inspection photos / AVIF evidence will be attached after fixtures delivered.</p>

        <section aria-label="Scheduled inspections" className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-6">
          <h3 className="mb-2 text-lg font-semibold">Scheduled (skeleton)</h3>
          <p className="text-sm text-muted-foreground">No scheduled inspections for this account.</p>
          <p className="mt-3 text-sm">
            <Link className="underline underline-offset-2 hover:text-primary" href="/inspections/sample">Open a sample inspection checklist</Link>
          </p>
        </section>

        <aside aria-label="Image notes" className="rounded-xl border border-border bg-card/60 p-6">
          <h3 className="mb-2 text-base font-semibold">Evidence images</h3>
          <p className="text-sm text-muted-foreground">Real AVIF fixtures from provider / user to be processed through <code>lib/pipeline/avif-evidence.ts</code> with audit links (request-id only).</p>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
