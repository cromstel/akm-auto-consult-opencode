name: customers-portal-plan
description: Parallel 3-agent implementation of Customer self-service portal (Phase 3/4) — REVIEWED; M2/M3/M4 follow-up required
status: reviewed
---
# Customers Self-Service Portal Plan (POST-REVIEW)
Source: PRD.md, TODO.md Phase 3/4, AGENTS.md
Status from review (thoughts/reviews/customers-portal-review.md): DB complete; API partial; UI rebuilt but missing planned pages; auth middleware file deferred; tests missing.

## Follow-up Milestones (parallel agents)
- M2-Follow: `app/customer/profile/page.tsx` + `components/customer/Card.tsx` + `app/customer/layout.tsx` sidebar
- M3-Follow: Vehicle link/enhancement on `app/customer/vehicles/page.tsx`
- M4-Follow: Claim intake endpoint `app/api/v1/claims/intake/route.ts` + `lib/auth/auth.middleware.ts` + `tests/customers/repo.test.ts`

## Security (already verified on /api/v1/customers)
- Cookie session (`verifySessionToken`), deny-by-default, `role==='customer'` enforced.
- Next lanes must preserve same pattern.
