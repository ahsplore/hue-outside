import { useState, useEffect, useMemo, useCallback } from 'react';
import type { 
  ActiveTab, 
  DailyColor, 
  DayChallengeEntry, 
  PhotoType, 
  UserSettings 
} from './types';

import { 
  formatLocalDate, 
  getDailyColorForDate 
} from './utils/colors';
import { 
  loadUserSettings, 
  saveUserSettings, 
  loadAllEntries, 
  saveAllEntries, 
  getOrCreateEntry, 
  deleteEntry,
  DEFAULT_SETTINGS 
} from './utils/storage';
import { calculateStreaks } from './utils/streak';
import { 
  savePhotoToDB, 
  getPhotoFromDB, 
  deletePhotoFromDB, 
  deleteDayPhotosFromDB, 
  clearAllPhotosFromDB 
} from './utils/db';
import { playChime, triggerCelebrationConfetti } from './utils/sound';

import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeDashboard } from './components/HomeDashboard';
import { CalendarView } from './components/CalendarView';
import { ArchiveView } from './components/ArchiveView';
import { ColorDiscovery } from './components/ColorDiscovery';
import { ColorScoutView } from './components/ColorScoutView';
import { SettingsView } from './components/SettingsView';
import { CameraModal } from './components/CameraModal';
import { DayDetailModal } from './components/DayDetailModal';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [settings, setSettings] = useState<UserSettings>(loadUserSettings);
  const [entries, setEntries] = useState<Record<string, DayChallengeEntry>>(loadAllEntries);

  // Local today string (YYYY-MM-DD)
  const todayDateStr = useMemo(() => formatLocalDate(new Date()), []);
  const todayColor = useMemo(() => getDailyColorForDate(todayDateStr), [todayDateStr]);

  // Today's entry
  const todayEntry = useMemo(() => {
    return entries[todayDateStr] || {
      date: todayDateStr,
      colorId: todayColor.id,
      colorName: todayColor.name,
      colorHex: todayColor.hex,
      natureUploaded: false,
      everydayUploaded: false,
      completed: false
    };
  }, [entries, todayDateStr, todayColor]);

  // Today's cached photos from IndexedDB
  const [todayNaturePhoto, setTodayNaturePhoto] = useState<string | null>(null);
  const [todayEverydayPhoto, setTodayEverydayPhoto] = useState<string | null>(null);

  // Modal states
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);
  const [cameraType, setCameraType] = useState<PhotoType>('nature');
  const [selectedDayModalDate, setSelectedDayModalDate] = useState<string | null>(null);
  const [scoutPreselectedColor, setScoutPreselectedColor] = useState<DailyColor | undefined>(undefined);

  // Load today's photos from IndexedDB on start
  useEffect(() => {
    let isMounted = true;
    if (todayEntry.natureUploaded) {
      getPhotoFromDB(todayDateStr, 'nature').then((data) => {
        if (isMounted) setTodayNaturePhoto(data);
      });
    } else {
      setTodayNaturePhoto(null);
    }

    if (todayEntry.everydayUploaded) {
      getPhotoFromDB(todayDateStr, 'everyday').then((data) => {
        if (isMounted) setTodayEverydayPhoto(data);
      });
    } else {
      setTodayEverydayPhoto(null);
    }

    return () => {
      isMounted = false;
    };
  }, [todayDateStr, todayEntry.natureUploaded, todayEntry.everydayUploaded]);

  // Calculate streaks across all entries
  const stats = useMemo(() => {
    return calculateStreaks(entries, todayDateStr);
  }, [entries, todayDateStr]);

  // Update settings handler
  const handleUpdateSettings = useCallback((newPartial: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      saveUserSettings(updated);
      return updated;
    });
  }, []);

  // Sound toggle in header
  const handleToggleSound = useCallback(() => {
    handleUpdateSettings({ soundEnabled: !settings.soundEnabled });
  }, [settings.soundEnabled, handleUpdateSettings]);

  // Handle photo captured or uploaded
  const handlePhotoCaptured = async (dataUrl: string, caption?: string) => {
    await savePhotoToDB(todayDateStr, cameraType, dataUrl);

    if (cameraType === 'nature') {
      setTodayNaturePhoto(dataUrl);
    } else {
      setTodayEverydayPhoto(dataUrl);
    }

    const current = getOrCreateEntry(todayDateStr, todayColor);
    const wasCompleted = current.completed;

    const updatedEntry: DayChallengeEntry = {
      ...current,
      natureUploaded: cameraType === 'nature' ? true : current.natureUploaded,
      natureUploadedAt: cameraType === 'nature' ? new Date().toISOString() : current.natureUploadedAt,
      natureCaption: cameraType === 'nature' ? caption : current.natureCaption,
      everydayUploaded: cameraType === 'everyday' ? true : current.everydayUploaded,
      everydayUploadedAt: cameraType === 'everyday' ? new Date().toISOString() : current.everydayUploadedAt,
      everydayCaption: cameraType === 'everyday' ? caption : current.everydayCaption,
      completed: false
    };

    // Both photos uploaded -> complete the challenge!
    if (updatedEntry.natureUploaded && updatedEntry.everydayUploaded) {
      updatedEntry.completed = true;
      updatedEntry.completedAt = new Date().toISOString();

      if (!wasCompleted) {
        // Trigger celebratory confetti and nature chime!
        triggerCelebrationConfetti(todayColor.hex);
        playChime(settings.soundEnabled);
      }
    }

    const newEntries = { ...entries, [todayDateStr]: updatedEntry };
    setEntries(newEntries);
    saveAllEntries(newEntries);
  };

  // Remove a photo from today
  const handleRemovePhoto = async (type: PhotoType) => {
    await deletePhotoFromDB(todayDateStr, type);

    if (type === 'nature') {
      setTodayNaturePhoto(null);
    } else {
      setTodayEverydayPhoto(null);
    }

    const current = getOrCreateEntry(todayDateStr, todayColor);
    const updatedEntry: DayChallengeEntry = {
      ...current,
      natureUploaded: type === 'nature' ? false : current.natureUploaded,
      natureUploadedAt: type === 'nature' ? undefined : current.natureUploadedAt,
      natureCaption: type === 'nature' ? undefined : current.natureCaption,
      everydayUploaded: type === 'everyday' ? false : current.everydayUploaded,
      everydayUploadedAt: type === 'everyday' ? undefined : current.everydayUploadedAt,
      everydayCaption: type === 'everyday' ? undefined : current.everydayCaption,
      completed: false,
      completedAt: undefined
    };

    const newEntries = { ...entries, [todayDateStr]: updatedEntry };
    setEntries(newEntries);
    saveAllEntries(newEntries);
  };

  // Delete an entire date entry
  const handleDeleteDateEntry = async (dateStr: string) => {
    await deleteDayPhotosFromDB(dateStr);
    deleteEntry(dateStr);
    const newEntries = { ...entries };
    delete newEntries[dateStr];
    setEntries(newEntries);

    if (dateStr === todayDateStr) {
      setTodayNaturePhoto(null);
      setTodayEverydayPhoto(null);
    }
  };

  // Clear all data
  const handleResetAllData = async () => {
    await clearAllPhotosFromDB();
    localStorage.clear();
    setEntries({});
    setTodayNaturePhoto(null);
    setTodayEverydayPhoto(null);
    setSettings(DEFAULT_SETTINGS);
  };

  const handleRefreshEntries = () => {
    setEntries(loadAllEntries());
  };

  // Open camera modal
  const handleOpenUpload = (type: PhotoType) => {
    setCameraType(type);
    setCameraModalOpen(true);
  };

  // Inspect day entry modal
  const selectedDayEntry = selectedDayModalDate ? entries[selectedDayModalDate] || null : null;

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#193826] flex flex-col font-sans selection:bg-[#E8DCC4] selection:text-[#0F2418]">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        soundEnabled={settings.soundEnabled}
        toggleSound={handleToggleSound}
        todayColorHex={todayColor.hex}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'today' && (
          <HomeDashboard
            todayColor={todayColor}
            todayEntry={todayEntry}
            todayDateStr={todayDateStr}
            stats={stats}
            naturePhotoUrl={todayNaturePhoto}
            everydayPhotoUrl={todayEverydayPhoto}
            onOpenUpload={handleOpenUpload}
            onRemovePhoto={handleRemovePhoto}
            onViewDayDetail={() => setSelectedDayModalDate(todayDateStr)}
            onOpenColorScout={() => {
              setScoutPreselectedColor(todayColor);
              setActiveTab('scout');
            }}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            entries={entries}
            todayDateStr={todayDateStr}
            stats={stats}
            onSelectDate={(dateStr) => setSelectedDayModalDate(dateStr)}
          />
        )}

        {activeTab === 'archive' && (
          <ArchiveView
            entries={entries}
            onSelectDate={(dateStr) => setSelectedDayModalDate(dateStr)}
            onDeleteEntry={handleDeleteDateEntry}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'scout' && (
          <ColorScoutView
            todayColor={todayColor}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            preselectedColor={scoutPreselectedColor}
          />
        )}

        {activeTab === 'discovery' && (
          <ColorDiscovery
            onSelectScoutColor={(color) => {
              setScoutPreselectedColor(color);
              setActiveTab('scout');
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetAllData={handleResetAllData}
            onRefreshEntries={handleRefreshEntries}
            todayColorName={todayColor.name}
            todayColorHex={todayColor.hex}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E2D5] bg-[#FAF7F0] py-8 px-4 text-center text-xs text-[#52796F] mb-16 lg:mb-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-title font-bold text-sm text-[#193826]">HUE OUTSIDE</span>
            <span>•</span>
            <span>Touch Grass Open-Source AI Challenge</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>100% On-Device Photo Privacy</span>
            <span>•</span>
            <span>Ollama Open-Weight Models</span>
            <span>•</span>
            <span>Offline-Ready</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        todayColorHex={todayColor.hex}
      />

      {/* Camera / Upload Modal */}
      <CameraModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        type={cameraType}
        colorName={todayColor.name}
        colorHex={todayColor.hex}
        onPhotoCaptured={handlePhotoCaptured}
      />

      {/* Day Details / Story Inspection Modal */}
      <DayDetailModal
        entry={selectedDayEntry}
        isOpen={Boolean(selectedDayModalDate)}
        onClose={() => setSelectedDayModalDate(null)}
        onDeleteEntry={handleDeleteDateEntry}
      />
    </div>
  );
}

export default App;
