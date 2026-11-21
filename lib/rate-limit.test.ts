/**
 * @jest-environment node
 */

// Each test re-imports the module fresh via jest.resetModules() + dynamic
// import(), because rate-limit.ts decides once, at module load, whether
// Upstash is configured (reads process.env at the top level) -- toggling
// env vars between tests has no effect on an already-imported module.

describe('createRateLimiter: in-memory fallback (Upstash not configured)', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('allows up to maxRequests within the window, then rejects', async () => {
    const { createRateLimiter } = await import('./rate-limit');
    const isRateLimited = createRateLimiter({ prefix: 'test', maxRequests: 3, windowMs: 60_000 });

    expect(await isRateLimited('k')).toBe('allowed');
    expect(await isRateLimited('k')).toBe('allowed');
    expect(await isRateLimited('k')).toBe('allowed');
    expect(await isRateLimited('k')).toBe('limited');
  });

  it('tracks different keys independently', async () => {
    const { createRateLimiter } = await import('./rate-limit');
    const isRateLimited = createRateLimiter({ prefix: 'test', maxRequests: 1, windowMs: 60_000 });

    expect(await isRateLimited('a')).toBe('allowed');
    expect(await isRateLimited('b')).toBe('allowed'); // unaffected by 'a's budget
    expect(await isRateLimited('a')).toBe('limited'); // 'a' is now over its own budget
  });

  it('two createRateLimiter() calls never share state, even for the same key', async () => {
    // This is the property that lets /chat, /pilot-request, and /report
    // give the same client independent budgets.
    const { createRateLimiter } = await import('./rate-limit');
    const routeA = createRateLimiter({ prefix: 'route-a', maxRequests: 1, windowMs: 60_000 });
    const routeB = createRateLimiter({ prefix: 'route-b', maxRequests: 1, windowMs: 60_000 });

    expect(await routeA('k')).toBe('allowed');
    expect(await routeB('k')).toBe('allowed');
  });

  it('allows requests again once the window has elapsed', async () => {
    jest.useFakeTimers();
    try {
      const { createRateLimiter } = await import('./rate-limit');
      const isRateLimited = createRateLimiter({ prefix: 'test', maxRequests: 1, windowMs: 1000 });

      expect(await isRateLimited('k')).toBe('allowed');
      expect(await isRateLimited('k')).toBe('limited');
      jest.advanceTimersByTime(1001);
      expect(await isRateLimited('k')).toBe('allowed');
    } finally {
      jest.useRealTimers();
    }
  });

  it('warns once at module load that it is running without Upstash', async () => {
    await import('./rate-limit');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('UPSTASH_REDIS_REST_URL'));
  });
});

describe('createRateLimiter: Upstash-backed (configured)', () => {
  const limitMock = jest.fn();

  beforeEach(() => {
    jest.resetModules();
    limitMock.mockReset();
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';

    jest.doMock('@upstash/redis', () => ({
      Redis: jest.fn().mockImplementation(() => ({})),
    }));
    jest.doMock('@upstash/ratelimit', () => ({
      Ratelimit: Object.assign(
        jest.fn().mockImplementation(() => ({ limit: limitMock })),
        { slidingWindow: jest.fn((max: number, window: string) => ({ max, window })) },
      ),
    }));
  });

  afterEach(() => {
    jest.dontMock('@upstash/redis');
    jest.dontMock('@upstash/ratelimit');
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it('is not rate limited when Upstash reports success: true', async () => {
    limitMock.mockResolvedValue({ success: true });
    const { createRateLimiter } = await import('./rate-limit');
    const isRateLimited = createRateLimiter({ prefix: 'test', maxRequests: 5, windowMs: 60_000 });

    expect(await isRateLimited('k')).toBe('allowed');
    expect(limitMock).toHaveBeenCalledWith('k');
  });

  it('is rate limited when Upstash reports success: false', async () => {
    limitMock.mockResolvedValue({ success: false });
    const { createRateLimiter } = await import('./rate-limit');
    const isRateLimited = createRateLimiter({ prefix: 'test', maxRequests: 5, windowMs: 60_000 });

    expect(await isRateLimited('k')).toBe('limited');
  });

  it('fails closed when the Upstash call itself throws', async () => {
    limitMock.mockRejectedValue(new Error('network blip'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const { createRateLimiter } = await import('./rate-limit');
      const isRateLimited = createRateLimiter({ prefix: 'test', maxRequests: 5, windowMs: 60_000 });

      expect(await isRateLimited('k')).toBe('unavailable');
      expect(errorSpy).toHaveBeenCalled();
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('rejects the SDK timeout result even when success is true', async () => {
    limitMock.mockResolvedValue({ success: true, reason: 'timeout' });
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const { createRateLimiter } = await import('./rate-limit');
      const isRateLimited = createRateLimiter({ prefix: 'test', maxRequests: 5, windowMs: 60_000 });
      expect(await isRateLimited('k')).toBe('unavailable');
    } finally {
      warnSpy.mockRestore();
    }
  });
});

describe('hosted rate limits require shared storage', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.VERCEL_ENV;
    delete process.env.VERCEL;
    delete process.env.ARF_ALLOW_LOCAL_RATE_LIMIT;
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it.each(['production', 'preview'])('fails closed with missing or partial Redis settings in %s', async (environment) => {
    process.env.VERCEL_ENV = environment;
    if (environment === 'preview') process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
    const { createRateLimiter } = await import('./rate-limit');
    const limit = createRateLimiter({ prefix: 'test', maxRequests: 5, windowMs: 1000 });
    expect(await limit('first')).toBe('unavailable');
    expect(await limit('other')).toBe('unavailable');
  });

  it('fails closed with the generic Vercel deployment marker alone', async () => {
    process.env.VERCEL = '1';
    const { createRateLimiter } = await import('./rate-limit');
    const limit = createRateLimiter({ prefix: 'test', maxRequests: 5, windowMs: 1000 });
    expect(await limit('first')).toBe('unavailable');
  });

  it('fails closed in a production build even without platform markers', async () => {
    process.env = { ...process.env, NODE_ENV: 'production' };
    const { createRateLimiter } = await import('./rate-limit');
    const limit = createRateLimiter({ prefix: 'test', maxRequests: 5, windowMs: 1000 });
    expect(await limit('first')).toBe('unavailable');
  });

  it.each([[undefined, 'allowed'], ['preview', 'unavailable']] as const)(
    'restricts the local E2E opt-in to non-hosted builds (%s)',
    async (environment, expected) => {
      process.env = { ...process.env, NODE_ENV: 'production', ARF_ALLOW_LOCAL_RATE_LIMIT: '1' };
      if (environment) process.env.VERCEL_ENV = environment;
      const { createRateLimiter } = await import('./rate-limit');
      const limit = createRateLimiter({ prefix: 'test', maxRequests: 5, windowMs: 1000 });
      expect(await limit('first')).toBe(expected);
    },
  );
});

describe('clientKeyFromRequest', () => {
  it('extracts and trims the first IP from a comma-separated x-forwarded-for', async () => {
    const { clientKeyFromRequest } = await import('./rate-limit');
    const req = new Request('https://example.com', {
      headers: { 'x-forwarded-for': ' 1.2.3.4 , 5.6.7.8' },
    });

    expect(clientKeyFromRequest(req)).toBe('1.2.3.4');
  });

  it('returns "unknown" when the header is absent', async () => {
    const { clientKeyFromRequest } = await import('./rate-limit');
    const req = new Request('https://example.com');

    expect(clientKeyFromRequest(req)).toBe('unknown');
  });
});
