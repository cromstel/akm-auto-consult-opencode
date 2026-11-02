import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';
import Link from 'next/link';

export default function StaffInspectionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="staff" />
      <main aria-label="Staff inspections" className="mx-auto max-w-5xl flex-1 px-6 py-10">
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight">Inspections</h2>
        <p className="mb-6 text-muted-foreground">Scheduled and completed field assessments. Select an inspection to work its checklist.</p>
        <section aria-label="Assigned inspections (skeleton)" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Assigned inspections</h3>
          <p className="text-sm text-muted-foreground">No assigned inspections. Inspection records appear once the DB wiring lands.</p>
          <p className="mt-3 text-sm">
            <Link className="underline underline-offset-2 hover:text-primary" href="/inspections/sample">Open a sample inspection checklist</Link>
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
