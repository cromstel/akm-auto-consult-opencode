import { z } from 'zod';

/**
 * Startup environment validation (imported by instrumentation.ts).
 *
 * Fail fast on missing/invalid configuration. Error messages contain key
 * names only — never values (secrets must not leak through logs or stack
 * traces).
 *
 * Rules:
 * - DATABASE_URL is always required and must be a mysql:// connection string.
 * - AUTH_SESSION_SECRET is required in production (>= 32 chars).
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_NAME: z.string().min(1).optional(),
  APP_URL: z.url().optional(),
  DATABASE_URL: z
    .string()
    .min(1)
    .refine((value) => value.startsWith('mysql://'), {
      message: 'DATABASE_URL must be a mysql:// connection string',
    }),
  AUTH_SESSION_SECRET: z.string().min(32).optional(),
  SESSION_TTL_SECONDS: z.coerce.number().int().positive().default(3600),
  AUTH_MFA_REQUIRED_FOR_PRIVILEGED: z
    .string()
    .default('true')
    .transform((value) => value === 'true'),
  TRUSTED_ORIGINS: z.string().default(''),
  STORAGE_BUCKET: z.string().optional(),
  JWT_SECRET: z.string().min(32).optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const keys = parsed.error.issues
      .map((issue) => issue.path.join('.'))
      .filter(Boolean)
      .join(', ');
    throw new Error(`Invalid environment configuration: ${keys}`);
  }

  if (parsed.data.NODE_ENV === 'production' && !parsed.data.AUTH_SESSION_SECRET) {
    throw new Error('Invalid environment configuration: AUTH_SESSION_SECRET is required in production');
  }

  return parsed.data;
}

/**
 * Non-throwing accessors for display config (brand name, base URL).
 *
 * These are safe to call during static prerender at build time, unlike
 * validateEnv(), which runs only at server startup via instrumentation.
 * The product display name must come from validated environment config,
 * never from a hardcoded literal.
 */
export function getAppName(): string {
  return process.env.APP_NAME?.trim() || 'App';
}

export function getAppUrl(): string {
  return process.env.APP_URL?.trim() || 'http://localhost:3000';
}
