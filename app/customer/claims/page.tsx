import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth/auth.service';
import { CustomerRepo } from '@/lib/db/customer.repository';
import { ClaimRepo } from '@/lib/db/claim.repository';
import { CustomerCard } from '@/components/customer/Card';

export default async function CustomerClaimsPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const payload = session ? verifySessionToken(session) : null;
  if (!payload || payload.role !== 'customer') return (<main aria-label="Claims" className="mx-auto max-w-3xl px-6 py-10"><h1 className="text-3xl font-extrabold">Claims</h1><p className="text-destructive">Not authorized.</p></main>);

  const customer = await CustomerRepo.findByUserId(payload.userId);
  if (!customer) return (<main aria-label="Claims" className="mx-auto max-w-3xl px-6 py-10"><h1 className="text-3xl font-extrabold">Claims</h1><p>No claims found.</p></main>);

  const claims = await ClaimRepo.findByCustomerId(payload.userId, 'self');
  return (
    <main aria-label="Claims" className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Your Claims</h1>
      {claims.length === 0 ? (<p>No claims yet.</p>) : (
        <div className="space-y-4">
          {claims.map(c => (
            <CustomerCard key={c.id} title={c.claimNumber}>
              <dl className="grid grid-cols-2 gap-4 text-sm"><dt>Status</dt><dd>{c.status}</dd><dt>Vehicle</dt><dd>{c.vehicle?.make} {c.vehicle?.model}</dd><dt>Priority</dt><dd>{c.priority}</dd></dl>
            </CustomerCard>
          ))}
        </div>
      )}
    </main>
  );
}
