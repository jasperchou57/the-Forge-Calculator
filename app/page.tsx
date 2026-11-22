import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import CalculatorDemo from '@/components/Landing/CalculatorDemo';
import oreData from '@/data/v20260201/ores.json';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';

const SITE_URL = 'https://www.forgeore.com';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};
import {
  Calculator,
  Settings,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  Gem,
  Swords,
  Shield as ShieldIcon,
  HelpCircle,
  Zap
} from 'lucide-react';

// FAQ data for structured data
const FAQ_DATA = [
  {
    q: 'What does the ore multiplier tell me?',
    a: 'The calculator averages the multiplier of every ore in your mix. For example, six Iron at 0.35× and six Gold at 0.65× give a 0.50× mix.'
  },
  {
    q: 'Which ores can I use?',
    a: `Search all ${oreData.ores.length} ores by name, or choose a world. W4 includes ores from Bamboo Forest, Holy Tree and Jade Spirit Cave, the six ores crafted in Aurelia Hall, plus Galaxite and Vooite.`
  },
  {
    q: 'Why do traits change when I switch modes?',
    a: 'Each ore can have weapon effects, armor effects, or effects shared by both. For example, Aetherit adds attack speed to a weapon and movement speed to armor.'
  },
  {
    q: 'When does an ore trait activate?',
    a: 'A matching ore must make up at least 10% of your mix. Most traits reach full strength at 30%. The percentage beside an active ore shows its share of the recipe.'
  },
  {
    q: 'Can I predict an exact item?',
    a: 'The chart estimates weapon categories or armor classes from ore count. The estimates exclude forge location, specific item variants, and molds.'
  },
  {
    q: 'How many ores can I enter?',
    a: 'Use up to four different ore types. The calculator covers mixes of 3–51 ores in Weapon mode and 3–45 in Armor mode.'
  },
  {
    q: 'How do I share a recipe?',
    a: 'Choose Share to copy the ore quantities, mode, results, and a link that opens the same mix.'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "ForgeCalc - The Forge Calculator",
            "alternateName": ["Forge Calc", "TheForgeCalculator", "The Forge Crafting Calculator", "The Forge Roblox Calculator"],
            "url": SITE_URL,
            "description": "Calculate forging probabilities for The Forge Roblox game",
            "applicationCategory": "GameApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQ_DATA.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
              }
            }))
          })
        }}
      />

      <main className="flex-1 relative pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20 w-full">

        {/* H1 HERO SECTION */}
        <section className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-highlight border border-accent-blue/20 text-accent-blue text-xs font-mono mb-4 animate-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-accent-blue"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></span>
            </span>
            {oreData.ores.length} ores in the calculator
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
            ForgeCalc – The Forge <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-indigo">Calculator</span>
            <span className="block text-xl md:text-2xl font-normal text-gray-400 mt-4">Roblox Forging Probability Tool</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed">
            Plan a weapon or armor forge in Roblox The Forge. Compare ore multipliers, see which traits your mix activates, and estimate your chances by equipment category.
            New to forging? Read our <Link href="/crafting" className="text-accent-blue hover:underline">crafting guide</Link>.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button asChild size="lg" icon={<Calculator className="w-5 h-5" />}>
              <Link href="#calculator">Open Calculator</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" icon={<Settings className="w-5 h-5" />}>
              <Link href="/optimize">Try Optimizer</Link>
            </Button>
          </div>
        </section>

        {/* H2: FORGE CALCULATOR */}
        <section id="calculator" className="scroll-mt-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Forge Calculator</h2>
            <p className="text-gray-500">Choose Weapon or Armor, then add at least three ores.</p>
          </div>
          <CalculatorDemo />
        </section>

        {/* H2: ORES & WEAPONS DIRECTORY */}
        <section className="grid md:grid-cols-2 gap-8">
          <Card className="p-6" hoverEffect>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-blue/20 rounded-lg">
                <Gem className="w-6 h-6 text-accent-blue" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Ores Directory</h2>
                <p className="text-sm text-gray-500">Multipliers, traits and locations</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Look up an ore before adding it to your mix. Each entry lists its multiplier, rarity and location.
            </p>
            <Button asChild variant="secondary" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
              <Link href="/ores">View All Ores</Link>
            </Button>
          </Card>

          <Card className="p-6" hoverEffect>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-indigo/20 rounded-lg">
                <Swords className="w-6 h-6 text-accent-indigo" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Weapons & Armor</h2>
                <p className="text-sm text-gray-500">Weapon categories and armor classes</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Learn how ore count affects the equipment you can forge, how to use molds, and where to craft ores.
            </p>
            <Button asChild variant="secondary" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
              <Link href="/crafting">Open Crafting Guide</Link>
            </Button>
          </Card>
        </section>

        {/* H2: BEST FORGE SETUPS */}
        <section id="setups" className="border-t border-white/5 pt-12 scroll-mt-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Example Ore Mixes</h2>
            <p className="text-gray-500">Try these mixes to see how the calculator responds.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Compare multipliers
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Start with 12 ores and change the proportions of Iron and Gold.
              </p>
              <ul className="text-xs text-gray-500 space-y-2">
                <li>• 8 Iron + 4 Gold → 0.45×</li>
                <li>• 6 Iron + 6 Gold → 0.50×</li>
                <li>• 4 Iron + 8 Gold → 0.55×</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Activate a weapon trait
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                In Weapon mode, use Iron and Fireite to see when Burn appears.
              </p>
              <ul className="text-xs text-gray-500 space-y-2">
                <li>• 11 Iron + 1 Fireite → below 10%</li>
                <li>• 10 Iron + 2 Fireite → Burn active</li>
                <li>• 8 Iron + 4 Fireite → above 30%</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <ShieldIcon className="w-5 h-5 text-blue-500" />
                Switch equipment modes
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Use 3 Aetherit and 7 Iron. Switch between Weapon and Armor with the same ores.
              </p>
              <ul className="text-xs text-gray-500 space-y-2">
                <li>• Weapon → attack speed</li>
                <li>• Armor → movement speed</li>
                <li>• Aetherit share → 30% in either mode</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* H2: HOW TO USE */}
        <section id="how-to-use" className="border-t border-white/5 pt-12 scroll-mt-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">How to Use ForgeCalc</h2>
            <p className="text-gray-500">Build a mix and compare the results as you adjust it.</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: "1", title: "Select World", desc: "Search all listed ores or narrow the list by world" },
              { step: "2", title: "Choose Mode", desc: "Switch between Weapon or Armor forging" },
              { step: "3", title: "Add Ores", desc: "Click ores and adjust quantities (3-51 for weapons)" },
              { step: "4", title: "Check Traits", desc: "Check which effects apply to your mode" },
              { step: "5", title: "Analyze & Share", desc: "Review probabilities and share your setup" }
            ].map((item) => (
              <div key={item.step} className="text-center p-4 bg-surface/30 rounded-xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-accent-blue/20 text-accent-blue font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="text-white font-medium text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* H2: FAQ */}
        <section id="faq" className="border-t border-white/5 pt-12 scroll-mt-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <HelpCircle className="w-8 h-8 text-accent-blue" />
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500">Everything you need to know about The Forge Calculator</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className="p-5 bg-surface/30 rounded-xl border border-white/5 hover:border-accent-blue/30 transition-colors">
                <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* H2: CHANGELOG */}
        <section id="changelog" className="border-t border-white/5 pt-12 scroll-mt-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Clock className="w-8 h-8 text-accent-blue" />
              Changelog
            </h2>
            <p className="text-gray-500">Recent updates and data changes</p>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-6">
            {[
              { ver: "v20261122", date: "Nov 22, 2026", changes: ["Added 6 crafted ores from Aurelia Hall and 12 Jade Spirit Cave ores to the World 4 filter"] },
              { ver: "v20261121", date: "Nov 21, 2026", changes: ["Added 15 Holy Tree ores and 13 Bamboo Forest ores to the World 4 filter", "Updated 43 ore multipliers", "Added World 4 filtering for Galaxite and Vooite", "Separated weapon and armor traits in recipe results"] },
              { ver: "v20260201", date: "Feb 1, 2026", changes: ["Listed 88 ores", "Added World 1/2 vs World 3 ore filtering", "URL sharing for forge setups"] },
              { ver: "v20260115", date: "Jan 15, 2026", changes: ["Added Frostspire Expanse ores", "Fixed trait activation threshold calculation", "Mobile UI improvements"] },
              { ver: "v20260101", date: "Jan 1, 2026", changes: ["Initial release with core calculator", "Weapon categories and armor classes", "Basic probability tables"] }
            ].map((log, i) => (
              <div key={i} className="flex gap-4 p-4 bg-surface/30 rounded-xl border border-white/5">
                <div className="text-right min-w-[100px]">
                  <div className="text-accent-blue font-mono font-bold">{log.ver}</div>
                  <div className="text-xs text-gray-600">{log.date}</div>
                </div>
                <div className="border-l border-white/10 pl-4">
                  <ul className="text-sm text-gray-400 space-y-1">
                    {log.changes.map((change, cIdx) => (
                      <li key={cIdx}>• {change}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-16 text-center bg-gradient-to-b from-transparent via-accent-blue/5 to-transparent rounded-3xl">
          <h2 className="text-3xl font-bold text-white mb-4">Try your own ore mix</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Pick ores from your inventory and compare your weapon and armor options.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" icon={<Calculator className="w-5 h-5" />}>
              <Link href="#calculator">Start Calculating</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" icon={<BookOpen className="w-5 h-5" />}>
              <Link href="/ores">Browse All Ores</Link>
            </Button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
