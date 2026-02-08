import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://www.forgeore.com';
const TITLE = 'Forge Optimizer | The Forge Crafting Calculator & Best Recipes';
const DESCRIPTION =
  'Find the best ore combinations for The Forge Roblox. The Forge crafting calculator optimizes recipes by trait, multiplier, and stability. Load results into the forging calculator with one click.';

const OPTIMIZER_FAQ = [
  {
    q: 'What does the Forge Optimizer do?',
    a: 'The Forge Optimizer analyzes all possible ore combinations and ranks them by multiplier, stability, or trait strength. It helps you find the best crafting recipe for your specific goals without trial and error.',
  },
  {
    q: 'How do I load an optimized recipe into the crafting calculator?',
    a: 'Click the "Use" button next to any result. The ore combination will be loaded directly into the main Forge Calculator where you can see detailed probabilities, trait activations, and predicted stats.',
  },
  {
    q: 'Can I filter by specific traits or ores?',
    a: 'Yes. Use the Target Trait dropdown to find recipes that activate a specific trait, set a minimum multiplier threshold, or require a specific ore to be included in the combination.',
  },
  {
    q: 'What is the difference between Power and Stable sorting?',
    a: 'Power sorting ranks recipes by total multiplier (higher damage/defense). Stable sorting prioritizes combinations with consistent outcomes and lower variance, ideal for players who want reliable results.',
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['forge optimizer', 'the forge crafting calculator', 'best ore combinations', 'the forge roblox calculator', 'forging calculator', 'the forge best recipes'],
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
  return (
    <>
      {/* FAQ JSON-LD (SSR) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: OPTIMIZER_FAQ.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }),
        }}
      />

      {children}

      {/* SSR static content for search engine indexability */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* About Section */}
          <section className="border-t border-white/5 pt-12">
            <h2 className="text-2xl font-bold text-white mb-4">About The Forge Crafting Calculator & Optimizer</h2>
            <div className="text-gray-400 text-sm leading-relaxed space-y-4">
              <p>
                The Forge Optimizer is a companion tool for the <Link href="/" className="text-accent-blue hover:underline">Forge Calculator</Link>.
                Instead of manually testing different ore combinations, the optimizer searches through proven recipes
                and ranks them by the metrics that matter most to your playstyle — whether that&apos;s raw multiplier power,
                trait synergies, or crafting stability.
              </p>
              <p>
                Every result can be loaded directly into the forging calculator with one click,
                where you&apos;ll see full probability breakdowns, weapon or armor predictions, and trait activation details.
                It works for both weapon crafting (3–51 ores) and armor crafting (3–45 ores) across World 1, World 2, and World 3.
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {OPTIMIZER_FAQ.map((faq, i) => (
                <div key={i} className="p-5 bg-surface/30 rounded-xl border border-white/5">
                  <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                  <p className="text-sm text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
