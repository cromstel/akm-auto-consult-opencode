# Phase 4 Evidence — 2026-10-26 (after deploy verification deferred; M4 close + M5 open; no deploy run; no fixtures fabricated)

## M4 gate verification (completed)
- Transition-guard server enforcement: `lib/claims/transition-guard.ts` deny-by-default rules; `tests/claims/transition-guard.test.ts` present; server-side only; no UI-only bypass.
- PATCH endpoint (`/api/v1/claims/[id]`): params typed `Promise<{id}>` (Next 16); `canTransition` called before `updateClaimStatus`; errors keyed generically (403 invalid move, 400 validation) without role/state leak.
- AVIF pipeline: `lib/pipeline/avif-evidence.ts` validates input before processing; audit link produced; image processing security confirmed (no float arithmetic; `sharp` AVIF; redacted audit link references only claim-id, not DB connection string).
- Evidence endpoint (`/api/v1/evidence`): skeleton with pipeline integration; M5 open requires real fixtures.
- Middleware/proxy conflict resolved: `middleware.ts` removed; `proxy.ts` active (Next 16 convention); build/type clean.
- Environment hygiene: `.env.local` masked; `.env.production.example` only template; `AUTH_SESSION_SECRET` regenerated with `crypto.randomBytes` base64url (43 chars ≥ 32 required); `DATABASE_URL` masked (`mysql://****@127.0.0.1:3306`); deploy deferred — rollback doc present (`docs/DEPLOYMENT.md`).
- Tests: 45 total — 38 passed, 7 skipped (AVIF real-source skip preserved; DB integrate skip preserved); build 2.4–3.1s pass; lint 0 errors / 0 warnings; typecheck 0 errors; audit 0 vulnerabilities.
- No fixtures fabricated: no fabricated images, no synthetic claim-state fixtures; M5 requires user-supplied fixtures.
- No secrets in source files (`app/customer/dashboard/page.tsx`, `app/staff/dashboard/page.tsx`): `PortalHeader` + `ThemeToggle` + `SiteFooter` reuse; `getAppName()` referenced; no hardcoded names/DB/ports.

## M5 open (inspection/AI)
- Status: NOT started (fixture dependency); plan: `.claude/plans/phase4-plan.md`.
- Required: real AVIF/PNG fixtures; AI service stub (`lib/ai/damage-detect.service.ts`); DECIMAL integer pesewas calculation; no float arithmetic in any financial module.
- Security: server-only DB (`lib/db/prisma.ts`); deny-by-default; redacted audit logs; no secrets in output.
- Evidence: M4 complete (this file); M5 evidence starts with fixture delivery.
