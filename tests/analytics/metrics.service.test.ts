import { describe, it, expect } from 'vitest';
import { summarizeMetrics } from '@/lib/analytics/metrics.service';

describe('metrics.service (no fixtures)', () => {
  it('returns skeleton with request-id and audit note (no fixtures)', async () => {
    const result = await summarizeMetrics({ requestId: 'test-req-2026-10-27' });
    expect(result.claimCount).toBe(0);
    expect(result.inspectionCount).toBe(0);
    expect(result.settlementGhsPesewas).toBe(0);
    expect(result.meta.requestId).toBe('test-req-2026-10-27');
    expect(result.meta.note).toContain('Skeleton');
  });

  // No fixtures required; analytics endpoint is skeleton only (M5 fixtures deferred).
  it('returns skeleton for any valid requestId', async () => {
    const result = await summarizeMetrics({ requestId: 'test-fetch-2026-10-27' });
    expect(result.meta.requestId).toBe('test-fetch-2026-10-27');
  });
});
