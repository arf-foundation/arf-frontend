import type { NextConfig } from "next";
import withPWA from "next-pwa";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' https://cdn.plot.ly https://platform.linkedin.com https://www.youtube.com https://api.github.com https://challenges.cloudflare.com 'unsafe-inline';
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
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  turbopack: {},
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://A-R-F-ARF-Sandbox-API.hf.space/v1/:path*',
      },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  workboxOptions: {
    exclude: [/\.map$/, /^manifest.*\.js$/],
    runtimeCaching: [
      // 1. Static assets: cache-first (immutable / hashed files)
      {
        urlPattern: /\.(?:js|css|woff2?|ttf|otf|eot)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-resources',
          expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }, // 30 days
        },
      },
      // 2. Images: cache-first (avif, webp, png, svg, ico, etc.)
      {
        urlPattern: /\.(?:png|svg|ico|webp|avif|gif|jpg|jpeg)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
      // 3. Navigation (HTML) – network-first for fresh content, fallback to cache
      {
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages',
          expiration: { maxEntries: 20, maxAgeSeconds: 24 * 60 * 60 }, // 1 day
          networkTimeoutSeconds: 3,
        },
      },
      // 4. API calls – network-only (do not cache simulated responses)
      {
        urlPattern: /\/api\/v1\/.*/,
        handler: 'NetworkOnly',
        options: {
          cacheName: 'api',
        },
      },
      // 5. Default fallback for other same‑origin requests: network-first
      {
        urlPattern: ({ url }) => url.origin === self.location.origin,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'other-sameorigin',
          expiration: { maxEntries: 30, maxAgeSeconds: 24 * 60 * 60 },
        },
      },
    ],
  },
  fallbacks: { document: '/offline' },
})(nextConfig);
