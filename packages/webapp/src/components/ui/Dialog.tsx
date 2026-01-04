import type { ReactNode } from 'react';
import { Button } from './Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
  variant?: 'default' | 'danger';
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel = 'OK',
  onConfirm,
  variant = 'default',
}: DialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}>
      <div
        className="
          w-full max-w-md mx-4 p-6 rounded-2xl
          bg-white dark:bg-slate-800
          border border-slate-200 dark:border-slate-700
          shadow-xl
          animate-in fade-in zoom-in-95 duration-200
        ">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">{title}</h2>
        <div className="text-slate-600 dark:text-slate-300 mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} size="sm" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
