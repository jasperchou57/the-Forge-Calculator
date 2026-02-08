import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import {
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
    a: 'Crafting in The Forge combines ores at the anvil to produce weapons or armor. The outcome depends on how many ores you use, their rarity, multiplier values, and composition percentages. Higher-quality ores and larger quantities produce stronger equipment.',
  },
  {
    q: 'What is the difference between weapon and armor crafting?',
    a: 'Weapon crafting uses 3–51 ores and produces categories like Dagger, Katana, Straight Sword, Great Sword, or Colossal based on ore count. Armor crafting uses 3–45 ores and produces Light, Medium, or Heavy armor. Each has different stat calculations.',
  },
  {
    q: 'How do traits activate during crafting?',
    a: 'Traits activate when a single ore type reaches at least 10% of your total composition. At 30% or higher, the trait reaches full (100%) effectiveness. Between 10–30%, effectiveness scales linearly. Planning your ore ratios is key to activating the right traits.',
  },
  {
    q: 'What is a crafting test in The Forge?',
    a: 'A crafting test is when you simulate a forge before committing real ores. Use the ForgeCalc crafting calculator to enter your ore combination and see predicted outcomes — weapon type, multiplier, trait activations, and probability distributions — all without spending resources.',
  },
  {
    q: 'How does the multiplier affect crafting results?',
    a: 'The total multiplier is a weighted average of all ores used. Higher multipliers mean stronger base stats on the resulting weapon or armor. Mixing high-tier ores with low-tier filler ores will drag down your average, so plan carefully.',
  },
  {
    q: 'Does ore count matter for crafting?',
    a: 'Yes. More ores generally produce heavier weapon categories (e.g. Great Sword or Colossal instead of Dagger). For armor, more ores shift results toward Heavy armor. The exact thresholds depend on the world and probability tables.',
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
            Everything you need to know about crafting in The Forge — from basic
            mechanics to advanced trait optimization. Use our{' '}
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
                Mine ores from caves across World 1, World 2, and World 3 (The Peak).
                Each ore has a <strong className="text-gray-200">rarity</strong>,{' '}
                <strong className="text-gray-200">multiplier</strong>, and optionally a{' '}
                <strong className="text-gray-200">trait</strong>. Higher-rarity ores like
                Mythril, Darkryte, and Void Ore have stronger multipliers but are harder to find.
                Browse all 88 ores in our{' '}
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
                Weapons require <strong className="text-gray-200">3–51 ores</strong> and
                armor requires <strong className="text-gray-200">3–45 ores</strong>. The number
                of ores determines your equipment category — fewer ores tend toward lighter weapons
                (Dagger, Katana), while more ores produce heavier ones (Great Sword, Colossal).
                The same logic applies to armor classes.
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
                Your final <strong className="text-gray-200">multiplier</strong> is the weighted
                average of all ores used. Mixing high-tier ores with weak filler drags down the
                average — it&apos;s often better to use fewer, high-quality ores. The{' '}
                <strong className="text-gray-200">composition percentage</strong> of each ore type
                determines which traits activate and how effective they are.
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
                Traits activate at <strong className="text-gray-200">10% composition</strong> and
                reach full effectiveness at <strong className="text-gray-200">30%</strong>. Between
                10–30%, strength scales linearly. Some traits stack well together (e.g. damage +
                lifesteal), while others can be dangerous — stacking too much Max HP reduction
                from Eye Ores can leave you with 0 health.
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
                  <p className="text-xs text-gray-500">3–51 ores • 5 weapon categories</p>
                </div>
              </div>
              <ul className="text-sm text-gray-400 space-y-2 mb-4">
                <li>• <strong className="text-gray-200">Dagger</strong> — Fast, low ore count, ideal for quick builds</li>
                <li>• <strong className="text-gray-200">Katana</strong> — Balanced speed and damage</li>
                <li>• <strong className="text-gray-200">Straight Sword</strong> — All-rounder with moderate stats</li>
                <li>• <strong className="text-gray-200">Great Sword</strong> — High damage, slower swing</li>
                <li>• <strong className="text-gray-200">Colossal</strong> — Maximum damage, requires the most ores</li>
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
                  <p className="text-xs text-gray-500">3–45 ores • 3 armor classes</p>
                </div>
              </div>
              <ul className="text-sm text-gray-400 space-y-2 mb-4">
                <li>• <strong className="text-gray-200">Light Armor</strong> — Low defense, high mobility, fewer ores needed</li>
                <li>• <strong className="text-gray-200">Medium Armor</strong> — Balanced defense and weight</li>
                <li>• <strong className="text-gray-200">Heavy Armor</strong> — Maximum defense, essential for boss fights and The Peak</li>
              </ul>
              <p className="text-xs text-gray-500 mb-4">
                Use the armor calculator to predict defense stats, armor class probability, and trait activations for your build.
              </p>
              <Button asChild variant="secondary" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                <Link href="/?mode=armor">Open Armor Calculator</Link>
              </Button>
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
                predicted weapon type, multiplier, and traits. This prevents wasting rare ores on bad outcomes.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-red-500" />
                <h3 className="text-white font-bold">Don&apos;t: Dilute with Filler</h3>
              </div>
              <p className="text-sm text-gray-400">
                Adding common ores (Stone, Copper) to pad the count drags down your multiplier dramatically.
                It&apos;s better to forge with fewer high-quality ores than to dilute your mix with weak materials.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-yellow-500" />
                <h3 className="text-white font-bold">Watch: Trait Stacking</h3>
              </div>
              <p className="text-sm text-gray-400">
                Some traits synergize well (damage + critical), but stacking too much HP reduction (from Eye Ores)
                can leave you with zero health. Always check the Traits panel in the calculator before committing.
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
