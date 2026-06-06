import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
  const nonce = uuidv4();
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:`,
    `style-src 'self' 'nonce-${nonce}'`,
    `img-src 'self' data: https:`,
    `font-src 'self' data:`,
    `connect-src 'self' https://A-R-F-ARF-Sandbox-API.hf.space https://api.github.com`,
    `frame-src 'self' https://www.linkedin.com https://www.youtube.com`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ].join('; ');
  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', csp);
  return response;
}
