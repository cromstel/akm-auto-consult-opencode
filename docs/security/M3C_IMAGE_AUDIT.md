# Security Audit — M3C (Image Pipeline)

- sharp package added; input restricted to claimId-related paths only.
- No untrusted SVG input allowed; AVIF/WebP output only.
- `sharp` binary installed; `node_modules` present.
- No secrets embedded (`.env.local` untouched).
- Security scan (grep secrets / console.log): clean.
