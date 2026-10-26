/** @type {import('next').NextConfig} */
const nextConfig = {
  // Images: no remote hosts are allowlisted yet — evidence uploads are served locally
  // from /uploads and need no remotePatterns. When a remote host is required, add an
  // explicit per-host entry; never use a wildcard hostname.
};

export default nextConfig;
