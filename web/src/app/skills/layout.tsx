import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skills Marketplace',
  description: 'Browse the SolKernal skill registry (off-chain today). Filter by category and provider. Free trial runs available; payments not enforced yet.',
  openGraph: {
    title: 'Skills Marketplace | SolKernal',
    description: 'Browse and run AI skills. Live-data tools preferred. Payment settlement is not live.',
  },
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
