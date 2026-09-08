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

   Without those two env vars, falls back to exactly the previous
   in-memory-per-instance behavior, so a deploy with no Upstash configured
   isn't broken -- just soft in the same way it always was. See
   README.md's Environment Variables section. */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = UPSTASH_URL && UPSTASH_TOKEN ? new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN }) : null;

if (!redis) {
  console.warn(
    '[rate-limit] UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN not set -- falling back to an ' +
      'in-memory, per-serverless-instance rate limiter. This bounds abuse from a single warm ' +
      'instance but does not guarantee a hard global cap. See lib/rate-limit.ts and README.md.',
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

/* Returns an async isRateLimited(key) -- true means reject the request.
   One Ratelimit/Map is built per call, at module load in each route (a
   direct replacement for that route's old top-level `const
   requestTimestamps = new Map()` singleton), not per request. */
export function createRateLimiter({ prefix, maxRequests, windowMs }: RateLimiterOptions): (
  key: string,
) => Promise<boolean> {
  if (redis) {
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests, `${Math.max(1, Math.round(windowMs / 1000))} s`),
      prefix: `arf-frontend:${prefix}`,
    });
    return async (key: string): Promise<boolean> => {
      try {
        const { success } = await ratelimit.limit(key);
        return !success;
      } catch (error) {
        // Fail closed: an Upstash outage should not silently turn into an
        // unlimited-abuse window on an endpoint that costs real money
        // (chat) or writes to a real backend (pilot-request, report) on
        // every request.
        console.error(`[rate-limit] Upstash check failed for prefix "${prefix}"; failing closed.`, error);
        return true;
      }
    };
  }

  const requestTimestamps = new Map<string, number[]>();
  return async (key: string): Promise<boolean> => {
    const now = Date.now();
    const recent = (requestTimestamps.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    requestTimestamps.set(key, recent);
    return recent.length > maxRequests;
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
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}
