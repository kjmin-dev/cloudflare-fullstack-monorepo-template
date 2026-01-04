import { CheckIcon } from '../icons';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Checkbox({ checked, onChange, disabled, className = '', id }: CheckboxProps) {
  return (
    <label
      className={`
        relative inline-flex items-center justify-center
        w-6 h-6 rounded-lg border-2 cursor-pointer
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${
          checked
            ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-500 shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/30'
            : 'border-slate-300 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500'
        }
        ${className}
      `}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="absolute opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed"
      />
      {checked && <CheckIcon className="w-4 h-4 text-white pointer-events-none" />}
    </label>
  );
}
