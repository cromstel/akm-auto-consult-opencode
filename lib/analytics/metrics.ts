import type { ClaimStatus } from '@/lib/claims/state';

/**
 * Analytics module — pure metric helpers. Dashboards (Phase 8) layer
 * role-scoped repository queries on top of these; no metric row ever
 * bypasses server-side scope filtering.
 */
export interface ClaimStatusCount {
  status: ClaimStatus;
  count: number;
}

const STATUSES: readonly ClaimStatus[] = [
  'submitted',
  'assigned',
  'inspected',
  'estimated',
  'approved',
  'resolved',
];

export function emptyStatusSummary(): Record<ClaimStatus, number> {
  const summary = {} as Record<ClaimStatus, number>;
  for (const status of STATUSES) summary[status] = 0;
  return summary;
}

export function summarizeByStatus(counts: readonly ClaimStatusCount[]): Record<ClaimStatus, number> {
  const summary = emptyStatusSummary();
  for (const entry of counts) {
    summary[entry.status] += entry.count;
  }
  return summary;
}

/** Open claims = everything not yet resolved. */
export function totalOpen(counts: readonly ClaimStatusCount[]): number {
  return counts
    .filter((entry) => entry.status !== 'resolved')
    .reduce((sum, entry) => sum + entry.count, 0);
}
