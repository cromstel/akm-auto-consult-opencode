# Plan — Full Frontend Development (AKM Auto Consult)
Plan file: opencode/plans/frontend-development-plan.md
Source skill: frontend-patterns (C:\projects\akm-auto-consult-opencode\skills\frontend-patterns\SKILL.md)
Date: 2026-10-26

## 1) Scope (per agent-org-plan.md milestones M3A / M4 / M5)
- Customer portal pages: claim submission, claim list/status, inspection schedule/view, estimate review/approval.
- Staff/admin portal pages: claims dashboard (table + filters), inspection checklist/completion, loss-adjustment form, approval/action panel.
- Shared: theme (light/dark, CSS custom props), responsive grids (1-col mobile / 3-col desktop), lazy component loading, memoized lists.
- No production fixtures; all pages use skeleton/loading states backed by server-only DB access.

## 2) Component Patterns (from skill reference)
- Composition: Card / CardHeader / CardBody; reusable Table, StatusBadge, ActionButton.
- Compound: Tabs (TabsContext + TabList + Tab) for claim lifecycle (submitted -> assigned -> inspected -> estimated -> approved -> resolved).
- Custom hooks: useQuery (fetcher + refetch stability via refs, enabled gate) for claims/inspection/estimate data; useDebounce for claim-search filters (500ms); useToggle for theme.
- Render props: DataLoader wrapper for async claim/inspection/evidence feeds; skeleton + error boundary per page.

## 3) Performance (per skill patterns)
- Memoization: useMemo for sorted/filtered claim lists; useCallback for search handlers; React.memo on pure cards (MarketCard / ClaimStatusBadge reference pattern).
- Lazy loading: lazy import for HeavyChart / inspection-map component; Suspense with ChartSkeleton.
- Virtualization: tanstack/react-virtual for long claim/evidence lists (estimateSize = 100, overscan 5).
- Image optimization: next/image with AVIF/WebP source; dimensions/sizes specified; lazy loading; remote host allowlist; no untrusted SVG.

## 4) Forms + Validation
- Controlled forms with Zod schemas; server-side authorization before any mutation; audit links recorded.
- Form error display per field; no float arithmetic for financial fields (DECIMAL via integer pesewas; `lib/finances/money.ts`).

## 5) Accessibility + Design
- Semantic HTML; aria-modal/dialog roles; reduced-motion support (prefers-reduced-motion); keyboard navigation on dropdowns/modals; focus management (previous focus restored on close).
- Theme tokens (`globals.css`): `--background`, `--foreground`, `--card`, `--primary`, `--border`; dark mode via `.dark` class.
- Responsive: mobile 1-col / desktop 3-col grid for claim cards; table scroll with sticky header.

## 6) Error / State Boundaries
- Client error boundary (`error.tsx`, `global-error.tsx`): generic message only; no stack/SQL details.
- Server-side deny-by-default (`proxy.ts`, auth middleware): protected paths redirect; role mismatch denied generically.
- Structured logging (`lib/observability/logger.ts`): JSON entries; redact sensitive keys; requestId propagated.
- Request correlation (`proxy.ts`): `x-request-id` header; echoed on response; audit links reference it.

## 7) Deliverables (no fixtures; skeleton/loading states until DB wired)
- `/customer/dashboard` + `/claims` + `/inspections/{id}` + `/estimates/{id}` (layout + header/footer different from public).
- `/staff/dashboard` + `/claims` + `/inspections` + `/estimates` + `/finance` (RBAC sidebar with permission-filtered nav; server authorization authoritative).
- Component library: `components/theme-toggle.tsx`, `components/layout/*.tsx` (SiteFooter, PortalHeader); `components/market-card.tsx` (reference from skill) adapted for claim cards.
- Tests for form validation, memoization, accessibility labels; no production fixtures; audit links only reference skeleton IDs.

## 8) Stop/Block Conditions
- No hardcoded secrets/app name/DB URL/port in components.
- Every protected route uses deny-by-default server check (not UI-only hiding).
- Images optimized via AVIF pipeline (`lib/pipeline/avif-evidence.ts`) before upload; audit link stored.
- Financial calculations use `DECIMAL` integer minor units (pesewas); never float.
- Tests/build/lint/type clean; 0 audit vulnerabilities; no `.env.local` committed.
