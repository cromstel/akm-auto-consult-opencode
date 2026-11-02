import { getAppName } from '@/lib/env';
import Link from 'next/link';
import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { signInCustomer } from '@/lib/auth/customer.actions';

export default function CustomerSignInPage() {
  const appName = getAppName();
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="customer" />
      <main aria-label="Customer sign in" className="mx-auto max-w-md flex-1 px-6 py-16">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight">{appName}</h1>
        <h2 className="mb-6 text-xl font-semibold">Customer sign in</h2>
        <form className="space-y-4" aria-label="Customer sign-in form" action={async (formData: FormData) => { 'use server'; const res = await signInCustomer(formData.get('email') as string, formData.get('password') as string); if (!res.success) { /* handle error display */ } }} method="POST">
          <div><label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label><input id="email" name="email" type="email" required autoComplete="email" className="w-full border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></div>
          <div><label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="w-full border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></div>
          <button type="submit" className="w-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">Sign in</button>
        </form>
        <nav aria-label="Alternative links" className="mt-4 flex gap-4 text-sm"><Link href="/auth/customer/register" className="underline underline-offset-2 hover:text-primary">Register</Link></nav>
      </main>
      <SiteFooter />
    </div>
  );
}
