/**
 * Staff platform sign-in — separate role path per PRD / SECURITY_RBAC.
 * Expected role family validated server-side; form role never trusted.
 * Deny-by-default on mismatch + generic error (no enumeration).
 * Dependency: M2 session middleware / auth.service session token verify.
 */
import { createSessionToken } from './auth.service';

export type StaffRoleFamily = 'admin' | 'management' | 'claims_officer' | 'audit' | 'finance';

export interface PlatformSignInPayload {
  email: string;
  password: string; // validated by auth service / DB; never logged
  expectedRole: StaffRoleFamily;
}

export interface SignInResult {
  success: boolean;
  sessionToken?: string;
  role?: string;
  error?: string; // generic — never reveals which check failed
  requestId: string;
}

function generateRequestId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function platformSignIn(
  payload: PlatformSignInPayload,
  verifyFn?: (email: string, pw: string) => Promise<{ userId: string; role: string; scope: string } | null>
): Promise<SignInResult> {
  const requestId = generateRequestId();
  try {
    // 1) Validate shape (no raw trust of expectedRole from form; check exists)
    if (!payload || typeof payload.email !== 'string' || !payload.email.includes('@')) {
      return { success: false, error: 'Invalid request.', requestId };
    }
    const allowed: Record<string, boolean> = { admin: true, management: true, claims_officer: true, audit: true, finance: true };
    if (!allowed[payload.expectedRole]) {
      return { success: false, error: 'Access denied.', requestId };
    }

    // 2) Verify credentials via M2 auth service / DB (parameterized, never log pw)
    const verified = verifyFn ? await verifyFn(payload.email, payload.password) : null;
    if (!verified) {
      // Generic denial prevents account enumeration; audit separately
      return { success: false, error: 'Access denied.', requestId };
    }

    // 3) Expected-role validation server-side (deny by default)
    if (verified.role !== payload.expectedRole) {
      return { success: false, error: 'Access denied.', requestId };
    }

    // 4) Create session via M2 auth.service (secret from env, validated at runtime)
    const secret = process.env.AUTH_SESSION_SECRET;
    if (!secret) throw new Error('AUTH_SESSION_SECRET missing');
    const token = createSessionToken(verified.userId, verified.role);
    return { success: true, sessionToken: token, role: verified.role, requestId };
  } catch (e) {
    // Never leak internal details (no error.message to client)
    return { success: false, error: 'An error occurred.', requestId };
  }
}
