import type { Metadata } from 'next';
import './globals.css';

const SITE_URL = 'https://www.forgeore.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'ForgeCalc - The Forge Calculator | Roblox Forging Probability Tool',
  description: 'Calculate forging probabilities, optimize ore combinations, and predict weapon/armor stats for The Forge Roblox. 88 ores, real probability tables, World 1-3 support. Free online calculator.',
  keywords: ['The Forge Calculator', 'Roblox The Forge', 'forge calculator', 'forging probability', 'ore calculator', 'weapon stats', 'armor calculator', 'trait activation'],
  authors: [{ name: 'ForgeCalc' }],
  openGraph: {
    title: 'ForgeCalc - The Forge Calculator for Roblox',
    description: 'Calculate forging probabilities and optimize ore combinations for The Forge Roblox game. Free tool with 88 ores and real game data.',
    url: SITE_URL,
    siteName: 'ForgeCalc',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'ForgeCalc - The Forge Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ForgeCalc - The Forge Calculator',
    description: 'Calculate forging probabilities for The Forge Roblox. 88 ores, real probability tables.',
    images: ['/twitter-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans bg-void text-gray-300 selection:bg-accent-blue/30 selection:text-white">
        <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40" />
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-glow-gradient pointer-events-none" />
        {children}
      </body>
    </html>
  );
}
