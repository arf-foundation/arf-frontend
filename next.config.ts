import type { NextConfig } from "next";
import withPWA from "next-pwa";

/* script-src/style-src 'unsafe-inline' — accepted risk, not an oversight.
   Audited 2026-09-18.

   Why not a nonce: Next.js can only inject a nonce into its own inline
   hydration/RSC scripts during per-request server rendering -- there's
   nothing to inject into on a statically-generated page. Every route here
   builds `○ Static` and is served from Vercel's edge cache. Nonces would
   force ALL pages to dynamic rendering (confirmed against this exact
   Next.js version's bundled docs, node_modules/next/dist/docs/.../
   content-security-policy.md): no more ISR, no CDN caching, real latency
   and hosting-cost increase -- a bad trade for a Medium defense-in-depth
   finding on a marketing/pricing site. Hash-based CSP doesn't avoid this
   either: it only covers Next's own inline scripts when paired with a
   nonce, so it doesn't get you out of the dynamic-rendering requirement.
   (Next also offers `experimental.sri` for hashing the external
   /_next/static/chunks/*.js bundles specifically -- real, static-rendering
   -compatible supply-chain hardening, but a separate concern from this
   inline-script question and not yet enabled here.)

   style-src keeps 'unsafe-inline' for a different reason: React's
   `style={{}}` prop emits inline `style` attributes, and per CSP3 a
   nonce/hash on style-src stops covering attributes (only <style>
   elements) -- tightening it would break rendering in hard-to-catch ways
   for a much narrower attack surface (CSS injection, not script
   execution) than script-src carries.

   What actually limits the exposure: no 'unsafe-eval'; object-src,
   base-uri, form-action, and frame-ancestors are all locked down; the
   only first-party inline script is the fixed, non-user-controllable
   theme-init snippet in app/layout.tsx. 'unsafe-inline' only becomes
   exploitable if something else first gets attacker-controlled HTML/script
   into the page -- so this was audited directly rather than assumed: the
   three public unauthenticated POST routes (/api/chat, /api/pilot-request,
   /api/report) all return JSON or a PDF binary, never HTML, and every
   field their responses feed into the UI renders through plain JSX `{}`
   interpolation (React-escaped), not dangerouslySetInnerHTML. A full grep
   across the app for dangerouslySetInnerHTML, .innerHTML =, eval/new
   Function, outerHTML, document.write, and insertAdjacentHTML turned up
   nothing else. Re-run that audit before revisiting this decision if any
   of those routes, or a new one, starts rendering user- or model-supplied
   content into markup. */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      manifest-src 'self' https://vercel.com;
      script-src 'self' https://cdn.plot.ly https://platform.linkedin.com https://www.youtube.com https://api.github.com https://challenges.cloudflare.com 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https://api.qrserver.com https://*.licdn.com https://*.ytimg.com https://*.githubusercontent.com https://*.vercel.app;
      font-src 'self' data:;
      connect-src 'self' https://api.github.com https://*.vercel.app;
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
  transpilePackages: ['@arf/ui'],
  turbopack: {},
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        // The old a-r-f-... domain 404s (verified directly): the HF org
        // renamed A-R-F -> ARF-AI. HF's own space API still lists the old
        // domain as a "READY" mapping, but hitting it directly returns HF's
        // generic 404 page, not the space -- only the new canonical host
        // actually works. Confirmed against HF's api/spaces endpoint.
        destination: 'https://arf-ai-arf-sandbox-api.hf.space/v1/:path*',
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
