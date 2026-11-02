import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function StaffEstimatesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="staff" />
      <main aria-label="Staff estimates" className="mx-auto max-w-5xl flex-1 px-6 py-10">
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight">Estimates</h2>
        <p className="mb-6 text-muted-foreground">Loss-adjustment estimates and approvals. All amounts DECIMAL integer pesewas — never float.</p>
        <section aria-label="Pending estimates (skeleton)" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Pending review</h3>
          <p className="text-sm text-muted-foreground">No estimates pending. Estimate records appear once the DB wiring lands.</p>
          <p className="mt-2 text-xs text-muted-foreground">Financial math via lib/finances/money.ts (integer pesewas; float artifacts rejected).</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
