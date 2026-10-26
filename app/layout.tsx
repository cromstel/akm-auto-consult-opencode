import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'AKM Auto Consult', template: '%s | AKM Auto Consult' },
  description: 'Motor claim management and adjustment platform.',
  openGraph: {
    title: 'AKM Auto Consult',
    description: 'Claims, inspections, estimates, settlement.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-background text-foreground">
        <header className="border-b border-border px-6 py-4">
          <h1 className="text-xl font-semibold">AKM Auto Consult</h1>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
