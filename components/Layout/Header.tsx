'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Hammer } from 'lucide-react';
import Button from '../UI/Button';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Calculator', href: '/#calculator' },
    { label: 'Optimizer', href: '/optimize' },
    { label: 'Ores', href: '/ores' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-void/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-accent-blue/20 to-accent-indigo/20 rounded-md border border-accent-blue/20">
              <Hammer className="w-5 h-5 text-accent-blue" />
            </div>
            <span className="font-bold text-white tracking-tight">Forge Calc</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild size="sm" variant="secondary">
              <Link href="/optimize">Try Optimizer</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-white/5 bg-surface p-4 space-y-4 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block text-base font-medium text-gray-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/5">
            <Button asChild className="w-full">
              <Link href="/optimize" onClick={() => setIsOpen(false)}>
                Try Optimizer
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
