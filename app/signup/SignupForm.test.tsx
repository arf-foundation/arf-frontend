/** @jest-environment node */

import { renderToStaticMarkup } from 'react-dom/server';
import SignupForm from './SignupForm';
import { type RequestOffer } from '../../lib/engagement-offers';

it.each([
  ['write-access-review', 'Request the $4,500 Write-Access Review'],
  ['pilot-snapshot', 'Request the free Pilot Snapshot'],
] as const)('renders the selected %s before hydration with a safe form fallback', (offer: RequestOffer, heading: string) => {
  const markup = renderToStaticMarkup(<SignupForm initialOffer={offer} />);
  const form = markup.match(/<form\b[^>]*>/)?.[0];
  expect(markup).toContain(heading);
  expect(form).toContain('method="post"');
  expect(form).toContain('action="/api/pilot-request"');
  expect(markup).toMatch(/<button[^>]*type="submit"[^>]*disabled/);
});
