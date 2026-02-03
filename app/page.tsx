import React from 'react';
import Link from 'next/link';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import CalculatorDemo from '@/components/Landing/CalculatorDemo';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import {
  Calculator,
  Settings,
  BookOpen,
  Dices,
  Target,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
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
    q: "What is The Forge Calculator?", 
    a: "The Forge Calculator is a free online tool that calculates forging probabilities, predicts weapon and armor stats, and helps optimize ore combinations for the Roblox game The Forge." 
  },
  { 
    q: "How accurate is this calculator?", 
    a: "We use real probability tables extracted from game data. Our calculations are verified with 50+ unit tests and match in-game results with 99%+ accuracy." 
  },
  { 
    q: "How many ores does ForgeCalc support?", 
    a: "ForgeCalc supports all 88 ores from The Forge, including World 1, World 2, and World 3 (The Peak) ores. We update within 24 hours of new game patches." 
  },
  { 
    q: "How do trait activations work?", 
    a: "Traits activate when an ore type reaches 10% of your total composition. At 30% or higher, the trait reaches 100% effectiveness. Between 10-30%, effectiveness scales linearly." 
  },
  { 
    q: "Can I share my forge setup?", 
    a: "Yes! Every ore combination generates a unique URL that you can share with friends or save for later. Just copy the URL from your browser." 
  },
  { 
    q: "Is this an official Roblox tool?", 
    a: "No, ForgeCalc is a fan-made community tool. We are not affiliated with Roblox Corporation or The Forge game developers." 
  },
  { 
    q: "What's the difference between weapon and armor forging?", 
    a: "Weapons use 3-51 ores and produce different weapon categories (Dagger, Katana, Great Sword, etc.). Armor uses 3-45 ores and produces Light, Medium, or Heavy armor." 
  },
  { 
    q: "How do I report incorrect data?", 
    a: "If you find any calculation errors or outdated data, please report it through our feedback form. We typically fix issues within 24 hours." 
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
            "url": "https://forgecalc.com",
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
            Data v20260201 • 88 Ores • World 1-3 Support
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
            ForgeCalc – The Forge <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-indigo">Calculator</span>
            <span className="block text-xl md:text-2xl font-normal text-gray-400 mt-4">Roblox Forging Probability Tool</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed">
            Calculate forging probabilities, optimize ore combinations, and predict weapon & armor stats for The Forge Roblox.
            <strong className="text-white"> Stop wasting rare ores</strong> – plan your crafts with real game data.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="#calculator">
              <Button size="lg" icon={<Calculator className="w-5 h-5" />}>Open Calculator</Button>
            </Link>
            <Link href="/optimize">
              <Button size="lg" variant="secondary" icon={<Settings className="w-5 h-5" />}>Try Optimizer</Button>
            </Link>
          </div>
        </section>

        {/* H2: FORGE CALCULATOR */}
        <section id="calculator" className="scroll-mt-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Forge Calculator</h2>
            <p className="text-gray-500">Select ores, adjust quantities, and see real-time forging probabilities</p>
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
                <p className="text-sm text-gray-500">All 88 ores with stats & locations</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Browse complete ore data including multipliers, rarity, traits, and drop locations for World 1, World 2, and World 3.
            </p>
            <Link href="/ores">
              <Button variant="secondary" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                View All Ores
              </Button>
            </Link>
          </Card>

          <Card className="p-6" hoverEffect>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-indigo/20 rounded-lg">
                <Swords className="w-6 h-6 text-accent-indigo" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Weapons & Armor</h2>
                <p className="text-sm text-gray-500">42 weapons, 21 armor pieces</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Explore all weapon categories (Dagger, Katana, Great Sword, Colossal) and armor classes with DPS rankings.
            </p>
            <Link href="/optimize">
              <Button variant="secondary" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                Explore Equipment
              </Button>
            </Link>
          </Card>
        </section>

        {/* H2: BEST FORGE SETUPS */}
        <section className="border-t border-white/5 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Best Forge Setups</h2>
            <p className="text-gray-500">Community-tested recipes for different playstyles</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Beginner Setups
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Low-cost recipes using common ores for early game progression. Perfect for World 1-2.
              </p>
              <ul className="text-xs text-gray-500 space-y-2">
                <li>• Iron + Gold (12 ores) → Katana</li>
                <li>• Silver + Platinum (15 ores) → Straight Sword</li>
                <li>• Diamond + Ruby (20 ores) → Great Sword</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                DPS Meta Builds
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Maximum damage output builds using trait synergies. For experienced players.
              </p>
              <ul className="text-xs text-gray-500 space-y-2">
                <li>• Eye Ore + Mythril + Lightite → Katana</li>
                <li>• Darkryte + Arcane + Demonite → Colossal</li>
                <li>• Iceite + Gargantuan → Heavy Weapon</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <ShieldIcon className="w-5 h-5 text-blue-500" />
                Tank Armor Builds
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Maximum defense and survivability. Essential for The Peak boss fights.
              </p>
              <ul className="text-xs text-gray-500 space-y-2">
                <li>• Obsidian + Mythril (35 ores) → Heavy Armor</li>
                <li>• Darkryte + Magmaite → Defense + Burn</li>
                <li>• Sanctis + Velchire → Holy Tank</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* H2: HOW TO USE */}
        <section className="border-t border-white/5 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">How to Use ForgeCalc</h2>
            <p className="text-gray-500">Get accurate forging predictions in 5 simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: "1", title: "Select World", desc: "Choose W1/W2 or W3 to filter available ores" },
              { step: "2", title: "Choose Mode", desc: "Switch between Weapon or Armor forging" },
              { step: "3", title: "Add Ores", desc: "Click ores and adjust quantities (3-51 for weapons)" },
              { step: "4", title: "Check Traits", desc: "Ensure key ores reach 30% for max trait power" },
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
        <section className="border-t border-white/5 pt-12">
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
        <section className="border-t border-white/5 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Clock className="w-8 h-8 text-accent-blue" />
              Changelog
            </h2>
            <p className="text-gray-500">Recent updates and data changes</p>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-6">
            {[
              { ver: "v20260201", date: "Feb 1, 2026", changes: ["Added all 88 ores with complete data", "Implemented 50+ unit tests for calculation accuracy", "Added World 1/2 vs World 3 ore filtering", "URL sharing for forge setups"] },
              { ver: "v20260115", date: "Jan 15, 2026", changes: ["Added Frostspire Expanse ores", "Fixed trait activation threshold calculation", "Mobile UI improvements"] },
              { ver: "v20260101", date: "Jan 1, 2026", changes: ["Initial release with core calculator", "42 weapons, 21 armor pieces", "Basic probability tables"] }
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Forge the Ultimate Gear?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of players using ForgeCalc to optimize their crafting. No signup required – start calculating now.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#calculator">
              <Button size="lg" icon={<Calculator className="w-5 h-5" />}>Start Calculating</Button>
            </Link>
            <Link href="/ores">
              <Button size="lg" variant="secondary" icon={<BookOpen className="w-5 h-5" />}>Browse All Ores</Button>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
