import { CustomerRepo } from '@/lib/db/customer.repository';
export default async function CustomerProfilePage() {
  // Placeholder: in production fetch session via cookie and render profile
  return (<main aria-label="Customer profile" className="mx-auto max-w-3xl px-6 py-10"><h1 className="text-3xl font-extrabold tracking-tight mb-4">Your Profile</h1><p className="text-muted-foreground">Profile management coming in M2. Use /customer/dashboard for now.</p></main>);
}
