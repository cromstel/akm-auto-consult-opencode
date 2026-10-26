// Next.js server instrumentation — runs once per server process at startup.
// Environment configuration is validated here so misconfiguration fails fast
// instead of surfacing as confusing runtime errors (or silent insecure defaults).
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateEnv } = await import('@/lib/env');
    validateEnv();
  }
}
