# Quality and Release Gate
Tests: unit (state machine, permissions, money/tax rounding, validation); integration (repositories, transaction, sessions, scoped queries, upload); API (auth, schemas, idempotency, rate limits); E2E (customer flow, each staff entry path, provisioning, inspection, estimate approval, finance checker); security (IDOR, escalation, CSRF/XSS, upload bypass, export injection, session invalidation). Use anonymized fixtures only.

Performance: track LCP/INP/CLS; server pagination, query indexes/plans, dynamic heavy components, bundle analysis, Next Image dimensions/sizes/modern formats/remote allowlist. Establish budgets with owner.

Accessibility: WCAG 2.2 AA target; keyboard/focus/labels/errors/contrast/reduced motion; accessible dialogs, tables, charts; validate both themes.

Release gate: accepted stories; no open critical/high security findings; lint/typecheck/tests/build pass; migration and restore tested; accessibility/performance agreed; secret scan clean; monitoring/runbooks active; UAT and release approval recorded.
- Milestone gates (plan): M2 auth gate (tests + middleware deny-by-default + no secrets); M4 claims gate (state machine + cross-tenant isolation); M7 deploy gate (performance/security/code review + docs updated).
- Fixtures: anonymized only; no production customer/claim data; no real names/phones in fixtures or logs.
