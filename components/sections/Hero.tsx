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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background — photo if set, otherwise gradient */}
      {heroImage ? (
        <>
          <Image
            src={urlFor(heroImage).width(1800).height(1200).url()}
            alt="Hero background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-white/60" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-cream via-warm-white to-blush/30" />
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-blush/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-rose/10 rounded-full blur-2xl" />
        </>
      )}

      <div className="absolute left-1/2 top-0 w-px h-20 bg-gradient-to-b from-transparent to-border opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-4xl">
          <p className="label-line text-xs tracking-[0.2em] uppercase text-gold mb-8">
            Handmade with Love
          </p>

          <h1 className="font-display font-light text-5xl sm:text-6xl md:text-7xl leading-tight text-ink mb-8">
            {headline}
          </h1>

          <p className="text-lg md:text-xl text-ink-light leading-relaxed max-w-2xl mb-10">
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

          <div className="flex items-center gap-6 mt-12 pt-12 border-t border-border">
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
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-12 bg-gradient-to-b from-ink to-transparent" />
        <p className="text-xs tracking-[0.2em] uppercase text-ink rotate-90 origin-center mt-2">Scroll</p>
      </div>
    </section>
  );
}
