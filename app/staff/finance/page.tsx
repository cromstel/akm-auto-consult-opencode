import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function StaffFinancePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="staff" />
      <main aria-label="Staff finance" className="mx-auto max-w-5xl flex-1 px-6 py-10">
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight">Finance</h2>
        <p className="text-muted-foreground mb-6">Invoices, settlements, reconciliation — DECIMAL integer pesewas only; no float arithmetic.</p>
        <section aria-label="Settlement summary" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Settlements (skeleton)</h3>
          <p className="text-sm text-muted-foreground">No settlement records for this period.</p>
          <p className="text-xs text-muted-foreground">All values stored as DECIMAL integer pesewas through lib/finances/money.ts.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
