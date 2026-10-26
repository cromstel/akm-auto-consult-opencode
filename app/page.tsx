export default function HomePage() {
  return (
    <section className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">AKM Auto Consult</h2>
      <p className="text-muted-foreground leading-relaxed">
        Motor claim management, inspections, AI-assisted damage detection,
        estimates, and settlement — for customers, staff, and partners.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <a href="/auth/customer/sign-in" className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg mb-1">Customer Portal</h3>
          <p className="text-sm text-muted-foreground">Register, submit claims, track progress.</p>
        </a>
        <a href="/auth/claims/sign-in" className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg mb-1">Claims & Adjustments</h3>
          <p className="text-sm text-muted-foreground">Intake, inspection, estimates, approvals.</p>
        </a>
        <a href="/auth/admin/sign-in" className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg mb-1">Admin Console</h3>
          <p className="text-sm text-muted-foreground">Users, roles, audit, settings.</p>
        </a>
      </div>
    </section>
  );
}
