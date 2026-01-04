import type { ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonVariant = 'default' | 'ghost' | 'danger';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  children: ReactNode;
  label: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default:
    'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700',
  ghost:
    'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  danger:
    'text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30',
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
};

export function IconButton({
  variant = 'default',
  size = 'md',
  children,
  label,
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`
        inline-flex items-center justify-center
        rounded-xl
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}>
      {children}
    </button>
  );
}
