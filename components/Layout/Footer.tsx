import React from 'react';
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
              <li><a href="#" className="hover:text-accent-blue transition-colors">Forge Calculator</a></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">Inventory Optimizer</a></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">Reroll Odds</a></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">Ore Chances <span className="text-xs text-accent-indigo ml-1">NEW</span></a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-accent-blue transition-colors">Mini Wiki</a></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">Best Setups</a></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">Update Log</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors">Disclaimer</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors">Cookie Settings</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600 text-center md:text-left">
            © 2024 Forge Calculator. Fan-made website. Not affiliated with Roblox or the game developers.
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