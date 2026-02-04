import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const SITE_URL = 'https://www.forgeore.com';
const TITLE = 'Terms of Service - ForgeCalc';
const DESCRIPTION =
  'Terms of service for ForgeCalc (forgeore.com), a fan-made calculator and ore database for The Forge Roblox.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/terms`,
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

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background font-sans text-white pb-20">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <header className="space-y-3">
            <h1 className="text-4xl font-bold font-heading">Terms of Service</h1>
            <p className="text-sm text-gray-500">
              Last updated: February 4, 2026
            </p>
            <p className="text-gray-400">
              By using ForgeCalc (forgeore.com), you agree to these terms.
              If you do not agree, please do not use the site.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Fan-made project</h2>
            <p className="text-gray-400">
              ForgeCalc is a community tool and is not affiliated with Roblox Corporation or the developers of The Forge.
              All trademarks belong to their respective owners.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">No guarantees</h2>
            <p className="text-gray-400">
              The site provides estimates and educational information. Game data may change, and results may differ from in-game outcomes.
              Use the tool at your own risk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Acceptable use</h2>
            <ul className="list-disc pl-5 text-gray-400 space-y-2">
              <li>Do not attempt to disrupt, overload, or compromise the site.</li>
              <li>Do not use the site for unlawful activities.</li>
              <li>Do not scrape the site at abusive rates.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Privacy</h2>
            <p className="text-gray-400">
              Please review our{' '}
              <Link href="/privacy" className="text-accent-blue hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Changes</h2>
            <p className="text-gray-400">
              We may update these terms as the site evolves. Updated terms will be posted on this page.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
