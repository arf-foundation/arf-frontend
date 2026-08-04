import { NextResponse } from 'next/server';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { ConnectError, getToken } from '@vercel/connect';
import Anthropic from '@anthropic-ai/sdk';

export const dynamic = 'force-dynamic';

/* ============================================================================
   ARF Institutional Memory Agent — real Claude call.

   Replaces the previous keyword-heuristic mock. prompt.txt (v1.3) is the
   full spec: deterministic JSON-only output, temperature=0, an enforced
   output schema. Consumed by the public, unauthenticated /agent page — this
   route's request/response contract (POST { message } -> ARFAgentOutput |
   { error }) is unchanged, so app/agent/page.tsx needed no edits.

   Auth: this connector is Vercel Connect's "API key" type (a static
   credential Vercel stores, not an OAuth grant), so getToken() returns the
   stored Anthropic key verbatim rather than a Vercel-minted bearer token.
   Passed straight into the Anthropic SDK's `apiKey` option, which sets the
   `x-api-key` header itself -- Anthropic's Messages API doesn't accept
   `Authorization: Bearer`, so this sidesteps needing to hand-roll that
   header. Requires `VERCEL_OIDC_TOKEN` in the environment; Vercel injects
   this automatically on deployment. Not runnable from a local dev server
   without `vercel link && vercel env pull` first.
   ========================================================================= */

const SYSTEM_PROMPT = readFileSync(join(process.cwd(), 'app/api/chat/prompt.txt'), 'utf-8');
const PROMPT_VERSION = 'ARF_IMO_v1.3';
// "Log prompt hash" per prompt.txt's own versioning requirements.
const PROMPT_HASH = createHash('sha256').update(SYSTEM_PROMPT).digest('hex').slice(0, 16);

const CONNECTOR = 'api.anthropic.com/arf-frontend';
const MODEL: Anthropic.Model = 'claude-haiku-4-5-20251001';

/* Best-effort rate limiting only. /agent is public and unauthenticated, and
   every request now costs real money against a metered connector, so some
   limit beats none -- but this is an in-memory Map scoped to one warm
   serverless instance. A cold start, a redeploy, or a different region gets
   a fresh Map, so this bounds abuse from a single hot instance rather than
   guaranteeing a hard global cap. Reach for Vercel KV / Upstash if this
   route sees real traffic and the soft limit isn't enough. */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestTimestamps = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (requestTimestamps.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestTimestamps.set(key, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(req: Request) {
  const clientKey = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes and try again.' },
      { status: 429 },
    );
  }

  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }

    const apiKey = await getToken(CONNECTOR, { subject: { type: 'app' } });
    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: message }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock) {
      throw new Error('Model returned no text content block');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(textBlock.text);
    } catch {
      console.error('ARF agent: model output was not valid JSON', {
        promptVersion: PROMPT_VERSION,
        promptHash: PROMPT_HASH,
        raw: textBlock.text,
      });
      return NextResponse.json({ error: 'Agent returned malformed output' }, { status: 502 });
    }

    // "Log output alongside version" per prompt.txt's versioning requirements.
    console.log('ARF agent evaluation', { promptVersion: PROMPT_VERSION, promptHash: PROMPT_HASH, output: parsed });

    return NextResponse.json(parsed);
  } catch (error) {
    if (error instanceof ConnectError) {
      console.error('Vercel Connect error:', error.message);
      return NextResponse.json({ error: 'Agent temporarily unavailable (connector error)' }, { status: 502 });
    }
    console.error('Error:', error);
    return NextResponse.json({ error: 'Agent failed' }, { status: 500 });
  }
}
