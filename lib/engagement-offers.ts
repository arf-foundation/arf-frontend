export const REVIEW_EXAMPLE_PATH = '/write-access-review';
export const REVIEW_REQUEST_PATH = '/signup?offer=write-access-review';
export const SNAPSHOT_REQUEST_PATH = '/signup?offer=pilot-snapshot';

export const OFFER_LABELS = {
  'write-access-review': 'Write-Access Review',
  'pilot-snapshot': 'Pilot Snapshot',
} as const;

export type RequestOffer = keyof typeof OFFER_LABELS;

export function isRequestOffer(value: unknown): value is RequestOffer {
  return value === 'write-access-review' || value === 'pilot-snapshot';
}
