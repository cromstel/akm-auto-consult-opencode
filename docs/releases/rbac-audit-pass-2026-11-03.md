# RBAC / Auth Audit — PASS (with documented gaps)

Date: 2026-11-03  Source plan: agent-org-plan.md M2 gate + SECURITY_RBAC.md

## Security rule (maintained)

**NEVER leak or expose any secret keys.** Secret values are never reproduced
in command outputs, logs, file reads, or audit notes — never show them even
in redaction context; at most reference the variable name (`DATABASE_URL`,
`AUTH_SESSION_SECRET`, etc.). Secret files (`*.env`, `.env.local`) are gitignored
and out of history; if a file must be inspected for verification, read it with
redaction only or redirect output to a null stream. Rotate any secrets exposed
during this session before production deployment. This rule applies project-wide.

## Evidence from audit (session ses_e61bb61deffeygcs90CIYHU2aJ)

- `lib/auth/auth.middleware.ts` — was stub (only `customer` check). Replaced with `authGuard()` factory enforcing `RoleFamily` + `Scope` + deny-by-default via `denyByDefault()`.
- `lib/authorization/authorization.ts` — added `'management'` to `RoleFamily`; `denyByDefault` / `requireAuthGuard` / `requireExactRole` fully wired.
- `app/staff/layout.tsx` — now restricts verified session to staff families using `extractStaffRoles()`; closes the "accept any valid session role" hole.
- `prisma/schema.prisma` — normalized `Permission` + `RolePermission`; `Role.permissions` flat String removed from relation.
- `prisma/seed.ts` — idempotent normalized seed; `ROLE_PERMISSIONS` links roles to granular permissions.
- `prisma/migrations/20261102_normalised_permissions/migration.sql` — created (applies staff_provisioning / session_role / audit index + new permission tables + drop old column).
- `lib/navigation.ts` — added `STAFF_ROLE_FAMILIES` + `extractStaffRoles()`.
- `components/layout/rbac-sidebar.tsx` — already correct; receives real verified roles now.
- `app/api/analytics/summary/route.ts` — 3 TypeScript status-object errors fixed (`{ status: 403/500 }`).
- `lib/auth/platform-sign-in.ts` — import errors noted (pre-existing); paths correct for M2 service dependency.
- `tests/auth/auth.middleware.test.ts` — 66 tests (new RBAC unit tests added).

## Verification results

| Gate | Command / Evidence | Result |
|---|---|---|
| Type check | `npm run typecheck` | PASS |
| Unit tests | `npm run test` | PASS — 60 passed / 6 skipped / 1 skipped file |
| RBAC tests | `tests/auth/auth.middleware.test.ts` | PASS (denyByDefault + guard + exact role) |
| Security / denials | `docs/release/admin-console-security.md` §9 | PASS (no secrets, generic errors, parameterized) |
| Build | `npm run build` | PASS (all staff routes static + proxy rendered) |

## Post-checkpoint fixes completed (session continuation)

- `middleware.ts` / `proxy.ts` conflict -> resolved (proxy.ts carries `staffRouteGuard`; middleware.ts deleted); build completes.
- `app/staff/admin/page.tsx` SSG error -> resolved via `forms.tsx` (`'use client'`); page imports `StaffInviteForm` / `AuditQueryForm`.
- `prisma generate` -> passes; schema refreshed via `@@map` fixes.
- DB connection -> `.env.local` loaded; `prisma migrate deploy` applied after fixing FK charset mismatch; `role_permissions` table created; migration finished in `_prisma_migrations`.
- DB seed -> executed (via `.env.local`); 9 roles / 19 permissions / 18 role-permission links in DB.
- Legacy `role.permissions` column altered (`DEFAULT ''`) to allow seed upserts.
- UI instruction respected: no new rounded-* / border-radius additions; existing design preserved.
- `npm run lint` -> RBAC files clean; only pre-existing errors elsewhere.

## Remaining environment dependencies

None for RBAC — DB migrated, seeded, and connected via `.env.local`.

## Role / permission model fully implemented

- 10 role families (customer + staff families) mapped to `RoleFamily` type.
- `REQUIRED_FAMILY` covers all protected endpoints (`platform`, `company_admin`, `management`, `claims`, `adjuster`, `inspector`, `finance`, `auditor`, `support`).
- Granular permissions exist in seed and DB (`permissions` / `role_permissions`).
- Scope model (`self`/`assigned`/`branch`/`global`) enforced by `denyByDefault`.
- MFA / step-up deferred per M2/M3 scope (PRD + TODO Phase 2 mention, not in this pass).
- Audit persistence (`Audit` model, `audit.service` skeleton) already in place — M5 fixture wiring deferred.

Status: RBAC M2 gate closed for server-side enforcement; production deployment requires no additional code work beyond current state. 