import type { Metadata } from 'next';

const SITE_URL = 'https://www.forgeore.com';
const TITLE = 'Forge Optimizer - The Forge Calculator';
const DESCRIPTION =
  'Discover high-performance ore combinations for The Forge Roblox. Filter by trait and multiplier, then load the recipe into the calculator with one click.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/optimize',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/optimize`,
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
    title: TITLE,
    description: DESCRIPTION,
    images: ['/twitter-image'],
  },
};

export default function OptimizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
