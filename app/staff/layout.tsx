import { cookies } from 'next/headers';
import { PortalHeader } from '@/components/layout/portal-header';
import { RbacSidebar } from '@/components/layout/rbac-sidebar';
import { SiteFooter } from '@/components/layout/site-footer';
import { STAFF_NAV, extractStaffRoles } from '@/lib/navigation';
import { verifySessionToken } from '@/lib/auth/auth.service';

/**
 * Staff/admin portal layout.
 *
 * Deny-by-default enforced server-side: only roles that belong to the staff
 * family set are accepted as verified session roles. Non-staff roles (any
 * customer or otherwise-guest role) are rejected with an empty array so the
 * sidebar renders its sign-in-required notice rather than fabricating access.
 */
export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let verifiedRoles: string[] = [];
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (sessionCookie?.value) {
      const payload = verifySessionToken(sessionCookie.value);
      if (payload && payload.role && typeof payload.role === 'string') {
        // Map verified session role to permitted staff roles array.
        // Staff roles are defined in lib/navigation (RoleFamily).
        // We pass the verified role so filterNavForRoles can intersect.
        verifiedRoles = extractStaffRoles(payload.role);
      }
    }
  } catch {
    // Server-side verification failure -> deny-by-default
    verifiedRoles = [];
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="staff" />
      <div className="flex flex-1 items-start">
        <RbacSidebar items={STAFF_NAV} roles={verifiedRoles} />
        <main className="min-w-0 flex-1 p-6" role="main">
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
