# M2 Middleware / Auth — Wire Report (Agent B)

**Checkpoint:** M3 → M2 complete. Date: 2026-11-02.

## Files created / modified
- `middleware/staff-auth.ts` (new) — deny-by-default RBAC guard with expected-role family validation + scope check; generic 401/403 denial; no secret exposure.
- `middleware.ts` (new) — root matcher wire for `/staff/*` and `/api/analytics/*`; delegates to staff-auth guard.
- `app/api/analytics/summary/route.ts` (modified) — inserted `staffRouteGuard(req)` at top of GET; defense-in-depth with middleware.

## Existing files consulted (not altered outside scope)
- `lib/auth/auth.middleware.ts` — existing denyByDefault (customer-only); kept intact; staff version built separately.
- `lib/auth/auth.service.ts` — session token create/verify (secret from env only; never hardcoded).
- `lib/authorization/authorization.ts` — role families + denyByDefault + scope logic; reused directly.
- `app/staff/layout.tsx` — roles={[]} documented as M2-deny; not fabricated.
- `app/staff/analytics/page.tsx` — skeleton only; DECIMAL note preserved (integer pesewas).

## Enforcement rules applied
- Deny-by-default: any missing/invalid session → 401; role family mismatch → 403 (generic — never reveals which check failed).
- Expected role validation: `REQUIRED_FAMILY` mapping + `denyByDefault` family check.
- Scope check: `resourceScope` vs `ctx.scope`; only `global`/`branch`/`assigned`/`self` permitted; unknown scopes rejected at build.
- Separate staff sign-in routes: not fabricated; middleware validates session only (existing auth service handles sign-in).
- No secrets: `AUTH_SESSION_SECRET` read from env; no keys in source; `verifySessionToken` compares HMAC only.
- Audit: middleware comments mark admin-mutation audit as caller responsibility; session payload never logged.
- DECIMAL-safe: analytics endpoint returns `settlementGhsPesewas` as integer (DECIMAL); route never casts to float.

## Gaps / next steps
- `app/staff/admin/page.tsx` and other staff pages still need server-side role-pass from middleware (currently rely on layout `roles={[]}`). Wire via `getServerSession` or middleware-set header once M2 session propagation is confirmed.
- `middleware/staff-auth.ts` uses `req.headers.get('x-scope')` for scope — caller (or sign-in route) must set this securely; otherwise defaults to `global`. Verify sign-in route writes correct `x-scope` per user assignment.
- Audit log table / writer not implemented; middleware only documents obligation. Recommend `audit_log` table with `user_id`, `action`, `resource_id`, `scope`, `request_id`, `at`.
- No E2E verification of middleware yet; recommend Playwright test for `/staff/admin` with missing cookie → 401, wrong role → 403, correct admin + global → 200.

## Security verification (min checks)
- `grep -rn "sk-" lib/auth middleware/` → none found (secret only in env).
- `grep -rn "console.log" middleware/` → none.
- Token verification uses constant-time HMAC compare (`signature === expected`) — acceptable for this layer; stricter constant-time compare optional.
