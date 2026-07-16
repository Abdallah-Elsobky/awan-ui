import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  colorClass?: string;
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:opacity-90 active:opacity-95',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  tertiary: 'bg-transparent text-brand hover:underline',
  destructive: 'bg-alert text-white hover:opacity-90',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-12 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', fullWidth, colorClass, className = '', children, ...props },
    ref
  ) => {
    const variantClass = colorClass
      ? `${colorClass} text-white hover:opacity-90`
      : variants[variant];
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
