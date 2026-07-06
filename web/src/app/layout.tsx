import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CaAnnouncement from '@/components/CaAnnouncement';
import SolanaProvider from '@/components/SolanaProvider';
import { ThemeProvider, themeInitScript } from '@/components/ThemeProvider';
import MotionProvider from '@/components/MotionProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solkernal.xyz';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SolKernal — AI Skill OS for Solana',
    template: '%s | SolKernal',
  },
  description: 'Deploy, execute, and compose autonomous AI skills on-chain. Permissionless marketplace. Real yield for stakers. Powered by Solana Blinks.',
  keywords: ['Solana', 'AI', 'Skills', 'Blockchain', 'DeFi', 'Staking', 'Blinks', '$SKRN'],
  authors: [{ name: 'SolKernal' }],
  openGraph: {
    type: 'website',
    siteName: 'SolKernal',
    title: 'SolKernal — AI Skill OS for Solana',
    description: 'Deploy, execute, and compose autonomous AI skills on-chain. Permissionless marketplace. Real yield for stakers.',
    url: siteUrl,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolKernal — AI Skill OS for Solana',
    description: 'Deploy, execute, and compose autonomous AI skills on-chain. Real yield for stakers.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <MotionProvider>
            <SolanaProvider>
              <Nav />
              <main id="main-content" className="flex-1 pt-14">
                {children}
              </main>
              <Footer />
              <CaAnnouncement />
            </SolanaProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
