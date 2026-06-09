'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isHome = pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome || open
          ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group">
          <span
            className={`font-display text-2xl font-medium tracking-wide transition-colors ${
              scrolled || !isHome ? 'text-ink' : 'text-ink'
            }`}
          >
            Signed by Sue
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted mt-0.5">
            Made by Hand. Made for Memories.
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm tracking-wide transition-colors hover:text-gold ${
                pathname === href ? 'text-gold' : 'text-ink-light'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/quote"
            className="ml-4 px-6 py-2.5 bg-ink text-white text-sm tracking-wide rounded-full hover:bg-ink-light transition-colors"
          >
            Request a Quote
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-border px-6 pb-8 pt-4 flex flex-col gap-5">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-base tracking-wide transition-colors ${
                pathname === href ? 'text-gold' : 'text-ink-light'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/quote"
            className="mt-2 text-center px-6 py-3 bg-ink text-white text-sm tracking-wide rounded-full hover:bg-ink-light transition-colors"
          >
            Request a Quote
          </Link>
        </div>
      )}
    </header>
  );
}
