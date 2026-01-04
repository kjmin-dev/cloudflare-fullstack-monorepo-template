import type { HTMLAttributes, ReactNode } from 'react';

type CardVariant = 'default' | 'elevated' | 'outlined';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white/80 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50 shadow-sm',
  elevated:
    'bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-black/30',
  outlined: 'bg-transparent border-2 border-slate-200 dark:border-slate-700',
};

const paddingStyles: Record<'none' | 'sm' | 'md' | 'lg', string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ variant = 'default', padding = 'md', children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        backdrop-blur-xl rounded-2xl
        transition-colors duration-200
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}>
      {children}
    </div>
  );
}
