import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Emits /about/index.html instead of /about.html so Apache serves clean URLs
  // via its native directory-index handling — no mod_rewrite/.htaccess needed.
  // This avoids IONOS shared-hosting plans that restrict AllowOverride/mod_rewrite.
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "*.firebasestorage.app",
      },
    ],
  },
};

export default nextConfig;
