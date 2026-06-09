'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { BASE_PRICE, SIGN_SIZES, COMPLEXITY_OPTIONS, MATERIAL_OPTIONS, RUSH_OPTIONS } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Prefill {
  size?: string;
  complexity?: string;
  material?: string;
  rush?: string;
}

interface QuoteWizardProps {
  prefill?: Prefill;
}

interface PhotoFile {
  name: string;
  type: string;
  data: string;
}

// ─── Event types ─────────────────────────────────────────────────────────────

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

// ─── Steps config ────────────────────────────────────────────────────────────

const STEPS = ['Event', 'Sign Details', 'Your Vision', 'Contact'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function OptionButton({
  label, sublabel, adder, selected, onClick,
}: {
  label: string; sublabel?: string; adder?: number | null; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all duration-150 ${
        selected ? 'border-gold bg-gold/10' : 'border-border bg-white hover:border-gold/40'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-sm font-medium ${selected ? 'text-ink' : 'text-ink-light'}`}>{label}</p>
          {sublabel && <p className="text-xs text-muted mt-0.5">{sublabel}</p>}
        </div>
        {adder !== undefined && (
          <span className={`text-sm shrink-0 ${selected ? 'text-gold font-medium' : 'text-muted'}`}>
            {adder === null ? '+ cost' : adder === 0 ? '+$0' : `+$${adder}`}
          </span>
        )}
        {selected && (
          <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center shrink-0">
            <svg viewBox="0 0 10 8" className="w-3 h-3"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        )}
      </div>
    </button>
  );
}

function PriceBar({ total, isSpecial }: { total: number | null; isSpecial: boolean }) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-xs text-muted">Estimated total</p>
        <p className="font-display text-2xl text-ink">
          {isSpecial ? 'Custom quote' : total !== null ? `$${total}` : `From $${BASE_PRICE}`}
        </p>
      </div>
      <p className="text-xs text-muted text-right max-w-[140px] leading-snug">
        Final price confirmed after your request
      </p>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function QuoteWizard({ prefill }: QuoteWizardProps) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');

  // Step 2
  const [sizeLabel, setSizeLabel] = useState(prefill?.size ?? '');
  const [complexityLabel, setComplexityLabel] = useState(prefill?.complexity ?? '');
  const [materialLabel, setMaterialLabel] = useState(prefill?.material ?? '');
  const [rushLabel, setRushLabel] = useState(prefill?.rush ?? RUSH_OPTIONS[0].label);

  // Step 3
  const [description, setDescription] = useState('');
  const [inspirationLinks, setInspirationLinks] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  // Step 4
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // ── Price calculation ────────────────────────────────────────────────────

  const selectedSize = SIGN_SIZES.find((s) => s.label === sizeLabel);
  const selectedComplexity = COMPLEXITY_OPTIONS.find((c) => c.label === complexityLabel);
  const selectedMaterial = MATERIAL_OPTIONS.find((m) => m.label === materialLabel);
  const selectedRush = RUSH_OPTIONS.find((r) => r.label === rushLabel) ?? RUSH_OPTIONS[0];
  const isSpecialMaterial = selectedMaterial?.adder === null;

  const total =
    selectedSize && selectedComplexity && selectedMaterial && !isSpecialMaterial
      ? BASE_PRICE + selectedSize.adder + selectedComplexity.adder + (selectedMaterial.adder ?? 0) + selectedRush.adder
      : null;

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1 && !eventType) e.eventType = 'Please select an event type';
    if (s === 3 && description.trim().length < 20) e.description = 'Please tell me a bit more (at least 20 characters)';
    if (s === 4) {
      if (!name.trim()) e.name = 'Please enter your name';
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) setStep((s) => Math.min(s + 1, 4));
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  // ── Photo handling ───────────────────────────────────────────────────────

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setPhotos((prev) => [...prev, ...files].slice(0, 5));
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate(4)) return;
    setStatus('submitting');
    try {
      const photoData: PhotoFile[] = await Promise.all(
        photos.map(async (file) => ({
          name: file.name,
          type: file.type,
          data: await fileToBase64(file),
        }))
      );

      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, eventType, eventDate,
          size: sizeLabel, complexity: complexityLabel,
          material: materialLabel, rush: rushLabel,
          estimatedTotal: isSpecialMaterial ? 'Custom quote' : total ? `$${total}` : null,
          description, inspirationLinks, photos: photoData,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  // ── Success state ────────────────────────────────────────────────────────

  if (status === 'success') {
    return (
      <div className="text-center py-16 px-6">
        <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={28} className="text-sage" />
        </div>
        <h2 className="font-display text-4xl text-ink mb-3">You&apos;re all set!</h2>
        <p className="text-ink-light leading-relaxed max-w-sm mx-auto mb-2">
          Thank you, {name.split(' ')[0]}! I&apos;ll be in touch within 24–48 hours with your quote.
        </p>
        <p className="text-sm text-muted">Check your inbox for a confirmation email.</p>
      </div>
    );
  }

  // ── Progress bar ─────────────────────────────────────────────────────────

  const inputClass = 'w-full border border-border rounded-2xl px-4 py-3.5 text-sm text-ink bg-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-colors';

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-1 flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  i + 1 < step ? 'bg-gold text-white' :
                  i + 1 === step ? 'bg-ink text-white' :
                  'bg-border text-muted'
                }`}>
                  {i + 1 < step ? (
                    <svg viewBox="0 0 10 8" className="w-3 h-3"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : i + 1}
                </div>
                <span className={`text-[10px] mt-1 tracking-wide hidden sm:block ${i + 1 === step ? 'text-ink' : 'text-muted'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-all ${i + 1 < step ? 'bg-gold' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 pb-28">

        {/* ── Step 1: Event ─────────────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-3xl text-ink mb-1">What&apos;s the occasion?</h2>
            <p className="text-sm text-muted mb-6">Select everything that applies.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {EVENT_OPTIONS.map(({ label, emoji }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setEventType(label)}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all min-h-[90px] ${
                    eventType === label
                      ? 'border-gold bg-gold/10'
                      : 'border-border bg-white hover:border-gold/40'
                  }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className={`text-xs text-center font-medium leading-tight ${eventType === label ? 'text-ink' : 'text-ink-light'}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
            {errors.eventType && (
              <p className="text-xs text-rose flex items-center gap-1 mb-4"><AlertCircle size={12} />{errors.eventType}</p>
            )}

            <div>
              <label className="block text-xs tracking-wide uppercase text-muted mb-2">Event Date (optional)</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={inputClass}
              />
              <p className="text-xs text-muted mt-1.5">Helps me plan the timeline for your order.</p>
            </div>
          </div>
        )}

        {/* ── Step 2: Sign Details ───────────────────────────────────────── */}
        {step === 2 && (
          <div className="flex flex-col gap-7">
            <div>
              <h2 className="font-display text-3xl text-ink mb-1">Tell me about your sign.</h2>
              <p className="text-sm text-muted">Not sure? Skip any of these — we&apos;ll figure it out together.</p>
            </div>

            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-muted mb-3">Size</p>
              <div className="flex flex-col gap-2">
                {SIGN_SIZES.map((s) => (
                  <OptionButton key={s.label} label={s.label} adder={s.adder}
                    selected={sizeLabel === s.label} onClick={() => setSizeLabel(s.label)} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-muted mb-3">Design Complexity</p>
              <div className="flex flex-col gap-2">
                {COMPLEXITY_OPTIONS.map((c) => (
                  <OptionButton key={c.label} label={c.label} sublabel={c.description} adder={c.adder}
                    selected={complexityLabel === c.label} onClick={() => setComplexityLabel(c.label)} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-muted mb-3">Material</p>
              <div className="flex flex-col gap-2">
                {MATERIAL_OPTIONS.map((m) => (
                  <OptionButton key={m.label} label={m.label} adder={m.adder}
                    selected={materialLabel === m.label} onClick={() => setMaterialLabel(m.label)} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-muted mb-3">Rush Order?</p>
              <div className="flex flex-col gap-2">
                {RUSH_OPTIONS.map((r) => (
                  <OptionButton key={r.label} label={r.label} adder={r.adder}
                    selected={rushLabel === r.label} onClick={() => setRushLabel(r.label)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Vision ────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-display text-3xl text-ink mb-1">Tell me your vision.</h2>
              <p className="text-sm text-muted">The more detail the better — names, wording, colors, style, anything.</p>
            </div>

            <div>
              <label className="block text-xs tracking-wide uppercase text-muted mb-2">
                Description <span className="text-rose">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className={inputClass}
                placeholder="e.g. 'Welcome to our wedding — Emily & Jake, June 14, 2025. We love a soft boho style with eucalyptus and blush tones.'"
              />
              {errors.description && (
                <p className="text-xs text-rose flex items-center gap-1 mt-1.5"><AlertCircle size={12} />{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-xs tracking-wide uppercase text-muted mb-2">Inspiration Links (optional)</label>
              <textarea
                value={inspirationLinks}
                onChange={(e) => setInspirationLinks(e.target.value)}
                rows={3}
                className={inputClass}
                placeholder="Paste Pinterest or Instagram links here, one per line."
              />
            </div>

            <div>
              <label className="block text-xs tracking-wide uppercase text-muted mb-2">Inspiration Photos (optional, up to 5)</label>
              <div
                className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-gold/40 transition-colors cursor-pointer active:bg-cream"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={20} className="text-muted mx-auto mb-2" />
                <p className="text-sm text-ink-light">Tap to upload photos</p>
                <p className="text-xs text-muted mt-1">JPG, PNG, HEIC up to 5MB each</p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
              </div>
              {photos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {photos.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 bg-cream border border-border rounded-xl px-3 py-1.5 text-xs text-ink-light">
                      <span className="max-w-[120px] truncate">{file.name}</span>
                      <button type="button" onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))} className="text-muted hover:text-rose">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 4: Contact ───────────────────────────────────────────── */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-display text-3xl text-ink mb-1">Last step — how do I reach you?</h2>
              <p className="text-sm text-muted">I&apos;ll send your quote to this email within 24–48 hours.</p>
            </div>

            <div>
              <label className="block text-xs tracking-wide uppercase text-muted mb-2">Name <span className="text-rose">*</span></label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Your full name" autoComplete="name" />
              {errors.name && <p className="text-xs text-rose flex items-center gap-1 mt-1.5"><AlertCircle size={12} />{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-wide uppercase text-muted mb-2">Email <span className="text-rose">*</span></label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={inputClass} placeholder="your@email.com" autoComplete="email" />
              {errors.email && <p className="text-xs text-rose flex items-center gap-1 mt-1.5"><AlertCircle size={12} />{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-wide uppercase text-muted mb-2">Phone (optional)</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className={inputClass} placeholder="(555) 000-0000" autoComplete="tel" />
            </div>

            {/* Summary */}
            <div className="bg-cream rounded-2xl p-5 mt-2">
              <p className="text-xs tracking-wide uppercase text-muted mb-3">Your Order Summary</p>
              <div className="flex flex-col gap-2 text-sm">
                {eventType && <div className="flex justify-between"><span className="text-muted">Event</span><span className="text-ink">{eventType}</span></div>}
                {sizeLabel && <div className="flex justify-between"><span className="text-muted">Size</span><span className="text-ink">{sizeLabel}</span></div>}
                {complexityLabel && <div className="flex justify-between"><span className="text-muted">Complexity</span><span className="text-ink">{complexityLabel}</span></div>}
                {materialLabel && <div className="flex justify-between"><span className="text-muted">Material</span><span className="text-ink">{materialLabel}</span></div>}
                {rushLabel && rushLabel !== RUSH_OPTIONS[0].label && <div className="flex justify-between"><span className="text-muted">Rush</span><span className="text-ink">{rushLabel}</span></div>}
              </div>
              <div className="border-t border-blush mt-3 pt-3 flex justify-between items-baseline">
                <span className="text-sm text-muted">Estimated Total</span>
                <span className="font-display text-2xl text-gold">
                  {isSpecialMaterial ? 'Custom' : total ? `$${total}` : `From $${BASE_PRICE}`}
                </span>
              </div>
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 p-4 bg-rose/10 border border-rose/20 rounded-xl text-sm text-rose">
                <AlertCircle size={16} />
                Something went wrong. Please try again or email hello@signedbysue.com.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Sticky bottom ─────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-3xl mx-auto px-4 py-3">
          {/* Price bar (steps 2-4) */}
          {step >= 2 && (
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wide">Estimated total</p>
                <p className="font-display text-xl text-ink">
                  {isSpecialMaterial ? 'Custom quote' : total !== null ? `$${total}` : `From $${BASE_PRICE}`}
                </p>
              </div>
              <p className="text-[10px] text-muted text-right leading-snug max-w-[120px]">
                Final price confirmed after your request
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className={`flex gap-3 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
            {step > 1 && (
              <button type="button" onClick={back}
                className="flex items-center gap-2 px-5 py-3 border border-border text-ink-light text-sm rounded-full hover:border-ink/40 transition-colors">
                <ArrowLeft size={15} /> Back
              </button>
            )}
            {step < 4 ? (
              <button type="button" onClick={next}
                className="flex items-center gap-2 px-7 py-3 bg-ink text-white text-sm rounded-full hover:bg-ink-light transition-colors ml-auto">
                Next <ArrowRight size={15} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={status === 'submitting'}
                className="flex items-center gap-2 px-7 py-3 bg-gold text-white text-sm rounded-full hover:bg-gold-dark transition-colors ml-auto disabled:opacity-60">
                {status === 'submitting' ? 'Sending…' : 'Send My Request ✦'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
