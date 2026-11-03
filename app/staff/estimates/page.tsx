import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { EstimateRepo } from '@/lib/db/estimate.repository';

// Staff estimates dashboard — server component.
// Auth enforced by middleware (staff-auth.ts). All amounts are integer pesewas (DECIMAL);
// float inputs are rejected at the repository layer (DECIMAL_INVALID check).
export default async function StaffEstimatesPage() {
  const estimates = await EstimateRepo.listStaff('global');
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="staff" />
      <main aria-label="Staff estimates" className="mx-auto max-w-5xl flex-1 px-6 py-10">
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight">Estimates</h2>
        <p className="mb-6 text-muted-foreground">
          Loss-adjustment estimates and approvals. All amounts DECIMAL(12,2) integer pesewas — never float; denials on any out-of-scope role.
        </p>
        <section aria-label="Estimates list" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {estimates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No estimates on file yet.</p>
          ) : (
            <ul className="space-y-4">
              {estimates.map((e) => (
                <li key={e.id} className="flex flex-wrap gap-4 border-b border-border/50 pb-4 last:border-0">
                  <span className="font-semibold text-muted-foreground">{e.claim?.customer?.name}</span>
                  <span className="font-medium">Total: {(Number(e.total)).toLocaleString('en-US', { maximumFractionDigits: 2 })} pesewa(s)</span>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">{e.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
