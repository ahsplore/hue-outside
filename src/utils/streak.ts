import type { DayChallengeEntry, UserStats } from '../types';


/**
 * Returns date string YYYY-MM-DD offset by specified number of days
 */
export function getOffsetDateString(dateStr: string, offsetDays: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate user stats & streaks accurately without month-boundary resets.
 */
export function calculateStreaks(
  entries: Record<string, DayChallengeEntry>,
  todayStr: string
): UserStats {
  const completedDates = new Set<string>();
  let totalPhotos = 0;

  for (const date in entries) {
    const entry = entries[date];
    if (entry.natureUploaded) totalPhotos++;
    if (entry.everydayUploaded) totalPhotos++;
    if (entry.completed) {
      completedDates.add(date);
    }
  }

  const hasCompletedToday = completedDates.has(todayStr);

  // Calculate current streak
  let currentStreak = 0;
  if (hasCompletedToday) {
    currentStreak = 1;
    let checkDate = getOffsetDateString(todayStr, -1);
    while (completedDates.has(checkDate)) {
      currentStreak++;
      checkDate = getOffsetDateString(checkDate, -1);
    }
  } else {
    // If today is not completed yet, streak from yesterday is still intact!
    let checkDate = getOffsetDateString(todayStr, -1);
    while (completedDates.has(checkDate)) {
      currentStreak++;
      checkDate = getOffsetDateString(checkDate, -1);
    }
  }

  // Calculate longest streak across all history
  const sortedDates = Array.from(completedDates).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: string | null = null;

  for (const d of sortedDates) {
    if (!lastDate) {
      tempStreak = 1;
    } else {
      const expectedNext = getOffsetDateString(lastDate, 1);
      if (d === expectedNext) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    lastDate = d;
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return {
    currentStreak,
    longestStreak,
    totalPhotos,
    totalCompletedDays: completedDates.size,
    hasCompletedToday
  };
}
