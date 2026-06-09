'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { PORTFOLIO_CATEGORIES } from '@/lib/utils';
import { urlFor } from '@/sanity/image';
import type { PortfolioProject, PortfolioCategory } from '@/types';

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
  'from-blush/30 to-blush/60',
  'from-sage/30 to-cream',
];

interface PortfolioGalleryProps {
  projects: PortfolioProject[];
  initialCategory?: string;
}

export default function PortfolioGallery({ projects, initialCategory = 'all' }: PortfolioGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [lightboxProject, setLightboxProject] = useState<PortfolioProject | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  const filtered =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.categories?.includes(activeCategory as PortfolioCategory));

  const openLightbox = (project: PortfolioProject, imgIndex = 0) => {
    setLightboxProject(project);
    setLightboxImageIndex(imgIndex);
  };

  const closeLightbox = () => setLightboxProject(null);

  const prevImage = () =>
    setLightboxImageIndex((i) =>
      i > 0 ? i - 1 : (lightboxProject?.images?.length ?? 1) - 1
    );

  const nextImage = () =>
    setLightboxImageIndex((i) =>
      i < (lightboxProject?.images?.length ?? 1) - 1 ? i + 1 : 0
    );

  return (
    <>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-5 py-2 rounded-full text-sm tracking-wide transition-all ${
            activeCategory === 'all'
              ? 'bg-ink text-white'
              : 'bg-cream text-ink-light hover:bg-blush'
          }`}
        >
          All Work
        </button>
        {PORTFOLIO_CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={`px-5 py-2 rounded-full text-sm tracking-wide transition-all ${
              activeCategory === value
                ? 'bg-ink text-white'
                : 'bg-cream text-ink-light hover:bg-blush'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      {filtered.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {filtered.map((project, i) => (
            <div
              key={project._id}
              className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300"
              onClick={() => openLightbox(project)}
            >
              {project.images?.[0] ? (
                <Image
                  src={urlFor(project.images[0]).width(700).url()}
                  alt={project.images[0].alt ?? project.title}
                  width={700}
                  height={875}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className={`bg-gradient-to-br ${PLACEHOLDER_GRADIENTS[i % PLACEHOLDER_GRADIENTS.length]} aspect-[4/5] flex items-center justify-center`}>
                  <span className="font-display text-5xl text-ink/10 italic">S</span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                {(project.categories ?? []).slice(0, 2).map((cat) => (
                  <span key={cat} className="px-3 py-1 bg-white/80 backdrop-blur-sm text-ink text-xs tracking-wide rounded-full">
                    {CATEGORY_LABELS[cat] ?? cat}
                  </span>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="font-display text-xl text-white">{project.title}</p>
                {project.clientName && (
                  <p className="text-xs text-white/60 mt-1">For {project.clientName}</p>
                )}
                {project.images && project.images.length > 1 && (
                  <p className="text-xs text-white/50 mt-1">{project.images.length} photos</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Placeholder state */
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {PLACEHOLDER_GRADIENTS.map((gradient, i) => (
            <div key={i} className="break-inside-avoid">
              <div className={`bg-gradient-to-br ${gradient} aspect-[4/5] rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm`}>
                <span className="font-display text-5xl text-ink/10 italic">S</span>
                <p className="text-xs text-muted tracking-widest uppercase">Coming Soon</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxProject && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxProject.images?.[lightboxImageIndex] ? (
              <Image
                src={urlFor(lightboxProject.images[lightboxImageIndex]).width(1200).url()}
                alt={lightboxProject.images[lightboxImageIndex].alt ?? lightboxProject.title}
                width={1200}
                height={900}
                className="max-h-[80vh] w-full object-contain rounded-lg"
              />
            ) : (
              <div className="aspect-video bg-cream rounded-lg flex items-center justify-center">
                <span className="font-display text-8xl text-ink/20 italic">S</span>
              </div>
            )}

            <div className="mt-4 text-center">
              <p className="font-display text-2xl text-white">{lightboxProject.title}</p>
              {lightboxProject.clientName && (
                <p className="text-sm text-white/50 mt-1">For {lightboxProject.clientName}</p>
              )}
            </div>

            {lightboxProject.images && lightboxProject.images.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={prevImage}
                  className="px-4 py-2 bg-white/10 text-white text-sm rounded-full hover:bg-white/20 transition-colors"
                >
                  ← Prev
                </button>
                <span className="text-white/50 text-xs">
                  {lightboxImageIndex + 1} / {lightboxProject.images.length}
                </span>
                <button
                  onClick={nextImage}
                  className="px-4 py-2 bg-white/10 text-white text-sm rounded-full hover:bg-white/20 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
