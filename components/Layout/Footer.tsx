import React from 'react';
import Link from 'next/link';
import { Hammer } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-surface/30 mt-24">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Hammer className="w-5 h-5 text-gray-400" />
              <span className="font-bold text-white tracking-tight">Forge Calc</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Forged for builders. The most accurate simulation tool for optimizing your in-game crafting economy.
            </p>
            <div className="inline-block px-2 py-1 bg-surface-highlight rounded border border-white/5 text-[10px] text-gray-400 font-mono">
              v2.4.0 (Raven Cave Updated)
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4 text-sm">Tools</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/#calculator" className="hover:text-accent-blue transition-colors">
                  Forge Calculator
                </Link>
              </li>
              <li>
                <Link href="/optimize" className="hover:text-accent-blue transition-colors">
                  Inventory Optimizer
                </Link>
              </li>
              <li>
                <span className="text-gray-600" title="Coming soon">
                  Reroll Odds
                </span>
              </li>
              <li>
                <Link href="/ores" className="hover:text-accent-blue transition-colors">
                  Ore Chances <span className="text-xs text-accent-indigo ml-1">NEW</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/ores" className="hover:text-accent-blue transition-colors">
                  Mini Wiki
                </Link>
              </li>
              <li>
                <Link href="/#setups" className="hover:text-accent-blue transition-colors">
                  Best Setups
                </Link>
              </li>
              <li>
                <span className="text-gray-600" title="Coming soon">
                  API Docs
                </span>
              </li>
              <li>
                <Link href="/#changelog" className="hover:text-accent-blue transition-colors">
                  Update Log
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <span className="text-gray-600" title="Coming soon">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-gray-600" title="Coming soon">
                  Terms of Service
                </span>
              </li>
              <li>
                <Link href="/#disclaimer" className="hover:text-gray-300 transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <span className="text-gray-600" title="Coming soon">
                  Cookie Settings
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p id="disclaimer" className="text-xs text-gray-600 text-center md:text-left">
            © 2026 ForgeCalc. Fan-made website. Not affiliated with Roblox or the game developers.
          </p>
          <div className="flex gap-4">
             {/* Social icons placeholders */}
             <div className="w-5 h-5 bg-gray-800 rounded-full opacity-50"></div>
             <div className="w-5 h-5 bg-gray-800 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;