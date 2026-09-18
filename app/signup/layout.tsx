import type { Metadata } from 'next';

/* Excluded from next-sitemap.config.js -- an application form, not content
   meant to rank. See app/dashboard/layout.tsx for the same reasoning. */
export const metadata: Metadata = {
  title: 'Request Pilot Access',
  description: 'Apply for pilot access to the ARF governance engine.',
  robots: { index: false, follow: true },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
