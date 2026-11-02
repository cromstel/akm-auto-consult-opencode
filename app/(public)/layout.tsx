import { SiteFooter } from '@/components/layout/site-footer';
import { ThemeToggle } from '@/components/theme-toggle';
import { getAppName } from '@/lib/env';

/**
 * Public marketing shell — distinct header/footer from the authenticated
 * portals (customer/staff render their own PortalHeader shells).
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{getAppName()}</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
      <SiteFooter />
    </>
  );
}
