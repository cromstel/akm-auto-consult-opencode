import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import { createSessionToken } from '@/lib/auth/auth.service';

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(128),
});

export async function POST(req: Request) {
  const requestId = req.headers.get('x-request-id') ?? 'unknown';
  try {
    const body: unknown = await req.json();
    const parsed = signInSchema.safeParse(body);
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fields[issue.path.join('.')] = issue.message;
      }
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'The request could not be processed.',
            fields,
            requestId,
          },
        },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true, role: true, status: true },
    });
    if (!user || user.status !== 'active' || user.role === 'public') {
      await prisma.audit.create({
        data: {
          action: 'sign_in',
          resource: 'auth/session',
          resourceId: null,
          context: JSON.stringify({ requestId, reason: 'invalid_or_inactive' }),
          outcome: 'failure',
          reason: 'invalid_credentials',
        },
      }).catch(() => {});
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'The request could not be processed.', requestId } },
        { status: 401 }
      );
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      await prisma.audit.create({
        data: {
          actorId: user.id,
          action: 'sign_in',
          resource: 'auth/session',
          resourceId: null,
          context: JSON.stringify({ requestId, reason: 'bad_password' }),
          outcome: 'failure',
          reason: 'invalid_credentials',
        },
      }).catch(() => {});
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'The request could not be processed.', requestId } },
        { status: 401 }
      );
    }
    const token = createSessionToken(user.id, user.role);
    const ttl = parseInt(process.env.SESSION_TTL_SECONDS || '43200', 10);
    const response = NextResponse.json(
      { data: { status: 'authenticated' }, meta: { requestId } },
      { status: 200 }
    );
    response.headers.set(
      'Set-Cookie',
      `session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${ttl}`
    );
    await prisma.audit.create({
      data: {
        actorId: user.id,
        action: 'sign_in',
        resource: 'auth/session',
        resourceId: null,
        context: JSON.stringify({ requestId, role: user.role }),
        outcome: 'success',
      },
    }).catch(() => {});
    return response;
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.', requestId } },
      { status: 500 }
    );
  }
}
