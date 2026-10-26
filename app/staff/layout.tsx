export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex min-h-screen">
      <aside className="w-64 border-r border-border p-4">
        <nav aria-label="Staff portal" className="flex flex-col gap-2">
          <a href="/staff/dashboard" className="underline">Dashboard</a>
          <a href="/staff/claims" className="underline">Claims</a>
          <a href="/staff/inspections" className="underline">Inspections</a>
          <a href="/staff/reports" className="underline">Reports</a>
          <a href="/staff/admin" className="underline">Admin</a>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </section>
  );
}
