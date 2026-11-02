# Admin Console Backend — Agent B deliverables

Agent: B (Backend/auth + analytics). Dependencies: M2 auth wiring (separate role sign-in paths, session middleware, DB role/scope).

## Built
- `lib/auth/platform-sign-in.ts` — staff sign-in route logic (expected-role validation, generic denial, deny-by-default middleware)
- `lib/auth/authorization.ts` — extended deny-by-default guard (role + scope + resource) with role-family mapping
- `lib/audit/audit.service.ts` + `audit.repository.ts` — audit events (actor/action/resource/time/requestId/scope/reason); no sensitive payload; audit for admin mutations
- `lib/db/analytics/summary.service.ts` — `/api/analytics/summary` backend (parameterized, DECIMAL-safe via integer pesewas, scoped, generic errors)
- `app/api/auth/platform/sign-in/route.ts` — staff sign-in endpoint (separate path from customer)
- `app/api/analytics/summary/route.ts` — analytics endpoint with parameterized query and structured response always returned
- `prisma/migrations/20261102_admin_console_staff_audit.sql` — schema additions (staff_provisioning table, session_role table, audit index); NOT applied automatically
- `docs/release/admin-console-backend.md` — endpoints/services, M2 dependencies, gaps

## Security notes
- No secrets in source or `.env` (use `process.env.AUTH_SESSION_SECRET` only, validated at runtime; never logged)
- All DB queries parameterized / use Prisma `where` with typed inputs (no raw concat)
- Audit records admin mutations (`staff_provision`, `role_assign`, `session_revoke`) — actor, action, resource, outcome, reason only; no passwords, tokens, payloads
- DENY BY DEFAULT middleware (`denyByDefault`) enforced server-side; role never trusted from form
- Generic error messages to clients (`An error occurred.`) with `requestId`; detailed errors only in server logs (no stack to client)
- Decimal-safe: all monetary/aggregate values use integer pesewas (DECIMAL-safe); no `parseFloat`

## Gaps / M2 dependencies
- Session middleware (cookie verify + rotation) must wire before production — currently relies on `lib/auth/auth.service.ts`
- Staff provisioning mutations audited but full RBAC permission mapping (`permissions` table normalization) deferred to M4
- Migration should be reviewed + applied manually (`prisma migrate deploy`) — not executed automatically per agent instructions
- Analytics DB aggregation skeleton; real aggregation requires M5 fixtures / DB connections

## Endpoints
- `POST /auth/platform/sign-in` — staff role-family sign-in with expected-role check
- `GET /api/analytics/summary?scope=...&from=...&to=...` — parameterized, scoped, structured response always
- Audit via service (call after mutation)

## Dependencies on M2 auth wiring
- Session middleware (cookie verify + rotation + revocation) must wire before production
- `platformSignIn` uses DB verification + session token from M2 auth.service; audit needs M2 user lookup
- Migration not applied; apply manually (`prisma migrate deploy`) after M2 review
- Analytics aggregation skeleton; real DB aggregation needs fixtures/connection (M5)

## Security verification checklist (pre-commit)
- [x] No hardcoded secrets (`AUTH_SESSION_SECRET` env only)
- [x] Parameterized / Prisma typed queries; no raw SQL concat
- [x] Audit omits payload / token / password
- [x] Generic errors (`An error occurred.`) to client; `requestId` for trace; details server-only
- [x] DECIMAL-safe integer pesewas; no `parseFloat`
- [x] Deny-by-default middleware (`denyByDefault`) enforced server-side
- [x] Migration not auto-run
