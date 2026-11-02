import { describe, it, expect } from 'vitest';
import { canTransition } from '@/lib/claims/transition-guard';

describe('claim-state transition guard (server-side, deny-by-default)', () => {
  it('allows valid steps', () => {
    expect(canTransition('submitted', 'assigned')).toBe(true);
    expect(canTransition('assigned', 'inspected')).toBe(true);
    expect(canTransition('inspected', 'estimated')).toBe(true);
    expect(canTransition('estimated', 'approved')).toBe(true);
    expect(canTransition('approved', 'resolved')).toBe(true);
  });
  it('denies invalid steps', () => {
    expect(canTransition('submitted', 'estimated')).toBe(false);
    expect(canTransition('submitted', 'approved')).toBe(false);
    expect(canTransition('submitted', 'resolved')).toBe(false);
    expect(canTransition('resolved', 'submitted')).toBe(false);
    expect(canTransition('unknown', 'anything')).toBe(false);
  });
  it('denies unknown from/to generically (no internal leak)', () => {
    expect(canTransition('', 'submitted')).toBe(false);
  });
});
