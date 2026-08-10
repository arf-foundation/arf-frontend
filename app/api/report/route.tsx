import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { CompliancePdfDocument } from './pdf-template';
import { MOCK_AUDIT_LOGS, MOCK_POLICY_VIOLATIONS, withinRange } from '../../../lib/governanceMockData';

// Real PDF generation from real (mock) data on every request -- same
// best-effort, in-memory per-IP limiter as app/api/pilot-request/route.ts;
// see that file's comment on why it's soft, not a hard guarantee across
// serverless instances. A dashboard export button's legitimate usage is a
// handful of requests per session, not a sustained stream.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 15;
const requestTimestamps = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (requestTimestamps.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestTimestamps.set(key, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
// Mock data spans this window; returned so a client can default/clamp to it.
const MOCK_DATA_MIN = '2026-05-13';
const MOCK_DATA_MAX = '2026-05-14';

export async function POST(request: Request) {
  const clientKey = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(clientKey)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a few minutes and try again.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { startDate, endDate } = (body ?? {}) as { startDate?: unknown; endDate?: unknown };

  if (typeof startDate !== 'string' || typeof endDate !== 'string' || !DATE_RE.test(startDate) || !DATE_RE.test(endDate)) {
    return NextResponse.json({ error: 'startDate and endDate are required, as YYYY-MM-DD strings.' }, { status: 400 });
  }
  if (startDate > endDate) {
    return NextResponse.json({ error: 'startDate must not be after endDate.' }, { status: 400 });
  }

  const auditLogs = MOCK_AUDIT_LOGS.filter((log) => withinRange(log.timestamp, startDate, endDate));
  const violations = MOCK_POLICY_VIOLATIONS.filter((v) => withinRange(v.timestamp, startDate, endDate));

  const generatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  const buffer = await renderToBuffer(
    <CompliancePdfDocument auditLogs={auditLogs} violations={violations} startDate={startDate} endDate={endDate} generatedAt={generatedAt} />
  );

  return new NextResponse(Buffer.from(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="arf-compliance-report_${startDate}_to_${endDate}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}

export async function GET() {
  return NextResponse.json(
    {
      error: 'Use POST with a JSON body of { startDate, endDate } (YYYY-MM-DD).',
      mockDataRange: { min: MOCK_DATA_MIN, max: MOCK_DATA_MAX },
    },
    { status: 405 }
  );
}
