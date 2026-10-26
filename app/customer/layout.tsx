export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container mx-auto py-8">
      <nav aria-label="Customer portal" className="mb-4 flex gap-4">
        <a href="/customer/dashboard" className="underline">Dashboard</a>
        <a href="/customer/claims" className="underline">Claims</a>
        <a href="/customer/vehicles" className="underline">Vehicles</a>
      </nav>
      {children}
    </section>
  );
}
