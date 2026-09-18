import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "What's New",
  description:
    "Release notes for ARF AI: governance engine changes, audit and compliance features, and platform updates by version.",
  alternates: { canonical: '/changelog' },
};

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
