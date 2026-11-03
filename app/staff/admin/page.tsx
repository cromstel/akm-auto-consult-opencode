import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { StaffInviteForm, AuditQueryForm } from './forms';

export default function StaffAdminPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="staff" />
      <main aria-label="Admin console" className="mx-auto max-w-5xl flex-1 px-6 py-10">
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight">Admin</h2>
        <p className="mb-6 text-muted-foreground">Authorized admin staff only. Provisioning, role assignment, platform configuration, audit search, and retention policy.</p>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Role management */}
          <section aria-label="Role management" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold">Role management</h3>
            <p className="text-sm text-muted-foreground mb-3">Nine seeded role families; deny-by-default enforced server-side. UI visibility is convenience only.</p>
            <table className="w-full text-sm" aria-label="Role families">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Scope</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['admin', 'global'],
                  ['claims_officer', 'branch / assigned'],
                  ['adjuster', 'assigned'],
                  ['inspector', 'branch / assigned'],
                  ['finance', 'branch / global'],
                  ['auditor', 'global'],
                  ['support', 'branch / assigned'],
                  ['customer', 'self'],
                ].map(([role, scope]) => (
                  <tr key={String(role)} className="border-t border-border">
                    <td className="py-2 font-medium">{String(role)}</td>
                    <td className="py-2 text-muted-foreground">{String(scope)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Staff invitation (admin-only) */}
          <section aria-label="Staff invitation" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold">Staff invitation (admin-only)</h3>
            <p className="text-sm text-muted-foreground mb-3">Public registration creates customers only. Staff accounts must be provisioned by an admin with verified session.</p>
            <StaffInviteForm />
            <p className="mt-3 text-xs text-muted-foreground">Invitation is a server-side mutation; audit log records actor / action / resource / time / request-id.</p>
          </section>

          {/* Settings */}
          <section aria-label="Settings" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold">Settings</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Session rotation / revocation configured server-side.</li>
              <li>CSRF protection enabled on state-changing operations.</li>
              <li>MFA / step-up available for privileged actions (pending enablement).</li>
              <li>No production fixtures; .env.local masked; no secrets in JSX.</li>
            </ul>
          </section>

          {/* Audit search */}
          <section aria-label="Audit search" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold">Audit search</h3>
            <AuditQueryForm />
            <p className="mt-3 text-xs text-muted-foreground">Audit entries include request-id correlation; server-side authorization checks deny by default.</p>
          </section>

          {/* Retention policy */}
          <section aria-label="Retention policy" className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold">Retention policy</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <article className="rounded-xl border border-border bg-card/70 p-4">
                <h4 className="font-semibold">Audit logs</h4>
                <p className="text-sm text-muted-foreground">Retained 7 years; immutable storage; access restricted to auditor / admin roles.</p>
              </article>
              <article className="rounded-xl border border-border bg-card/70 p-4">
                <h4 className="font-semibold">Staff provisioning records</h4>
                <p className="text-sm text-muted-foreground">Retained 3 years after offboarding; role-change history preserved.</p>
              </article>
              <article className="rounded-xl border border-border bg-card/70 p-4">
                <h4 className="font-semibold">Claims / inspection data</h4>
                <p className="text-sm text-muted-foreground">Per sector regulation; retention enforced at DB layer; no soft-deletes for audit-critical events.</p>
              </article>
            </div>
          </section>

          {/* Access boundary */}
          <aside aria-label="Access boundary" className="mt-6 rounded-xl border border-border bg-card/60 p-6">
            <h3 className="mb-2 text-base font-semibold">Access boundary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Admin actions require an authorized admin session (server-side verification; UI visibility is convenience only). Privileged actions require MFA / step-up when enabled. Phase 2 auth middleware (expected-role validation, deny-by-default middleware) is not fully wired — sidebar currently shows sign-in-required state (roles={[]}) until session roles are passed.
            </p>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
