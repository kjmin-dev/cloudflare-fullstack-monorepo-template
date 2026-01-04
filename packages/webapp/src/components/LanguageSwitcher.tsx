import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type SupportedLanguage, supportedLanguages } from '../i18n';
import { ChevronDownIcon, GlobeIcon } from './icons';
import { Button, Card } from './ui';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLanguage = i18n.language as SupportedLanguage;

  const handleLanguageChange = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="gap-2">
        <GlobeIcon className="w-4 h-4" />
        <span className="hidden sm:inline">{t(`language.${currentLanguage}`)}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <Card variant="elevated" padding="none" className="absolute right-0 mt-2 py-2 w-36 z-20" role="listbox">
          {supportedLanguages.map((lang) => (
            <button
              key={lang}
              type="button"
              role="option"
              aria-selected={currentLanguage === lang}
              onClick={() => handleLanguageChange(lang)}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-200 ${
                currentLanguage === lang
                  ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-slate-700'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}>
              {t(`language.${lang}`)}
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}
