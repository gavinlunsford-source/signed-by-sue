import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import QuoteEstimator from '@/components/pricing/QuoteEstimator';
import { getFaqs } from '@/sanity/queries';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent pricing for custom hand-painted signs. All projects start at $40. Use the estimator to build your quote.',
};

const STARTING_PRICES = [
  { label: 'Wedding Signs', price: '$40' },
  { label: 'Graduation Signs', price: '$40' },
  { label: 'Missionary Farewell', price: '$40' },
  { label: 'Bridal & Baby Showers', price: '$40' },
  { label: 'Birthday & Event Signs', price: '$40' },
  { label: 'Mirror Signs', price: '$60' },
  { label: 'Custom Artwork', price: 'Quote' },
];

export default async function PricingPage() {
  const faqData = await getFaqs().catch(() => []);

  return (
    <div className="min-h-screen bg-warm-white pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="label-line text-xs tracking-[0.2em] uppercase text-gold mb-4">Transparent Pricing</p>
          <h1 className="font-display font-light text-5xl md:text-6xl text-ink mb-4">Pricing</h1>
          <p className="text-base text-ink-light max-w-xl mx-auto leading-relaxed">
            Every project starts at $40. Use the builder below to get an instant estimate based on size, complexity, and material.
          </p>
        </div>

        {/* Starting prices strip */}
        <div className="bg-cream rounded-2xl px-6 py-6 mb-16">
          <p className="text-xs tracking-[0.2em] uppercase text-muted text-center mb-5">Starting Prices</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {STARTING_PRICES.map(({ label, price }) => (
              <div key={label} className="text-center">
                <p className="font-display text-2xl text-gold mb-1">{price}</p>
                <p className="text-xs text-muted leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Estimator */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <p className="label-line text-xs tracking-[0.2em] uppercase text-gold mb-3">Price Calculator</p>
            <h2 className="font-display font-light text-4xl text-ink">Estimate Your Order</h2>
          </div>
          <QuoteEstimator />
        </div>

        {/* What to expect */}
        <div className="bg-cream rounded-3xl p-10 md:p-12 mb-16">
          <h2 className="font-display font-light text-3xl text-ink mb-8 text-center">What to Expect</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Turnaround Time',
                body: 'Standard orders take 1–2 weeks. Rush orders available for an additional fee — within 7 days (+$15) or within 3 days (+$25), subject to availability.',
              },
              {
                title: "What's Included",
                body: 'Your quote includes the sign and up to two design revision rounds. Additional revisions, rush fees, and shipping are quoted separately.',
              },
              {
                title: 'Payment',
                body: 'A 50% deposit is required to begin. The balance is due before delivery. Venmo, PayPal, and Zelle accepted.',
              },
            ].map(({ title, body }) => (
              <div key={title}>
                <h3 className="font-display text-xl text-ink mb-2">{title}</h3>
                <p className="text-sm leading-relaxed text-ink-light">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        {faqData.length > 0 && (
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-light text-4xl text-ink text-center mb-10">Frequently Asked Questions</h2>
            <div className="flex flex-col divide-y divide-border">
              {faqData.map((faq) => (
                <details key={faq._id} className="group py-5 cursor-pointer">
                  <summary className="flex items-center justify-between gap-4 list-none">
                    <span className="font-display text-xl text-ink">{faq.question}</span>
                    <ChevronDown size={18} className="text-muted shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 text-sm leading-relaxed text-ink-light prose prose-sm max-w-none">
                    <PortableText value={faq.answer} />
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <p className="font-display text-2xl text-ink mb-4">Ready to get started?</p>
          <Link href="/quote" className="inline-flex items-center gap-2 px-8 py-4 bg-ink text-white text-sm tracking-wide rounded-full hover:bg-ink-light transition-colors">
            Request a Custom Quote →
          </Link>
        </div>

      </div>
    </div>
  );
}
