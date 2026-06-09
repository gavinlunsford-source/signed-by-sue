import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  label?: string;
  headline: string;
  subtext?: string;
  align?: 'left' | 'center';
  className?: string;
  light?: boolean;
}

export default function SectionHeader({
  label,
  headline,
  subtext,
  align = 'center',
  className,
  light = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      {label && (
        <p
          className={cn(
            'label-line text-xs tracking-[0.2em] uppercase mb-4',
            light ? 'text-white/50' : 'text-gold'
          )}
        >
          {label}
        </p>
      )}
      <h2
        className={cn(
          'font-display font-light leading-tight mb-4',
          'text-4xl md:text-5xl',
          light ? 'text-white' : 'text-ink'
        )}
      >
        {headline}
      </h2>
      {subtext && (
        <p
          className={cn(
            'text-base leading-relaxed',
            light ? 'text-white/60' : 'text-ink-light'
          )}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
