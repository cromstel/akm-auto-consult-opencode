/**
 * Analytics aggregation — server-side only; deny-by-default authorization
 * checked by caller (proxy/auth middleware) before invoking.
 * All monetary values via DECIMAL integer pesewas (lib/finances/money.ts);
 * never float. Audit link references request-id only (no DB URL, no secret).
 */
export interface SummaryMetrics {
  claimCount: number;
  inspectionCount: number;
  settlementGhsPesewas: number;
  meta: {
    requestId: string;
    generatedAt: string;
    note: string;
  };
}

export async function summarizeMetrics(
  options: { requestId: string }
): Promise<SummaryMetrics> {
  // Skeleton — real DB aggregation wired after M5 fixtures delivered.
  // Server-side DB access required; deny-by-default enforced by caller.
  return {
    claimCount: 0,
    inspectionCount: 0,
    settlementGhsPesewas: 0,
    meta: {
      requestId: options.requestId,
      generatedAt: new Date().toISOString(),
      note: 'Skeleton — M5 fixtures required for real aggregation.',
    },
  };
}
