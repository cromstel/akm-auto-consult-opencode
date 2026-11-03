import { Metadata } from 'next';
import Image from 'next/image';
import { getAppName } from '@/lib/env';

export const metadata: Metadata = {
  title: `${getAppName()} — Motor Claim Management & Inspection Platform`,
  description:
    'AKM Auto Consult connects customers, claims officers, adjusters, inspectors, finance, and auditors through a secure, audited claim lifecycle — from intake and evidence upload to estimates, settlement, and reporting.',
  keywords: [
    'motor claims',
    'insurance claims',
    'accident inspection',
    'loss adjustment',
    'estimate',
    'settlement',
    'audit',
  ],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://akm-autoconsult.example/',
    siteName: getAppName(),
    title: `${getAppName()} — Motor Claim Management`,
    description:
      'Claim intake, inspection, estimation, settlement, and audit — for customers and staff.',
    images: [{ url: '/images/hero.avif', width: 1200, height: 600, alt: 'AKM Auto Consult platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/hero.avif'],
  },
};

export default function HomePage() {
  const appName = getAppName();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: appName,
            url: 'https://akm-autoconsult.example/',
            logo: '/icon.svg',
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'Customer support',
              areaServed: 'GH',
              availableLanguage: ['en'],
            },
          }),
        }}
      />
      <div className="relative overflow-x-hidden">
        <section aria-label="Hero" className="relative min-h-[100dvh] flex flex-col justify-center">
          <Image
            src="/images/hero.avif"
            alt="AKM Auto Consult — claim management and inspection platform"
            fill
            priority
            sizes="100vw"
            className="object-cover -z-10"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="relative mx-auto max-w-5xl px-6 py-24 md:py-32 lg:py-40 space-y-8">
            <header className="space-y-6 max-w-3xl">
              <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl drop-shadow-lg">
                {appName}
              </h1>
              <p className="text-xl md:text-2xl leading-relaxed text-white/90 max-w-2xl drop-shadow">
                Motor claim management, field inspection, loss-adjustment estimates,
                and settlement — for customers, claims officers, adjusters,
                inspectors, finance, and auditors.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="/auth/customer/sign-in" className="rounded-lg bg-white text-foreground px-6 py-3 text-base font-semibold shadow hover:bg-white/90 transition">
                  Customer sign in
                </a>
                <a href="/auth/admin/sign-in" className="rounded-lg border border-white/30 bg-white/10 text-white px-6 py-3 text-base font-semibold backdrop-blur hover:bg-white/20 transition">
                  Staff / admin
                </a>
              </div>
            </header>
          </div>
        </section>

        <section aria-label="Capabilities" className="mx-auto max-w-5xl px-6 py-20 md:py-28 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">Claim lifecycle, audited end-to-end</h2>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">From first report to settlement — every transition, upload, and approval is recorded, role-gated, and verifiable.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <article className="group rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition">
              <div className="mb-5 overflow-hidden rounded-xl">
                <Image src="/images/feature1.avif" alt="Claims submitted" width={400} height={300} className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Claims submitted</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Customers register claims with vehicle, damage, policy, and evidence links. Each claim gets a unique id and a visible status lifecycle.</p>
            </article>
            <article className="group rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition">
              <div className="mb-5 overflow-hidden rounded-xl">
                <Image src="/images/feature2.avif" alt="Inspection and evidence" width={400} height={300} className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Inspection + evidence</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Field inspections with structured checklist items linked to AVIF-processed evidence images. Audit links correlate every upload.</p>
            </article>
            <article className="group rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition">
              <div className="mb-5 overflow-hidden rounded-xl">
                <Image src="/images/feature3.avif" alt="Estimates and settlement" width={400} height={300} className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Estimates + settlement</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Adjusters set itemized estimates; finance approves; settlement records are audited with DECIMAL-safe totals and visible tax calculations.</p>
            </article>
          </div>
        </section>

        <section aria-label="Call to action" className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <div className="rounded-3xl bg-gradient-to-br from-foreground to-card border border-border p-10 md:p-16 text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">Start a claim or manage one</h2>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">Customers can register and submit claims. Staff log in through role-specific portals with deny-by-default middleware.</p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a href="/auth/customer/sign-up" className="rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition">Register as customer</a>
              <a href="/auth/admin/sign-in" className="rounded-lg border border-border bg-card px-6 py-3 text-base font-semibold hover:bg-primary/10 transition">Staff sign in</a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
