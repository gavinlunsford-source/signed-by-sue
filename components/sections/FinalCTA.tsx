import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FinalCTAProps {
  headline?: string;
  subtext?: string;
}

export default function FinalCTA({
  headline = 'Ready to Create Something Unforgettable?',
  subtext = "Every sign starts with a conversation. Tell me about your event and I'll bring your vision to life.",
}: FinalCTAProps) {
  return (
    <section className="py-24 md:py-32 bg-cream relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-blush opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-blush/30 opacity-30" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <p className="label-line text-xs tracking-[0.2em] uppercase text-gold mb-6">
          Let&apos;s Work Together
        </p>

        <h2 className="font-display font-light text-4xl md:text-6xl text-ink leading-tight mb-6">
          {headline}
        </h2>

        <p className="text-base md:text-lg text-ink-light leading-relaxed mb-10 max-w-xl mx-auto">
          {subtext}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/quote"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink text-white text-sm tracking-wide rounded-full hover:bg-ink-light transition-all duration-200 group"
          >
            Start Your Custom Order
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-8 py-4 border border-ink/20 text-ink text-sm tracking-wide rounded-full hover:border-ink/50 transition-colors"
          >
            View Pricing
          </Link>
        </div>

        <p className="text-xs text-muted mt-8">
          Responses within 24–48 hours · Rush orders available
        </p>
      </div>
    </section>
  );
}
