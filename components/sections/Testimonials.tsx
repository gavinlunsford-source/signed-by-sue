import Image from 'next/image';
import { Star } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { urlFor } from '@/sanity/image';
import type { Testimonial } from '@/types';

const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    _id: '1',
    _type: 'testimonial',
    name: 'Sarah M.',
    role: 'Bride, May 2024',
    quote:
      "The welcome sign she made for our wedding was absolutely breathtaking. Everyone stopped to admire it. It's now hanging in our home as a permanent reminder of the most beautiful day.",
    rating: 5,
  },
  {
    _id: '2',
    _type: 'testimonial',
    name: 'The Johnson Family',
    role: 'Graduation Party',
    quote:
      'She captured exactly what we envisioned and more. The level of detail and personalization made it feel so special. Our daughter cried when she saw it — the best reaction.',
    rating: 5,
  },
  {
    _id: '3',
    _type: 'testimonial',
    name: 'Emma R.',
    role: 'Baby Shower',
    quote:
      "I cannot believe how quickly she turned around our order. The quality is incredible, and the communication throughout was so reassuring. Highly recommend for any occasion!",
    rating: 5,
  },
];

interface TestimonialsProps {
  testimonials?: Testimonial[];
  headline?: string;
}

export default function Testimonials({ testimonials, headline = 'Words from Clients' }: TestimonialsProps) {
  const display = testimonials && testimonials.length > 0 ? testimonials : PLACEHOLDER_TESTIMONIALS;

  return (
    <section className="py-24 md:py-32 bg-ink relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-gold/5 rounded-full blur-2xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          label="Testimonials"
          headline={headline}
          subtext="Real words from the people who trusted me with their most meaningful moments."
          light
          className="mb-16"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {display.slice(0, 3).map((t) => (
            <div
              key={t._id}
              className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col gap-5 hover:bg-white/[0.07] transition-colors duration-200"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                  <Star key={i} size={13} className="text-gold fill-gold" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-display text-lg text-white/80 italic leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                {t.photo ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={urlFor(t.photo).width(80).height(80).url()}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gold/20 shrink-0 flex items-center justify-center">
                    <span className="font-display text-sm text-gold">{t.name[0]}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm text-white font-medium">{t.name}</p>
                  {t.role && <p className="text-xs text-white/40 mt-0.5">{t.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
