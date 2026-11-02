import { getAppName } from 
\@/lib/env\';
import Link from 
\next/link\';
import { PortalHeader } from 
\@/components/layout/portal-header\';
import { SiteFooter } from 
\@/components/layout/site-footer\';

export default function CustomerSignInPage() {
  const appName = getAppName();

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="customer" />
      <main aria-label="Customer sign in" className="mx-auto max-w-md flex-1 px-6 py-16">
