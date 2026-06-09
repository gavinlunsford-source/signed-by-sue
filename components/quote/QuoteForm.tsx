'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { EVENT_TYPES, SIGN_SIZES, COMPLEXITY_OPTIONS, MATERIAL_OPTIONS, RUSH_OPTIONS } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  eventType: z.string().min(1, 'Please select an event type'),
  eventDate: z.string().optional(),
  size: z.string().optional(),
  complexity: z.string().optional(),
  material: z.string().optional(),
  rush: z.string().optional(),
  description: z.string().min(20, 'Please tell me a bit more about your vision (at least 20 characters)'),
  inspirationNotes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const inputClass = 'w-full border border-border rounded-xl px-4 py-3 text-sm text-ink bg-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-colors';
const labelClass = 'block text-xs tracking-wide uppercase text-muted mb-2';
const selectClass = `${inputClass} appearance-none`;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-rose flex items-center gap-1"><AlertCircle size={12} />{message}</p>;
}

export default function QuoteForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setStatus('submitting');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white border border-border rounded-3xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={28} className="text-sage" />
        </div>
        <h2 className="font-display text-3xl text-ink mb-3">Message Received!</h2>
        <p className="text-ink-light leading-relaxed mb-8 max-w-sm mx-auto">
          Thank you for reaching out. I&apos;ll get back to you within 24–48 hours with pricing and availability.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="px-6 py-2.5 border border-border text-ink-light text-sm rounded-full hover:border-ink/40 transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-border rounded-3xl p-8 md:p-10 shadow-sm space-y-8" noValidate>

      {/* Contact */}
      <div>
        <h3 className="font-display text-xl text-ink mb-5">Your Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name <span className="text-rose">*</span></label>
            <input {...register('name')} className={inputClass} placeholder="Your full name" autoComplete="name" />
            <FieldError message={errors.name?.message} />
          </div>
          <div>
            <label className={labelClass}>Email <span className="text-rose">*</span></label>
            <input {...register('email')} type="email" className={inputClass} placeholder="your@email.com" autoComplete="email" />
            <FieldError message={errors.email?.message} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Phone (optional)</label>
            <input {...register('phone')} type="tel" className={inputClass} placeholder="(555) 000-0000" autoComplete="tel" />
          </div>
        </div>
      </div>

      {/* Event */}
      <div className="border-t border-border pt-8">
        <h3 className="font-display text-xl text-ink mb-5">About Your Event</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Event Type <span className="text-rose">*</span></label>
            <select {...register('eventType')} className={selectClass}>
              <option value="">Select event type…</option>
              {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <FieldError message={errors.eventType?.message} />
          </div>
          <div>
            <label className={labelClass}>Event Date (optional)</label>
            <input {...register('eventDate')} type="date" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Sign specs */}
      <div className="border-t border-border pt-8">
        <h3 className="font-display text-xl text-ink mb-1">Sign Specs</h3>
        <p className="text-sm text-muted mb-5">Not sure? Just describe what you have in mind and I&apos;ll help.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Size</label>
            <select {...register('size')} className={selectClass}>
              <option value="">Not sure yet</option>
              {SIGN_SIZES.map((s) => <option key={s.label}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Design Complexity</label>
            <select {...register('complexity')} className={selectClass}>
              <option value="">Not sure yet</option>
              {COMPLEXITY_OPTIONS.map((c) => <option key={c.label}>{c.label} — {c.description}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Material</label>
            <select {...register('material')} className={selectClass}>
              <option value="">Not sure yet</option>
              {MATERIAL_OPTIONS.map((m) => <option key={m.label}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Rush Order?</label>
            <select {...register('rush')} className={selectClass}>
              {RUSH_OPTIONS.map((r) => <option key={r.label}>{r.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Vision */}
      <div className="border-t border-border pt-8">
        <h3 className="font-display text-xl text-ink mb-5">Tell Me Your Vision</h3>
        <div className="mb-4">
          <label className={labelClass}>Description <span className="text-rose">*</span></label>
          <textarea
            {...register('description')}
            rows={5}
            className={inputClass}
            placeholder="Describe what you're envisioning — names, dates, colors, wording, style. The more detail the better!"
          />
          <FieldError message={errors.description?.message} />
        </div>
        <div>
          <label className={labelClass}>Inspiration & Notes (optional)</label>
          <textarea
            {...register('inspirationNotes')}
            rows={3}
            className={inputClass}
            placeholder="Pinterest links, Instagram posts, color palettes, or anything else that captures the vibe."
          />
          <p className="mt-1.5 text-xs text-muted">You can also email photos after submitting.</p>
        </div>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 p-4 bg-rose/10 border border-rose/20 rounded-xl text-sm text-rose">
          <AlertCircle size={16} />
          Something went wrong. Please try again or email hello@signedbysue.com directly.
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-4 bg-ink text-white text-sm tracking-wide rounded-full hover:bg-ink-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Sending…' : 'Send Quote Request'}
      </button>

      <p className="text-xs text-center text-muted -mt-4">
        No commitment required · I&apos;ll respond within 24–48 hours · The earlier you order, the better!
      </p>
    </form>
  );
}
