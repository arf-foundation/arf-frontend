import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/* Shared rate limiting for public, unauthenticated POST routes that cost
   real money or hit a real backend on every request (chat, pilot-request,
   report). Three copies of the same in-memory `Map` used to live one per
   route; consolidated here once the fix required real infrastructure
   support, not just deduplication.

   Backed by Upstash Redis -- a real store outside any single serverless
   instance -- when UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN are
   configured. That's the part the previous in-memory Map could not
   provide at any tuning: a `Map` is scoped to one warm instance, so
   concurrent requests landing on different instances (or a cold
   start/redeploy resetting one) each got their own fresh budget --
   bounding abuse from a single hot instance, never a true global cap.

   Production builds require both variables by default. Local and CI
   runs can use per-instance counters. See README.md. */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = UPSTASH_URL && UPSTASH_TOKEN ? new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN }) : null;
const hosted = process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview' ||
  (process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'development');
const allowLocal = !hosted &&
  (process.env.NODE_ENV !== 'production' || process.env.ARF_ALLOW_LOCAL_RATE_LIMIT === '1');

if (!redis) {
  console.warn(
    allowLocal
      ? '[rate-limit] UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN not set; using local rate limiting.'
      : '[rate-limit] Missing Upstash configuration; requests will be refused.',
  );
}

interface RateLimiterOptions {
  /* Namespaces this limiter's counters from every other createRateLimiter()
     call -- so e.g. the same client IP gets independent budgets for /chat
     vs /report rather than sharing one counter. Only load-bearing on the
     Upstash path (Ratelimit's own `prefix` option); the in-memory fallback
     is already isolated per call via its own closure-scoped Map. */
  prefix: string;
  maxRequests: number;
  windowMs: number;
}

export type RateLimitResult = 'allowed' | 'limited' | 'unavailable';

export function createRateLimiter({ prefix, maxRequests, windowMs }: RateLimiterOptions): (
  key: string,
) => Promise<RateLimitResult> {
  if (redis) {
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests, `${Math.max(1, Math.round(windowMs / 1000))} s`),
      prefix: `arf-frontend:${prefix}`,
    });
    return async (key: string): Promise<RateLimitResult> => {
      try {
        const { success, reason } = await ratelimit.limit(key);
        if (reason === 'timeout') {
          console.warn(`[rate-limit] Upstash timed out for prefix "${prefix}".`);
          return 'unavailable';
        }
        return success ? 'allowed' : 'limited';
      } catch {
        // Fail closed: an Upstash outage should not silently turn into an
        // unlimited-abuse window on an endpoint that costs real money
        // (chat) or writes to a real backend (pilot-request, report) on
        // every request.
        console.error(`[rate-limit] Upstash check failed for prefix "${prefix}"; failing closed.`);
        return 'unavailable';
      }
    };
  }

  if (!allowLocal) return async () => 'unavailable';

  const requestTimestamps = new Map<string, number[]>();
  const maxKeys = 4096;
  let nextPrune = 0;
  return async (key: string): Promise<RateLimitResult> => {
    const now = Date.now();
    if (now >= nextPrune) {
      for (const [client, timestamps] of requestTimestamps) {
        if (now - timestamps[timestamps.length - 1] >= windowMs) requestTimestamps.delete(client);
      }
      nextPrune = now + windowMs;
    }
    const recent = (requestTimestamps.get(key) ?? []).filter((t) => now - t < windowMs);
    if (!requestTimestamps.has(key) && requestTimestamps.size >= maxKeys) return 'unavailable';
    if (recent.length >= maxRequests) return 'limited';
    recent.push(now);
    requestTimestamps.set(key, recent);
    return 'allowed';
  };
}

/* The public IP Vercel's edge network assigns this request. Not
   spoofable: Vercel overwrites x-forwarded-for on every request and does
   not forward externally-supplied values (confirmed against Vercel's own
   docs, docs/headers/request-headers -- "Custom X-Forwarded-For IP" is an
   Enterprise-only trusted-proxy feature this project doesn't have), so
   there's no client-controlled header to defend against here the way
   there would be behind a self-hosted proxy. */
export function clientKeyFromRequest(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}
