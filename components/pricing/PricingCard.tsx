import Link from 'next/link';
import { Check } from 'lucide-react';
import type { PricingItem } from '@/types';

interface PricingCardProps {
  item: PricingItem;
}

export default function PricingCard({ item }: PricingCardProps) {
  return (
    <div className="bg-white border border-border rounded-2xl p-7 flex flex-col gap-5 hover:border-gold/40 hover:shadow-md transition-all duration-300">
      <div>
        <h3 className="font-display text-2xl text-ink mb-2">{item.title}</h3>
        <div className="text-3xl font-display text-gold">
          {item.isCustomQuote ? (
            <span>Custom Quote</span>
          ) : (
            <span>Starting at ${item.startingPrice}</span>
          )}
        </div>
      </div>

      {item.description && (
        <p className="text-sm leading-relaxed text-ink-light">{item.description}</p>
      )}

      {item.features && item.features.length > 0 && (
        <ul className="flex flex-col gap-2.5 flex-1">
          {item.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-light">
              <Check size={14} className="text-gold shrink-0 mt-0.5" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/quote"
        className="mt-auto inline-flex items-center justify-center px-6 py-3 bg-ink text-white text-sm tracking-wide rounded-full hover:bg-ink-light transition-colors"
      >
        {item.isCustomQuote ? 'Get a Quote' : 'Request This'}
      </Link>
    </div>
  );
}
