/**
 * Every pilot-form <option value> must equal a Notion select option EXACTLY.
 *
 * Why this is a test and not a code review note: the API route sends the
 * option value through cleanSelect() -- which only strips commas -- as a
 * Notion select `name`. Notion CREATES an option that does not exist rather
 * than rejecting it. So a mismatch does not fail: it silently grows a
 * duplicate option and splits that field's data across two values, with
 * nothing logged and nothing visible until someone reads the database and
 * wonders why the numbers do not add up.
 *
 * Two mismatches were live when this was written, both invisible in review:
 *   - expectedVolume sent "10000–10000"-style values with no spaces
 *     around the en-dash, against Notion's "10000 – 100000". Latent: it
 *     fires the first time anyone picks that bracket.
 *   - cloudEnvironment sent a TRUNCATED "On‑premises" while the option
 *     is "On‑premises / Private cloud".
 * A third had already fired, which is why Notion still carries both
 * "1000 – 10000" and "1000–10000".
 *
 * NOTE THE INVISIBLE CHARACTERS. These strings use U+2011 non-breaking
 * hyphen and U+2013 en-dash. They are indistinguishable from "-" in most
 * diffs and editors, so they are written as escapes here on purpose. If you
 * are updating this list, copy the name from the Notion schema, do not
 * retype it.
 *
 * Source of truth: ARF Pilot Requests data source, schema read 2026-09-21.
 * If an option is added in Notion, add it here in the same commit.
 */
import fs from 'fs';
import path from 'path';

const PAGE = path.join(__dirname, 'page.tsx');
const ROUTE = path.join(__dirname, '..', 'api', 'pilot-request', 'route.ts');

/** Mirrors cleanSelect() in the API route. Pinned by a test below. */
const cleanSelect = (v: string) => v.replace(/,/g, '');

const NOTION_OPTIONS: Record<string, string[]> = {
  industry: [
    'Fintech / Banking',
    'Healthcare / Life Sciences',
    'Cloud Infrastructure / DevOps',
    'E‑commerce / Retail',
    'Manufacturing / IoT',
    'Government / Defense',
    'Consulting / Services',
    'Other',
  ],
  jobRole: [
    'CTO / VP Engineering',
    'Director of AI / ML',
    'Platform / SRE Lead',
    'Solutions Architect',
    'ML / AI Engineer',
    'Security / Compliance Lead',
    'Consultant / Advisor',
    'Other',
  ],
  expectedVolume: [
    '< 1000',
    '1000 – 10000',
    '10000 – 100000',
    '> 100000',
    // Duplicate created by an earlier form/Notion mismatch. Listed so this
    // test describes Notion as it IS; remove from both once the stray option
    // and the QA fixture row referencing it are deleted.
    '1000–10000',
  ],
  cloudEnvironment: [
    'AWS',
    'Azure',
    'GCP',
    'On‑premises / Private cloud',
    'Multi‑cloud',
  ],
  aiMaturity: [
    'Exploring / Proof of concept',
    'Advisory AI in production',
    'Limited autonomous actions',
    'Full autonomous operations',
  ],
  budgetApproved: ['Prefer not to say', 'Yes approved', 'In discussion', 'Not yet'],
  timeline: [
    'Immediate (< 1 month)',
    '1–3 months',
    '3–6 months',
    '> 6 months / exploratory',
  ],
  companySize: ['1-9', '10-50', '51-200', '201-1000', '1000+'],
  headquarters: ['New York City metro', 'Elsewhere in the US', 'Outside the US'],
  governanceOwner: [
    'Nobody yet',
    'Part of an existing role',
    'Dedicated person or team',
  ],
};

function optionValues(source: string, field: string): string[] {
  const block = new RegExp(`name="${field}"([\\s\\S]*?)</select>`).exec(source);
  if (!block) throw new Error(`no <select name="${field}"> in signup/page.tsx`);
  return [...block[1].matchAll(/<option value="([^"]*)"/g)]
    .map((m) => m[1])
    .filter(Boolean);
}

/** Render invisible characters so a failure message is actually readable. */
const visible = (s: string) =>
  [...s].map((c) => (c.charCodeAt(0) > 126 ? `<U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}>` : c)).join('');

describe('pilot form options match the Notion schema', () => {
  const page = fs.readFileSync(PAGE, 'utf8');

  it.each(Object.keys(NOTION_OPTIONS))('%s', (field) => {
    const values = optionValues(page, field);
    expect(values.length).toBeGreaterThan(0);

    for (const raw of values) {
      const sent = cleanSelect(raw);
      expect(NOTION_OPTIONS[field].map(visible)).toContain(visible(sent));
    }
  });

  it('every select in the form is covered by this test', () => {
    const named = [...page.matchAll(/<select[\s\S]{0,400}?name="(\w+)"/g)].map((m) => m[1]);
    const uncovered = named.filter((n) => !(n in NOTION_OPTIONS));
    expect(uncovered).toEqual([]);
  });

  it('cleanSelect still only strips commas', () => {
    // If the route starts transforming values differently, the assumption
    // this whole file rests on is gone and these values need rechecking.
    const route = fs.readFileSync(ROUTE, 'utf8');
    expect(route).toContain("return value.replace(/,/g, '');");
  });
});
