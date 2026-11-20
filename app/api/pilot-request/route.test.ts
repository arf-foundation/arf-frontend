/** @jest-environment node */

import { POST } from './route';

const mockCreate = jest.fn();
const mockIsRateLimited = jest.fn();

jest.mock('@notionhq/client', () => ({
  Client: jest.fn(() => ({ pages: { create: mockCreate } })),
}));

jest.mock('../../../lib/rate-limit', () => ({
  clientKeyFromRequest: jest.fn(() => 'test-client'),
  createRateLimiter: jest.fn(() => () => mockIsRateLimited()),
}));

const intake = {
  email: 'engineer@example.com',
  intendedWrite: 'Delete a volume after migration.',
  decision: 'Customer approval to enable the agent.',
  agreeToTerms: true,
};

function submit(body: Record<string, unknown>) {
  return POST(new Request('http://localhost/api/pilot-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }));
}

beforeEach(() => {
  mockCreate.mockReset().mockResolvedValue({});
  mockIsRateLimited.mockReset().mockResolvedValue('allowed');
});

it.each([
  ['write-access-review', 'Write-Access Review'],
  ['pilot-snapshot', 'Pilot Snapshot'],
])('records a %s with only the short intake fields', async (offer, label) => {
  const response = await submit({ ...intake, offer });

  expect(response.status).toBe(200);
  expect(mockCreate).toHaveBeenCalledTimes(1);
  const { properties } = mockCreate.mock.calls[0][0];
  expect(properties['Full Name'].title).toEqual([{ text: { content: `${label} request` } }]);
  expect(properties.Email.email).toBe(intake.email);
  expect(properties.Company.rich_text).toEqual([]);
  expect(properties['Use Case'].rich_text.map((part: { text: { content: string } }) => part.text.content).join(''))
    .toBe(`Requested offer: ${label}\nIntended write: ${intake.intendedWrite}\nPending decision: ${intake.decision}`);
});

it('preserves the previous payload and existing Notion select strings', async () => {
  const response = await submit({
    fullName: 'Example Engineer', email: intake.email, company: 'Example',
    useCase: intake.intendedWrite, expectedVolume: '1000 – 10000',
    cloudEnvironment: 'On‑premises / Private cloud',
  });
  expect(response.status).toBe(200);
  const properties = mockCreate.mock.calls[0][0].properties;
  expect(properties['Full Name'].title).toEqual([{ text: { content: 'Example Engineer' } }]);
  expect(properties.Company.rich_text).toEqual([{ text: { content: 'Example' } }]);
  expect(properties['Use Case'].rich_text).toEqual([{ text: { content: intake.intendedWrite } }]);
  expect(properties['Expected Volume'].select.name).toBe('1000 – 10000');
  expect(properties['Cloud Environment'].select.name).toBe('On‑premises / Private cloud');
});

it.each([undefined, '', '  '])('accepts a write without optional details (%j)', async (decision) => {
  const response = await submit({ ...intake, offer: 'write-access-review', decision });

  expect(response.status).toBe(200);
  expect(mockCreate).toHaveBeenCalledTimes(1);
  expect(mockCreate.mock.calls[0][0].properties['Use Case'].rich_text).toEqual([
    { text: { content: 'Requested offer: Write-Access Review\n' } },
    { text: { content: `Intended write: ${intake.intendedWrite}` } },
  ]);
});

it.each([
  { offer: 'unknown' },
  { intendedWrite: '   ' },
  { decision: 'x'.repeat(501) },
  { decision: null },
  { email: 'invalid' },
  { agreeToTerms: false },
])('rejects incomplete or unsupported intake before writing: %j', async (change) => {
  const response = await submit({ ...intake, offer: 'write-access-review', ...change });
  expect(response.status).toBe(400);
  expect(mockCreate).not.toHaveBeenCalled();
});

it('retains the public rate limit for the short form', async () => {
  mockIsRateLimited.mockResolvedValue('limited');
  const response = await submit({ ...intake, offer: 'pilot-snapshot' });
  expect(response.status).toBe(429);
  expect(mockCreate).not.toHaveBeenCalled();
});

it('reports an unavailable limiter before writing to Notion', async () => {
  mockIsRateLimited.mockResolvedValue('unavailable');
  expect((await submit({ ...intake, offer: 'pilot-snapshot' })).status).toBe(503);
  expect(mockCreate).not.toHaveBeenCalled();
});

it('ignores legacy fields on short forms and discards unknown legacy options', async () => {
  expect((await submit({ ...intake, offer: 'write-access-review', cloudEnvironment: 'AWS' })).status).toBe(200);
  expect(mockCreate.mock.calls[0][0].properties['Cloud Environment'].select).toBeNull();

  expect((await submit({ fullName: 'Example', company: 'Example', email: intake.email, cloudEnvironment: 'Unknown option' })).status).toBe(200);
  expect(mockCreate.mock.calls[1][0].properties['Cloud Environment'].select).toBeNull();
});
