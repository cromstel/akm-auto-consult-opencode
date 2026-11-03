'use server';
import { createSessionToken } from '@/lib/auth/auth.service';
import { hashPassword, comparePassword } from './password';
import { prisma } from '../db/prisma';
import { cookies } from 'next/headers';

export async function signInCustomer(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== 'customer' || !await comparePassword(password, user.passwordHash)) return { success: false, error: 'Invalid credentials' };
  if (!user.verified) return { success: false, error: 'Please verify your email' };
  const token = createSessionToken(user.id, user.role);
  (await cookies()).set('session', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 86400, path: '/' });
  return { success: true };
}

export async function registerCustomer(email: string, password: string, fullName?: string, phone?: string, address?: string, dateOfBirth?: string, organization?: string, policyNumber?: string, nationalIdNumber?: string, honeytrap?: string, confirmEmail?: string) {
  if (honeytrap && honeytrap !== '') return { success: false, error: 'Bot detected' };
  // Inline email + confirm match validation
  if (!email || !confirmEmail || email !== confirmEmail) return { success: false, error: 'Emails must match' };
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { success: false, error: 'Account exists' };
  const hash = await hashPassword(password);
  const userData = { email, passwordHash: hash, role: 'customer', status: 'pending', verified: false, fullName: fullName || undefined, phone: phone || undefined, name: fullName || email };
  const user = await prisma.user.create({ data: userData });
  const customerData = {
    userId: user.id,
    name: fullName || email,
    fullName: fullName || undefined,
    phone: phone || undefined,
    address: address || undefined,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    organization: organization || '',
    nationalIdNumber: nationalIdNumber || undefined,
  };
  await prisma.customer.create({ data: customerData });
  if (policyNumber) {
    const customerRec = await prisma.customer.findUnique({ where: { userId: user.id }, select: { id: true } });
    if (customerRec) {
      await prisma.policy.create({ data: { customerId: customerRec.id, policyNumber } });
    }
  }
  return { success: true, userId: user.id };
}
