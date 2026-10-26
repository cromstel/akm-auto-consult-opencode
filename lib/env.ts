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
 * - AUTH_SESSION_SECRET is required in production (>= 32 chars). In
 *   development it is validated if present; sessions are skeleton-only until
 *   the M2 auth service is fully wired.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_NAME: z.string().min(1).default('AKM Auto Consult'),
  APP_URL: z.string().url().default('http://localhost:3000'),
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
