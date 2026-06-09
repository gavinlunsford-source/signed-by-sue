'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EVENT_TYPES, SIGN_SIZES, MATERIALS } from '@/lib/utils';

const BASE_PRICES: Record<string, number> = {
  Wedding: 40,
  Graduation: 40,
  'Missionary Farewell': 40,
  'Baby Shower': 40,
  'Bridal Shower': 40,
  Birthday: 40,
  'Mirror or Glass Sign': 60,
  'Custom Artwork': 50,
  Other: 40,
};

const SIZE_MULTIPLIERS: Record<string, number> = {
  'Small (up to 12")': 1,
  'Medium (12"–24")': 1.5,
  'Large (24"–36")': 2.2,
  'Extra Large (36"+)': 3.2,
  "Not sure — I need a recommendation": 1.5,
};

const MATERIAL_ADDERS: Record<string, number> = {
  'Wood (standard)': 0,
  'Wood (premium/stained)': 15,
  'Mirror or Glass': 20,
  Canvas: 10,
  Acrylic: 15,
  "Not sure — I need a recommendation": 0,
};

const COMPLEXITY_ADDERS: Record<string, number> = {
  simple: 0,
  moderate: 20,
  elaborate: 50,
};

export default function QuoteEstimator() {
  const [eventType, setEventType] = useState('');
  const [size, setSize] = useState('');
  const [material, setMaterial] = useState('');
  const [complexity, setComplexity] = useState('');
  const [rush, setRush] = useState(false);

  const estimate = (() => {
    if (!eventType || !size || !material || !complexity) return null;
    const base = BASE_PRICES[eventType] ?? 40;
    const sizeMulti = SIZE_MULTIPLIERS[size] ?? 1;
    const materialAdd = MATERIAL_ADDERS[material] ?? 0;
    const complexityAdd = COMPLEXITY_ADDERS[complexity] ?? 0;
    const rushAdd = rush ? 30 : 0;
    const total = Math.round(base * sizeMulti + materialAdd + complexityAdd + rushAdd);
    return { low: total, high: Math.round(total * 1.3) };
  })();

  const selectClass = "w-full border border-border rounded-xl px-4 py-3 text-sm text-ink bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-colors";

  return (
    <div className="bg-white border border-border rounded-3xl p-8 md:p-10 shadow-sm">
      <h3 className="font-display text-3xl text-ink mb-2">Estimate Your Price</h3>
      <p className="text-sm text-muted mb-8">
        Get a ballpark figure before you reach out. Exact quotes are provided after a quick conversation.
      </p>

      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        {/* Event type */}
        <div>
          <label className="block text-xs tracking-wide uppercase text-muted mb-2">Event Type</label>
          <select className={selectClass} value={eventType} onChange={(e) => setEventType(e.target.value)}>
            <option value="">Select event type…</option>
            {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Size */}
        <div>
          <label className="block text-xs tracking-wide uppercase text-muted mb-2">Sign Size</label>
          <select className={selectClass} value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">Select size…</option>
            {SIGN_SIZES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Material */}
        <div>
          <label className="block text-xs tracking-wide uppercase text-muted mb-2">Material</label>
          <select className={selectClass} value={material} onChange={(e) => setMaterial(e.target.value)}>
            <option value="">Select material…</option>
            {MATERIALS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>

        {/* Complexity */}
        <div>
          <label className="block text-xs tracking-wide uppercase text-muted mb-2">Design Complexity</label>
          <select className={selectClass} value={complexity} onChange={(e) => setComplexity(e.target.value)}>
            <option value="">Select complexity…</option>
            <option value="simple">Simple — text only, clean lettering</option>
            <option value="moderate">Moderate — some florals or artwork</option>
            <option value="elaborate">Elaborate — detailed illustrations or multiple elements</option>
          </select>
        </div>
      </div>

      {/* Rush order */}
      <label className="flex items-center gap-3 mb-8 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={rush}
            onChange={(e) => setRush(e.target.checked)}
          />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${rush ? 'bg-gold border-gold' : 'border-border group-hover:border-gold/50'}`}>
            {rush && <svg viewBox="0 0 10 8" className="w-3 h-3 fill-white"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
        </div>
        <span className="text-sm text-ink-light">Rush order needed (under 1 week) <span className="text-muted">+$30</span></span>
      </label>

      {/* Result */}
      <div className={`rounded-2xl p-6 transition-all duration-300 ${estimate ? 'bg-cream border border-blush' : 'bg-cream/50 border border-border'}`}>
        {estimate ? (
          <div>
            <p className="text-xs text-muted tracking-wide uppercase mb-2">Estimated Range</p>
            <p className="font-display text-4xl text-ink mb-1">
              ${estimate.low} – ${estimate.high}
            </p>
            <p className="text-xs text-muted leading-relaxed mt-2">
              This is an estimate only. Your final quote may vary based on specific design details, current availability, and any special requests.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-ink text-white text-sm tracking-wide rounded-full hover:bg-ink-light transition-colors"
            >
              Request an Exact Quote →
            </Link>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="font-display text-2xl text-ink/30 mb-1">$—</p>
            <p className="text-xs text-muted">Complete all fields above to see your estimate</p>
          </div>
        )}
      </div>
    </div>
  );
}
