import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import PricingCard from '@/components/pricing/PricingCard';
import QuoteEstimator from '@/components/pricing/QuoteEstimator';
import { getPricing, getFaqs } from '@/sanity/queries';
import { PortableText } from '@portabletext/react';
import type { PricingItem } from '@/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent pricing for custom hand-painted signs. Wedding signs starting at $40. Use the estimator to get a quick ballpark.',
};

const DEFAULT_PRICING: PricingItem[] = [
  {
    _id: '1', _type: 'pricing', title: 'Wedding Signs', startingPrice: 40, isCustomQuote: false, sortOrder: 1,
    description: 'Welcome signs, seating charts, bar menus, vow signs, and more.',
    features: ['Fully custom design', 'Choice of size and material', 'Multiple lettering styles', 'Coordination with your aesthetic'],
  },
  {
    _id: '2', _type: 'pricing', title: 'Graduation Signs', startingPrice: 40, isCustomQuote: false, sortOrder: 2,
    description: 'Personalized signs featuring names, schools, and milestone details.',
    features: ['Name and year lettering', 'School colors or themes', 'Photo-worthy design', 'Keepsake quality'],
  },
  {
    _id: '3', _type: 'pricing', title: 'Missionary Farewell Signs', startingPrice: 40, isCustomQuote: false, sortOrder: 3,
    description: 'Honor the calling with a beautiful handmade tribute.',
    features: ['Mission name and dates', 'Scripture or quotes', 'Custom colors', 'Framing-ready finish'],
  },
  {
    _id: '4', _type: 'pricing', title: 'Mirror & Glass Signs', startingPrice: 60, isCustomQuote: false, sortOrder: 4,
    description: 'Hand-lettered mirrors for weddings, nurseries, and home décor.',
    features: ['Premium mirror quality', 'Gold or white paint options', 'Keepsake and décor ready', 'Various sizes available'],
  },
  {
    _id: '5', _type: 'pricing', title: 'Custom Artwork', isCustomQuote: true, sortOrder: 5,
    description: 'One-of-a-kind pieces tailored entirely to your vision — portraits, illustrations, home décor, and beyond.',
    features: ['Fully custom concept', 'Collaborative design process', 'Any size, material, or style', 'Quoted individually'],
  },
];

export default async function PricingPage() {
  const [pricingData, faqData] = await Promise.allSettled([
    getPricing(),
    getFaqs(),
  ]);

  const pricing = pricingData.status === 'fulfilled' && pricingData.value.length > 0
    ? pricingData.value
    : DEFAULT_PRICING;

  const faqs = faqData.status === 'fulfilled' ? faqData.value : [];

  return (
    <div className="min-h-screen bg-warm-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="label-line text-xs tracking-[0.2em] uppercase text-gold mb-4">Transparent Pricing</p>
          <h1 className="font-display font-light text-5xl md:text-6xl text-ink mb-4">
            Pricing
          </h1>
          <p className="text-base text-ink-light max-w-xl mx-auto leading-relaxed">
            Every piece is priced based on size, material, and complexity. The prices below are starting points — use the estimator to get a ballpark, then request a quote for the exact number.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {pricing.map((item) => (
            <PricingCard key={item._id} item={item} />
          ))}
        </div>

        {/* Estimator */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <p className="label-line text-xs tracking-[0.2em] uppercase text-gold mb-3">Price Calculator</p>
            <h2 className="font-display font-light text-4xl text-ink">Estimate Your Order</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <QuoteEstimator />
          </div>
        </div>

        {/* What to expect */}
        <div className="bg-cream rounded-3xl p-10 md:p-12 mb-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl text-ink mb-6 text-center">What to Expect</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Turnaround Time',
                  body: 'Standard orders take 1–2 weeks. Rush orders (under 1 week) are available for an additional fee, subject to current availability.',
                },
                {
                  title: 'What\'s Included',
                  body: 'Your quote includes the sign, packaging, and up to two design revision rounds. Additional revisions, rush fees, and shipping are quoted separately.',
                },
                {
                  title: 'Payment',
                  body: 'A 50% deposit is required to begin. The remaining balance is due before delivery. I accept Venmo, PayPal, and Zelle.',
                },
              ].map(({ title, body }) => (
                <div key={title}>
                  <h3 className="font-display text-xl text-ink mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed text-ink-light">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs */}
        {faqs.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-4xl text-ink text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col divide-y divide-border">
              {faqs.map((faq) => (
                <details key={faq._id} className="group py-5 cursor-pointer">
                  <summary className="flex items-center justify-between gap-4 list-none">
                    <span className="font-display text-xl text-ink">{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className="text-muted shrink-0 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <div className="mt-3 text-sm leading-relaxed text-ink-light prose prose-sm max-w-none">
                    <PortableText value={faq.answer} />
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
