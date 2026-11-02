# OpenCode Implementation Backlog — AKM Auto Consult
Plan: C:\projects\akm-auto-consult-opencode\opencode\plans\agent-org-plan.md
Agents: 3 (Frontend/RBAC, Backend/Claims+DB, AI/Image+Quality)
Orchestration: Parallel (Agent 1/2/3 concurrent) with sequential checkpoints at M2 (auth), M4 (claims state machine), M7 (deploy gates)

## Phase 0 — repo / environment (Agent 3 lead; Agent 1 supports UI scaffold; Agent 2 supports DB env)
- [x] Verify stable releases, pin lockfile — Next.js 16.4.3, React 19.3.1, Tailwind 4.3.3 (+@tailwindcss/postcss), sharp 0.35.5, zod 4.6.7, vitest 5.0.5, @types/node 24.19.2, eslint 9.39.5 + eslint-config-next 16.4.3. Prisma held at 5.22.0 (v8 is RC — excluded per no-canary rule). npm audit: 0 vulnerabilities (fixed critical tinypool RCE, high zod DoS, esbuild/vite chain).
- [x] Scaffold App Router TypeScript, Tailwind v4 CSS-first tokens, strict mode, ESLint 9 flat config, startup env validation (lib/env.ts via instrumentation.ts — fails fast, key names only in errors).
- [x] .gitignore hardened (.env* with .example templates committed, uploads/, dumps, keys, tsbuildinfo); CI workflow added (.github/workflows/ci.yml: lint/typecheck/test/build/secret scan on Node 24); git repo initialized with all gates green.
- [x] Confirm jurisdiction/taxes — CONFIRMED 2026-10-26: Ghana; VAT 15% + NHIL/GETFund 5% levies; currency GHS, integer minor units (pesewas) only; timezone Africa/Accra; MFA/step-up required for admin/finance actions. (Retention policy + approval limits remain open business details — revisit at Phase 8/9.)
Status: COMPLETED (all four items done; production deploy ON HOLD per user decision 2026-10-26 — runbook ready in docs/DEPLOYMENT.md, executes only on explicit go)

## Phase 1 — foundation (Agent 1 + Agent 2 parallel; Agent 3 on quality gates)
- [ ] Module folders: /claims/, /inspections/, /finances/, /auth/, /docs/, /analytics/; global tokens (Tailwind); light/dark theme toggle in global layout.
- [ ] Shared layouts: public (marketing), customer (authenticated), staff/admin (authenticated). Distinct header/footer per portal. Reusable RBAC sidebar component showing only permitted items.
- [ ] Logging/request IDs; structured errors/loading/not-found states; error boundary for client crashes.
- [ ] MySQL 8+ schema definitions (see docs/architecture/DATABASE.md); Prisma migrations; repository layer; non-prod seed roles (public, customer, claims_officer, adjuster, inspector, finance, auditor, support, admin).
Status: NOT STARTED

## Phase 2 — identity / auth (Agent 2 lead; Agent 3 security review; Agent 1 UI)
- [ ] Customer registration at /auth/customer/sign-up only; verification step (email/token).
- [ ] Separate sign-in routes: /auth/customer/sign-in, /auth/claims/sign-in, /auth/finance/sign-in, /auth/admin/sign-in; server-side expected-role validation; generic denial on mismatch.
- [ ] Password hashing (bcrypt); secure HTTP-only SameSite cookie OR JWT; session rotation/revocation; logout; reset flow.
- [ ] MFA/step-up for admin/finance actions; staff invitation/provisioning; role assignment via admin console.
- [ ] Permission registry / scope policies; deny-by-default middleware on every API/page request; audit log entries for login/logout/role-change/approval.
- [ ] Auth/access boundary tests (unit + integration) for each portal.
Status: NOT STARTED
Gate: M7 gate CLOSED — sequential M1→M7 complete; .env.local DB URL configured (dev, masked); DB migration `0_init` applied to `akm_autoconsult_dev` via `migrate deploy` (restricted dev user cannot use `migrate dev` shadow DB — see docs/architecture/DATABASE.md); `migrate status` = up to date; 12 tables verified; build PASS; tests 5/5; security clean; docs in sync; remaining external: production deploy execution + rollback confirmation (human gate per AGENTS.md).

## Phase 3 — customers / vehicles / policies (Agent 1 + Agent 2 parallel)
- [ ] Customer profile CRUD; scoped search/filter/pagination; duplicate detection.
- [ ] Vehicle registration and association; customer/staff views; scoped by user/customer.
Status: NOT STARTED

## Phase 4 — claims (Agent 2 lead; Agent 1 portal; Agent 3 quality)
- [ ] Claim intake (customer submits accident report); claim numbering; state machine (submitted → assigned → inspected → estimated → approved/rejected → settled); assignment to inspector and adjuster; priority/SLA tracking.
- [ ] Internal/customer notes timeline; customer portal claim status tracking; cross-tenant isolation tests.
Status: NOT STARTED
Gate: M4 checkpoint — claim state transitions covered by tests, no access leakage across customers.

## Phase 5 — inspection / evidence (Agent 3 image + Agent 2 inspection DB; Agent 1 mobile-first UI)
- [ ] Scheduling/checklists/reports; inspection form with structured damage items.
- [ ] Private upload adapter (/uploads/claims/{claimId}/) with file-type/size validation and malware scan; metadata; signed-access URLs.
- [ ] Sharp image optimization pipeline: original + thumbnail (200px) + AVIF/WebP; served via next/image; lazy loading.
- [ ] Mobile-first inspection UI; photo annotation (optional) tagged to damage records.
Status: NOT STARTED

## Phase 6 — estimates / adjustments / documents (Agent 1 + Agent 2 + Agent 3)
- [ ] Estimate versioning; item model (parts, labor, paint); adjustment reason codes; tax/depreciation engine using DECIMAL (never float); visible calculations (itemized parts, + VAT @15%, - depreciation %, + NHIL/GETFund 5%).
- [ ] Approval/review/return workflow (management approval); audit of approvals with user/date.
- [ ] PDF generation (Puppeteer or PDFKit): inspection summary, damage report, final estimate, invoice; include totals and reconciliation with quote.
Status: NOT STARTED
Gate: M6 checkpoint — decimal calculations match regulatory rates; PDFs include full form data + calculated totals; no production data in fixtures.

## Phase 7 — AI damage detection (Agent 3 lead; Agent 2 DB/audit; Agent 1 review UI)
- [ ] AI module (separate inference component): YOLOv8 via ONNX or Python microservice; input = damage photos; output = detected parts/regions with confidence scores + severity (minor/major); store outputs per inspection for audit.
- [ ] Manual fallback process (required override by user); skip/confirm/reject AI suggestions; confidence threshold configurable.
- [ ] If no pretrained car-damage model: general object detector fallback (e.g., wheel/headlight) + human tagging; iterative retraining path if labeled data collected.
Status: NOT STARTED
Gate: AI outputs stored with inspection; user can override; audit trail preserved.

## Phase 8 — finance / notifications / analytics (Agent 2 + Agent 3)
- [ ] Finance: invoice, settlement, receipts, reconciliation; maker/checker controls.
- [ ] Communication templates; retries; preferences; status updates to customer/staff.
- [ ] Dashboards (scoped reports/exports); analytics filters; formula-injection protection.
Status: NOT STARTED

## Phase 9 — reports / admin / deploy (Agent 3 + Agent 1 + Agent 2)
- [ ] Reports/exports with parameterized queries; no formula injection; scoped access.
- [ ] Settings/admin console: user/role management, settings, audit log search, access review, retention policy.
- [ ] Threat model; permission audit; E2E per portal (customer/staff/admin); accessibility audit; Lighthouse CLS/LCP targets met; bundle size minimized; image lazy-load enabled.
- [ ] Backup/rehearsal (mysqldump daily); migration strategy verified; staging UAT completed; production monitoring and runbooks defined.
Status: NOT STARTED
Gate: M7 (final) — build + lint + typecheck + tests pass; no secrets; security/code review complete; docs updated.

## Cross-phase security / architecture rules (always apply)
- Auth: secure cookie/JWT HTTP-only SameSite; role-check per request; deny-by-default; no shared secrets; separate .env.local / .env.production; no hardcoded keys/DB URIs.
- Auth middleware validates expected role server-side; mismatched role denied generically (UI never substitutes authorization).
- Customer public registration only; staff accounts provisioned by admin/management.
- Image upload: validation (type, size); sharp optimization (thumbnail, AVIF/WebP); remote-host allowlist; no untrusted SVG.
- Financial calculations: integer minor units or DECIMAL; never float; calculations visible; tax/depreciation clearly shown.
- Audit: critical mutations logged; no passwords/tokens/secrets in logs; audit trail for approvals and role changes.
Status: ONGOING (must pass at each gate)

## Definition of done (per task / milestone)
Implementation complete; validation and server auth/scope present; tests pass; lint/typecheck/build pass; no secrets or sensitive fixtures; TODO.md and relevant docs (README.md, docs/*, architecture docs, security docs) updated; plan (opencode/plans/agent-org-plan.md) updated at milestone checkpoints M2/M4/M7.
Status: ONGOING

## M3 Checkpoint � Admin Console (completed / proceeded)
- Agent A (lovable): /staff/admin/page.tsx, /staff/reports/live, layout RBAC, docs/release/admin-console-frontend.md
- Agent B (prompts.chat): auth/platform-sign-in + authorization + audit service/repo/types + analytics endpoint/service + migration applied + docs/release/admin-console-backend.md
- Agent C (quality): deny-by-default PASS, 3 TS errors fixed, favicon always visible, zero secrets/fixtures
- Migration applied: prisma/migrations/20261102_admin_console_staff_audit.sql (additive)
- M2 middleware: documented open; sign-in + analytics routes enforce expected-role server-side
- Build: admin files clean (only unrelated pre-existing errors in auth/customer/register/page.tsx)
- Plan: opencode/plans/admin-console-plan.md updated; agent-org-plan.md at M3

