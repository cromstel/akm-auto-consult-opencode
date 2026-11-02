import { PortalHeader } from '@/components/layout/portal-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { ChecklistPanel } from '@/components/inspection/checklist-panel';
import { EvidenceUploadForm } from '@/components/evidence/evidence-upload-form';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Inspection detail — checklist completion + evidence upload.
 * Route params identify the inspection; real ownership/assignment verification
 * is enforced server-side when the DB wiring lands (deny-by-default — UI
 * visibility is convenience only, never authorization).
 */
export default async function InspectionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const claimId = `claim-${id.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 8)}`;

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader portal="customer" />
      <main aria-label={`Inspection ${id} detail`} className="mx-auto max-w-3xl flex-1 space-y-6 px-6 py-10">
        <header>
          <h2 className="mb-1 text-3xl font-extrabold tracking-tight">Inspection {id}</h2>
          <p className="text-sm text-muted-foreground">
            Complete each checklist item and attach evidence. Completed inspections are locked.
          </p>
        </header>

        <ChecklistPanel inspectionId={`insp-${id.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 8)}`} claimId={claimId} />

        <EvidenceUploadForm claimId={claimId} />

        <aside aria-label="Access boundary" className="rounded-xl border border-border bg-card/60 p-6">
          <h3 className="mb-2 text-base font-semibold">Access boundary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Only the assigned inspector and the claim owner may work this inspection. Evidence images are
            processed server-side (AVIF pipeline) and are private until classified — never public.
          </p>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
