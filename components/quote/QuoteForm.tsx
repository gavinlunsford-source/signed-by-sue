'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, AlertCircle, Upload, X } from 'lucide-react';
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
  description: z.string().min(20, 'Please describe your vision (at least 20 characters)'),
  inspirationLinks: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface QuoteFormProps {
  prefill?: {
    size?: string;
    complexity?: string;
    material?: string;
    rush?: string;
  };
}

const inputClass = 'w-full border border-border rounded-xl px-4 py-3 text-sm text-ink bg-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-colors';
const labelClass = 'block text-xs tracking-wide uppercase text-muted mb-2';
const selectClass = `${inputClass} appearance-none`;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-rose flex items-center gap-1"><AlertCircle size={12} />{message}</p>;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function QuoteForm({ prefill }: QuoteFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [photos, setPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      size: prefill?.size ?? '',
      complexity: prefill?.complexity ?? '',
      material: prefill?.material ?? '',
      rush: prefill?.rush ?? '',
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setPhotos((prev) => [...prev, ...files].slice(0, 5));
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    setStatus('submitting');
    try {
      const photoData = await Promise.all(
        photos.map(async (file) => ({
          name: file.name,
          type: file.type,
          data: await fileToBase64(file),
        }))
      );

      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, photos: photoData }),
      });

      if (!res.ok) throw new Error();
      setStatus('success');
      reset();
      setPhotos([]);
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
        <button onClick={() => setStatus('idle')} className="px-6 py-2.5 border border-border text-ink-light text-sm rounded-full hover:border-ink/40 transition-colors">
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-border rounded-3xl p-8 md:p-10 shadow-sm space-y-8" noValidate>

      {/* Pre-fill banner */}
      {(prefill?.size || prefill?.complexity || prefill?.material) && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl px-5 py-3 text-sm text-ink-light">
          ✦ Your selections from the estimator have been pre-filled below — just review and fill in the rest.
        </div>
      )}

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
        <p className="text-sm text-muted mb-5">Not sure on any of these? Just leave them blank and describe what you have in mind.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Size</label>
            <select {...register('size')} className={selectClass}>
              <option value="">Not sure yet</option>
              {SIGN_SIZES.map((s) => <option key={s.label} value={s.label}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Design Complexity</label>
            <select {...register('complexity')} className={selectClass}>
              <option value="">Not sure yet</option>
              {COMPLEXITY_OPTIONS.map((c) => <option key={c.label} value={c.label}>{c.label} — {c.description}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Material</label>
            <select {...register('material')} className={selectClass}>
              <option value="">Not sure yet</option>
              {MATERIAL_OPTIONS.map((m) => <option key={m.label} value={m.label}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Rush Order?</label>
            <select {...register('rush')} className={selectClass}>
              {RUSH_OPTIONS.map((r) => <option key={r.label} value={r.label}>{r.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Vision */}
      <div className="border-t border-border pt-8">
        <h3 className="font-display text-xl text-ink mb-5">Tell Me Your Vision</h3>
        <div className="mb-5">
          <label className={labelClass}>Description <span className="text-rose">*</span></label>
          <textarea
            {...register('description')}
            rows={5}
            className={inputClass}
            placeholder="Names, dates, wording, colors, style — the more detail the better!"
          />
          <FieldError message={errors.description?.message} />
        </div>

        {/* Inspiration links */}
        <div className="mb-5">
          <label className={labelClass}>Inspiration Links (optional)</label>
          <textarea
            {...register('inspirationLinks')}
            rows={3}
            className={inputClass}
            placeholder="Paste Pinterest links, Instagram posts, or any other URLs that capture the vibe — one per line is great."
          />
        </div>

        {/* Photo upload */}
        <div>
          <label className={labelClass}>Inspiration Photos (optional, up to 5)</label>
          <div
            className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-gold/40 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={20} className="text-muted mx-auto mb-2" />
            <p className="text-sm text-ink-light">Click to upload photos</p>
            <p className="text-xs text-muted mt-1">JPG, PNG, HEIC up to 5MB each</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          {photos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {photos.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-cream border border-border rounded-lg px-3 py-1.5 text-xs text-ink-light">
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button type="button" onClick={() => removePhoto(i)} className="text-muted hover:text-rose transition-colors">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
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
        No commitment required · Response within 24–48 hours · The earlier you order, the better!
      </p>
    </form>
  );
}
