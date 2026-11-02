# Phase 4 Plan — 2026-10-26 (after Phase 3 deploy-verification; no production deploy run)
Status: OPEN — M4 gate closes; M5 inspection/AI opens. Deploy remains deferred per user hold ("execute deploy" required). No fixtures fabricated; AVIF/PNG source must be supplied at M5 start by user or provider.

## M4 gate CLOSE (claim-state + evidence) — completed in prior work
- **Claim-state enforcement**: `lib/claims/transition-guard.ts` deny-by-default transitions; `lib/repositories/claims.ts updateClaimStatus` calls before write; `PATCH /api/v1/claims/[id]` params `Promise<{id}>`; invalid moves → 403 generic, validation → 400 (server-side enforce, not UI-only). Tests in `tests/claims/transition-guard.test.ts`.
- **AVIF pipeline**: `lib/pipeline/avif-evidence.ts` validate → sharp → AVIF → audit link; validated input before processing (security); no real AVIF source executed yet (skipped Phase 3 intentionally to avoid unverified fixtures).
- **Evidence endpoint**: `app/api/v1/evidence/route.ts` wired to pipeline (skeleton; M5 complete requires real evidence upload path).
- **Smoke reference**: `docs/deploy/smoke-checks.ts` executed locally only (DB in sync via `migrate deploy`; dev host 127.0.0.1 only).
- **Docs**: `docs/deploy/DEPLOY_EVIDENCE.md`, `docs/deploy/MIDDLEWARE_PROXY_FIX.md`, `docs/deploy/ENV_FIX.md`, `opencode/plans/landing-page-plan.md`, `opencode/plans/landing-page-evidence.json`.

## M5 INSPECTION / AI — OPEN (real fixtures required at start, provided by user)
Task: AI damage detection (YOLOv8/ONNX or manual fallback on inspectable media) with inspection checklist/completion module and loss-adjustment estimate + approval panel.

Required inputs (none automated yet):
1. Real accident-photo / damage-photo fixtures supplied by user or external data provider.
2. Robust fixtures tested against existing images (no fresh file gen from unverified claim examples — stale test data risk).
3. NO FLOAT FINANCIAL CALCULATIONS — all monetary math via `DECIMAL` integer pesewas through `lib/finances/money.ts`.

Deliverables (no production fixtures):
- Inspection schedule page (`/inspections/{id}` with checklist completion UI)
- Loss-adjustment form (`/estimates/{id}` estimate review/approval, server-side authz + DECIMAL audit links)
- AI compute stub (`lib/ai/damage-detect.service.ts`) calling real image inference against provided fixtures; error boundary does NOT surface model internals
- Integration tests with provided fixtures; TypeScript strict; lint 0 errors; typecheck 0 errors; audit 0 vulnerabilities

## Stop conditions (before any deploy)
- No invented fixtures; no `.env.local` committed; app/DB/port never hardcoded; `getAppName()` only
- Deny-by-default on protected routes; REDACTED logging everywhere (sensitive keys never logged)
- `proxy.ts` Next 16 convention; `middleware.ts` removed
- Build ≤10s; tests ≥80%; audit clean; `prisma migrate deploy` verified locally
- Production restart requires user confirmation + Hostinger env variables set via platform
