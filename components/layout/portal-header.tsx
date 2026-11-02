import { ThemeToggle } from '@/components/theme-toggle';
import { getAppName } from '@/lib/env';

const PORTAL_LABELS = {
  customer: 'Customer Portal',
  staff: 'Staff Portal',
} as const;

/**
 * Authenticated-portal header — distinct from the public marketing header.
 * The sign-in identity is wired in Phase 2; nothing here reveals roles.
 */
export function PortalHeader({ portal }: { portal: keyof typeof PORTAL_LABELS }) {
  return (
    <header className="border-b border-border px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span className="text-lg font-semibold">{getAppName()}</span>
          <span className="text-sm text-muted-foreground">{PORTAL_LABELS[portal]}</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
