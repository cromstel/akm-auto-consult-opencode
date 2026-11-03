import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth/auth.service';
import { VehicleRepo } from '@/lib/db/vehicle.repository';
import { CustomerCard } from '@/components/customer/Card';

export default async function CustomerVehiclesPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const payload = session ? verifySessionToken(session) : null;
  if (!payload || payload.role !== 'customer') return (<main aria-label="Vehicles" className="mx-auto max-w-3xl px-6 py-10"><h1 className="text-3xl font-extrabold">Vehicles</h1><p className="text-destructive">Not authorized.</p></main>);

  const vehicles = await VehicleRepo.findByCustomerId(payload.userId, 'self');
  return (
    <main aria-label="Vehicles" className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Vehicles</h1>
      {vehicles.length === 0 ? (<p>No vehicles found.</p>) : (
        <div className="grid gap-4">
          {vehicles.map(v => (
            <CustomerCard key={v.id} title={`${v.year} ${v.make} ${v.model}`}>
              <p className="text-sm text-muted-foreground">VIN: {v.vin || '—'}</p>
            </CustomerCard>
          ))}
        </div>
      )}
    </main>
  );
}
