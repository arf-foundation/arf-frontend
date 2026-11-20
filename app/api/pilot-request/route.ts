import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';
import { clientKeyFromRequest, createRateLimiter } from '../../../lib/rate-limit';
import { isRequestOffer, OFFER_LABELS } from '../../../lib/engagement-offers';
import { readJsonObject } from '../../../lib/request-json';

const legacyOptions = {
  industry: ['Fintech / Banking', 'Healthcare / Life Sciences', 'Cloud Infrastructure / DevOps', 'E‑commerce / Retail', 'Manufacturing / IoT', 'Government / Defense', 'Consulting / Services', 'Other'],
  jobRole: ['CTO / VP Engineering', 'Director of AI / ML', 'Platform / SRE Lead', 'Solutions Architect', 'ML / AI Engineer', 'Security / Compliance Lead', 'Consultant / Advisor', 'Other'],
  companySize: ['1-9', '10-50', '51-200', '201-1000', '1000+'],
  headquarters: ['New York City metro', 'Elsewhere in the US', 'Outside the US'],
  expectedVolume: ['< 1000', '1000 – 10000', '10000 – 100000', '> 100000'],
  cloudEnvironment: ['AWS', 'Azure', 'GCP', 'On‑premises / Private cloud', 'Multi‑cloud'],
  aiMaturity: ['Exploring / Proof of concept', 'Advisory AI in production', 'Limited autonomous actions', 'Full autonomous operations'],
  governanceOwner: ['Nobody yet', 'Part of an existing role', 'Dedicated person or team'],
  budgetApproved: ['Yes approved', 'In discussion', 'Not yet'],
  timeline: ['Immediate (< 1 month)', '1–3 months', '3–6 months', '> 6 months / exploratory'],
};

function select(value: unknown, options: readonly string[]) {
  const name = typeof value === 'string' ? value.replace(/,/g, '').trim() : '';
  return options.includes(name) ? { name } : null;
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
const checkRateLimit = createRateLimiter({
  prefix: 'pilot-request',
  windowMs: 10 * 60 * 1000,
  maxRequests: 5,
});

export async function POST(request: Request) {
  const clientKey = clientKeyFromRequest(request);
  const rate = await checkRateLimit(clientKey);
  if (rate !== 'allowed') {
    return NextResponse.json(
      { error: rate === 'limited' ? 'Too many requests. Please wait a few minutes and try again.' : 'Requests are temporarily unavailable.' },
      { status: rate === 'limited' ? 429 : 503 },
    );
  }

  try {
    const body = await readJsonObject(request, 16_000);
    if (!body) {
      return NextResponse.json({ error: 'Please submit a request form.' }, { status: 400 });
    }
    const {
      offer,
      intendedWrite,
      decision,
      agreeToTerms,
      fullName,
      email,
      useCase,
    } = body;

    if (offer !== undefined && !isRequestOffer(offer)) {
      return NextResponse.json({ error: 'Please select an available offer.' }, { status: 400 });
    }
    if (typeof email !== 'string' || email.length > 254 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    const legacy: Record<string, unknown> = isRequestOffer(offer) ? {} : body;
    const company = legacy.company;
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
          select: select(legacy.industry, legacyOptions.industry),
        },
        'Job Role': {
          select: select(legacy.jobRole, legacyOptions.jobRole),
        },
        'Use Case': {
          rich_text: context,
        },
        'Expected Volume': {
          select: select(legacy.expectedVolume, legacyOptions.expectedVolume),
        },
        'Cloud Environment': {
          select: select(legacy.cloudEnvironment, legacyOptions.cloudEnvironment),
        },
        'AI Maturity': {
          select: select(legacy.aiMaturity, legacyOptions.aiMaturity),
        },
        'Budget Approved': {
          select: select(legacy.budgetApproved, legacyOptions.budgetApproved),
        },
        Timeline: {
          select: select(legacy.timeline, legacyOptions.timeline),
        },
        'Company Size': {
          select: select(legacy.companySize, legacyOptions.companySize),
        },
        Headquarters: {
          select: select(legacy.headquarters, legacyOptions.headquarters),
        },
        'Governance Owner': {
          select: select(legacy.governanceOwner, legacyOptions.governanceOwner),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    console.error('Pilot request storage failed');
    return NextResponse.json(
      { error: 'Something went wrong submitting your request. Please try again or email juan@arf-ai.com directly.' },
      { status: 500 }
    );
  }
}
