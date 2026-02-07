import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

const SITE_URL = 'https://www.forgeore.com';
const TITLE = 'Support - ForgeCalc';
const DESCRIPTION =
  'Get help with ForgeCalc (forgeore.com). Report bugs, request features, or contact us for any questions about The Forge Calculator.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/support',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/support`,
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

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-white pb-20">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <header className="space-y-3">
            <h1 className="text-4xl font-bold font-heading">Support</h1>
            <p className="text-sm text-gray-500">
              Last updated: February 7, 2026
            </p>
            <p className="text-gray-400">
              Need help with ForgeCalc? Found a bug or have a feature request?
              We&apos;re here to help.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Contact us</h2>
            <p className="text-gray-400">
              For general questions, feedback, or business inquiries, reach out
              to us at{' '}
              <a
                href="mailto:help@forgeore.com"
                className="text-accent-blue hover:underline"
              >
                help@forgeore.com
              </a>
              . We aim to respond within 48 hours.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Report a bug</h2>
            <p className="text-gray-400">
              If you find incorrect calculations, outdated ore data, or any
              other issue, please let us know by{' '}
              <a
                href="https://github.com/jasperchou57/the-Forge-Calculator/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline"
              >
                opening an issue on GitHub
              </a>{' '}
              or emailing us directly. When reporting, please include:
            </p>
            <ul className="list-disc pl-5 text-gray-400 space-y-2">
              <li>A description of the issue</li>
              <li>Steps to reproduce the problem</li>
              <li>Your browser and device information</li>
              <li>Screenshots, if applicable</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Feature requests</h2>
            <p className="text-gray-400">
              Have an idea for a new feature or improvement? We love hearing
              from the community. Submit your suggestions via{' '}
              <a
                href="https://github.com/jasperchou57/the-Forge-Calculator/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline"
              >
                GitHub Issues
              </a>{' '}
              or email us at{' '}
              <a
                href="mailto:help@forgeore.com"
                className="text-accent-blue hover:underline"
              >
                help@forgeore.com
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">FAQ</h2>
            <p className="text-gray-400">
              Before reaching out, check our{' '}
              <Link href="/#faq" className="text-accent-blue hover:underline">
                Frequently Asked Questions
              </Link>{' '}
              — your question may already be answered there.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Disclaimer</h2>
            <p className="text-gray-400">
              ForgeCalc is a fan-made community tool and is not affiliated with
              Roblox Corporation or the developers of The Forge. All game data
              is provided for educational purposes and may not perfectly reflect
              in-game results after patches.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
