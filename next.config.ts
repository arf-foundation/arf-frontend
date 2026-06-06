import type { NextConfig } from "next";
import withPWA from "next-pwa";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  compiler: { removeConsole: true },
  turbopack: {},
  async rewrites() {
    return [{ source: '/api/v1/:path*', destination: 'https://A-R-F-ARF-Sandbox-API.hf.space/v1/:path*' }];
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
  workboxOptions: { exclude: [/\.map$/, /^manifest.*\.js$/], runtimeCaching: [] },
  fallbacks: { document: '/offline' },
})(nextConfig);
