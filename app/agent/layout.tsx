import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Institutional Memory Agent',
  description:
    'Paste an incident description and get a structured governance evaluation back from a live, Claude-backed demo agent — public and unauthenticated.',
  alternates: { canonical: '/agent' },
};

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
