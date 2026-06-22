'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '#heat', label: 'Heat This Week' },
    { href: '#arsenal', label: 'Full Arsenal' },
    { href: '#free-tools', label: 'Free Tools' },
    { href: '/vst/eq-forge', label: 'Solo Pages' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan to-magenta flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#0A0A0F]" />
          </div>
          <div>
            <div className="font-semibold tracking-[-1.5px] text-xl">HEAT</div>
            <div className="text-[10px] text-text-muted -mt-1.5">by bZ</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="hover:text-cyan transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-cyan to-magenta group-hover:w-full transition-all" />
            </Link>
          ))}
          <Link 
            href="#free-tools" 
            className="px-6 py-2.5 rounded-full border border-white/20 hover:border-cyan/50 hover:bg-white/5 text-sm font-medium transition-all flex items-center gap-2"
          >
            Get Free Tools
          </Link>
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-white/10 glass px-6 py-6 flex flex-col gap-4 text-sm">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="py-2 hover:text-cyan transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link 
            href="#free-tools" 
            className="mt-2 px-6 py-3 rounded-full border border-white/20 text-center hover:border-cyan/50"
            onClick={() => setIsOpen(false)}
          >
            Get Free Tools
          </Link>
        </div>
      )}
    </nav>
  );
}