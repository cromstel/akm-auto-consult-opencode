import { SiteFooter } from '@/components/layout/site-footer';
import { PortalHeader } from '@/components/layout/portal-header';
import { CUSTOMER_NAV } from '@/lib/navigation';
import Link from 'next/link';

export default function CustomerDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="customer" />
      <section className="container mx-auto flex-1 py-8" aria-label="Customer dashboard">
        <h2 className="mb-4 text-2xl font-semibold">Overview</h2>
        <nav aria-label="Customer portal" className="mb-6 flex gap-4">
          {CUSTOMER_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="underline underline-offset-2 hover:text-primary transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="grid gap-4 md:grid-cols-3">
          <a href="/customer/claims" className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow" aria-label="View claims">
            <h3 className="mb-1 text-lg font-semibold">Claims</h3>
            <p className="text-sm text-muted-foreground">Submit new claims and track existing ones.</p>
          </a>
          <a href="/customer/vehicles" className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow" aria-label="Manage vehicles">
            <h3 className="mb-1 text-lg font-semibold">Vehicles</h3>
            <p className="text-sm text-muted-foreground">Add or review insured vehicles.</p>
          </a>
          <a href="/customer/inspections" className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow" aria-label="Inspections">
            <h3 className="mb-1 text-lg font-semibold">Inspections</h3>
            <p className="text-sm text-muted-foreground">Schedule and view inspection results.</p>
          </a>
        </div>

        <aside aria-label="Recent claims" className="mt-8 rounded-xl border border-border bg-card p-6">
          <h3 className="mb-3 text-lg font-semibold">Recent claims</h3>
          <p className="text-sm text-muted-foreground">No open claims found for this account.</p>
        </aside>
      </section>
      <SiteFooter />
    </div>
  );
}
