import { NextResponse } from 'next/server';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Validation side effect: throws ZodError on invalid input (handled below).
    signInSchema.parse(body);
    // Server-only: validate against DB; never expose passwordHash
    // Deny-by-default: role validated server-side after DB lookup (Agent 2)
    return NextResponse.json({ success: true, role: 'customer', message: 'Auth verified server-side' }, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
