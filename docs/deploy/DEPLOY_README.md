# AKM Auto Consult — Manual Upload Deployment Package

Packaged: 2026-10-27 · Build: Next.js 16.4.3 standalone · Target: Hostinger Node.js (CloudLinux, MySQL at `127.0.0.1:3306`)

## What's in this package
| Path | Purpose |
|------|---------|
| `server.js` | Standalone Next.js server entrypoint (hPanel startup file) |
| `.next/` | Compiled app (server chunks + static assets) |
| `public/` | Static files |
| `package.json` + `package-lock.json` | For `npm ci` on the server — installs Linux-correct binaries (sharp, Prisma engines) |
| `prisma/schema.prisma` + `prisma/migrations/0_init` | For `prisma migrate deploy` |
| `.env.production.example` | Template ONLY — copy key names into hPanel env vars; never commit real values |
| `DEPLOYMENT.md` | Full runbook + rollback plan |

**Deliberately excluded**: `node_modules` (Windows binaries from the build machine — `npm ci` installs Linux-correct ones) and any real `.env*` values (set via hPanel environment variables instead).

## Deploy steps (Hostinger hPanel)
1. **Upload & extract**: Upload this zip to your hosting file manager, extract into the Node.js app directory (e.g. `~/apps/akm-autoconsult`).
2. **Install dependencies**: In the app directory run `npm ci`. This recreates `node_modules` with Linux binaries (sharp/libvips, Prisma query engine) from the lockfile — required before first start.
3. **Database migration**: Run `npx prisma migrate deploy`. Uses `DATABASE_URL` from the environment. The DB user is restricted — `migrate deploy` (not `migrate dev`) is the only supported path; shadow database is not available.
4. **Environment variables** — set in hPanel (Node.js app settings), NOT in files:
   - `NODE_ENV=production`
   - `APP_URL=https://akmautoconsult.cromstelit.com`
   - `APP_NAME=<display name>`
   - `DATABASE_URL=mysql://<user>:<password>@127.0.0.1:3306/<database>` (use `127.0.0.1`, never the remote `srvNNNN` host, from the app on the same server)
   - `AUTH_SESSION_SECRET=<≥32 random chars>` (generate once, e.g. `openssl rand -base64 32`)
   - `SESSION_TTL_SECONDS`, `TRUSTED_ORIGINS=https://akmautoconsult.cromstelit.com`, plus storage/mail/OTEL keys per `.env.production.example`
5. **Startup file**: point the hPanel Node.js app at `server.js`. Set `PORT`/`HOSTNAME` per the panel (the app binds `0.0.0.0` by default in standalone mode).
6. **Verify**: app responds 200 on `/` (landing page); `/api/v1/claims/[id]` PATCH without auth returns generic 401/403 (deny-by-default working); no stack traces in responses.

## Rollback
See `DEPLOYMENT.md` (rollback section): revert env vars in hPanel, restore previous extracted directory, migrations are additive-only (`0_init`).

## Security notes
- The app validates env at startup and fails fast on missing/short secrets (`lib/env.ts`).
- Never store secrets in the repository or the zip; hPanel env vars are the single source of truth.
- Seed script refuses to run in production (`prisma/seed.ts` guard) — do not seed production.
