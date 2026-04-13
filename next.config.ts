import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  turbopack: {},
  // The rewrite to the real ARF engine has been removed.
  // The frontend now uses mock data or a local sandbox.
  async rewrites() {
    return [
      // Example: proxy to a mock/sandbox endpoint (optional)
      // {
      //   source: '/api/v1/:path*',
      //   destination: 'https://sandbox.arf.dev/v1/:path*',
      // },
    ];
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // 👇 Ensure all PWA icons (including apple-touch-icon) are generated
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  workboxOptions: {
    exclude: [/\.map$/, /^manifest.*\.js$/],
  },
  // Optional: provide a fallback for the document (already present)
  fallbacks: {
    document: '/offline',
  },
})(nextConfig);
