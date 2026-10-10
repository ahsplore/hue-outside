import type { DayChallengeEntry, UserSettings, DailyColor } from '../types';
import { TIME_WINDOW_PRESETS } from './notifications';
import { getDailyColorForDate } from './colors';


const SETTINGS_KEY = 'hue_outside_user_settings_v1';
const ENTRIES_KEY = 'hue_outside_entries_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  notificationsEnabled: false,
  timeWindow: TIME_WINDOW_PRESETS[0],
  ollamaEndpoint: 'http://localhost:11434',
  ollamaModel: 'llama3.2:latest',
  soundEnabled: true,
  hasOnboarded: false
};

export function loadUserSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading user settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving user settings:', e);
  }
}

export function loadAllEntries(): Record<string, DayChallengeEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading entries:', e);
    return {};
  }
}

export function saveAllEntries(entries: Record<string, DayChallengeEntry>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Error saving entries:', e);
  }
}

export function getOrCreateEntry(dateStr: string, color?: DailyColor): DayChallengeEntry {
  const entries = loadAllEntries();
  if (entries[dateStr]) {
    return entries[dateStr];
  }

  const assignedColor = color || getDailyColorForDate(dateStr);
  const newEntry: DayChallengeEntry = {
    date: dateStr,
    colorId: assignedColor.id,
    colorName: assignedColor.name,
    colorHex: assignedColor.hex,
    natureUploaded: false,
    everydayUploaded: false,
    completed: false
  };

  entries[dateStr] = newEntry;
  saveAllEntries(entries);
  return newEntry;
}

export function deleteEntry(dateStr: string): void {
  const entries = loadAllEntries();
  if (entries[dateStr]) {
    delete entries[dateStr];
    saveAllEntries(entries);
  }
}

/**
 * Generate sample field journal data for testing calendar & streak tracking
 */
export function seedSampleJournalEntries(): Record<string, DayChallengeEntry> {
  const entries = loadAllEntries();
  const today = new Date();

  // Create entries for 3 past consecutive days so reviewer immediately sees streak
  for (let i = 3; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;

    if (!entries[dateStr]) {
      const color = getDailyColorForDate(dateStr);
      entries[dateStr] = {
        date: dateStr,
        colorId: color.id,
        colorName: color.name,
        colorHex: color.hex,
        natureUploaded: true,
        natureUploadedAt: new Date(d.setHours(10, 15, 0)).toISOString(),
        natureCaption: `Spotted ${color.name} on a quiet morning stroll.`,
        everydayUploaded: true,
        everydayUploadedAt: new Date(d.setHours(15, 40, 0)).toISOString(),
        everydayCaption: `Found matching hue on kitchen ceramics.`,
        completed: true,
        completedAt: new Date(d.setHours(15, 40, 0)).toISOString()
      };
    }
  }

  saveAllEntries(entries);
  return entries;
}
