import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stake $SKRN',
  description: 'Staking is not live. SolKernal will not accept stake or show yield until on-chain vault programs ship.',
};

export default function StakeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
