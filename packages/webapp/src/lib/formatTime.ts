import type { TFunction } from 'i18next';

export function formatFullDateTime(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatTime(dateString: string, t: TFunction): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  const SECONDS_IN_MINUTE = 60;
  const SECONDS_IN_HOUR = 3600;
  const SECONDS_IN_DAY = 86400;

  if (diffSeconds < SECONDS_IN_DAY) {
    if (diffSeconds <= 0) {
      return t('time.now');
    }
    if (diffSeconds < SECONDS_IN_MINUTE) {
      return t('time.secondsAgo', { count: diffSeconds });
    }
    if (diffSeconds < SECONDS_IN_HOUR) {
      const minutes = Math.floor(diffSeconds / SECONDS_IN_MINUTE);
      return t('time.minutesAgo', { count: minutes });
    }
    const hours = Math.floor(diffSeconds / SECONDS_IN_HOUR);
    return t('time.hoursAgo', { count: hours });
  }

  return formatFullDateTime(dateString);
}
