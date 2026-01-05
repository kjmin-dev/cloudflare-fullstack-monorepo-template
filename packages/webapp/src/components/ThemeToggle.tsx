import { useTheme } from '@/contexts/ThemeContext';
import { MoonIcon, SunIcon } from '@/components/icons';
import { IconButton } from '@/components/ui/ui.exports';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton onClick={toggleTheme} label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
    </IconButton>
  );
}
