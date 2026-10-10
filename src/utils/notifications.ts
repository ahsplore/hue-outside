import type { TimeWindowConfig } from '../types';


export const TIME_WINDOW_PRESETS: TimeWindowConfig[] = [
  {
    type: 'all_day',
    label: 'All Day (8:00 AM - 9:00 PM)',
    startHour: 8,
    endHour: 21
  },
  {
    type: 'morning',
    label: 'Morning Walk (7:00 AM - 11:00 AM)',
    startHour: 7,
    endHour: 11
  },
  {
    type: 'lunch',
    label: 'Lunchtime Stroll (11:30 AM - 2:30 PM)',
    startHour: 11,
    endHour: 14
  },
  {
    type: 'golden_hour',
    label: 'Golden Hour (4:00 PM - 7:30 PM)',
    startHour: 16,
    endHour: 19
  }
];

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermissionState(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  try {
    return await Notification.requestPermission();
  } catch (err) {
    console.error('Failed to request notification permission:', err);
    return 'denied';
  }
}

export function sendHueNotification(
  title: string,
  body: string,
  icon?: string
): boolean {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }
  try {
    new Notification(title, {
      body,
      icon: icon || '/favicon.svg',
      badge: '/favicon.svg'
    });
    return true;
  } catch (err) {
    console.error('Error dispatching browser notification:', err);
    return false;
  }
}

/**
 * Check if current local hour falls within user's configured time window
 */
export function isWithinTimeWindow(windowConfig: TimeWindowConfig): boolean {
  const currentHour = new Date().getHours();
  return currentHour >= windowConfig.startHour && currentHour <= windowConfig.endHour;
}
