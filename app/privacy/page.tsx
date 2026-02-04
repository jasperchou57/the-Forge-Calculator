import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const SITE_URL = 'https://www.forgeore.com';
const TITLE = 'Privacy Policy - ForgeCalc';
const DESCRIPTION =
  'Privacy policy for ForgeCalc (forgeore.com), a fan-made calculator and ore database for The Forge Roblox.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/privacy`,
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

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-white pb-20">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <header className="space-y-3">
            <h1 className="text-4xl font-bold font-heading">Privacy Policy</h1>
            <p className="text-sm text-gray-500">
              Last updated: February 4, 2026
            </p>
            <p className="text-gray-400">
              ForgeCalc (forgeore.com) is a fan-made tool for the Roblox game The Forge.
              We do not require an account to use this site.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Information we process</h2>
            <ul className="list-disc pl-5 text-gray-400 space-y-2">
              <li>
                <span className="text-gray-300">Basic request data:</span> like IP address, user agent, and request logs may be processed by our hosting providers for security and reliability.
              </li>
              <li>
                <span className="text-gray-300">No account data:</span> we do not ask for usernames, emails, or passwords.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Cookies</h2>
            <p className="text-gray-400">
              We do not intentionally use advertising trackers. Some essential cookies or similar technologies may be used by the platform or browser.
              For details, see{' '}
              <Link href="/cookies" className="text-accent-blue hover:underline">
                Cookie Settings
              </Link>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Changes</h2>
            <p className="text-gray-400">
              We may update this policy as the site evolves (for example, if we add analytics).
              Updates will be posted on this page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Questions</h2>
            <p className="text-gray-400">
              If you have questions, please open an issue in the project repository or contact us through the site links.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
