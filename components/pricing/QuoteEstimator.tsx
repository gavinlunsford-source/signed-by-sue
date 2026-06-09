'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_PRICE, SIGN_SIZES, COMPLEXITY_OPTIONS, MATERIAL_OPTIONS, RUSH_OPTIONS } from '@/lib/utils';

export default function QuoteEstimator() {
  const router = useRouter();
  const [sizeLabel, setSizeLabel] = useState<string | null>(null);
  const [complexityLabel, setComplexityLabel] = useState<string | null>(null);
  const [materialLabel, setMaterialLabel] = useState<string | null>(null);
  const [rushLabel, setRushLabel] = useState<string>(RUSH_OPTIONS[0].label);

  const selectedSize = SIGN_SIZES.find((s) => s.label === sizeLabel);
  const selectedComplexity = COMPLEXITY_OPTIONS.find((c) => c.label === complexityLabel);
  const selectedMaterial = MATERIAL_OPTIONS.find((m) => m.label === materialLabel);
  const selectedRush = RUSH_OPTIONS.find((r) => r.label === rushLabel) ?? RUSH_OPTIONS[0];

  const isSpecialMaterial = selectedMaterial?.adder === null;

  const total =
    selectedSize && selectedComplexity && selectedMaterial && !isSpecialMaterial
      ? BASE_PRICE + selectedSize.adder + selectedComplexity.adder + (selectedMaterial.adder ?? 0) + selectedRush.adder
      : null;

  const handleRequestQuote = () => {
    const params = new URLSearchParams();
    if (sizeLabel) params.set('size', sizeLabel);
    if (complexityLabel) params.set('complexity', complexityLabel);
    if (materialLabel) params.set('material', materialLabel);
    if (rushLabel !== RUSH_OPTIONS[0].label) params.set('rush', rushLabel);
    router.push(`/quote?${params.toString()}`);
  };

  const btnBase = 'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150';
  const btnActive = 'border-gold bg-gold/10 text-ink font-medium';
  const btnInactive = 'border-border bg-white text-ink-light hover:border-gold/40';

  const lineItems = [
    { label: 'Base project', amount: BASE_PRICE as number | null },
    { label: 'Size', amount: selectedSize ? selectedSize.adder : null },
    { label: 'Design complexity', amount: selectedComplexity ? selectedComplexity.adder : null },
    { label: 'Material', amount: isSpecialMaterial ? null : selectedMaterial ? selectedMaterial.adder : null },
    { label: 'Rush fee', amount: selectedRush.adder > 0 ? selectedRush.adder : null },
  ];

  return (
    <div className="bg-white border border-border rounded-3xl p-8 md:p-10 shadow-sm">
      <h3 className="font-display text-3xl text-ink mb-1">Build Your Quote</h3>
      <p className="text-sm text-muted mb-8">Every project starts at ${BASE_PRICE}. Select your options to see your total.</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left — options */}
        <div className="flex flex-col gap-6">

          {/* Size */}
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-muted mb-3">1. Size</p>
            <div className="flex flex-col gap-2">
              {SIGN_SIZES.map((s) => (
                <button key={s.label} onClick={() => setSizeLabel(s.label)}
                  className={`${btnBase} ${sizeLabel === s.label ? btnActive : btnInactive}`}>
                  <div className="flex justify-between items-center">
                    <span>{s.label}</span>
                    <span className={sizeLabel === s.label ? 'text-gold' : 'text-muted'}>{s.adder === 0 ? '+$0' : `+$${s.adder}`}</span>
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
                <button key={c.label} onClick={() => setComplexityLabel(c.label)}
                  className={`${btnBase} ${complexityLabel === c.label ? btnActive : btnInactive}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span>{c.label}</span>
                      <span className="text-xs text-muted ml-2">— {c.description}</span>
                    </div>
                    <span className={complexityLabel === c.label ? 'text-gold' : 'text-muted'}>{c.adder === 0 ? '+$0' : `+$${c.adder}`}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-muted mb-3">3. Material</p>
            <div className="flex flex-col gap-2">
              {MATERIAL_OPTIONS.map((m) => (
                <button key={m.label} onClick={() => setMaterialLabel(m.label)}
                  className={`${btnBase} ${materialLabel === m.label ? btnActive : btnInactive}`}>
                  <div className="flex justify-between items-center">
                    <span>{m.label}</span>
                    <span className={materialLabel === m.label ? 'text-gold' : 'text-muted'}>
                      {m.adder === null ? '+ cost' : m.adder === 0 ? '+$0' : `+$${m.adder}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rush */}
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-muted mb-3">4. Rush Fee</p>
            <div className="flex flex-col gap-2">
              {RUSH_OPTIONS.map((r) => (
                <button key={r.label} onClick={() => setRushLabel(r.label)}
                  className={`${btnBase} ${rushLabel === r.label ? btnActive : btnInactive}`}>
                  <div className="flex justify-between items-center">
                    <span>{r.label}</span>
                    <span className={rushLabel === r.label ? 'text-gold' : 'text-muted'}>{r.adder === 0 ? '' : `+$${r.adder}`}</span>
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
              {lineItems.map(({ label, amount }) => {
                if (label !== 'Base project' && amount === null) return null;
                return (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span className="text-ink-light">{label}</span>
                    <span className="text-ink font-medium">{amount === null ? '—' : `$${amount}`}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-blush pt-4 mb-6">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-ink-light">Total</span>
                <span className="font-display text-4xl text-ink">
                  {isSpecialMaterial ? 'Custom' : total !== null ? `$${total}` : '—'}
                </span>
              </div>
              {isSpecialMaterial && <p className="text-xs text-muted mt-1">Special material cost added at quote</p>}
              {total === null && !isSpecialMaterial && <p className="text-xs text-muted mt-1">Select all options to see your total</p>}
            </div>

            <button
              onClick={handleRequestQuote}
              className="block w-full text-center px-6 py-3 bg-ink text-white text-sm tracking-wide rounded-full hover:bg-ink-light transition-colors"
            >
              Request This Quote →
            </button>
            <p className="text-xs text-center text-muted mt-3">The earlier you order, the better!</p>
          </div>

          {/* Example quotes */}
          <div className="mt-6">
            <p className="text-xs tracking-[0.15em] uppercase text-muted mb-3">Example Quotes</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Graduation sign', total: 50, note: 'Small + decorative elements' },
                { label: 'Large wedding sign', total: 70, note: 'Large + decorative elements' },
                { label: 'Mirror welcome sign', total: 70, note: 'Small + mirror + decorative' },
                { label: 'Detailed wedding sign', total: 80, note: 'Large + detailed artwork' },
                { label: 'Large mirror w/ artwork', total: 100, note: 'Large + mirror + detailed artwork' },
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
