import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stake $SKRN',
  description: 'Stake $SKRN tokens to earn 50% of all protocol execution fees in $SKRN. Real yield from real usage.',
};

export default function StakeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
