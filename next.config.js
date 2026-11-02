/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output: self-contained server for manual-upload deploys
  // (Hostinger Node.js). Produces .next/standalone with traced node_modules.
  output: 'standalone',
  // Images: no remote hosts are allowlisted yet — evidence uploads are served locally
  // from /uploads and need no remotePatterns. When a remote host is required, add an
  // explicit per-host entry; never use a wildcard hostname.
};

export default nextConfig;
