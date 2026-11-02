export function CustomerCard({ title, children }: { title: string; children?: React.ReactNode }) {
  return (<section aria-label={title} className="rounded-xl border bg-card p-5 shadow-sm"><h3 className="mb-2 text-base font-semibold">{title}</h3>{children}</section>);
}
