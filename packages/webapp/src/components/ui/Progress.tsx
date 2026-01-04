interface ProgressProps {
  value: number;
  max?: number;
  isComplete?: boolean;
  showAnimation?: boolean;
  className?: string;
}

export function Progress({ value, max = 100, isComplete, showAnimation = true, className = '' }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const complete = isComplete ?? percentage === 100;

  return (
    <div
      className={`
        h-2 rounded-full overflow-hidden
        transition-colors duration-300
        ${complete ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-slate-200 dark:bg-white/10'}
        ${className}
      `}>
      <div
        className={`
          h-full rounded-full
          transition-all duration-500 ease-out
          ${
            complete
              ? `bg-gradient-to-r from-emerald-400 to-teal-400 ${showAnimation ? 'animate-pulse' : ''}`
              : 'bg-gradient-to-r from-violet-500 to-purple-500'
          }
        `}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
