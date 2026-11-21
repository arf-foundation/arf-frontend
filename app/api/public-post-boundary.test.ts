/** @jest-environment node */

import { POST as chat } from './chat/route';
import { POST as signup } from './pilot-request/route';
import { POST as report } from './report/route';

const mockLimit = jest.fn();

jest.mock('@vercel/connect', () => ({ getToken: jest.fn(), ConnectError: Error }));
jest.mock('@react-pdf/renderer', () => ({ renderToBuffer: jest.fn() }));
jest.mock('./report/pdf-template', () => ({ CompliancePdfDocument: jest.fn() }));
jest.mock('../../lib/rate-limit', () => ({
  clientKeyFromRequest: () => 'synthetic',
  createRateLimiter: () => () => mockLimit(),
}));

describe.each([
  ['chat', chat],
  ['pilot-request', signup],
  ['report', report],
] as const)('/api/%s request boundary', (route, post) => {
  function request(headers: Record<string, string>) {
    return new Request(`https://www.example.test/api/${route}`, { method: 'POST', headers, body: '{}' });
  }

  beforeEach(() => mockLimit.mockReset().mockResolvedValue('limited'));

  it.each([
    [{ Origin: 'https://elsewhere.example.test', 'Content-Type': 'application/json' }, 403],
    [{ Origin: 'null', 'Content-Type': 'application/json' }, 403],
    [{ 'Sec-Fetch-Site': 'cross-site', 'Content-Type': 'application/json' }, 403],
    [{ 'Sec-Fetch-Site': 'same-site', 'Content-Type': 'application/json' }, 403],
    [{
      Host: 'www.example.test', 'X-Forwarded-Host': 'external.example.test',
      Origin: 'https://external.example.test', 'Content-Type': 'application/json',
    }, 403],
    [{ 'Content-Type': 'text/plain' }, 415],
    [{ 'Content-Type': 'application/jsonp' }, 415],
  ] as const)('refuses incompatible requests before rate lookup (%j)', async (headers, status) => {
    expect((await post(request(headers))).status).toBe(status);
    expect(mockLimit).not.toHaveBeenCalled();
  });

  it.each([
    { Origin: 'https://www.example.test', 'Sec-Fetch-Site': 'same-origin', 'Content-Type': 'application/json; charset=UTF-8' },
    { Host: 'preview.example.test', Origin: 'https://preview.example.test', 'Content-Type': 'application/json' },
    { 'Content-Type': 'Application/JSON' },
  ])('keeps allowed JSON behind the existing rate limiter (%j)', async (headers) => {
    expect((await post(request(headers as Record<string, string>))).status).toBe(429);
    expect(mockLimit).toHaveBeenCalledTimes(1);
  });
});
