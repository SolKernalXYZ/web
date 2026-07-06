import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skills Marketplace',
  description: 'Browse the on-chain AI skill registry. Filter by category, LLM provider, and execution cost. Execute skills directly on Solana.',
  openGraph: {
    title: 'Skills Marketplace | SolKernal',
    description: 'Browse and execute AI skills on Solana. Filter by category, provider, and cost.',
  },
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
