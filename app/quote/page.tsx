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
    <div className="min-h-screen bg-warm-white pt-24 pb-4">
      <div className="max-w-2xl mx-auto px-5">
        <div className="mb-6">
          <p className="label-line text-xs tracking-[0.2em] uppercase text-gold mb-2">Custom Sign Request</p>
          <h1 className="font-display font-light text-4xl text-ink">Request a Quote</h1>
        </div>
        <QuoteWizard prefill={params} />
      </div>
    </div>
  );
}
