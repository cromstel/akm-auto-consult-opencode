import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';
import ReportsClient from '@/components/staff/reports-params';

export default function StaffReportsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="staff" />
      <main aria-label="Staff reports" className="mx-auto max-w-5xl flex-1 px-6 py-10">
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight">Reports</h2>
        <p className="mb-6 text-muted-foreground">Audit and reconciliation reports for finance and auditors. Parameterized queries; aggregated server-side via /api/analytics/summary.</p>
        <section aria-label="Report parameters and live data" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-bold">Live analytics reference</h3>
          <p className="text-sm text-muted-foreground">Use parameters to filter; results load from <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/analytics/summary</code> with a fresh request-id audit correlation.</p>
          <ReportsClient />
        </section>
        <aside aria-label="Access boundary" className="mt-6 rounded-xl border border-border bg-card/60 p-6">
          <h3 className="mb-2 text-base font-semibold">Access boundary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Reports are permitted for admin, auditor, and finance roles (deny-by-default; server-side enforcement on /api/analytics/summary). No formula injection: only parameterized filters applied server-side.
          </p>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
