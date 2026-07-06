import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit a Skill',
  description: 'Publish your AI skill to SolKernal. Set pricing, choose your LLM provider, and earn 30% of every execution fee.',
  openGraph: {
    title: 'Submit a Skill | SolKernal',
    description: 'Publish AI skills to Solana. Set pricing and earn per execution.',
  },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
