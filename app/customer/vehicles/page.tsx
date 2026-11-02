import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function CustomerVehiclesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="customer" />
      <main aria-label="Customer vehicles" className="mx-auto max-w-5xl flex-1 px-6 py-10">
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight">Vehicles</h2>
        <p className="mb-6 text-muted-foreground">Insured vehicles on this account. Real records appear once the DB wiring lands.</p>
        <section aria-label="Vehicle list (skeleton)" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Registered vehicles</h3>
          <p className="text-sm text-muted-foreground">No vehicles registered yet.</p>
        </section>
        <aside aria-label="Access boundary" className="mt-6 rounded-xl border border-border bg-card/60 p-6">
          <h3 className="mb-2 text-base font-semibold">Access boundary</h3>
          <p className="text-sm text-muted-foreground">Only the account owner may view these records. Server-side authorization enforced.</p>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
