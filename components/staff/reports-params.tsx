"use client";
import { useState } from 'react';

export interface AnalyticsResponse {
  data: {
    claimCount: number;
    inspectionCount: number;
    settlementGhsPesewas: number;
  };
  meta: { requestId: string; generatedAt: string };
  audit?: { endpoint: string; note: string; rollbackDoc: string };
}

interface AnalyticData {
  claimCount: number; inspectionCount: number; settlementGhsPesewas: number;
  meta: { requestId: string; generatedAt: string };
  audit?: { endpoint: string; note: string; rollbackDoc: string };
}

export default function ReportsClient() {
  const [params, setParams] = useState({ claimState: 'all', from: '', to: '' });
  const [result, setResult] = useState<AnalyticData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const url = new URL('/api/analytics/summary', window.location.origin);
      url.searchParams.set('requestId', 'report-' + Date.now());
      if (params.claimState && params.claimState !== 'all') url.searchParams.set('claimState', params.claimState);
      if (params.from) url.searchParams.set('from', params.from);
      if (params.to) url.searchParams.set('to', params.to);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Analytics fetch failed: ' + res.status);
      const body = (await res.json()) as AnalyticsResponse;
      const data = body.data;
      setResult({
        claimCount: data.claimCount ?? 0,
        inspectionCount: data.inspectionCount ?? 0,
        settlementGhsPesewas: data.settlementGhsPesewas ?? 0,
        meta: body.meta || { requestId: '', generatedAt: new Date().toISOString() },
        audit: body.audit,
      });
    } catch (e: unknown) {
      setError((e as Error)?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-label="Report parameters" className="mt-8">
      <h3 className="text-xl font-bold">Parameter input</h3>
      <form
        onSubmit={(e) => { e.preventDefault(); load(); }}
        className="mt-4 flex flex-wrap gap-3 items-end"
        aria-label="Analytics query parameters"
      >
        <label className="flex flex-col gap-1 text-sm">
          Claim state
          <select
            aria-label="Claim state filter"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm"
            value={params.claimState}
            onChange={(e) => setParams({ ...params, claimState: e.target.value })}
          >
            <option value="all">All</option>
            <option value="settled">Settled</option>
            <option value="pending">Pending</option>
            <option value="disputed">Disputed</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          From (date)
          <input
            aria-label="From date"
            type="date"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm"
            value={params.from}
            onChange={(e) => setParams({ ...params, from: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          To (date)
          <input
            aria-label="To date"
            type="date"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm"
            value={params.to}
            onChange={(e) => setParams({ ...params, to: e.target.value })}
          />
        </label>
        <button
          type="submit"
          aria-label="Load analytics"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load live data'}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {result && (
        <article aria-label="Live analytics" className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h4 className="text-lg font-semibold">Analytics summary (live)</h4>
          <dl className="mt-3 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Claim count</dt>
              <dd className="text-2xl font-extrabold">{result.claimCount.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Inspection count</dt>
              <dd className="text-2xl font-extrabold">{result.inspectionCount.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Settlement (GHS pesewas)</dt>
              <dd className="text-2xl font-extrabold">{result.settlementGhsPesewas.toLocaleString()}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Request-id: <code className="rounded bg-muted px-1 py-0.5 text-xs">{result.meta?.requestId || '—'}</code>
            {result.meta?.generatedAt ? ' • Generated ' + new Date(result.meta.generatedAt).toLocaleString() : ''}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Source endpoint: <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/analytics/summary</code>
            {result.audit?.note ? ' — ' + result.audit.note : ''}
          </p>
        </article>
      )}
    </section>
  );
}
