import Link from 'next/link';
import { filterNavForRoles, type NavItem } from '@/lib/navigation';

/**
 * Reusable RBAC-aware sidebar. Renders only items permitted for the given
 * verified roles; with no authenticated role it shows a sign-in-required
 * notice instead of fabricating access. Phase 2 passes real session roles
 * from server middleware (verified session token, expected-role check).
 */
export function RbacSidebar({
  items,
  roles,
  isLoading = false,
}: {
  items: readonly NavItem[];
  roles: readonly string[];
  isLoading?: boolean;
}) {
  const permitted = filterNavForRoles(items, roles);
  const denied = roles.length === 0 && !isLoading;
  return (
    <aside
      className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-border bg-card/40 p-4 md:flex lg:w-72"
      aria-label="Staff portal navigation"
    >
      <nav aria-label="Staff portal" className="flex flex-col gap-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
            Verifying session…
          </p>
        ) : denied ? (
          <div role="status" aria-live="polite">
            <p className="text-sm text-muted-foreground">
              Sign-in required — no portal items are available without an authenticated staff role.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Deny-by-default: access is denied until server-side session validation confirms an expected staff role.
            </p>
          </div>
        ) : permitted.length === 0 ? (
          <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
            Your role does not permit any portal items. Contact an administrator.
          </p>
        ) : (
          permitted.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground underline-offset-2"
            >
              {item.label}
            </Link>
          ))
        )}
      </nav>
    </aside>
  );
}
