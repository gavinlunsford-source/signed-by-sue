'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { EVENT_TYPES, SIGN_SIZES, MATERIALS } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  eventType: z.string().min(1, 'Please select an event type'),
  eventDate: z.string().optional(),
  size: z.string().optional(),
  material: z.string().optional(),
  description: z.string().min(20, 'Please tell me a bit more about your vision (at least 20 characters)'),
  inspirationUrls: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full border border-border rounded-xl px-4 py-3 text-sm text-ink bg-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-colors';

const labelClass = 'block text-xs tracking-wide uppercase text-muted mb-2';

interface FieldErrorProps {
  message?: string;
}
function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-rose flex items-center gap-1"><AlertCircle size={12} />{message}</p>;
}

export default function QuoteForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
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

      if (!res.ok) throw new Error('Request failed');
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-border rounded-3xl p-8 md:p-10 shadow-sm space-y-6"
      noValidate
    >
      {/* Contact info */}
      <div>
        <h3 className="font-display text-xl text-ink mb-5">Your Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Name <span className="text-rose">*</span>
            </label>
            <input
              {...register('name')}
              className={inputClass}
              placeholder="Your full name"
              autoComplete="name"
            />
            <FieldError message={errors.name?.message} />
          </div>
          <div>
            <label className={labelClass}>
              Email <span className="text-rose">*</span>
            </label>
            <input
              {...register('email')}
              type="email"
              className={inputClass}
              placeholder="your@email.com"
              autoComplete="email"
            />
            <FieldError message={errors.email?.message} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Phone (optional)</label>
            <input
              {...register('phone')}
              type="tel"
              className={inputClass}
              placeholder="(555) 000-0000"
              autoComplete="tel"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-display text-xl text-ink mb-5">About Your Order</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Event Type <span className="text-rose">*</span>
            </label>
            <select {...register('eventType')} className={inputClass}>
              <option value="">Select event type…</option>
              {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <FieldError message={errors.eventType?.message} />
          </div>

          <div>
            <label className={labelClass}>Event Date (optional)</label>
            <input
              {...register('eventDate')}
              type="date"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Approximate Size</label>
            <select {...register('size')} className={inputClass}>
              <option value="">Not sure yet</option>
              {SIGN_SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Preferred Material</label>
            <select {...register('material')} className={inputClass}>
              <option value="">Not sure yet</option>
              {MATERIALS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-display text-xl text-ink mb-5">Tell Me Your Vision</h3>

        <div className="mb-4">
          <label className={labelClass}>
            Description <span className="text-rose">*</span>
          </label>
          <textarea
            {...register('description')}
            rows={5}
            className={inputClass}
            placeholder="Describe what you're envisioning — names, dates, colors, style, words you want included, or anything else that feels relevant. The more detail the better!"
          />
          <FieldError message={errors.description?.message} />
        </div>

        <div>
          <label className={labelClass}>
            Inspiration Links or Notes (optional)
          </label>
          <textarea
            {...register('inspirationUrls')}
            rows={3}
            className={inputClass}
            placeholder="Paste any Pinterest links, Instagram posts, or other reference images here. Describe color palettes, aesthetics, or styles you love."
          />
          <p className="mt-1.5 text-xs text-muted">You can also email photos directly after submitting.</p>
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

      <p className="text-xs text-center text-muted">
        By submitting, you agree to be contacted about your quote. I typically respond within 24–48 hours.
      </p>
    </form>
  );
}
