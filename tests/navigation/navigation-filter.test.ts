import { describe, it, expect } from 'vitest';
import { CUSTOMER_NAV, STAFF_NAV, filterNavForRoles } from '@/lib/navigation';

describe('filterNavForRoles (deny-by-default)', () => {
  it('shows nothing without an authenticated role', () => {
    expect(filterNavForRoles(STAFF_NAV, [])).toEqual([]);
  });

  it('shows nothing for unknown roles', () => {
    expect(filterNavForRoles(STAFF_NAV, ['intruder'])).toEqual([]);
  });

  it('customer sees the full customer nav', () => {
    expect(filterNavForRoles(CUSTOMER_NAV, ['customer']).map((i) => i.label)).toEqual([
      'Dashboard',
      'Claims',
      'Vehicles',
      'Inspections',
    ]);
  });

  it('customer role cannot see staff items', () => {
    expect(filterNavForRoles(STAFF_NAV, ['customer'])).toEqual([]);
  });

  it('inspector sees only permitted staff items', () => {
    const labels = filterNavForRoles(STAFF_NAV, ['inspector']).map((i) => i.label);
    expect(labels).toEqual(['Dashboard', 'Claims', 'Inspections']);
  });

  it('admin sees all staff items', () => {
    expect(filterNavForRoles(STAFF_NAV, ['admin']).map((i) => i.label)).toEqual([
      'Dashboard',
      'Claims',
      'Inspections',
      'Estimates',
      'Finance',
      'Reports',
      'Admin',
    ]);
  });

  it('combines multiple roles union-style', () => {
    const labels = filterNavForRoles(STAFF_NAV, ['adjuster', 'finance']).map((i) => i.label);
    expect(labels).toEqual(['Dashboard', 'Claims', 'Estimates', 'Finance', 'Reports']);
  });
});
