/**
 * The changelog page keeps a hard-coded DEFAULT_ENTRIES fallback and shows it
 * whenever /data/changelog.json fails to load (the catch branch in
 * page.tsx calls setEntries(DEFAULT_ENTRIES)). That branch is invisible to a
 * build and to any scan of the live JSON, so a claim corrected in the JSON
 * can survive in the fallback and appear exactly when the fetch fails.
 *
 * It happened: the JSON's 2026-08-10 entry said the PDF report contains a
 * "compliance roadmap" while the fallback still said "certifications"
 * (Codex review of #22 at 9cef986). This test pins every fallback entry to
 * the JSON entry with the same date and title.
 */
import fs from 'fs';
import path from 'path';

type Entry = { date: string; title: string; description?: string };

const PAGE = path.join(__dirname, 'page.tsx');
const JSON_PATH = path.join(__dirname, '..', '..', 'public', 'data', 'changelog.json');

function fallbackEntries(): Entry[] {
  const src = fs.readFileSync(PAGE, 'utf8');
  const start = src.indexOf('const DEFAULT_ENTRIES');
  const open = src.indexOf('[', src.indexOf('=', start));
  const close = src.indexOf('\n];', open);
  // The array literal holds only plain object literals with string values.
  return new Function(`return ${src.slice(open, close + 2)}`)() as Entry[];
}

describe('changelog fallback entries match the published JSON', () => {
  const json: Entry[] = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8')).entries;
  const byKey = new Map(json.map((e) => [`${e.date}|${e.title}`, e]));
  const fallback = fallbackEntries();

  it('finds the fallback entries', () => {
    expect(fallback.length).toBeGreaterThan(0);
  });

  it.each(fallback.map((e) => [`${e.date} ${e.title}`, e] as const))(
    '%s says the same thing in both places',
    (_label, entry) => {
      const published = byKey.get(`${entry.date}|${entry.title}`);
      expect(published).toBeDefined();
      expect(entry.description ?? '').toBe(published?.description ?? '');
    },
  );
});
