import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Clock, 
  ShieldCheck, 
  HardDrive, 
  Download, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Volume2,
  VolumeX,
  Info
} from 'lucide-react';
import type { UserSettings, TimeWindowType } from '../types';
import { 
  TIME_WINDOW_PRESETS, 
  getNotificationPermissionState, 
  requestNotificationPermission, 
  sendHueNotification 
} from '../utils/notifications';
import { getStorageStats } from '../utils/db';
import { seedSampleJournalEntries, loadAllEntries } from '../utils/storage';


interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetAllData: () => void;
  onRefreshEntries: () => void;
  todayColorName: string;
  todayColorHex: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
  onRefreshEntries,
  todayColorName,
  todayColorHex
}) => {
  const [permissionState, setPermissionState] = useState<NotificationPermission>(getNotificationPermissionState());
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [storageStats, setStorageStats] = useState<{ count: number; estimatedBytes: number }>({ count: 0, estimatedBytes: 0 });
  const [showClearModal, setShowClearModal] = useState<boolean>(false);
  const [seededMsg, setSeededMsg] = useState<string | null>(null);

  useEffect(() => {
    getStorageStats().then(setStorageStats);
  }, []);

  const handleRequestNotification = async () => {
    const res = await requestNotificationPermission();
    setPermissionState(res);
    if (res === 'granted') {
      onUpdateSettings({ notificationsEnabled: true });
      setNotificationMsg('Browser notification permission granted!');
      setTimeout(() => setNotificationMsg(null), 3000);
    } else {
      onUpdateSettings({ notificationsEnabled: false });
      setNotificationMsg('Notification permission was declined or blocked.');
      setTimeout(() => setNotificationMsg(null), 3500);
    }
  };

  const handleSendTestNotification = () => {
    if (permissionState !== 'granted') {
      setNotificationMsg('Please enable notification permissions first.');
      setTimeout(() => setNotificationMsg(null), 3000);
      return;
    }
    const success = sendHueNotification(
      '🌿 Touch Grass Alert • Hue Outside',
      `Step outside! Today's challenge hue is ${todayColorName} (${todayColorHex}). Can you spot it?`
    );
    if (success) {
      setNotificationMsg('Test notification sent! Check your system notifications.');
    } else {
      setNotificationMsg('Could not dispatch notification. Ensure notifications are allowed.');
    }
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleTimeWindowChange = (type: TimeWindowType) => {
    const preset = TIME_WINDOW_PRESETS.find((p) => p.type === type) || TIME_WINDOW_PRESETS[0];
    onUpdateSettings({ timeWindow: preset });
  };

  const handleExportJournal = () => {
    const entries = loadAllEntries();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hue_outside_field_journal_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSeedSampleData = () => {
    seedSampleJournalEntries();
    onRefreshEntries();
    getStorageStats().then(setStorageStats);
    setSeededMsg('Sample journal entries loaded! Head over to Calendar or My Archive to explore them.');
    setTimeout(() => setSeededMsg(null), 4500);
  };

  const formatKB = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header card */}
      <section className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#52796F] mb-1">
          <SettingsIcon className="w-4 h-4 text-[#2D5A40]" />
          <span>App Preferences & Privacy</span>
        </div>
        <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#193826]">
          Settings & Local Privacy
        </h1>
        <p className="text-xs sm:text-sm text-[#52796F] mt-1">
          Configure your daily challenge hunting schedule, notifications, and device data.
        </p>
      </section>

      {/* Daily Challenge Window */}
      <section className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#2D5A40]" />
          <h2 className="font-serif-title text-lg font-bold text-[#193826]">
            Daily Challenge Time Window
          </h2>
        </div>
        <p className="text-xs text-[#52796F]">
          Choose the ideal time of day when you prefer stepping outside for your color hunt.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {TIME_WINDOW_PRESETS.map((preset) => {
            const isSelected = settings.timeWindow.type === preset.type;
            return (
              <div
                key={preset.type}
                onClick={() => handleTimeWindowChange(preset.type)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-[#193826] bg-[#F4FAF6] ring-1 ring-[#193826]'
                    : 'border-[#E8E2D5] bg-[#FAF7F0] hover:border-[#CFC5B4]'
                }`}
              >
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#193826]">
                    {preset.label}
                  </h4>
                  <span className="text-[11px] text-[#52796F]">
                    {preset.startHour}:00 - {preset.endHour}:00
                  </span>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-[#193826]" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Notifications & Realistic Limitation Disclaimer */}
      <section className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#2D5A40]" />
            <h2 className="font-serif-title text-lg font-bold text-[#193826]">
              Daily Reminders & Notifications
            </h2>
          </div>

          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
            permissionState === 'granted'
              ? 'bg-emerald-100 text-emerald-800'
              : permissionState === 'denied'
              ? 'bg-red-100 text-red-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            Permission: {permissionState}
          </span>
        </div>

        {notificationMsg && (
          <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-xs font-semibold text-[#193826] flex items-center gap-2 animate-pop-in">
            <Info className="w-4 h-4 text-[#2D5A40] shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleRequestNotification}
            className="px-4 py-2.5 rounded-2xl bg-[#193826] text-white hover:bg-[#234B34] text-xs font-bold transition-all shadow-xs"
          >
            {permissionState === 'granted' ? 'Permissions Configured' : 'Request Notification Permission'}
          </button>

          <button
            type="button"
            onClick={handleSendTestNotification}
            className="px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0C2] text-[#193826] hover:bg-[#F3ECE1] text-xs font-bold transition-colors"
          >
            Send Test Alert
          </button>
        </div>

        {/* Real technical explanation */}
        <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-1.5 text-xs text-[#52796F]">
          <span className="font-bold text-[#193826] flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#2D5A40]" />
            Realistic Browser Notification Disclosure:
          </span>
          <p>
            Standard web browser notifications require browser permission and trigger while this tab or browser is active. Due to operating system browser sandboxes, web apps cannot ring a mobile phone or sleeping desktop if the browser process is entirely terminated without native push subscriptions.
          </p>
        </div>
      </section>

      {/* Sound Effects */}
      <section className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF7F0] text-[#2D5A40] flex items-center justify-center">
            {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-serif-title font-bold text-sm sm:text-base text-[#193826]">
              Nature Chime Sound Effects
            </h3>
            <p className="text-xs text-[#52796F]">
              Play gentle audio bell chimes when challenges and streaks are completed.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            settings.soundEnabled
              ? 'bg-[#193826] text-white shadow-2xs'
              : 'bg-[#FAF7F0] border border-[#D8D0C2] text-[#52796F]'
          }`}
        >
          {settings.soundEnabled ? 'Enabled' : 'Muted'}
        </button>
      </section>

      {/* 100% On-Device Privacy & Storage */}
      <section className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-[#2D5A40]" />
          <h2 className="font-serif-title text-lg font-bold text-[#193826]">
            100% On-Device Storage & Privacy
          </h2>
        </div>

        <p className="text-xs text-[#52796F]">
          Hue Outside never sends your personal photographs to third-party cloud servers or AI models. All images are safely encrypted and indexed locally inside your browser's IndexedDB engine.
        </p>

        <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#193826] block">Local Storage Footprint</span>
            <span className="text-[#52796F]">{storageStats.count} photo files stored locally</span>
          </div>
          <span className="font-mono font-bold text-[#193826]">
            {formatKB(storageStats.estimatedBytes)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportJournal}
            className="px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0C2] text-[#193826] hover:bg-[#F3ECE1] text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-[#2D5A40]" />
            Export Journal JSON
          </button>

          <button
            type="button"
            onClick={handleSeedSampleData}
            className="px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0C2] text-[#193826] hover:bg-[#F3ECE1] text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#E8A838]" />
            Load Sample Past Days (Demo)
          </button>

          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </button>
        </div>

        {seededMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-pop-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{seededMsg}</span>
          </div>
        )}
      </section>

      {/* Confirmation Modal for Clearing All Data */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E8E2D5] shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-700 font-serif-title font-bold text-lg">
              <AlertCircle className="w-5 h-5" />
              <span>Reset all photos & streaks?</span>
            </div>
            <p className="text-xs text-[#52796F] leading-relaxed">
              This will permanently delete all local IndexedDB photo entries, wipe your streak history, and restore initial defaults. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onResetAllData();
                  setShowClearModal(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors"
              >
                Yes, Wipe Everything
              </button>
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#D8D0C2] text-[#193826] text-xs font-semibold hover:bg-[#FAF7F0] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
