# System Architecture
## Stack
Next.js App Router + React + TypeScript strict; Tailwind CSS v4 + PostCSS; MySQL supported LTS; supported Node.js LTS; schema validation (Zod or equivalent); proven auth/session library or carefully designed first-party service; unit/integration tests and Playwright; OpenTelemetry-compatible logs/traces; private object storage and provider adapters. Verify current ORM MySQL compatibility at bootstrap: Prisma only if current stable supports the required MySQL setup; otherwise choose a stable MySQL-compatible typed ORM/query builder. Do not assume PostgreSQL features.

## Agent-plan architecture references
Plan file: opencode/plans/agent-org-plan.md. Agent 1 (UI) owns public/customer/staff layouts + reusable RBAC sidebar; Agent 2 (backend/DB) owns modules, schema, auth middleware, claim state machine; Agent 3 (AI/quality) owns sharp image pipeline, AI service integration (YOLOv8/ONNX or manual fallback), document generation, and milestone quality/security gates (M2/M4/M7).
Module mapping: identity/auth -> Agent 2; customers/vehicles -> Agent 1+2; claims/inspections -> Agent 1+2; AI/image -> Agent 3; estimates/finance -> Agent 1+2+3; analytics/admin -> Agent 3.
## Design
Modular monolith with domains and clear layers: UI (RSC/layouts/forms), application use cases, domain rules/state machine, infrastructure repositories/storage/mail/PDF/telemetry, API route handlers. Server actions are also untrusted entry points.

## Folder structure
```text
src/
  app/
    (public)/{layout.tsx,page.tsx,services/,contact/,legal/}
    (auth)/auth/{customer,platform,company-admin,management,claims,adjuster,inspector,finance,auditor,support}/sign-in/
    (customer-portal)/customer/{layout.tsx,...}
    (staff-portal)/dashboard/{layout.tsx,claims/,inspections/,estimates/,finance/,reports/,admin/}
    api/v1/
    globals.css layout.tsx error.tsx
  components/{ui,public,dashboard,forms,data-table}/
  modules/{identity,organizations,customers,vehicles,policies,claims,inspections,evidence,estimates,adjustments,documents,finance,notifications,reporting,audit}/
  lib/{auth,authorization,config,db,env,http,logging,rate-limit,storage,validation}/
  styles/ types/
db/{migrations,seed}/
tests/{unit,integration,e2e}/
public/{brand,images}/
docs/
```
Route groups organize layouts without changing URL. API version path `/api/v1`.

## Shells
Public shell has public header/footer. Customer portal has customer shell. Staff dashboard has separate global dashboard header/footer and shared permission-aware sidebar. Header may contain account menu, notifications, theme, breadcrumbs and permitted quick search. UI filtering is convenience; services/APIs enforce permissions.

## Performance
Prefer server components; client components only for interaction. Private pages/response data must not be cached cross-user. Bounded server pagination, indexes, explicit cache policies. Next Image with dimensions/sizes, modern formats, lazy load below fold, remote host allowlist; no untrusted SVG. Standard production minification/build optimizations, no manual source minification.
