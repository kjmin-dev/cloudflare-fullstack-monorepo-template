import { forwardRef, useState, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasGlow?: boolean;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasGlow = false, className = '', wrapperClassName = '', onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={`relative ${wrapperClassName}`}>
        {hasGlow && (
          <div
            className={`absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur transition-opacity duration-300 ${
              isFocused ? 'opacity-30' : 'opacity-0'
            }`}
          />
        )}
        <input
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className={`
            relative w-full px-4 py-3
            bg-slate-50 dark:bg-slate-900
            border border-slate-200 dark:border-slate-700
            rounded-xl
            text-slate-900 dark:text-slate-100
            placeholder-slate-400 dark:placeholder-slate-500
            focus:outline-none focus:border-violet-400 dark:focus:border-violet-500
            focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-500/20
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = 'Input';
