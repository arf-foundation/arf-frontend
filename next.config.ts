import type { NextConfig } from "next";
import withPWA from "next-pwa";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' https://cdn.plot.ly https://platform.linkedin.com https://www.youtube.com https://api.github.com https://challenges.cloudflare.com 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https://api.qrserver.com https://*.licdn.com https://*.ytimg.com https://*.githubusercontent.com https://*.vercel.app;
      font-src 'self' data:;
      connect-src 'self' https://api.github.com https://sandbox.arf.dev https://*.vercel.app;
      frame-src 'self' https://www.linkedin.com https://www.youtube.com https://www.youtube-nocookie.com;
      frame-ancestors 'none';
      form-action 'self';
      base-uri 'self';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

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
  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Ensure all PWA icons (including apple-touch-icon) are generated
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
