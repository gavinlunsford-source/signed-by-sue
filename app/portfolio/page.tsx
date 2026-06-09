import type { Metadata } from 'next';
import PortfolioGallery from '@/components/portfolio/PortfolioGallery';
import { getPortfolioProjects } from '@/sanity/queries';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Browse custom hand-painted signs for weddings, graduations, missionary farewells, showers, birthdays, and more.',
};

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects().catch(() => []);

  return (
    <div className="min-h-screen bg-warm-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Page header */}
        <div className="text-center mb-16">
          <p className="label-line text-xs tracking-[0.2em] uppercase text-gold mb-4">
            The Work
          </p>
          <h1 className="font-display font-light text-5xl md:text-6xl text-ink mb-4">
            Portfolio
          </h1>
          <p className="text-base text-ink-light max-w-xl mx-auto leading-relaxed">
            Every piece is one-of-a-kind, made by hand for a moment that matters.
            Browse by category or explore everything below.
          </p>
        </div>

        <PortfolioGallery projects={projects} />

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-ink-light mb-4">Don&apos;t see what you&apos;re looking for?</p>
          <a
            href="/quote"
            className="inline-flex items-center gap-2 px-8 py-4 bg-ink text-white text-sm tracking-wide rounded-full hover:bg-ink-light transition-colors"
          >
            Request a Custom Piece →
          </a>
        </div>
      </div>
    </div>
  );
}
