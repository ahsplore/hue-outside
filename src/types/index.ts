export interface DailyColor {
  id: string;
  name: string;
  hex: string;
  rgb: string;
  family: 'green' | 'blue' | 'yellow' | 'pink' | 'purple' | 'terracotta' | 'earth';
  lightText: boolean;
  natureFact: string;
  natureHints: string[];
  everydayHints: string[];
  seasonRelevance: string;
}

export type PhotoType = 'nature' | 'everyday';

export interface PhotoEntry {
  type: PhotoType;
  dataUrl?: string; // Loaded from IndexedDB
  uploadedAt: string;
  caption?: string;
}

export interface DayChallengeEntry {
  date: string; // YYYY-MM-DD
  colorId: string;
  colorName: string;
  colorHex: string;
  natureUploaded: boolean;
  natureUploadedAt?: string;
  natureCaption?: string;
  everydayUploaded: boolean;
  everydayUploadedAt?: string;
  everydayCaption?: string;
  completed: boolean;
  completedAt?: string;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalPhotos: number;
  totalCompletedDays: number;
  hasCompletedToday: boolean;
}

export type TimeWindowType = 'all_day' | 'morning' | 'lunch' | 'golden_hour' | 'custom';

export interface TimeWindowConfig {
  type: TimeWindowType;
  label: string;
  startHour: number; // 0-23
  endHour: number;   // 0-23
}

export interface UserSettings {
  notificationsEnabled: boolean;
  timeWindow: TimeWindowConfig;
  ollamaEndpoint: string;
  ollamaModel: string;
  soundEnabled: boolean;
  hasOnboarded: boolean;
}

export type ActiveTab = 'today' | 'calendar' | 'archive' | 'scout' | 'discovery' | 'settings';
