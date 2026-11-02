import type { RoleFamily } from '@/lib/authorization/authorization';

/**
 * Navigation registry. Each item declares the roles permitted to see it.
 * UI visibility is convenience only — authorization is enforced
 * server-side on every request (deny-by-default).
 */
export interface NavItem {
  label: string;
  href: string;
  roles: readonly RoleFamily[];
}

const ALL_STAFF: readonly RoleFamily[] = [
  'admin',
  'claims_officer',
  'adjuster',
  'inspector',
  'finance',
  'auditor',
  'support',
];

export const CUSTOMER_NAV: readonly NavItem[] = [
  { label: 'Dashboard', href: '/customer/dashboard', roles: ['customer'] },
  { label: 'Claims', href: '/customer/claims', roles: ['customer'] },
  { label: 'Vehicles', href: '/customer/vehicles', roles: ['customer'] },
  { label: 'Inspections', href: '/customer/inspections', roles: ['customer'] },
];

export const STAFF_NAV: readonly NavItem[] = [
  { label: 'Dashboard', href: '/staff/dashboard', roles: ALL_STAFF },
  { label: 'Claims', href: '/staff/claims', roles: ['admin', 'claims_officer', 'adjuster', 'inspector', 'support'] },
  { label: 'Inspections', href: '/staff/inspections', roles: ['admin', 'inspector'] },
  { label: 'Estimates', href: '/staff/estimates', roles: ['admin', 'adjuster'] },
  { label: 'Finance', href: '/staff/finance', roles: ['admin', 'finance'] },
  { label: 'Reports', href: '/staff/reports', roles: ['admin', 'auditor', 'finance'] },
  { label: 'Admin', href: '/staff/admin', roles: ['admin'] },
];

/** Role families permitted to enter the staff portal. Non-staff roles are denied-by-default here. */
export const STAFF_ROLE_FAMILIES: readonly RoleFamily[] = [
  'admin',
  'management',
  'claims_officer',
  'adjuster',
  'inspector',
  'finance',
  'auditor',
  'support',
] as const;

/** Extract verified staff roles from a decoded session payload. Returns [] when the role is outside staff families. */
export function extractStaffRoles(role: string | undefined | null): string[] {
  if (!role || typeof role !== 'string') return [];
  if (!(STAFF_ROLE_FAMILIES as readonly string[]).includes(role)) return [];
  return [role];
}

/**
 * Deny-by-default navigation filter: only items whose required roles intersect
 * the caller's verified roles are returned. Empty roles -> no items.
 */
export function filterNavForRoles(items: readonly NavItem[], roles: readonly string[]): NavItem[] {
  const owned = new Set(roles);
  return items.filter((item) => item.roles.some((role) => owned.has(role)));
}
