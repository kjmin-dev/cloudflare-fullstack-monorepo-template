import type { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className = '' }: TooltipProps) {
  return (
    <div className={`group/tooltip relative inline-flex ${className}`}>
      {children}
      <div
        role="tooltip"
        className="
          invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          px-2.5 py-1.5 rounded-lg
          bg-slate-800 dark:bg-slate-700
          text-white text-xs whitespace-nowrap
          shadow-lg
          z-50
          pointer-events-none
          transition-opacity duration-150
        ">
        {content}
        <div
          className="
            absolute top-full left-1/2 -translate-x-1/2
            border-4 border-transparent border-t-slate-800 dark:border-t-slate-700
          "
        />
      </div>
    </div>
  );
}
