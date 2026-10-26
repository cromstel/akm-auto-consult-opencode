import { randomUUID } from 'crypto';

export interface SessionPayload {
  userId: string;
  role: string;
  issuedAt: number;
}

export function createSessionToken(userId: string, role: string): string {
  // Skeleton for JWT/session: real secret from process.env.AUTH_SESSION_SECRET
  return `session:${userId}:${role}:${randomUUID()}`;
}

export function validateEnv() {
  const required = ['DATABASE_URL', 'AUTH_SESSION_SECRET', 'APP_URL'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing env: ${missing.join(', ')}`);
  }
}
