# Analytics / Reporting — scaffold (M5 reporting layer; no AVIF fixtures required here)
Plan file: opencode/plans/analytics-report-plan.md (derived from frontend-patterns + agent-org-plan.md M5)
Status: OPEN — skeleton only; real report data flows through `lib/repositories/claims.ts` + `lib/finances/money.ts` after M5 fixtures delivered.
Constraints: server-side DB only (`lib/db/prisma.ts`); deny-by-default role check (proxy/auth); DECIMAL integer pesewas (no float); audit links (request-id); responsive grid; no fixtures; .env masked.
