import { createHmac } from 'crypto';

export interface SessionPayload {
  userId: string;
  role: string;
  issuedAt: number;
}

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function encodePayload(obj: SessionPayload): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

export function createSessionToken(userId: string, role: string): string {
  const payload: SessionPayload = { userId, role, issuedAt: Date.now() };
  const payloadEncoded = encodePayload(payload);
  const secret = process.env.AUTH_SESSION_SECRET || '';
  if (!secret) throw new Error('AUTH_SESSION_SECRET is not configured');
  const signature = signPayload(payloadEncoded, secret);
  return `${payloadEncoded}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const secret = process.env.AUTH_SESSION_SECRET || '';
  if (!secret || !token || !token.includes('.')) return null;
  const [payloadEncoded, signature] = token.split('.');
  if (!payloadEncoded || !signature) return null;
  const expected = signPayload(payloadEncoded, secret);
  if (signature !== expected) return null;
  try {
    const payloadStr = Buffer.from(payloadEncoded, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadStr);
    if (!payload || typeof payload !== 'object') return null;
    if (typeof payload.userId !== 'string' || payload.userId.length === 0) return null;
    if (typeof payload.role !== 'string' || payload.role.length === 0) return null;
    if (typeof payload.issuedAt !== 'number') return null;
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
