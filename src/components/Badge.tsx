import { type ReactNode } from 'react';

type BadgeColor = 'brand' | 'success' | 'warning' | 'alert' | 'play' | 'work' | 'study' | 'personal' | 'slate';

interface BadgeProps {
  color?: BadgeColor;
  children: ReactNode;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  brand: 'bg-brand-50 text-brand-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  alert: 'bg-alert-50 text-alert-700',
  play: 'bg-play-50 text-play-600',
  work: 'bg-work-50 text-work-600',
  study: 'bg-study-50 text-study-600',
  personal: 'bg-personal-50 text-personal-600',
  slate: 'bg-slate-100 text-slate-600',
};

export function Badge({ color = 'slate', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
}
