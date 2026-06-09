import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const base = 'inline-flex items-center justify-center font-sans tracking-wide transition-all duration-200 rounded-full';

const variants = {
  primary: 'bg-ink text-white hover:bg-ink-light',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-white',
  ghost: 'text-gold hover:text-gold-dark underline-offset-4 hover:underline',
};

const sizes = {
  sm: 'text-xs px-5 py-2',
  md: 'text-sm px-7 py-3',
  lg: 'text-sm px-9 py-4',
};

export default function Button({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  children,
  type = 'button',
  disabled,
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], disabled && 'opacity-50 cursor-not-allowed', className);

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>;
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
