import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://www.forgeore.com';
const TITLE = 'Forge Optimizer | Compare Weapon Recipes';
const DESCRIPTION =
  'Compare weapon recipes by trait and ore multiplier in The Forge. Open a mix in the calculator to see its weapon effects or switch to Armor to see its armor effects.';

const OPTIMIZER_FAQ = [
  {
    q: 'What does the Forge Optimizer do?',
    a: 'The Forge Optimizer compares a selection of weapon ore mixes and ranks matching recipes by their average multiplier.',
  },
  {
    q: 'How do I load an optimized recipe into the crafting calculator?',
    a: 'Select Use beside a result to open that mix in Weapon mode. Switch to Armor in the calculator to see which armor traits the same ores activate.',
  },
  {
    q: 'Can I filter by specific traits or ores?',
    a: 'Yes. Use the Target Trait dropdown to find recipes that activate a specific trait, set a minimum multiplier threshold, or require a specific ore to be included in the combination.',
  },
  {
    q: 'How are results sorted?',
    a: 'Choose Highest × or Lowest × to sort the matching recipes by their weighted average ore multiplier.',
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
                It compares weapon recipes using ores from Worlds 1–3 and selected World 4 ores. Filter by weapon trait or ore, then sort the results by multiplier.
              </p>
              <p>
                Select Use beside a recipe to see its weapon traits and estimated weapon types.
                To check the same mix for armor, switch to Armor in the calculator.
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
