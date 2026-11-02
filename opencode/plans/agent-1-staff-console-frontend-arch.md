# Agent 1 — Staff-Console Frontend Architecture Spec
Target: M4 gate (post-M2 auth, pre-M5 AI). Agent 1 role per agent-org-plan.md (UI/RBAC/portals).

## 1. RBAC sidebar + role-check middleware (staff routes)
- Component: components/layout/rbac-sidebar.tsx (existing; M3A wired with verified-role state, deny-default message, responsive md:flex, aria-live). Agent 1 preserves — no rewrite needed unless new nav items added.
- Route guard: app/staff/layout.tsx (async server component, reads session cookie via next/headers cookies(), verifies verifySessionToken(), maps payload.role -> verifiedRoles[] passed to RbacSidebar; try/catch -> [] deny-by-default). Keep; when M2 middleware completes prefer middleware-injected props over re-verifying in layout (per docs/release/admin-console-frontend.md M2 wire notes).
- Middleware gap to document (not Agent 1's build): lib/auth/auth.middleware.ts checks only customer role; staff expected-role + deny-by-default middleware deferred — Agent 1 pages must still rely on server-side authorization (layout + endpoint checks), never client-only hide.
- File paths to edit: components/layout/rbac-sidebar.tsx (add new page links); app/staff/layout.tsx (no structural change until M2 middleware delivers props); lib/navigation.ts (STAFF_NAV) if new sections added.

## 2. Admin invite endpoint wire-up (replace alert with POST)
- Current: app/staff/admin/page.tsx line 49 — onSubmit alert('Invite submitted — server-side provisioning required (M2 auth not fully wired)').
- Agent 1 action: replace with real form POST to /api/staff/invite (placeholder server handler allowed; document what's missing). Form fields already present (email, role select, scope select).
- Placeholder handler: app/api/staff/invite/route.ts (NEW, server-only; validate email, role in allowed RoleFamily, scope; call staff provisioning service if M2 DB available; else return 202 with message "provisioning queued — M2 auth middleware pending"). Must use deny-by-default guard; audit mutation (actor/action/resource/requestId) per docs/release/admin-console-backend.md.
- What's missing (document, don't block M4): M2 session middleware fully enforcing staff session; DB staff_provisioning table (see migration below) not yet applied to dev DB; audit service fully wired to mutation; MFA/step-up for privileged actions pending.
- File paths: app/staff/admin/page.tsx (form submit only); app/api/staff/invite/route.ts (new placeholder); docs/release/admin-console-frontend.md (update M2 wire notes).

## 3. Staff pages to complete (Agent 1 scope — UI + layout integration)
Per agent-org-plan.md M4 claims workflow + M7 analytics/dashboard; Agent 1 owns pages, not DB/AI. Target pages (all under /staff/ using layout + sidebar):
- dashboard — summary cards, claim counts, open inspections (skeleton until M2 analytics aggregation; Agent 2 provides /api/analytics/summary — Agent 1 consumes).
- claims — list/detail + assignment UI (integrates with Agent 2 claim-state machine at M4; Agent 1 only displays / uses API).
- inspections — inspector view + photo annotations (Agent 3 image pipeline feeds /uploads/claims/{id}/; Agent 1 renders with next/image).
- estimates — adjuster view + cost calculation display (Agent 2 M6 logic; Agent 1 renders DECIMAL-safe integer pesewas, no float formatting).
- finance — branch / global financial view (Agent 2 DB aggregation; Agent 1 table + export).
- analytics — /api/analytics/summary consumer (Agent 2 endpoint exists; Agent 1 builds charts/dashboard grid; fix open TypeScript status-object errors noted in M2 gate).
- reports — existing /staff/reports (M3A) — extend with new report types (audit export, claim summary PDF via Agent 3 doc generation reference only; Agent 1 links to generated URLs).
- Key file paths: app/staff/dashboard/page.tsx (new); app/staff/claims/page.tsx (new); app/staff/inspections/page.tsx (new); app/staff/estimates/page.tsx (new); app/staff/finance/page.tsx (new); app/staff/analytics/page.tsx (new); app/staff/reports/page.tsx (extend); each with corresponding page.tsx route; shared components in components/staff/ (new folder for cards, tables, filters).

## 4. Migration to apply (Agent 2 applies; Agent 1 verifies schema awareness)
- File: prisma/migrations/20261102_admin_console_staff_audit.sql (Agent 2 built; NOT applied automatically per docs/release/admin-console-backend.md).
- Defines: staff_provisioning (actor/role/scope/requestId/timestamp + audit index); session_role (user/session/role/scope/verified_at + session rotation hooks). Agent 1 must not assume tables exist in dev until Agent 2 applies (`prisma migrate deploy` after M2 review). Document on M2 checkpoint.
- Agent 1 impact: staff invite endpoint references staff_provisioning; session_role needed for middleware-injected props; sidebar verifiedRoles derived from session_role once middleware uses it.
- Verification action (Agent 1): after Agent 2 applies migration, confirm `prisma generate` produces types for staff_provisioning / session_role; update invite endpoint types accordingly.

## 5. Key file paths — Agent 1 write/edit targets
- Layout / RBAC: components/layout/rbac-sidebar.tsx; app/staff/layout.tsx (interim — minimal change until M2 middleware);
- Admin page (invite wire): app/staff/admin/page.tsx; NEW app/api/staff/invite/route.ts;
- Staff pages: app/staff/dashboard/page.tsx; app/staff/claims/page.tsx; app/staff/inspections/page.tsx; app/staff/estimates/page.tsx; app/staff/finance/page.tsx; app/staff/analytics/page.tsx; app/staff/reports/page.tsx (extend);
- Components: components/staff/ (new — cards, filter-bar, claim-row, estimate-card, audit-table, analytics-chart-wrapper);
- Nav / types: lib/navigation.ts (STAFF_NAV); prisma/schema adjustments only by Agent 2 — Agent 1 reads generated types;
- Docs: docs/release/admin-console-frontend.md (update M2/M4 wire notes, missing endpoints list); docs/release/admin-console-backend.md (cross-ref invite endpoint).
- Security / quality (pre-commit per AGENTS.md / verification-loop): no secrets in JSX; input validated server-side; generic errors to client; audit records mutations; deny-by-default enforced server-side; no hardcoded fixtures.

## M2 / M4 / M7 sync notes (3-agent, per agent-org-plan.md)
- M2 gate (auth): Agent 1 depends on Agent 2 middleware + session_role. Agent 1 delivers sidebar/layout only; no production invite endpoint until middleware verifies session. Keep placeholder 202 with audit note.
- M4 gate (claims): Agent 1 pages integrate Agent 2 claim-state API + Agent 3 image uploads. Parallel — Agent 1 can scaffold claim/inspection pages with skeleton API calls; Agent 2 fills endpoints.
- M7 gate (deployment): Agent 1 completes analytics/dashboard charts, final responsive tests, Lighthouse; Agent 3 delivers AVIF pipeline; Agent 2 delivers DB aggregation.
- No code in spec (only paths); placeholder server handler documented; migration noted as Agent 2 responsibility with Agent 1 verification step.
