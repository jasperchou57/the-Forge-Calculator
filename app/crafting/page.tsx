import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import {
  Anvil,
  Calculator,
  Settings,
  ArrowRight,
  Gem,
  Swords,
  Shield,
  Zap,
  HelpCircle,
  Layers,
  Target,
  TrendingUp,
} from 'lucide-react';

const SITE_URL = 'https://www.forgeore.com';
const TITLE = 'The Forge Crafting Guide | Crafting Calculator & Forging Mechanics';
const DESCRIPTION =
  'Complete guide to crafting in The Forge Roblox. Learn how the forging system works, understand ore composition, trait activations, and weapon/armor crafting mechanics. Use our crafting calculator to plan your forges.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'the forge crafting',
    'the forge crafting calculator',
    'the forge forging calculator',
    'the forge crafting test',
    'forge crafting guide',
    'the forge roblox crafting',
  ],
  alternates: {
    canonical: '/crafting',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/crafting`,
    siteName: 'ForgeCalc',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'The Forge Crafting Guide - ForgeCalc',
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

const CRAFTING_FAQ = [
  {
    q: 'How does crafting work in The Forge?',
    a: 'At a forge, combine ores to make a weapon or armor. Matching molds help you target a particular piece. At a Crafting Stall, spend the ingredients and gold in a recipe to make its listed ore.',
  },
  {
    q: 'What is the difference between weapon and armor crafting?',
    a: 'Weapon mode estimates the chance of each weapon category. Armor mode estimates the chances of light, medium and heavy armor. Both charts use the total ore count. Your forge location and molds can affect which item you actually get.',
  },
  {
    q: 'How do traits activate during crafting?',
    a: 'In ForgeCalc, a trait appears when its ore makes up at least 10% of the mix. At 30% or higher, the trait reaches full (100%) effectiveness. Between 10–30%, effectiveness scales linearly. Planning your ore ratios is key to activating the right traits.',
  },
  {
    q: 'What is a crafting test in The Forge?',
    a: 'A crafting test is when you simulate a forge before committing real ores. Use the ForgeCalc crafting calculator to enter your ore combination and see predicted outcomes — weapon type, multiplier, trait activations, and probability distributions — all without spending resources.',
  },
  {
    q: 'How does the multiplier affect crafting results?',
    a: 'A higher multiplier gives your weapon or armor stronger base stats. The forge weights ore multipliers by quantity. Bismuth and Fichilliumorite take the weighted average of any regular ores in the mix. With only these special ores, the forge weights Bismuth at 8× and Fichilliumorite at 1×.',
  },
  {
    q: 'Does ore count matter for crafting?',
    a: 'Yes. More ores generally produce heavier weapon categories (e.g. Great Sword or Colossal instead of Dagger). For armor, more ores shift results toward Heavy armor. Change the quantity in the calculator to see the odds for each category.',
  },
];

export default function CraftingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: CRAFTING_FAQ.map((faq) => ({
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

      <main className="flex-1 relative pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 w-full">

        {/* Hero */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-highlight border border-accent-blue/20 text-accent-blue text-xs font-mono">
            <Layers className="w-3 h-3" />
            CRAFTING GUIDE
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            The Forge Crafting{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-indigo">
              Guide
            </span>
            <span className="block text-xl md:text-2xl font-normal text-gray-400 mt-4">
              How Forging Works in The Forge Roblox
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed">
            Learn how ore mixes affect equipment rolls, how molds target an item, and which
            ores you can make at a Crafting Stall. Use our{' '}
            <Link href="/#calculator" className="text-accent-blue hover:underline">
              crafting calculator
            </Link>{' '}
            to test combinations before you forge.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button asChild size="lg" icon={<Calculator className="w-5 h-5" />}>
              <Link href="/#calculator">Open Crafting Calculator</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" icon={<Settings className="w-5 h-5" />}>
              <Link href="/optimize">Try Optimizer</Link>
            </Button>
          </div>
        </section>

        {/* Section: How Crafting Works */}
        <section className="border-t border-white/5 pt-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How Crafting Works</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent-blue/20 rounded-lg">
                  <Gem className="w-6 h-6 text-accent-blue" />
                </div>
                <h3 className="text-lg font-bold text-white">1. Gather Ores</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Check an ore’s multiplier and trait before choosing your mix.
                The calculator includes ores from Worlds 1–3 and selected World 4 ores, including those from Bamboo Forest, Holy Tree and Jade Spirit Cave. Find their stats and locations in the{' '}
                <Link href="/ores" className="text-accent-blue hover:underline">
                  ore directory
                </Link>.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent-indigo/20 rounded-lg">
                  <Layers className="w-6 h-6 text-accent-indigo" />
                </div>
                <h3 className="text-lg font-bold text-white">2. Choose Your Mix</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                In the calculator, try <strong className="text-gray-200">3–51 ores for weapons</strong> or{' '}
                <strong className="text-gray-200">3–45 for armor</strong>. Change the count to see how
                the odds shift between equipment types. For a mold-assisted forge, check the selected
                item’s chance in the game.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-white">3. Multiplier & Composition</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Each ore’s quantity affects the <strong className="text-gray-200">multiplier</strong>.
                One Starite (4×) and three Matter (8×) average 7×. Add five Fichilliumorite and the
                mix grows from four ores to nine, still at 7×.{' '}
                <Link href="/?mode=armor&ores=starite:1,matter:3,fichilliumorite:5#calculator" className="text-accent-blue hover:underline">
                  Try the nine-ore mix
                </Link>.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-lg font-bold text-white">4. Trait Activations</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                ForgeCalc starts showing a trait when its ore makes up 10% of your mix and
                estimates full strength at 30%. For example, 3 Eye Ore in a 10-ore mix reaches 30%.
                Eye Ore adds physical damage and reduces maximum health.
              </p>
            </Card>
          </div>
        </section>

        {/* Section: Weapon vs Armor */}
        <section className="border-t border-white/5 pt-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Weapon vs Armor Crafting</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6" hoverEffect>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent-blue/20 rounded-lg">
                  <Swords className="w-6 h-6 text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Weapon Forging</h3>
                  <p className="text-xs text-gray-500">Calculator range: 3–51 ores</p>
                </div>
              </div>
              <ul className="text-sm text-gray-400 space-y-2 mb-4">
                <li>• <strong className="text-gray-200">Dagger</strong> — Fast, low ore count, ideal for quick builds</li>
                <li>• <strong className="text-gray-200">Katana</strong> — Balanced speed and damage</li>
                <li>• <strong className="text-gray-200">Straight Sword</strong> — All-rounder with moderate stats</li>
                <li>• <strong className="text-gray-200">Great Sword</strong> — High damage, slower swing</li>
                <li>• <strong className="text-gray-200">Colossal</strong> — A heavier weapon type in larger ore mixes</li>
              </ul>
              <Button asChild variant="secondary" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                <Link href="/?mode=weapon">Open Weapon Calculator</Link>
              </Button>
            </Card>

            <Card className="p-6" hoverEffect>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent-indigo/20 rounded-lg">
                  <Shield className="w-6 h-6 text-accent-indigo" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Armor Crafting</h3>
                  <p className="text-xs text-gray-500">Calculator range: 3–45 ores</p>
                </div>
              </div>
              <ul className="text-sm text-gray-400 space-y-2 mb-4">
                <li>• <strong className="text-gray-200">Light Armor</strong> — Most likely in the calculator’s smallest ore mixes</li>
                <li>• <strong className="text-gray-200">Medium Armor</strong> — Most likely in the calculator’s 11–20 ore range</li>
                <li>• <strong className="text-gray-200">Heavy Armor</strong> — Larger ore mixes favor this class in the calculator</li>
              </ul>
              <p className="text-xs text-gray-500 mb-4">
                Use the armor calculator to compare class probabilities, ore multipliers, and traits.
              </p>
              <Button asChild variant="secondary" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                <Link href="/?mode=armor">Open Armor Calculator</Link>
              </Button>
            </Card>
          </div>
        </section>

        <section aria-labelledby="molds-and-ore-crafting" className="border-t border-white/5 pt-12">
          <h2 id="molds-and-ore-crafting" className="scroll-mt-24 text-3xl font-bold text-white mb-8 text-center">
            Molds &amp; Ore Crafting
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="flex flex-col p-6" hoverEffect>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent-blue/20 rounded-lg">
                  <Anvil aria-hidden="true" className="w-6 h-6 text-accent-blue" />
                </div>
                <h3 id="molds" className="scroll-mt-24 text-xl font-bold text-white">Weapon &amp; Armor Molds</h3>
              </div>
              <ul className="space-y-4 text-sm text-gray-400 leading-relaxed">
                <li><strong className="text-gray-200">Using a mold.</strong> Choose an available item at the forge,
                  add your ores, then add Weapon Molds for a weapon or Armor Molds for armor.</li>
                <li><strong className="text-gray-200">Getting the exact item.</strong> Each matching mold raises
                  the selected item’s chance. For a guaranteed roll, add enough to reach 100%.</li>
                <li><strong className="text-gray-200">Finding molds.</strong> Reaper can drop Weapon Molds, and
                  Golem can drop Armor Molds. The Island 4 Raid Shop stocks both in its weekly supplies.</li>
              </ul>
            </Card>

            <Card className="flex min-w-0 flex-col p-6" hoverEffect>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent-indigo/20 rounded-lg">
                  <Gem aria-hidden="true" className="w-6 h-6 text-accent-indigo" />
                </div>
                <h3 id="ore-crafting" className="scroll-mt-24 text-xl font-bold text-white">Ore Crafting Recipes</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Visit the Forgotten Kingdom Crafting Stall on Island 2 to make these ores.
              </p>
              <table className="mt-4 w-full text-left text-sm text-gray-300">
                <caption className="sr-only">Forgotten Kingdom recipes per craft</caption>
                <thead className="border-b border-white/20">
                  <tr>
                    <th scope="col" className="pr-2 py-2">Ore</th>
                    <th scope="col" className="pr-2">Ingredients</th>
                    <th scope="col" className="pr-2">Gold</th>
                    <th scope="col">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Blue Crystal Ore', '3 Quartz + 3 Sapphire', '80', '5s'],
                    ['Mythril', '1 Obsidian + 1 Rivalite', '125', '20s'],
                    ['Eye Ore', '2 Cuprite + 1 Rivalite', '150', '20s'],
                    ['Lightite', '2 Diamond + 1 Eye Ore + 2 Mythril', '250', '20s'],
                  ].map(([ore, ingredients, gold, time]) => (
                    <tr key={ore} className="border-b border-white/10">
                      <th scope="row" className="pr-2 py-2 font-medium text-white">{ore}</th>
                      <td className="pr-2">{ingredients}</td>
                      <td className="pr-2">{gold}</td>
                      <td>{time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-sm text-gray-400">Lightite costs 250 gold with Eye Ore and Mythril
                on hand, or 650 gold if you also craft the Eye Ore and both Mythril.</p>
            </Card>
          </div>
        </section>

        {/* Section: Crafting Tips */}
        <section className="border-t border-white/5 pt-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Crafting Tips & Common Mistakes</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-green-500" />
                <h3 className="text-white font-bold">Do: Plan Before Forging</h3>
              </div>
              <p className="text-sm text-gray-400">
                Run a crafting test in the calculator first. Enter your planned ore mix and check the
                predicted weapon type, multiplier, and traits. Compare two mixes before choosing which ores to spend.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-red-500" />
                <h3 className="text-white font-bold">Check Your Trait Share</h3>
              </div>
              <p className="text-sm text-gray-400">
                Adding Fichilliumorite to a mix with regular ores preserves its multiplier, but each original ore
                makes up a smaller share of the total. If a trait ore drops below 10%, its trait switches off.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-yellow-500" />
                <h3 className="text-white font-bold">Watch: Trait Stacking</h3>
              </div>
              <p className="text-sm text-gray-400">
                Check the Traits panel before committing your ores. Eye Ore trades maximum health for physical damage,
                so consider whether that trade works for your build.
              </p>
            </Card>
          </div>
        </section>

        {/* Section: FAQ */}
        <section className="border-t border-white/5 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <HelpCircle className="w-8 h-8 text-accent-blue" />
              Crafting FAQ
            </h2>
            <p className="text-gray-500">Common questions about The Forge crafting mechanics</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {CRAFTING_FAQ.map((faq, i) => (
              <div
                key={i}
                className="p-5 bg-surface/30 rounded-xl border border-white/5 hover:border-accent-blue/30 transition-colors"
              >
                <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center bg-gradient-to-b from-transparent via-accent-blue/5 to-transparent rounded-3xl">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Craft?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Use the crafting calculator to test your ore combinations, predict outcomes, and optimize
            your builds — all before spending a single ore.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" icon={<Calculator className="w-5 h-5" />}>
              <Link href="/#calculator">Open Crafting Calculator</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" icon={<Gem className="w-5 h-5" />}>
              <Link href="/ores">Browse All Ores</Link>
            </Button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
