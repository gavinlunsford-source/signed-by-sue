import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { urlFor } from '@/sanity/image';
import type { PortfolioProject } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
  weddings: 'Wedding',
  graduations: 'Graduation',
  'missionary-farewells': 'Missionary Farewell',
  showers: 'Shower',
  birthdays: 'Birthday',
  'mirrors-glass': 'Mirror & Glass',
  'custom-artwork': 'Custom Artwork',
};

const PLACEHOLDER_GRADIENTS = [
  'from-blush/60 to-rose/30',
  'from-cream to-blush/50',
  'from-sage/20 to-blush/40',
  'from-rose/20 to-cream',
  'from-blush/40 to-sage/20',
  'from-cream to-rose/20',
];

interface FeaturedWorkProps {
  projects?: PortfolioProject[];
}

export default function FeaturedWork({ projects = [] }: FeaturedWorkProps) {
  const displayProjects = (projects ?? []).slice(0, 6);

  return (
    <section className="py-24 md:py-32 bg-warm-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <SectionHeader
            label="Portfolio"
            headline="Featured Work"
            subtext="A glimpse into recent pieces — each one made with intention for a moment that deserves to be remembered."
            align="left"
          />
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-dark transition-colors shrink-0 group"
          >
            View Full Portfolio
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {displayProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project, i) => (
              <Link
                key={project._id}
                href={`/portfolio`}
                className="group relative overflow-hidden rounded-2xl bg-cream aspect-[4/5] block shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {project.images?.[0] ? (
                  <Image
                    src={urlFor(project.images[0]).width(600).height(750).url()}
                    alt={project.images[0].alt ?? project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${PLACEHOLDER_GRADIENTS[i % PLACEHOLDER_GRADIENTS.length]} flex items-center justify-center`}>
                    <span className="font-display text-4xl text-ink/20 italic">
                      {project.title?.[0] ?? 'S'}
                    </span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category pill */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-ink text-xs tracking-wide rounded-full">
                    {CATEGORY_LABELS[project.category] ?? project.category}
                  </span>
                </div>

                {/* Title on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="font-display text-xl text-white">{project.title}</p>
                  {project.clientName && (
                    <p className="text-xs text-white/60 mt-1">For {project.clientName}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Placeholder grid when no CMS data yet */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLACEHOLDER_GRADIENTS.map((gradient, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} aspect-[4/5] shadow-sm`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="font-display text-6xl text-ink/10 italic">S</span>
                  <p className="text-xs text-muted tracking-widest uppercase">
                    {['Weddings', 'Graduations', 'Missionary Farewells', 'Showers', 'Mirrors & Glass', 'Custom Artwork'][i]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
