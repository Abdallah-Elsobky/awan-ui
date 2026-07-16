import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  accent?: 'none' | 'emerald' | 'amber' | 'red';
  padding?: 'sm' | 'md' | 'lg';
}

const accentClasses: Record<string, string> = {
  none: '',
  emerald: 'border-t-4 border-t-success',
  amber: 'border-t-4 border-t-warning',
  red: 'border-t-4 border-t-alert',
};

const paddingClasses: Record<string, string> = {
  sm: 'p-3',
  md: 'p-4 sm:p-5',
  lg: 'p-6',
};

export function Card({
  hover = false,
  accent = 'none',
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl shadow-card transition-all ${accentClasses[accent]} ${paddingClasses[padding]} ${hover ? 'hover:shadow-card-hover hover:border-slate-300 cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
