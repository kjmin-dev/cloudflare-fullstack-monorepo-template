import { CheckIcon } from '../icons';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ checked, onChange, disabled, className = '' }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`
        w-6 h-6 rounded-lg border-2
        flex items-center justify-center
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          checked
            ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-500 shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/30'
            : 'border-slate-300 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500'
        }
        ${className}
      `}>
      {checked && <CheckIcon className="w-4 h-4 text-white" />}
    </button>
  );
}
