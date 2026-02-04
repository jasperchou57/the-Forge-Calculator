import type { Metadata } from 'next';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const SITE_URL = 'https://www.forgeore.com';
const TITLE = 'Cookie Settings - ForgeCalc';
const DESCRIPTION =
  'Cookie information and settings for ForgeCalc (forgeore.com). Learn how cookies may be used and how to control them in your browser.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/cookies',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/cookies`,
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

export default function CookieSettingsPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-white pb-20">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <header className="space-y-3">
            <h1 className="text-4xl font-bold font-heading">Cookie Settings</h1>
            <p className="text-sm text-gray-500">Last updated: February 4, 2026</p>
            <p className="text-gray-400">
              This page explains how cookies may be used and how you can control them.
              ForgeCalc does not require sign-in and does not intentionally run advertising trackers.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">What are cookies?</h2>
            <p className="text-gray-400">
              Cookies are small pieces of data stored in your browser. They are commonly used for
              basic site functionality, security, and remembering preferences.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">How to manage cookies</h2>
            <ul className="list-disc pl-5 text-gray-400 space-y-2">
              <li>You can block or delete cookies in your browser settings.</li>
              <li>You can use private/incognito mode to reduce stored data.</li>
              <li>On mobile, the setting is usually under Privacy/Security in your browser app.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Notes</h2>
            <p className="text-gray-400">
              If we add optional analytics in the future, we will update this page with clear controls.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
