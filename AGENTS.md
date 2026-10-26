# OpenCode Agent Instructions
Read `MEMORY.md`, `WIKI.md`, `PRD.md`, architecture, security, API docs and `TODO.md` before coding.

- Implement TODO phases sequentially. Mark done only after tests and review.
- Use Next.js App Router, TypeScript strict, Tailwind CSS + PostCSS; follow https://nextjs.org/docs.
- MySQL is required. Server-only typed data-access layer; no client DB access.
- Every route handler, server action and mutation validates input, authenticates, authorizes permission and record/tenant scope, and applies rate limits where relevant. UI hiding is never authorization.
- Customer public registration only. Staff accounts are provisioned by authorized admin/management.
- Separate role sign-in routes; expected role must be validated server-side. Shared internal auth service is allowed, but mismatched role is denied generically.
- No hardcoded secrets, app name, port, DB host/name/user/password, public origin or key. Validate env configuration. Commit `.example` templates only; ignore `.env*` local secrets.
- Use secure httpOnly SameSite cookies, session rotation/revocation, CSRF protections and MFA/step-up for privileged actions.
- Financial values use integer minor units or DECIMAL, never float. Transactions and idempotency for critical operations.
- Audit security/business-critical mutations. Do not log passwords, tokens, secret values or sensitive evidence URLs.
- Follow agent plan (opencode/plans/agent-org-plan.md): milestones M1-M7, parallel agents (UI/Backend/AI+Quality), milestone gates M2/M4/M7, update TODO.md and docs after each phase.
- Confirm unclear sections before implementing; apply best recommendations by default (security, RBAC, DECIMAL finance, AVIF pipeline, AI audit storage, deny-by-default, no production fixtures).
- Reusable RBAC-aware dashboard sidebar, separate public/customer/staff layouts and headers/footers.
- Prefer Server Components; use Client Components only for needed interaction.
- Next.js Image for assets: dimensions/sizes, optimized formats, lazy loading and remote host allowlist. Avoid untrusted SVG.
- Add tests for access boundaries, workflow state transitions, calculations and APIs. Lint/typecheck/tests/build must pass.
- Update docs/TODO after schema or behavior changes. Never use production customer data in fixtures.
