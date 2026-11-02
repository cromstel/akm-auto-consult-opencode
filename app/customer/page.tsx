import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function CustomerPortalHome() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="customer" />
      <main aria-label="Customer portal" className="mx-auto max-w-5xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-semibold mb-2">Customer Portal</h1>
        <p className="text-muted-foreground">
          Submit and track claims. Access is controlled by deny-by-default RBAC, enforced server-side.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
