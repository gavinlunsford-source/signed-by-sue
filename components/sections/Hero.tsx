import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { urlFor } from '@/sanity/image';
import type { SanityImage } from '@/types';

interface HeroProps {
  headline?: string;
  subheadline?: string;
  cta?: string;
  heroImage?: SanityImage;
}

export default function Hero({
  headline = "Custom Hand-Painted Signs for Life's Biggest Moments",
  subheadline = 'Custom artwork for weddings, graduations, missionary farewells, showers, birthdays, and celebrations of every kind.',
  cta = 'Get a Custom Quote',
  heroImage,
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-cream via-warm-white to-blush/20">
      {/* Soft background accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blush/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-rose/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16">
        <div className={`grid gap-12 items-center ${heroImage ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-4xl'}`}>

          {/* Text */}
          <div>
            <p className="label-line text-xs tracking-[0.2em] uppercase text-gold mb-6">
              Handmade with Love
            </p>
            <h1 className="font-display font-light text-5xl sm:text-6xl md:text-7xl leading-tight text-ink mb-6">
              {headline}
            </h1>
            <p className="text-lg text-ink-light leading-relaxed max-w-xl mb-8">
              {subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink text-white text-sm tracking-wide rounded-full hover:bg-ink-light transition-all duration-200 group"
              >
                {cta}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 border border-ink/20 text-ink text-sm tracking-wide rounded-full hover:border-ink/60 transition-colors"
              >
                View Portfolio
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10 pt-10 border-t border-border">
              <div className="text-center">
                <div className="font-display text-3xl text-ink">100%</div>
                <div className="text-xs text-muted tracking-wide mt-1">Handmade</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="font-display text-3xl text-ink">Custom</div>
                <div className="text-xs text-muted tracking-wide mt-1">Every Piece</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="font-display text-3xl text-ink">★ 5.0</div>
                <div className="text-xs text-muted tracking-wide mt-1">Client Reviews</div>
              </div>
            </div>
          </div>

          {/* Image — only shown if set in Sanity */}
          {heroImage && (
            <div className="relative hidden lg:block">
              {/* Decorative offset border */}
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border border-blush" />
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-xl">
                <Image
                  src={urlFor(heroImage).width(900).height(1125).url()}
                  alt="Signed by Sue — custom hand-painted signs"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 0vw, 45vw"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
