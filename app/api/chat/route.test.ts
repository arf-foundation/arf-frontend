/** @jest-environment node */

import { POST } from './route';

const mockGetToken = jest.fn();
const mockCreate = jest.fn();
const mockBudget = jest.fn();

jest.mock('@vercel/connect', () => ({
  ConnectError: class ConnectError extends Error {},
  getToken: () => mockGetToken(),
}));
jest.mock('@anthropic-ai/sdk', () => ({
  __esModule: true,
  default: jest.fn(() => ({ messages: { create: mockCreate } })),
}));
jest.mock('../../../lib/rate-limit', () => ({
  clientKeyFromRequest: jest.fn(() => 'unit-test'),
  createRateLimiter: ({ prefix }: { prefix: string }) => async () =>
    prefix === 'chat-budget' ? mockBudget() : 'allowed',
}));

const sample = {
  incident_summary: 'Synthetic incident', normalized_category: 'Network',
  probable_root_cause: '', gating_rule_triggered: 'low_confidence', uncertainty_notes: '',
  detected_patterns: [], gating_rule_stack: [], policy_flag_frequency_hint: [], policy_flags: [],
  similarity_confidence: 0, risk_score: 0.75, pattern_signal_count: 0,
  healing_intent: { intent_type: 'Review', parameters: {}, rollback_required: false, execution_mode_recommended: 'Advisory' },
};

function submit(body: unknown) {
  return POST(new Request('http://localhost/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }));
}

beforeEach(() => {
  mockGetToken.mockReset().mockResolvedValue('synthetic-token');
  mockCreate.mockReset().mockResolvedValue({ content: [{ type: 'text', text: JSON.stringify(sample) }] });
  mockBudget.mockReset().mockResolvedValue('allowed');
});

it.each([{ message: '  ' }, { message: 'x'.repeat(4001) }, { message: 'test', extra: 'x'.repeat(26_000) }])(
  'rejects invalid input before requesting a credential', async body => {
    expect((await submit(body)).status).toBe(400);
    expect(mockGetToken).not.toHaveBeenCalled();
  },
);

it.each([['limited', 429], ['unavailable', 503]])('stops before contacting the model when the budget is %s', async (state, status) => {
  mockBudget.mockResolvedValue(state);
  expect((await submit({ message: 'A synthetic incident' })).status).toBe(status);
  expect(mockGetToken).not.toHaveBeenCalled();
});

it('returns valid model output without logging its content', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  try {
    const response = await submit({ message: 'A synthetic incident' });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(sample);
    expect(JSON.stringify(log.mock.calls)).not.toContain(sample.incident_summary);
  } finally {
    log.mockRestore();
  }
});

it('rejects malformed response shape without logging its content', async () => {
  const warning = jest.spyOn(console, 'warn').mockImplementation(() => {});
  mockCreate.mockResolvedValue({ content: [{ type: 'text', text: JSON.stringify({ ...sample, policy_flags: null }) }] });
  try {
    expect((await submit({ message: 'A synthetic incident' })).status).toBe(502);
    expect(JSON.stringify(warning.mock.calls)).not.toContain(sample.incident_summary);
  } finally {
    warning.mockRestore();
  }
});
