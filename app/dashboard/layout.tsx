import type { Metadata } from 'next';

/* Excluded from next-sitemap.config.js -- this is a live simulated demo, not
   content meant to rank. It was inheriting the root layout's "index, follow"
   with no override, which is what Replay QA's crawlability findings caught:
   a page invisible to the sitemap but still telling crawlers to index it. */
export const metadata: Metadata = {
  title: 'Governance Console',
  description:
    'A public sandbox view of the ARF Governance Console: simulated risk scores, policy violations, and audit trail.',
  robots: { index: false, follow: true },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
