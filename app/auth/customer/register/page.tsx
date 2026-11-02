import { getAppName } from '@/lib/env';
import Link from 'next/link';
import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { registerCustomer } from '@/lib/auth/customer.actions';

export default function CustomerRegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="customer" />
      <main aria-label="Customer registration" className="mx-auto max-w-md flex-1 px-6 py-16">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight">{getAppName()}</h1>
        <h2 className="mb-6 text-xl font-semibold">Customer register</h2>
        <p className="mb-4 text-sm text-muted-foreground">Public registration creates customer accounts only. Staff/admin accounts are provisioned by authorized management.</p>
        <form className="space-y-4" aria-label="Customer registration form" action={async (formData: FormData) => { 'use server'; await registerCustomer(
          formData.get('email') as string,
          formData.get('password') as string,
          formData.get('fullName') as string,
          formData.get('phone') as string,
          formData.get('address') as string,
          formData.get('dateOfBirth') as string,
          formData.get('organization') as string,
          formData.get('policyNumber') as string,
          formData.get('nationalIdNumber') as string,
          formData.get('confirmEmail') as string,
        ); }} method="POST">
          <div><label htmlFor="fullName" className="mb-1 block text-sm font-medium">Full name</label><input id="fullName" name="fullName" type="text" required autoComplete="name" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></div>
          <div><label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label><input id="email" name="email" type="email" required autoComplete="email" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></div>
          <div><label htmlFor="confirmEmail" className="mb-1 block text-sm font-medium">Confirm email</label><input id="confirmEmail" name="confirmEmail" type="email" required autoComplete="email" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></div>
          <div><label htmlFor="phone" className="mb-1 block text-sm font-medium">Contact number</label><input id="phone" name="phone" type="tel" required autoComplete="tel" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></div>
          <div><label htmlFor="address" className="mb-1 block text-sm font-medium">Address</label><input id="address" name="address" type="text" required className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></div>
          <div><label htmlFor="dateOfBirth" className="mb-1 block text-sm font-medium">Date of birth</label><input id="dateOfBirth" name="dateOfBirth" type="date" required className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></div>
          <div><label htmlFor="nationalIdNumber" className="mb-1 block text-sm font-medium">National ID number (verification)</label><input id="nationalIdNumber" name="nationalIdNumber" type="text" maxLength={60} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></div>
          <div><label htmlFor="policyNumber" className="mb-1 block text-sm font-medium">Policy number *</label><input id="policyNumber" name="policyNumber" type="text" maxLength={60} required className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></div>
          <div><label htmlFor="organization" className="mb-1 block text-sm font-medium">Organization name *</label><input id="organization" name="organization" type="text" required className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></div>
          <div className="grid grid-cols-2 gap-3"><div><label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label><input id="password" name="password" type="password" required minLength={8} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></div><div><label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">Confirm</label><input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></div></div>
          {/* Bot honeypot — must stay empty */}
          <div aria-hidden="true" className="hidden"><label htmlFor="honeytrap">Leave empty</label><input id="honeytrap" name="honeytrap" type="text" tabIndex={-1} autoComplete="off" /></div>
          <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">Create account</button>
        </form>
        <nav aria-label="Alternative links" className="mt-4 flex gap-4 text-sm"><Link href="/auth/customer/sign-in" className="underline underline-offset-2 hover:text-primary">Sign in</Link></nav>
      </main>
      <SiteFooter />
    </div>
  );
}
