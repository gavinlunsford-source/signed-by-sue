'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BASE_PRICE, SIGN_SIZES, COMPLEXITY_OPTIONS, MATERIAL_OPTIONS, RUSH_OPTIONS } from '@/lib/utils';

export default function QuoteEstimator() {
  const [size, setSize] = useState<number | null>(null);
  const [complexity, setComplexity] = useState<number | null>(null);
  const [material, setMaterial] = useState<number | null>(null); // null = special
  const [rush, setRush] = useState<number>(0);

  const isSpecialMaterial = material === -1;
  const total =
    size !== null && complexity !== null && material !== null && !isSpecialMaterial
      ? BASE_PRICE + size + complexity + material + rush
      : null;

  const lineItems = [
    { label: 'Base project', amount: BASE_PRICE, always: true },
    { label: 'Size', amount: size, always: false },
    { label: 'Design complexity', amount: complexity, always: false },
    { label: 'Material', amount: material === -1 ? null : material, always: false },
    { label: 'Rush fee', amount: rush > 0 ? rush : null, always: false },
  ];

  const btnBase = 'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150';
  const btnActive = 'border-gold bg-gold/10 text-ink font-medium';
  const btnInactive = 'border-border bg-white text-ink-light hover:border-gold/40';

  return (
    <div className="bg-white border border-border rounded-3xl p-8 md:p-10 shadow-sm">
      <h3 className="font-display text-3xl text-ink mb-1">Build Your Quote</h3>
      <p className="text-sm text-muted mb-8">Every project starts at ${BASE_PRICE}. Select your options below.</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left — options */}
        <div className="flex flex-col gap-6">

          {/* Size */}
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-muted mb-3">1. Size</p>
            <div className="flex flex-col gap-2">
              {SIGN_SIZES.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSize(s.adder)}
                  className={`${btnBase} ${size === s.adder ? btnActive : btnInactive}`}
                >
                  <div className="flex justify-between items-center">
                    <span>{s.label}</span>
                    <span className={size === s.adder ? 'text-gold' : 'text-muted'}>
                      {s.adder === 0 ? '+$0' : `+$${s.adder}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Complexity */}
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-muted mb-3">2. Design Complexity</p>
            <div className="flex flex-col gap-2">
              {COMPLEXITY_OPTIONS.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setComplexity(c.adder)}
                  className={`${btnBase} ${complexity === c.adder ? btnActive : btnInactive}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span>{c.label}</span>
                      <span className="text-xs text-muted ml-2">— {c.description}</span>
                    </div>
                    <span className={complexity === c.adder ? 'text-gold' : 'text-muted'}>
                      {c.adder === 0 ? '+$0' : `+$${c.adder}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-muted mb-3">3. Material</p>
            <div className="flex flex-col gap-2">
              {MATERIAL_OPTIONS.map((m) => {
                const val = m.adder === null ? -1 : m.adder;
                return (
                  <button
                    key={m.label}
                    onClick={() => setMaterial(val)}
                    className={`${btnBase} ${material === val ? btnActive : btnInactive}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{m.label}</span>
                      <span className={material === val ? 'text-gold' : 'text-muted'}>
                        {m.adder === null ? '+ cost' : m.adder === 0 ? '+$0' : `+$${m.adder}`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rush */}
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-muted mb-3">4. Rush Fee</p>
            <div className="flex flex-col gap-2">
              {RUSH_OPTIONS.map((r) => (
                <button
                  key={r.label}
                  onClick={() => setRush(r.adder)}
                  className={`${btnBase} ${rush === r.adder ? btnActive : btnInactive}`}
                >
                  <div className="flex justify-between items-center">
                    <span>{r.label}</span>
                    <span className={rush === r.adder ? 'text-gold' : 'text-muted'}>
                      {r.adder === 0 ? '' : `+$${r.adder}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — running total */}
        <div className="md:sticky md:top-8 self-start">
          <div className="bg-cream border border-blush rounded-2xl p-6">
            <p className="text-xs tracking-[0.15em] uppercase text-muted mb-5">Your Estimate</p>

            <div className="flex flex-col gap-3 mb-5">
              {lineItems.map(({ label, amount, always }) => {
                if (!always && amount === null) return null;
                return (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span className="text-ink-light">{label}</span>
                    <span className="text-ink font-medium">
                      {amount === null ? '—' : `$${amount}`}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-blush pt-4 mb-6">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-ink-light">Total</span>
                <span className="font-display text-4xl text-ink">
                  {isSpecialMaterial
                    ? 'Custom'
                    : total !== null
                    ? `$${total}`
                    : '—'}
                </span>
              </div>
              {isSpecialMaterial && (
                <p className="text-xs text-muted mt-1">Special material cost added at quote</p>
              )}
              {total === null && !isSpecialMaterial && (
                <p className="text-xs text-muted mt-1">Select all options to see your total</p>
              )}
            </div>

            <Link
              href="/quote"
              className="block text-center px-6 py-3 bg-ink text-white text-sm tracking-wide rounded-full hover:bg-ink-light transition-colors"
            >
              Request This Quote →
            </Link>
            <p className="text-xs text-center text-muted mt-3">
              The earlier you order, the better!
            </p>
          </div>

          {/* Example quotes */}
          <div className="mt-6">
            <p className="text-xs tracking-[0.15em] uppercase text-muted mb-3">Example Quotes</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Graduation sign', total: 50, note: 'Small + decorative' },
                { label: 'Large wedding sign', total: 70, note: 'Large + decorative' },
                { label: 'Mirror welcome sign', total: 70, note: 'Small + mirror + decorative' },
                { label: 'Detailed wedding sign', total: 80, note: 'Large + detailed artwork' },
              ].map(({ label, total, note }) => (
                <div key={label} className="flex justify-between items-center text-sm py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-ink">{label}</p>
                    <p className="text-xs text-muted">{note}</p>
                  </div>
                  <span className="font-display text-xl text-gold">${total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
