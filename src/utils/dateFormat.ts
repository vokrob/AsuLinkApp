export function formatVkStyle(date: Date | string): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date.replace(/(\d+)\.(\d+)\.(\d+)/, '$3-$2-$1')) : date;
  const now = new Date();

  if (isNaN(dateObj.getTime())) {
    return typeof date === 'string' ? date : '';
  }

  const diffMs = now.getTime() - dateObj.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const timeString = dateObj.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  if (diffDays === 0) {
    if (diffMinutes < 1) return 'только что';

    if (diffMinutes < 60) {
      const minutes = diffMinutes;
      if (minutes === 1 || minutes === 21 || minutes === 31 || minutes === 41 || minutes === 51) {
        return `${minutes} минуту назад`;
      } else if ((minutes >= 2 && minutes <= 4) ||
        (minutes >= 22 && minutes <= 24) ||
        (minutes >= 32 && minutes <= 34) ||
        (minutes >= 42 && minutes <= 44) ||
        (minutes >= 52 && minutes <= 54)) {
        return `${minutes} минуты назад`;
      } else {
        return `${minutes} минут назад`;
      }
    }

    if (diffHours < 24) {
      if (diffHours === 1 || diffHours === 21) {
        return 'час назад';
      } else if ((diffHours >= 2 && diffHours <= 4) || (diffHours >= 22 && diffHours <= 24)) {
        return `${diffHours} часа назад`;
      } else {
        return `${diffHours} часов назад`;
      }
    }
  }

  if (diffDays === 1) {
    return `вчера в ${timeString}`;
  }

  if (diffDays < 7) {
    const days = ['воскресенье', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу'];
    return `в ${days[dateObj.getDay()]} в ${timeString}`;
  }

  return dateObj.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ` в ${timeString}`;
} 