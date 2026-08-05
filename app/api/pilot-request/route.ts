import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

function cleanSelect(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.replace(/,/g, '');
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 500;

/* Public, unauthenticated endpoint writing directly to a real Notion
   database on every request -- had no rate limiting, no email format
   check, and no field length limits. Same shape of best-effort, in-memory
   per-IP limiter as app/api/chat/route.ts (see that file's comment on why
   it's soft, not a hard guarantee across serverless instances). A lead-gen
   form's legitimate usage is "submit once, maybe retry" -- a generous
   window still catches sustained abuse without blocking a real user. */
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

export async function POST(request: Request) {
  const clientKey = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes and try again.' },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const {
      fullName,
      email,
      company,
      industry,
      jobRole,
      useCase,
      expectedVolume,
      cloudEnvironment,
      aiMaturity,
      budgetApproved,
      timeline,
    } = body;

    if (!fullName || !email || !company) {
      return NextResponse.json(
        { error: 'Full name, email, and company are required.' },
        { status: 400 }
      );
    }
    if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    for (const [field, value] of Object.entries({ fullName, company, useCase })) {
      if (typeof value === 'string' && value.length > MAX_FIELD_LENGTH) {
        return NextResponse.json({ error: `${field} is too long.` }, { status: 400 });
      }
    }

    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID as string },
      properties: {
        'Full Name': {
          title: [{ text: { content: fullName } }],
        },
        Email: {
          email: email,
        },
        Company: {
          rich_text: [{ text: { content: company } }],
        },
        Industry: {
          select: industry ? { name: cleanSelect(industry) } : null,
        },
        'Job Role': {
          select: jobRole ? { name: cleanSelect(jobRole) } : null,
        },
        'Use Case': {
          rich_text: useCase ? [{ text: { content: useCase } }] : [],
        },
        'Expected Volume': {
          select: expectedVolume ? { name: cleanSelect(expectedVolume) } : null,
        },
        'Cloud Environment': {
          select: cloudEnvironment ? { name: cleanSelect(cloudEnvironment) } : null,
        },
        'AI Maturity': {
          select: aiMaturity ? { name: cleanSelect(aiMaturity) } : null,
        },
        'Budget Approved': {
          select: budgetApproved ? { name: cleanSelect(budgetApproved) } : null,
        },
        Timeline: {
          select: timeline ? { name: cleanSelect(timeline) } : null,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    // Was returning the raw Notion error message to the client -- could
    // leak internal details (database schema, field names, auth hints).
    // Logged server-side only now; client gets a generic message.
    console.error('Notion API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong submitting your request. Please try again or email juan@arf-ai.com directly.' },
      { status: 500 }
    );
  }
}
