import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';
import { clientKeyFromRequest, createRateLimiter } from '../../../lib/rate-limit';
import { isRequestOffer, OFFER_LABELS } from '../../../lib/engagement-offers';

function select(value: unknown) {
  const name = typeof value === 'string' ? value.replace(/,/g, '').trim() : '';
  return name ? { name } : null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 500;

function boundedText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= MAX_FIELD_LENGTH;
}

function richText(content: string) {
  return { text: { content } };
}

/* Public, unauthenticated endpoint writing directly to a real Notion
   database on every request. A lead-gen form's legitimate usage is "submit
   once, maybe retry" -- a generous window still catches sustained abuse
   without blocking a real user. See lib/rate-limit.ts. */
const isRateLimited = createRateLimiter({
  prefix: 'pilot-request',
  windowMs: 10 * 60 * 1000,
  maxRequests: 5,
});

export async function POST(request: Request) {
  const clientKey = clientKeyFromRequest(request);
  if (await isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes and try again.' },
      { status: 429 },
    );
  }

  try {
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Please submit a request form.' }, { status: 400 });
    }
    const {
      offer,
      intendedWrite,
      decision,
      agreeToTerms,
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
      companySize,
      headquarters,
      governanceOwner,
    } = body as Record<string, unknown>;

    if (offer !== undefined && !isRequestOffer(offer)) {
      return NextResponse.json({ error: 'Please select an available offer.' }, { status: 400 });
    }
    if (typeof email !== 'string' || email.length > 254 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    let title: string;
    let context = typeof useCase === 'string' && useCase ? [richText(useCase)] : [];
    if (isRequestOffer(offer)) {
      if (!boundedText(intendedWrite) || agreeToTerms !== true) {
        return NextResponse.json(
          { error: 'Enter the intended write and agree to the terms.' },
          { status: 400 },
        );
      }
      if (decision !== undefined && (typeof decision !== 'string' || decision.length > MAX_FIELD_LENGTH)) {
        return NextResponse.json({ error: 'Keep optional details within 500 characters.' }, { status: 400 });
      }
      const pendingDecision = typeof decision === 'string' ? decision.trim() : '';
      title = `${OFFER_LABELS[offer]} request`;
      context = [
        richText(`Requested offer: ${OFFER_LABELS[offer]}\n`),
        richText(`Intended write: ${intendedWrite.trim()}${pendingDecision ? '\n' : ''}`),
      ];
      if (pendingDecision) context.push(richText(`Pending decision: ${pendingDecision}`));
    } else if (!boundedText(fullName) || !boundedText(company) ||
      (typeof useCase === 'string' && useCase.length > MAX_FIELD_LENGTH)) {
      return NextResponse.json(
        { error: 'Enter a full name and company. Keep each field within 500 characters.' },
        { status: 400 },
      );
    } else {
      title = fullName;
    }

    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID as string },
      properties: {
        'Full Name': {
          title: [richText(title)],
        },
        Email: {
          email: email,
        },
        Company: {
          rich_text: boundedText(company) ? [richText(company)] : [],
        },
        Industry: {
          select: select(industry),
        },
        'Job Role': {
          select: select(jobRole),
        },
        'Use Case': {
          rich_text: context,
        },
        'Expected Volume': {
          select: select(expectedVolume),
        },
        'Cloud Environment': {
          select: select(cloudEnvironment),
        },
        'AI Maturity': {
          select: select(aiMaturity),
        },
        'Budget Approved': {
          select: select(budgetApproved),
        },
        Timeline: {
          select: select(timeline),
        },
        'Company Size': {
          select: select(companySize),
        },
        Headquarters: {
          select: select(headquarters),
        },
        'Governance Owner': {
          select: select(governanceOwner),
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
