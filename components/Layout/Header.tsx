'use client';

import React, { useState } from 'react';
import { Menu, X, Hammer, ChevronDown, Github } from 'lucide-react';
import Button from '../UI/Button';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Calculators', href: '#calculators', hasDropdown: true },
    { label: 'Guides', href: '#guides', hasDropdown: true },
    { label: 'Feedback', href: '#feedback' }
  ];

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-void/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-accent-blue/20 to-accent-indigo/20 rounded-md border border-accent-blue/20">
              <Hammer className="w-5 h-5 text-accent-blue" />
            </div>
            <span className="font-bold text-white tracking-tight">Forge Calc</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <Button size="sm" variant="secondary">Sign In</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-white/5 bg-surface p-4 space-y-4 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block text-base font-medium text-gray-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-4 border-t border-white/5">
            <Button className="w-full">Sign In</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;