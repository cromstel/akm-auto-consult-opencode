# AKM Auto Consult

Full-stack Auto Insurance / Loss-Adjustment platform. Next.js 16 / TypeScript / Tailwind CSS / Prisma (MySQL) / RBAC (deny-by-default middleware) / DECIMAL (integer pesewas, never float) / AVIF assets.

## Documentation order
Read in sequence: `AGENTS.md`, `MEMORY.md`, `WIKI.md`, `PRD.md`, `TODO.md`, then `docs/architecture/*`, `docs/security/*`, `docs/api/*`, `docs/DEPLOYMENT.md`, `docs/QUALITY.md`.

## Architecture & security rules
- Middleware: deny-by-default (`staff-auth.ts`); scope = `self` / `assigned` / `global` only.
- Finance: DECIMAL `DECIMAL(12,2)` integer pesewas; float arithmetic rejected; audit entries (`Audit` model) created on approval / settlement via `EstimateRepo.updateStatus`.
- Images: `.avif` pipeline; metadata SEO + JSON-LD; `.opencode/plans/` hard rule for plans.
- No hardcoded secrets (`sk-`, tokens, passwords); `Audit` context never logs session secrets.

## Key phases (M1-M5 completed)
- M1 Landing (`.avif`, metadata, JSON-LD)
- M2 Auth / deny-by-default middleware
- M3 Customer / Vehicle profile wiring
- M4 Claims (`ClaimRepo`, `claims/page.tsx`, `.opencode/plans/phase4-claims-plan.md`)
- M5 Estimates (`EstimateRepo` integer-guard + audit-on-change; `staff/estimates/page.tsx`; `.opencode/plans/phase5-estimates-plan.md`)
- M7 Gate verified; commit `feat: phase5-estimates decimal audit staff-estimates` pushed to `https://github.com/cromstel/akm-auto-consult-opencode.git`.

## Project plans
`ls .opencode/plans/` — `agent-1-staff-console-frontend-arch.md`, `agent-org-plan.md`, `analytics-report-plan.md`, `customers-portal-plan.md`, `customers-portal-plan.tdd.md`, `frontend-development-plan.md`, `landing-page-evidence.json`, `landing-page-plan.md`, `phase2-auth-plan.md`, `phase3-customer-vehicle-plan.md`, `phase4-claims-plan.md`, `phase4-fixtures-catalog.md`, `phase5-estimates-plan.md`. (Plan files preserved; not deleted.)

## Stack & versions
Next.js 16.4.3, Tailwind CSS 4.3.x, TypeScript strict. Verify official docs before bootstrap: https://nextjs.org/docs.

## Build / quality
`npm run build`, `npx tsc --noEmit`, `npm run lint`. 80%+ test coverage target; security checks (`security-review` skill patterns); audit trails on all financial mutations.
