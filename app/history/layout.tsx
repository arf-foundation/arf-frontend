import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Risk History',
  description:
    'A running history of simulated risk evaluations and governance decisions from the ARF sandbox API.',
  alternates: { canonical: '/history' },
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
