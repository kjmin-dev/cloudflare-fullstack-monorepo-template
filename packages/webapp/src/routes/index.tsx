import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRightIcon, ClipboardCheckIcon } from '../components/icons';
import { Button, Card, Input } from '../components/ui';

const USER_ID_KEY = 'todo_user_id';

export const Route = createFileRoute('/')({
  component: MainPage,
});

function MainPage() {
  const { t } = useTranslation();
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUserId = localStorage.getItem(USER_ID_KEY);
    if (savedUserId) {
      navigate({ to: '/todos' });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUserId = userId.trim();
    if (trimmedUserId) {
      localStorage.setItem(USER_ID_KEY, trimmedUserId);
      navigate({ to: '/todos' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400 dark:bg-slate-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 dark:opacity-30 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-400 dark:bg-slate-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 dark:opacity-20 animate-pulse" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-fuchsia-400 dark:bg-slate-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 dark:opacity-20 animate-pulse" />

        <Card variant="elevated" padding="lg" className="relative">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/30 dark:shadow-black/40">
              <ClipboardCheckIcon className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              {t('main.title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('main.subtitle')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder={t('main.placeholder')}
              hasGlow
              autoFocus
              className="text-base py-4"
            />

            <Button type="submit" disabled={!userId.trim()} size="lg" className="w-full group">
              {t('main.start')}
              <ArrowRightIcon className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-6">{t('main.footer')}</p>
      </div>
    </div>
  );
}
