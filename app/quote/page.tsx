import type { Metadata } from 'next';
import QuoteForm from '@/components/quote/QuoteForm';

export const metadata: Metadata = {
  title: 'Request a Quote',
  description: "Start your custom sign order. Tell me about your event and I'll be in touch within 24–48 hours.",
};

interface QuotePageProps {
  searchParams: Promise<{ size?: string; complexity?: string; material?: string; rush?: string }>;
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-warm-white pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="label-line text-xs tracking-[0.2em] uppercase text-gold mb-4">Let&apos;s Work Together</p>
          <h1 className="font-display font-light text-5xl md:text-6xl text-ink mb-4">Request a Quote</h1>
          <p className="text-base text-ink-light max-w-lg mx-auto leading-relaxed">
            Tell me about your event and vision. I&apos;ll get back to you within 24–48 hours with pricing and next steps.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {['✦ No commitment required', '✦ Response within 48 hours', '✦ Rush orders available'].map((item) => (
            <span key={item} className="text-xs text-muted tracking-wide">{item}</span>
          ))}
        </div>

        <QuoteForm prefill={params} />
      </div>
    </div>
  );
}
