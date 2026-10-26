export default function CustomerPortalHome() {
  return (
    <main aria-label="Customer portal">
      <h1 className="text-2xl font-semibold mb-2">Customer Portal</h1>
      <p className="text-muted-foreground">
        Submit and track claims. Access is controlled by deny-by-default RBAC, enforced server-side.
      </p>
    </main>
  );
}
