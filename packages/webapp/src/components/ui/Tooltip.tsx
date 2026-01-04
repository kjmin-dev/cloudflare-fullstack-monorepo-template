import { type ReactNode, useState } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            px-2.5 py-1.5 rounded-lg
            bg-slate-800 dark:bg-slate-700
            text-white text-xs whitespace-nowrap
            shadow-lg
            z-50
            pointer-events-none
          ">
          {content}
          <div
            className="
              absolute top-full left-1/2 -translate-x-1/2
              border-4 border-transparent border-t-slate-800 dark:border-t-slate-700
            "
          />
        </div>
      )}
    </div>
  );
}
