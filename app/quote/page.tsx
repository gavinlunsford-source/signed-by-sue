import type { Metadata } from 'next';
import QuoteWizard from '@/components/quote/QuoteWizard';

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
    <div className="min-h-screen bg-warm-white pt-28 pb-32">
      <div className="max-w-2xl mx-auto px-5">
        <div className="text-center mb-10">
          <p className="label-line text-xs tracking-[0.2em] uppercase text-gold mb-3">Let&apos;s Work Together</p>
          <h1 className="font-display font-light text-4xl md:text-5xl text-ink mb-3">Request a Quote</h1>
          <p className="text-sm text-muted">4 quick steps · No commitment · Response within 48 hours</p>
        </div>
        <QuoteWizard prefill={params} />
      </div>
    </div>
  );
}
