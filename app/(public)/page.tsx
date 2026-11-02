import { getAppName } from '@/lib/env';

export default function HomePage() {
  const appName = getAppName();

  return (
    <div className="relative overflow-x-hidden">
      {/* Subtle geometric grid background — industrial, not decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <section className="relative mx-auto max-w-5xl px-6 py-16 md:py-24 space-y-16">
        {/* Hero — purpose + audience first, no vague copy */}
        <header className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {appName}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Motor claim management, field inspection, loss-adjustment estimates,
            and settlement — for customers, claims officers, adjusters,
            inspectors, finance, and auditors.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="/auth/customer/sign-in" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">Customer sign in</a>
            <a href="/auth/admin/sign-in" className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-primary/10">Staff / admin</a>
          </div>
        </header>

        {/* Feature grid — claim lifecycle */}
        <section aria-label="Capabilities" className="grid gap-6 md:grid-cols-3">
          <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Claims submitted</h3>
            <p className="text-sm text-muted-foreground">Customers register claims with vehicle, damage, and policy data. Each claim gets a unique id and status lifecycle.</p>
          </article>
          <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Inspection + evidence</h3>
            <p className="text-sm text-muted-foreground">Field inspections use checklist items linked to AVIF-processed evidence images. Audit links correlate every upload.</p>
          </article>
          <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Estimates + settlement</h3>
            <p className="text-sm text-muted-foreground">Adjusters set estimates; finance approves; settlement records are audited. Deny-by-default RBAC at every step.</p>
          </article>
        </section>

        {/* Evidence pipeline note */}
        <section aria-label="Evidence pipeline" className="rounded-2xl border border-border bg-card/60 p-6">
          <h2 className="mb-2 text-xl font-semibold">Evidence pipeline</h2>
          <p className="text-sm text-muted-foreground">Images upload through an AVIF pipeline (client validates type/size; server re-validates, converts, writes <code>Evidence</code> and <code>Inspection.checklistData</code>, audits to <code>Audit</code>).</p>
        </section>
      </section>

      <footer aria-label="Public footer" className="mx-auto max-w-5xl px-6 pb-12 pt-4">
        <div className="mx-auto max-w-5xl px-6 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {getAppName()}</span>
          <span>Ghana · VAT 15% + NHIL/GETFund 5% · GHS (pesewas) · Africa/Accra</span>
        </div>
      </footer>
    </div>
  );
}
