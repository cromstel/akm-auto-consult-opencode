import Link from 'next/link';
import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { CUSTOMER_NAV } from '@/lib/navigation';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="customer" />
      <section className="container mx-auto flex-1 py-8">
        <nav aria-label="Customer portal" className="mb-4 flex gap-4">
          {CUSTOMER_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="underline">
              {item.label}
            </Link>
          ))}
        </nav>
        {children}
      </section>
      <SiteFooter />
    </div>
  );
}
