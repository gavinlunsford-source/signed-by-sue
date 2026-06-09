'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, X, CheckCircle, AlertCircle, ArrowRight as ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { BASE_PRICE, SIGN_SIZES, COMPLEXITY_OPTIONS, MATERIAL_OPTIONS, RUSH_OPTIONS } from '@/lib/utils';
import type { PricingSettings } from '@/types';

interface Prefill { size?: string; complexity?: string; material?: string; rush?: string; }
interface QuoteWizardProps { prefill?: Prefill; pricingSettings?: PricingSettings | null; }
interface PhotoFile { name: string; type: string; data: string; }

const EVENT_OPTIONS = [
  { label: 'Wedding', emoji: '💍' },
  { label: 'Graduation', emoji: '🎓' },
  { label: 'Missionary Farewell', emoji: '✈️' },
  { label: 'Bridal Shower', emoji: '💐' },
  { label: 'Baby Shower', emoji: '🍼' },
  { label: 'Birthday & Event', emoji: '🎂' },
  { label: 'Mirror Sign', emoji: '🪞' },
  { label: 'Custom Artwork', emoji: '🎨' },
  { label: 'Other', emoji: '✨' },
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Animated price counter
function AnimatedPrice({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => { setDisplay(value); }, [value]);
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={display}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -8, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="font-display text-2xl text-ink"
      >
        {display}
      </motion.span>
    </AnimatePresence>
  );
}

export default function QuoteWizard({ prefill, pricingSettings }: QuoteWizardProps) {
  const sizeOpts = pricingSettings?.sizes?.length ? pricingSettings.sizes : SIGN_SIZES;
  const complexityOpts = pricingSettings?.complexityOptions?.length ? pricingSettings.complexityOptions : COMPLEXITY_OPTIONS;
  const materialOpts = pricingSettings?.materialOptions?.length ? pricingSettings.materialOptions : MATERIAL_OPTIONS;
  const rushOpts = pricingSettings?.rushOptions?.length ? pricingSettings.rushOptions : RUSH_OPTIONS;
  const basePrice = pricingSettings?.basePrice ?? BASE_PRICE;

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [sizeLabel, setSizeLabel] = useState(prefill?.size ?? '');
  const [complexityLabel, setComplexityLabel] = useState(prefill?.complexity ?? '');
  const [materialLabel, setMaterialLabel] = useState(prefill?.material ?? '');
  const [rushLabel, setRushLabel] = useState(prefill?.rush ?? rushOpts[0]?.label ?? RUSH_OPTIONS[0].label);
  const [description, setDescription] = useState('');
  const [inspirationLinks, setInspirationLinks] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const selectedSize = sizeOpts.find((s) => s.label === sizeLabel);
  const selectedComplexity = complexityOpts.find((c) => c.label === complexityLabel);
  const selectedMaterial = materialOpts.find((m) => m.label === materialLabel);
  const selectedRush = rushOpts.find((r) => r.label === rushLabel) ?? rushOpts[0];
  const isSpecialMaterial = selectedMaterial?.adder === null;
  const total = selectedSize && selectedComplexity && selectedMaterial && !isSpecialMaterial
    ? basePrice + (selectedSize.adder ?? 0) + (selectedComplexity.adder ?? 0) + (selectedMaterial.adder ?? 0) + (selectedRush?.adder ?? 0)
    : null;
  const priceDisplay = isSpecialMaterial ? 'Custom' : total !== null ? `$${total}` : `From $${basePrice}`;

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1 && !eventType) e.eventType = 'Pick an occasion to continue';
    if (s === 3 && description.trim().length < 20) e.description = 'Tell me just a little more (20+ characters)';
    if (s === 4) {
      if (!name.trim()) e.name = 'What\'s your name?';
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Need a valid email to send your quote';
      if (!phone.trim()) e.phone = 'A phone number helps Hallie reach you quickly';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    setDirection(1);
    setStep((s) => s + 1);
    setTimeout(scrollTop, 50);
  };

  const back = () => {
    setErrors({});
    setDirection(-1);
    setStep((s) => s - 1);
    setTimeout(scrollTop, 50);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setPhotos((prev) => [...prev, ...files].slice(0, 5));
  };

  const handleSubmit = async () => {
    if (!validate(4)) return;
    setStatus('submitting');
    try {
      const photoData: PhotoFile[] = await Promise.all(
        photos.map(async (f) => ({ name: f.name, type: f.type, data: await fileToBase64(f) }))
      );
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, eventType, eventDate,
          size: sizeLabel, complexity: complexityLabel,
          material: materialLabel, rush: rushLabel,
          estimatedTotal: priceDisplay,
          description, inspirationLinks, photos: photoData,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setStatus('error');
    }
  };

  // ── Slide variants ──────────────────────────────────────────────────────────
  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-60%' : '60%', opacity: 0 }),
  };

  const inputClass = 'w-full border border-border rounded-2xl px-4 py-4 text-sm text-ink bg-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-colors';

  // ── Success ─────────────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-6 pb-32"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={28} className="text-sage" />
        </motion.div>
        <h2 className="font-display text-4xl text-ink mb-3">You&apos;re all set!</h2>
        <p className="text-ink-light leading-relaxed max-w-sm mx-auto mb-10">
          Thank you, {name.split(' ')[0]}! I&apos;ll be in touch within 24–48 hours with your quote.
        </p>

        <div className="border-t border-border pt-10">
          <p className="text-sm text-muted mb-2">While you wait —</p>
          <p className="font-display text-2xl text-ink mb-6">See what&apos;s possible.</p>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-ink text-white text-sm tracking-wide rounded-full hover:bg-ink-light transition-colors group"
          >
            Browse the Portfolio
            <ArrowRightIcon size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div ref={topRef} className="relative">

      {/* ── Progress dots ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <motion.div
            key={s}
            animate={{
              width: s === step ? 24 : 8,
              backgroundColor: s < step ? '#B89872' : s === step ? '#2A2018' : '#E8E0D8',
            }}
            transition={{ duration: 0.3 }}
            className="h-2 rounded-full"
          />
        ))}
      </div>

      {/* ── Step content with slide transition ──────────────────────────────── */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
          >

            {/* ── Step 1: Occasion ──────────────────────────────────────────── */}
            {step === 1 && (
              <div className="pb-32">
                <div className="mb-7">
                  <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2">Step 1 of 4</p>
                  <h2 className="font-display text-4xl text-ink leading-tight">What&apos;s the<br />occasion?</h2>
                </div>

                <div className="grid grid-cols-3 gap-2.5 mb-6">
                  {EVENT_OPTIONS.map(({ label, emoji }) => (
                    <motion.button
                      key={label}
                      type="button"
                      onClick={() => { setEventType(label); setErrors({}); }}
                      whileTap={{ scale: 0.94 }}
                      animate={eventType === label ? { scale: [1, 1.04, 1] } : {}}
                      transition={{ duration: 0.2 }}
                      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 transition-colors min-h-[80px] ${
                        eventType === label ? 'border-gold bg-gold/10' : 'border-border bg-white'
                      }`}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <span className={`text-[11px] text-center font-medium leading-tight ${eventType === label ? 'text-ink' : 'text-ink-light'}`}>
                        {label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {errors.eventType && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-rose flex items-center gap-1 mb-5">
                    <AlertCircle size={12} />{errors.eventType}
                  </motion.p>
                )}

                <div>
                  <label className="block text-xs tracking-wide uppercase text-muted mb-2">Event Date <span className="normal-case text-muted">(optional)</span></label>
                  <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={inputClass} />
                  <p className="text-xs text-muted mt-2">Helps me plan your timeline.</p>
                </div>
              </div>
            )}

            {/* ── Step 2: Sign details ───────────────────────────────────────── */}
            {step === 2 && (
              <div className="pb-36">
                <div className="mb-7">
                  <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2">Step 2 of 4</p>
                  <h2 className="font-display text-4xl text-ink leading-tight">Tell me about<br />your sign.</h2>
                  <p className="text-sm text-muted mt-2">Not sure? Skip any — we&apos;ll figure it out.</p>
                </div>

                {[
                  {
                    label: 'Size', options: sizeOpts.map((s) => ({
                      label: s.label, sub: undefined, adder: s.adder, selected: sizeLabel === s.label,
                      onClick: () => setSizeLabel(s.label),
                    })),
                  },
                  {
                    label: 'Design Complexity', options: complexityOpts.map((c) => ({
                      label: c.label, sub: c.description, adder: c.adder, selected: complexityLabel === c.label,
                      onClick: () => setComplexityLabel(c.label),
                    })),
                  },
                  {
                    label: 'Material', options: materialOpts.map((m) => ({
                      label: m.label, sub: undefined, adder: m.adder, selected: materialLabel === m.label,
                      onClick: () => setMaterialLabel(m.label),
                    })),
                  },
                  {
                    label: 'Rush Order?', options: rushOpts.map((r) => ({
                      label: r.label, sub: undefined, adder: r.adder, selected: rushLabel === r.label,
                      onClick: () => setRushLabel(r.label),
                    })),
                  },
                ].map(({ label, options }) => (
                  <div key={label} className="mb-6">
                    <p className="text-xs tracking-[0.15em] uppercase text-muted mb-2.5">{label}</p>
                    <div className="flex flex-col gap-2">
                      {options.map((opt) => (
                        <motion.button
                          key={opt.label}
                          type="button"
                          onClick={opt.onClick}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-colors ${
                            opt.selected ? 'border-gold bg-gold/10' : 'border-border bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className={`text-sm ${opt.selected ? 'text-ink font-medium' : 'text-ink-light'}`}>{opt.label}</p>
                              {opt.sub && <p className="text-xs text-muted mt-0.5">{opt.sub}</p>}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-sm ${opt.selected ? 'text-gold font-medium' : 'text-muted'}`}>
                                {opt.adder === null ? '+ cost' : opt.adder === 0 ? '' : `+$${opt.adder}`}
                              </span>
                              <motion.div
                                animate={{ scale: opt.selected ? 1 : 0, opacity: opt.selected ? 1 : 0 }}
                                transition={{ duration: 0.15 }}
                                className="w-5 h-5 rounded-full bg-gold flex items-center justify-center"
                              >
                                <svg viewBox="0 0 10 8" className="w-3 h-3"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </motion.div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Step 3: Vision ─────────────────────────────────────────────── */}
            {step === 3 && (
              <div className="pb-36">
                <div className="mb-7">
                  <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2">Step 3 of 4</p>
                  <h2 className="font-display text-4xl text-ink leading-tight">Paint me a<br />picture.</h2>
                  <p className="text-sm text-muted mt-2">Names, wording, colors, vibe — the more the better.</p>
                </div>

                <div className="mb-5">
                  <textarea
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); setErrors({}); }}
                    rows={6}
                    className={inputClass}
                    placeholder={`e.g. "Welcome to our wedding — Emily & Jake, June 14, 2025. We love a soft boho style with eucalyptus and blush tones. The sign should say..."`}
                  />
                  {errors.description && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-rose flex items-center gap-1 mt-2">
                      <AlertCircle size={12} />{errors.description}
                    </motion.p>
                  )}
                </div>

                <div className="mb-5">
                  <label className="block text-xs tracking-wide uppercase text-muted mb-2">
                    Inspiration Links <span className="normal-case text-muted">(optional)</span>
                  </label>
                  <textarea
                    value={inspirationLinks}
                    onChange={(e) => setInspirationLinks(e.target.value)}
                    rows={3}
                    className={inputClass}
                    placeholder="Paste Pinterest or Instagram links here."
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-wide uppercase text-muted mb-2">
                    Inspiration Photos <span className="normal-case text-muted">(optional, up to 5)</span>
                  </label>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer hover:border-gold/40 transition-colors"
                  >
                    <Upload size={18} className="text-muted mx-auto mb-2" />
                    <p className="text-sm text-ink-light">Tap to upload</p>
                    <p className="text-xs text-muted mt-1">JPG, PNG or HEIC · 5MB max each</p>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
                  </motion.div>
                  {photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {photos.map((file, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 bg-cream border border-border rounded-xl px-3 py-1.5 text-xs text-ink-light">
                          <span className="max-w-[120px] truncate">{file.name}</span>
                          <button type="button" onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))} className="text-muted hover:text-rose"><X size={12} /></button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 4: Contact ────────────────────────────────────────────── */}
            {step === 4 && (
              <div className="pb-40">
                <div className="mb-7">
                  <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2">Step 4 of 4</p>
                  <h2 className="font-display text-4xl text-ink leading-tight">Almost there —<br />how do I reach you?</h2>
                </div>

                <div className="flex flex-col gap-4 mb-7">
                  <div>
                    <label className="block text-xs tracking-wide uppercase text-muted mb-2">Name <span className="text-rose">*</span></label>
                    <input value={name} onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: '' })); }}
                      className={inputClass} placeholder="Your full name" autoComplete="name" />
                    {errors.name && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</motion.p>}
                  </div>
                  <div>
                    <label className="block text-xs tracking-wide uppercase text-muted mb-2">Email <span className="text-rose">*</span></label>
                    <input value={email} onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: '' })); }}
                      type="email" className={inputClass} placeholder="your@email.com" autoComplete="email" />
                    {errors.email && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</motion.p>}
                  </div>
                  <div>
                    <label className="block text-xs tracking-wide uppercase text-muted mb-2">Phone <span className="text-rose">*</span></label>
                    <input value={phone} onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: '' })); }}
                      type="tel" className={inputClass} placeholder="(555) 000-0000" autoComplete="tel" />
                    {errors.phone && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.phone}</motion.p>}
                  </div>
                </div>

                {/* Summary */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="bg-cream rounded-2xl p-5">
                  <p className="text-xs tracking-wide uppercase text-muted mb-4">Your Order Summary</p>
                  <div className="flex flex-col gap-2.5 text-sm">
                    {[
                      ['Occasion', eventType],
                      ['Size', sizeLabel],
                      ['Complexity', complexityLabel],
                      ['Material', materialLabel],
                      [rushLabel !== rushOpts[0]?.label ? 'Rush' : '', rushLabel !== rushOpts[0]?.label ? rushLabel : ''],
                    ].filter(([, v]) => v).map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-muted">{label}</span>
                        <span className="text-ink text-right max-w-[55%]">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-blush mt-4 pt-4 flex justify-between items-baseline">
                    <span className="text-sm text-muted">Estimated Total</span>
                    <span className="font-display text-2xl text-gold">{priceDisplay}</span>
                  </div>
                </motion.div>

                {status === 'error' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-2 p-4 bg-rose/10 border border-rose/20 rounded-xl text-sm text-rose mt-4">
                    <AlertCircle size={16} />
                    Something went wrong. Please try again or email hello@signedbysue.com.
                  </motion.div>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Sticky bottom bar ──────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border/60 safe-area-bottom">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between gap-4">

          {/* Price (steps 2+) or spacer */}
          {step >= 2 ? (
            <div className="min-w-0">
              <p className="text-[10px] text-muted uppercase tracking-wide">Estimated</p>
              <AnimatedPrice value={priceDisplay} />
            </div>
          ) : (
            <div />
          )}

          {/* Navigation */}
          <div className="flex items-center gap-2 shrink-0">
            {step > 1 && (
              <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={back}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-ink-light hover:border-ink/40 transition-colors">
                <ArrowLeft size={16} />
              </motion.button>
            )}
            {step < 4 ? (
              <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={next}
                className="flex items-center gap-2 px-6 h-10 bg-ink text-white text-sm rounded-full hover:bg-ink-light transition-colors">
                Next <ArrowRight size={14} />
              </motion.button>
            ) : (
              <motion.button whileTap={{ scale: 0.97 }} type="button" onClick={handleSubmit}
                disabled={status === 'submitting'}
                className="flex items-center gap-2 px-6 h-10 bg-gold text-white text-sm rounded-full hover:bg-gold-dark transition-colors disabled:opacity-60">
                {status === 'submitting' ? 'Sending…' : 'Send Request ✦'}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
