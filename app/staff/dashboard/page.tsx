import { RbacSidebar } from '@/components/layout/rbac-sidebar';
import { SiteFooter } from '@/components/layout/site-footer';
import { STAFF_NAV } from '@/lib/navigation';

/**
 * Staff portal dashboard — deny-by-default visible via server-side role check.
 * RbacSidebar renders only permitted nav items; if no authenticated roles
 * exist the sidebar shows the sign-in-required message (never fabricates
 * access). Real session verification lives server-side (proxy + auth middleware).
 */
export default function StaffDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <RbacSidebar items={STAFF_NAV} roles={[]} />
        <main className="flex-1 p-6" aria-label="Staff dashboard">
          <h2 className="mb-4 text-2xl font-semibold">Staff Overview</h2>
          <aside aria-label="Module links" className="grid gap-4 md:grid-cols-3">
            <a href="/staff/claims" className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow" aria-label="Claims module">
              <h3 className="mb-1 text-lg font-semibold">Claims</h3>
              <p className="text-sm text-muted-foreground">Assigned claims, inspections, and adjustments.</p>
            </a>
            <a href="/staff/inspections" className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow" aria-label="Inspections module">
              <h3 className="mb-1 text-lg font-semibold">Inspections</h3>
              <p className="text-sm text-muted-foreground">Scheduled and completed field assessments.</p>
            </a>
            <a href="/staff/finance" className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow" aria-label="Finance module">
              <h3 className="mb-1 text-lg font-semibold">Finance</h3>
              <p className="text-sm text-muted-foreground">Invoices, settlements, and reconciliation.</p>
            </a>
          </aside>

          <aside aria-label="Pending tasks" className="mt-8 rounded-xl border border-border bg-card p-6">
            <h3 className="mb-3 text-lg font-semibold">Pending tasks</h3>
            <p className="text-sm text-muted-foreground">No pending tasks for this staff account.</p>
          </aside>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
