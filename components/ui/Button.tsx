import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-500',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-500',
      outline: 'border-2 border-slate-300 text-slate-900 hover:bg-slate-50 focus-visible:outline-slate-500',
      ghost: 'text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="animate-spin mr-2">⟳</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
