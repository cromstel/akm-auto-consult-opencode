# Admin Console Security Review — Agent C (Quality / Security)

Date: 2026-11-02
Scope: Front (/app/staff/admin, reports, layout, auth/admin/sign-in) + Back (v1/auth/sign-in, analytics/summary, audit service/repo/types, authorization, migrations, reports-params)
Status: PASS with noted gaps / M2 dependency

---

## 1. Deny-by-default (goal: active)
- `lib/authorization/authorization.ts` — `denyByDefault()` returns false on missing/unknown role or scope mismatch (line 49-62). `requireAuthGuard()` uses it (line 75-77).
- `app/staff/layout.tsx` — `roles={[]}` explicitly deny-by-default until M2 middleware passes verified session roles; comment confirms never fabricate (lines 1-2, 15-17).
- `app/staff/admin/page.tsx` — line 16: "deny-by-default enforced server-side. UI visibility is convenience only." Access-boundary aside (line 157-162) notes M2 not fully wired → middleware not fully enforced in production yet.
- `tests/auth/deny-default.test.ts` present.
Status: ACTIVE / GATE OPEN — middleware not fully enforced until M2 auth wiring completes.

## 2. Secrets / hardcoded keys (goal: none in JSX/API; .env reference only)
- Checked all new JSX/API files from A/B: `admin/page.tsx`, `reports/page.tsx`, `analytics/page.tsx`, `auth/admin/sign-in/page.tsx`, `api/v1/auth/sign-in/route.ts`, `api/analytics/summary/route.ts`, components/staff/reports-params.tsx, lib/auth/auth.service.ts, lib/auth/platform-sign-in.ts.
- No embedded API keys, DB passwords, session secrets, or connection strings found.
- `app/admin/page.tsx` line 106 references `.env.local masked; no secrets in JSX` as documentation, not leakage.
- `.env.local` present locally (dev only): contains `AUTH_SESSION_SECRET`, `DATABASE_URL`; gitignored; `.env.production.example` present, `.env.production` masked.
Status: PASS / GATE CLOSED.

## 3. Audit service (goal: excludes passwords/tokens/payload; generic errors)
- `lib/audit/audit.service.ts` line 4-5: "Never include password, token, payload, or DB connection strings." Model (`AuditEvent` in `audit.types.ts`) has actor/action/resource/resourceId/outcome/scope/reason/requestId/timestamp — no password/token/payload fields.
- `lib/audit/audit.repository.ts` line 3: "All writes parameterized via Prisma; no SQL concat; no payload/logging of secrets." Skeleton uses Prisma `audit.create`; no raw SQL concat.
- `api/v1/auth/sign-in/route.ts` audit entries (lines 40-49, 57-67, 83-92) store only `requestId`, `reason`, `role` (line 89: `context: JSON.stringify({ requestId, role: user.role })`) — no password/hash/token emitted.
- Errors returned are generic: `message: 'The request could not be processed.'` / `'An unexpected error occurred.'` — no stack traces or internal details exposed.
Status: PASS / GATE CLOSED. Note: M5 DB wiring needed for full audit persistence (repository is skeleton).

## 4. Analytics endpoint (goal: parameterized/typed, DECIMAL-safe, generic errors, no internal details)
- `lib/db/analytics/summary.service.ts`: defines `settlementGhsPesewas: number` (integer pesewas, never float) line 18; returns 0 skeleton (line 31). No float arithmetic.
- `api/analytics/summary/route.ts`: validates `scope` against allowed array (`global`, `org`, `branch`, `self`) line 12; passes typed `scope/from/to` to `analyticsSummary()`. Catch block (lines 18-20) returns generic error `'An error occurred.'` with no internal details.
- `components/staff/reports-params.tsx` uses `URL.searchParams.set()` (parameterized client-side); sends to endpoint; no raw SQL concat.
Status: PASS for design / GATE OPEN on TypeScript errors (see §8).

## 5. Staff sign-in validates role server-side (not from form); denies generically
- `app/auth/admin/sign-in/page.tsx`: form has no role field; action="#" method="post" submits to server; `noValidate` is present (fine — server validates).
- `app/api/v1/auth/sign-in/route.ts` line 39: `user.role === 'public'` denied with 401 + generic message `'The request could not be processed.'` (lines 51, 69). Also denies `status !== 'active'`. Role verified via DB `prisma.user.findUnique()` (line 35-38), never from form payload.
Status: PASS / GATE CLOSED.

## 6. Accessibility
- Semantic HTML used throughout new pages: `<main aria-label="...">`, `<section aria-label="...">`, `<article aria-label="...">`, `<aside aria-label="...">`, `<dl>`/<dt>/<dd> (reports-params line 113), `<nav aria-label="...">`.
- Forms: `aria-label` on forms (admin/page 51, 113; reports-params 58, 54); `label htmlFor` + `id` on inputs (auth/admin/sign-in); `aria-label` on inputs/select/button; `role="alert"` on error (reports-params 105).
- No untrusted SVG found; all images/icons assumed from existing library or none added.
Status: PASS / GATE CLOSED.

## 7. Security docs updated
- Created `docs/release/admin-console-security.md` (this file) with audit evidence, remaining risks (M2 auth middleware not fully enforced; audit repo skeleton; analytics skeleton deferred to M5 fixtures), dependency list (M2 sign-in middleware, M5 DB connection, M5 fixtures), and gate status per section above.
Status: PASS / GATE CLOSED.

## 8. Build / lint / typecheck references — TypeScript errors introduced
- `npx tsc --noEmit` reports errors (new / relevant):
  - `app/api/analytics/summary/route.ts` line 14: `Type '403' has no properties in common with type 'ResponseInit'` — `NextResponse.json(data, 403)` should be `NextResponse.json(data, { status: 403 })`.
  - `app/api/analytics/summary/route.ts` line 17: argument `200 | 500` not assignable to `ResponseInit | undefined`.
  - `app/api/analytics/summary/route.ts` line 19: `Type '500' has no properties in common...`.
  - `app/api/auth/platform/sign-in/route.ts` line 15, 18, 20: similar numeric-status issues + `expectedRole` type incompatibility.
  - `lib/auth/platform-sign-in.ts` line 7, 8, 60: missing module `../auth.service` / `../../authorization/authorization`.
- These are pre-existing / introduced by backend route changes; analytics endpoint specifically has 3 type errors in new file.
Status: FAIL / GATE OPEN — fix analytics `route.ts` status-object usage; resolve auth module paths.

## 9. No production fixtures; no untrusted SVG; responsive preserved
- No fixture files found under `tests/` for admin/staff admin (only `tests/auth/deny-default.test.ts`).
- No SVG files added in new JSX; icons use existing component libraries.
- Responsive classes present (`sm:grid-cols-3`, `flex-wrap`, `max-w-5xl`, `min-w-0`) in admin/reports pages.
Status: PASS / GATE CLOSED.

---

## Critical flags
- NONE for secrets, missing role check, or unparameterized query.
- MEDIUM: analytics endpoint TypeScript errors (3 in route.ts); auth/platform-sign-in module resolution errors; audit repository skeleton (M5 DB wiring needed for persistence).
- GATE OPEN: M2 auth middleware not fully enforced (documented on admin page / layout); must complete before production deployment.

## 10. M3 — Agent C verification (quality / security) — 2026-11-02
- Middleware (`lib/auth/auth.middleware.ts`): deny-by-default returns 401 generic `'Unauthorized'` when cookie missing or role mismatch; no role-specific messages — generic denial preserved.
- Auth service (`lib/auth/auth.service.ts`): HMAC-SHA256 session tokens with `process.env.AUTH_SESSION_SECRET`; validates payload structure; throws if secret missing — no hardcoded secret.
- Authorization (`lib/authorization/authorization.ts`): `denyByDefault()` false on null/unknown role / scope mismatch; `requireAuthGuard()` factory uses it; allowed-family mapping covers admin/claims_officer/adjuster/inspector/finance/auditor/support/customer.
- Auth routes updated: `app/api/auth/platform/sign-in/route.ts` + `app/api/v1/auth/sign-in/route.ts` — role verified via `prisma.user.findUnique()` server-side, never from form; mismatched role (`public`, inactive) denied generically with 401 and generic message (`'The request could not be processed.'`); audit entries contain only `requestId`, `role`, no password/token.
- Staff routes enforcing auth: `app/staff/layout.tsx` passes `roles={[]}` deny-by-default; `app/staff/*/page.tsx` uses same deny-by-default sidebar (`RbacSidebar` with `roles={[]}`); no fabricated access. `components/layout/rbac-sidebar.tsx` renders sign-in-required when `roles` empty rather than inventing links.
- Sidebar roles not fabricated: `lib/navigation.ts` defines `STAFF_NAV` with real role families (admin/claims_officer/adjuster/inspector/finance/auditor/support); `filterNavForRoles()` intersects verified roles only; empty input → zero items.
- Audit safe: `lib/audit/audit.service.ts` excludes password/token/payload/DB connection; `auditRepository` skeleton uses Prisma `create` (parameterized); audit events use `actor/action/resource/resourceId/outcome/scope/reason/requestId/timestamp` — no secret fields.
- DECIMAL analytics: `lib/finances/money.ts` uses integer pesewas (`PESEWAS_PER_CEDI = 100`) with `toPesewas()` rejecting float artifacts; `lib/db/analytics/summary.service.ts` defines `settlementGhsPesewas: number` (integer); `api/analytics/summary/route.ts` validates `scope` against allowed array, passes typed params, generic error on failure, no internal details.
- No hardcoded secrets found in new middleware/auth/staff/analytics files; `.env.local` masked, `.env.production.example` present, `.env*` gitignored.
Status: PASS for design / M2 gate verified; GATE OPEN only for production middleware enforcement (staff pages currently `roles={[]}` until M2 sign-in middleware fully wired); analytics route TypeScript errors (3 status-object issues) remain open per §8.

---

## Recommended fixes (ordered)
1. `app/api/analytics/summary/route.ts`: change `NextResponse.json(..., 403)` → `{ status: 403 }`; `..., 200` → `{ status: 200 }`; `..., 500` → `{ status: 500 }`.
2. `lib/auth/platform-sign-in.ts`: fix import paths to `auth.service` / `authorization`.
3. `prisma/migrations/20261102_admin_console_staff_audit.sql` + `lib/audit/audit.repository.ts`: wire real Prisma create after M2 sign-off.
4. Confirm middleware (expected-role validation) wired at M2; until then treat admin portal as protected by session + server-side deny-by-default only.
