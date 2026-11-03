import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth/auth.service';
import { CustomerRepo } from '@/lib/db/customer.repository';
import { CustomerCard } from '@/components/customer/Card';

export default async function CustomerProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const payload = session ? verifySessionToken(session) : null;
  if (!payload || payload.role !== 'customer') return (<main aria-label="Profile" className="mx-auto max-w-3xl px-6 py-10"><h1 className="text-3xl font-extrabold">Profile</h1><p className="text-destructive">Not authorized.</p></main>);

  const customer = await CustomerRepo.findByUserId(payload.userId);
  if (!customer) return (<main aria-label="Profile" className="mx-auto max-w-3xl px-6 py-10"><h1 className="text-3xl font-extrabold">Profile</h1><p>Profile not found.</p></main>);

  return (
    <main aria-label="Customer profile" className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Your Profile</h1>
      <CustomerCard title="Personal info">
        <div className="grid gap-2 text-sm"><div><strong>Name:</strong> {customer.name}</div><div><strong>Full name:</strong> {customer.fullName || '-'}</div><div><strong>Email:</strong> {payload?.userId ? '-' : '-'}</div><div><strong>Phone:</strong> {customer.phone || '-'}</div><div><strong>National ID:</strong> {customer.nationalIdNumber || '-'}</div><div><strong>Address:</strong> {customer.address || '-'}</div><div><strong>DOB:</strong> {customer.dateOfBirth ? new Date(customer.dateOfBirth).toISOString().split('T')[0] : '-'}</div></div>
      </CustomerCard>
      <CustomerCard title="Organization">
        <div className="grid gap-2 text-sm"><div><strong>Organization:</strong> {customer.organization || '-'}</div></div>
      </CustomerCard>
    </main>
  );
}
