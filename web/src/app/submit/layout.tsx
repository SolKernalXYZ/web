import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit a Skill',
  description: 'Publish an AI skill to the SolKernal off-chain registry. Listed fees are not paid out yet.',
  openGraph: {
    title: 'Submit a Skill | SolKernal',
    description: 'Publish AI skills. Builder fee splits are planned, not live.',
  },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
