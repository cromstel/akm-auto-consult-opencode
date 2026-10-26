# Deployment and Environment
Use `.env.local` and `.env.production` locally, ignored by Git; commit only `.env.example` templates. Production secrets belong in deployment secret manager. Validate configuration at startup and never log values. Do not expose server values via `NEXT_PUBLIC_*`.

Configuration keys: `APP_NAME`, `APP_URL`, `PORT`, `NODE_ENV`, `DATABASE_URL` (or one canonical DB env scheme), `AUTH_SESSION_SECRET`, `SESSION_TTL_SECONDS`, `AUTH_MFA_REQUIRED_FOR_PRIVILEGED`, `TRUSTED_ORIGINS`, `RATE_LIMIT_*`, `STORAGE_ENDPOINT/REGION/BUCKET/ACCESS_KEY_ID/SECRET_ACCESS_KEY`, `MAIL_FROM`, `MAIL_PROVIDER_API_KEY`, `LOG_LEVEL`, `OTEL_EXPORTER_OTLP_ENDPOINT`.

Deploy on supported Node LTS, HTTPS, secure cookies, private MySQL network/TLS, least-privilege DB account, encrypted backups, private object storage. CI: lint/typecheck/test/migration checks/dependency and secret scan/build. CD: staging, smoke tests, approval gate, production rollout, rollback/forward plan.

Backups: encrypted automated MySQL backup and PITR where possible; object versioning and retention; rehearse restore of DB and file metadata; agree RPO/RTO. Monitor errors, latency, DB pool, storage, retries, backup status and auth anomalies.
- Agent-plan milestone gates apply: M2 auth, M4 claims, M7 deploy. Each gate requires build+lint+typecheck+tests pass, no secrets, security/code review complete.
- .env files never committed; .env.local/.env.production only; secret manager for production keys (DB, JWT, mail, storage).
- AI inference module: if using a separate Python/ONNX service, deploy separately with health checks; manual fallback enforced; audit outputs stored per inspection.

## Production deploy target & runbook (Hostinger CloudLinux)
Target: `https://akmautoconsult.cromstelit.com` — Node.js website, hosting account `u255640043`, order `200530310`, docroot `.../public_html/akm-auto-consult`. MySQL runs on the same host: the app connects to `127.0.0.1:3306`; never use the public `srvNNNN.hstgr.io` hostname from the app.

Each step below is gated on explicit human approval before execution:

1. Create production MySQL database + user (Hostinger API). Credentials go only into `hosting_nodejs_replace-environment-variables` (full replace, masked on read) — never into files, source or logs.
2. Set production env vars: `NODE_ENV=production`, `DATABASE_URL` (mysql://...@127.0.0.1:3306/...), `AUTH_SESSION_SECRET` (>= 32 chars, generated), `APP_URL=https://akmautoconsult.cromstelit.com`.
3. Build & deploy the Node.js app (`hosting_nodejs_start-build` → poll `hosting_nodejs_build`; on failure `hosting_nodejs_analyse-failed-build`). Build-time env changes require a rebuild.
4. Apply schema: `prisma migrate deploy` against the production DB (no shadow DB needed — restricted-user workflow, see docs/architecture/DATABASE.md).
5. Smoke tests: `GET /` → 200; `GET /customer` → redirect to `/auth/customer/sign-in`; `POST /api/auth` with invalid body → 400.

Rollback plan (rehearse before first production deploy):
- Pre-deploy snapshot: `mysqldump` of the production DB plus record of the current deployed build.
- Rollback: restore DB snapshot, re-deploy the previous build. For a first deploy, rollback = remove app files + drop app database.
- Migrations are forward-only; schema rollback happens via dump restore, never by down-migrating.
