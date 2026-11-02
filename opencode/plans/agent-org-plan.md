# Project: AKM Auto Consult — Agent Organization Plan
Folder (per user + skill): C:\projects\akm-auto-consult-opencode\opencode\plans
Plan file: agent-org-plan.md
Source: C:\projects\akm-auto-consult-opencode\executive-summary.md

## 1) Project Scope (from executive-summary.md)
- Full-stack Next.js (App Router, TypeScript) + Tailwind + PostCSS
- MySQL 8+; ORM Prisma; auth NextAuth/custom JWT; RBAC
- Modules: public site, customer portal, staff/admin portal, AI damage detection (YOLOv8/ONNX or manual fallback), image optimization (sharp -> AVIF/WebP), document generation (Puppeteer/PDFKit), audit trail, analytics
- Security: HTTPS, secure cookies/JWT (HTTP-only), bcrypt, deny-by-default role checks, rate limits, no hardcoded secrets (env .local/.production)
- Deploy target: standard Apache + MySQL shared hosting
- Theme: light/dark responsive; next/image optimization; code-split/minified

## 2) Agent Team Composition (3 agents, parallel orchestration)
Agent 1 — FRONTEND / UI & RBAC (customer portal, staff/admin portals, layouts, sidebar, theme, responsive, images)
Agent 2 — BACKEND / DATA & CLAIMS (DB schema, Prisma migrations, claims workflow, AI damage module, REST APIs, middleware/auth guards, audit logs)
Agent 3 — DOCUMENT / AI-INTEGRATION & QUALITY (image optimization/sharp + AVIF pipeline, document generation, AI inference integration, security/quality checks, performance/Lighthouse gates)
Orchestration pattern: PARALLEL (independent modules concurrent) with sequential sync points at: auth layer, DB schema, claim-state machine.
Concurrency cap: 3 (the 3 agents)
Timeout per milestone: 300s (5 min) default; can extend on AI module
Retry for failures: 3 attempts before escalation

## 3) Milestones (sequential + parallel within)
M1 — Scaffold: Next.js App Router project structure (app, public, prisma, .env.local, tailwind/postcss, .gitignore no .env)
M2 — Auth + RBAC: separate sign-in paths (/auth/customer/sign-in, /auth/claims/sign-in), JWT/cookie auth, deny-by-default role middleware, reusable RBAC sidebar
M3A (Agent 1) — Public + Customer portal pages + theme toggle + responsive layouts — DONE (Admin Console frontend: /staff/admin, /staff/reports live, RBAC sidebar wired, docs updated)
M3B (Agent 2) — DB schema + REST APIs — DONE (auth + authorization + audit + analytics endpoint + migration applied + docs updated)
M3C (Agent 3) — Image pipeline (sharp: thumbnail + AVIF/WebP) + image optimization config; basic security audit (secrets, .env rules)
M4 — Claims workflow (customer submits claim; staff assigns inspector/adjuster; inspector records damage + annotated photos; adjuster estimates; management approves)
M5 — AI damage detection: YOLOv8 via ONNX or Python service; manual fallback; confidence threshold; audit storage of model outputs
M6 — Estimate/costing logic (VAT 15%, NHIL/GETFund 5%, depreciation) + document generation (PDF reports/estimates/invoices)
M7 — Analytics/dashboard + deployment readiness (Apache+MySQL, .env.production, build/minify/code-split, Lighthouse performance gates, final security/code review)

## 4) Communication / Sync Pattern
Direct agent-to-agent for tightly coupled tasks (e.g., Agent 1's auth sidebar depends on Agent 2's RBAC middleware results).
Checkpoint events (broadcast after M1, M2, M4): each agent reports module state.
Data flow: DB schema (Agent 2) -> frontend pages (Agent 1); image uploads processed by Agent 3 pipeline, stored in /uploads/claims/{claimId}/.
Conflict resolution: deny-by-default auth overrides any UI visibility; DB schema changes require Agent 2 confirmation before Agent 1 updates forms.

## 5) Performance / Quality Targets
Agent selection accuracy target: 95% (each module assigned to agent matching capability)
Task completion rate: 99%
Response time: < 5 sec for API; Lighthouse CLS/LCP high
Resource utilization: 60-80% (run in parallel, not single-threaded)
Quality gates per milestone: build + lint + typecheck must pass; no hardcoded secrets; security review; tests for auth/access boundaries, claim-state transitions, calculations.

Checkpoint event M2 — Agent C (quality/security): PASS with noted gaps (docs/release/admin-console-security.md §10). Deny-by-default middleware active; auth routes server-side validated; staff routes deny-by-default (`roles={[]}`); sidebar not fabricated; audit safe; DECIMAL analytics verified; no secrets. Gaps: (1) staff middleware not fully enforced (pages pass empty roles until M2 middleware wires verified session); (2) analytics `route.ts` 3 TypeScript status-object errors open; (3) auth/platform-sign-in module import paths unresolved; (4) audit repository / DB connection skeleton deferred M5. Recommend close M2 once middleware passes real session roles to staff layout and analytics types fixed.

## 6) Error Handling + Failover
Retries: 3 per milestone; after retry fails, escalate to lead (Agent 2 for DB/auth; Agent 1 for UI; Agent 3 for AI/images).
Rollback: DB changes rolled back via Prisma; UI changes rolled back via git revert; AI model failures fall back to manual tagging (manual process enforced by user override).
Timeout: 300s (default). AI module gets extended budget if needed.
Backup agents: Agent 2 can cover some Agent 3 (security/quality) tasks; Agent 1 covers UI-related quality.

## 7) Security / Constraints (from summary)
- No secrets in source; only .env.local / .env.production; .gitignore excludes .env*; no log of passwords/tokens/secrets; audit trail for approvals.
- HTTPS required; auth cookie/JWT HTTP-only; rate limits; deny-by-default access check per request; role mismatch denied generically; separate sign-in paths with expected role validated server-side.
- Image uploads: restrict type/size; optimize via sharp; serve via next/image; avoid untrusted SVG.
- Financial values: integer minor units / DECIMAL (no float); visible itemized calculations; reconcile with quote.
- Separate public/customer/staff/admin layouts/headers/footers; reusable RBAC sidebar.

## 8) Implementation Path (incremental, per summary instruction)
Phase 1 (M1-M2): foundation (project scaffold + auth + RBAC)
Phase 2 (M3A-M3C parallel): customer portal + DB + image pipeline + security
Phase 3 (M4-M5): claims workflow + AI module + manual fallback
Phase 4 (M6-M7): estimates/ PDFs + analytics + deploy readiness + Lighthouse/security/code review
Deliverables: working app, test suite, docs updates, no production data in fixtures.

# End of agent-org-plan.md
