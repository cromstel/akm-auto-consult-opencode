import z from 'zod';

export const CustomerRegisterSchema = z.object({
  email: z.string().email('Invalid email'),
  confirmEmail: z.string().email('Invalid confirm email'),
  fullName: z.string().min(1, 'Full name required').max(120),
  phone: z.string().optional().refine((v) => !v || /^\+?[\d\s()-]{7,}$/.test(v), { message: 'Invalid phone number' }),
  address: z.string().optional().refine((v) => !v || v.length >= 5, { message: 'Address too short' }),
  dateOfBirth: z.string().optional().refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), { message: 'Date must be YYYY-MM-DD' }),
  organization: z.string().min(1, 'Organization name required').max(120),
  nationalIdNumber: z.string().max(60).optional(),
  policyNumber: z.string().min(1, 'Policy number required').max(60),
  password: z.string().min(8, 'Min 8 chars').max(128).regex(/[A-Z]/, 'Need uppercase').regex(/[a-z]/, 'Need lowercase').regex(/[0-9]/, 'Need digit'),
  confirmPassword: z.string(),
  honeytrap: z.string().optional(), // bot honeypot — must be empty
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] })
.refine((d) => d.email === d.confirmEmail, { message: 'Emails must match', path: ['confirmEmail'] })
.refine((d) => !d.honeytrap || d.honeytrap === '', { message: 'Bot detected', path: ['honeytrap'] });
