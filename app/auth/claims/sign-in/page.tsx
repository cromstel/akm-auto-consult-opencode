'use client';

import { getAppName } from '@/lib/env';
import Link from 'next/link';
import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function StaffClaimsSignInPage() {
  const appName = getAppName();
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="staff" />
      <main aria-label="Staff claims sign in" className="mx-auto max-w-md flex-1 px-6 py-16">
        <img src="/icon.svg" alt="AKM Logo" className="h-10 w-auto mb-4" />
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">{appName}</h1>
        <h2 className="mb-6 text-xl font-semibold">Claims / Adjustments — staff sign in</h2>
        <p className="mb-4 text-sm text-muted-foreground">Restricted to staff/admin roles. Expected role validated server-side; mismatched roles denied generically.</p>
        <form className="space-y-4" aria-label="Staff claims sign-in form" action="#" method="post" noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">Sign in</button>
        </form>
        <nav aria-label="Alternative links" className="mt-4 flex gap-4 text-sm">
          <Link className="underline underline-offset-2 hover:text-primary" href="/customer/register">Register as customer</Link>
          <Link className="underline underline-offset-2 hover:text-primary" href="/customer/claims">Customer claims</Link>
          <Link className="underline underline-offset-2 hover:text-primary" href="/">Back to landing</Link>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
