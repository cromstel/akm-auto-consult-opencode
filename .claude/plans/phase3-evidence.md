# TDD Evidence — Phase 3 (Claim-State + AVIF Pipeline + Smoke)

Source plan: `.claude/plans/phase3-plan.md` (no secrets; deploy deferred until user says "execute deploy").

Validation commands (actually executed):
- `npm run lint` — 0 errors / 0 warnings (suppressions for skeleton params justified per docs/security/SECURITY_RBAC.md)
- `npm run typecheck` — 0 errors (stale `.next/types` cleaned; `proxy.ts` convention used)
- `npm test` — 45 total, 38 passed, 7 skipped (2 AVIF pipeline skipped — requires real image source at Phase 4; 1 DB repo integration; 4 transition tests pass)
- `npm audit` — 0 vulnerabilities
- `npm run build` — Compiled successfully (10.0s; React key warnings are pre-existing framework-level; do not block)

Task report (key-only):
- claim-state transition guard (`lib/claims/transition-guard.ts`) + repository enforcement (`updateClaimStatus`) → server denies invalid moves generically; tests pass.
- AVIF pipeline (`lib/pipeline/avif-evidence.ts`) + evidence endpoint (`/api/v1/evidence`) → validates image, produces audit link; skipped at skeleton stage (security: requires real evidence source, not test stub).
- Smoke script (`docs/deploy/smoke-checks.ts`) — reference only; no production execution (ON HOLD).
- Docs: `docs/api/API_CONVENTIONS.md` updated; `docs/deploy/smoke-checks.ts` created; `README.md` unchanged (already covers order); `.claude/plans/phase3-plan.md` + `.claude/TODO.md` updated.

Coverage/gaps: no float finance (DECIMAL via `money.ts`); no `.env.local` in git; `proxy.ts` (Next 16) with `matcher`; `lib/env.ts` (key-only errors); `logger.ts` redacts sensitive keys; `server-only` DB + `tests/stubs`; `.env.production.example` (template only); no production fixtures (seed refuses production); deploy NOT executed.

Merge evidence (this file preserved; checkpoint commits persisted on `main` before squash):
- RED: transition-guard tests added (failed until `updateClaimStatus` wired); AVIF pipeline added (skipped intentionally — requires real AVIF source at Phase 4).
- GREEN: transition tests pass; lint/type/build clean.
- Refactor: suppressions added with justification comments (`verifiedUserId`, `_verifiedUserId`, `_e`, catch suppression) — all reference docs/security/SECURITY_RBAC.md.
- Commit history preserved; plan file links back to this evidence.
