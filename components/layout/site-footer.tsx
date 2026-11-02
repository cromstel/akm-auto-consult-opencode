import { getAppName } from '@/lib/env';

/**
 * Shared footer rendered by every portal shell (public, customer, staff).
 * The product display name comes from validated environment config.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-6 py-4 text-sm text-muted-foreground">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>
          © {year} {getAppName()}
        </span>
        <span>Claims · Inspections · Estimates · Settlement</span>
      </div>
    </footer>
  );
}
