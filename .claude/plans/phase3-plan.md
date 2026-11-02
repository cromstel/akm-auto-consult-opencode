PHASE 3 PLAN — 2026-10-26 (post-Phase 2 gate pass)
Status: ON HOLD for deploy still deferred; feature work continues.
Objective: claim-state machine wired server-side (not UI-only) + AI/AVIF pipeline end-to-end + smoke verification.

Milestones / dependencies (from agent-org-plan.md M4 gate):
- M4 CLAIMS: transition-guard server enforcement; repository + endpoint use it.
- M5 INSPECTION/AI: AVIF pipeline wired to evidence endpoint with audit link.
- M6 FINANCE: no new work (DECIMAL verified earlier); keep current.
- M7 SMOKE + DEPLOY: docs/DEPLOYMENT.md smoke runbook only; deploy deferred.

Tasks (smallest independently verifiable):
1. Claim-state enforcement: repository uses transition-guard before updates.
2. PATCH /api/v1/claims endpoint validates transition server-side (denies invalid moves generically).
3. Evidence endpoint (/api/v1/evidence) integrates AVIF pipeline + audit link + redacted log.
4. Smoke verification script (docs/deploy/smoke.sh equivalent) — no deploy run.
5. Doc sync: WIKI.md glossary updates; docs/api endpoints catalog aligned with new endpoints; .claude/TODO.md updated with Phase 3 close.

Safety / evidence rules:
- No `.env.local` secrets in any output; DATABASE_URL masked; AUTH_SESSION_SECRET never logged.
- No float arithmetic (DECIMAL / integer pesewas); redaction applied.
- Deny-by-default: transition denied generically; no role leak; server-side only.
- Tests: add claim-state transition tests; AVIF pipeline test; smoke test.
- Deploy: runbook references only; actual deploy requires explicit user "execute deploy".
