import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Flame, 
  Trophy, 
  Info
} from 'lucide-react';
import type { DayChallengeEntry, UserStats } from '../types';
import { getDailyColorForDate } from '../utils/colors';
import { getAllPhotosFromDB } from '../utils/db';


interface CalendarViewProps {
  entries: Record<string, DayChallengeEntry>;
  todayDateStr: string;
  stats: UserStats;
  onSelectDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  entries,
  todayDateStr,
  stats,
  onSelectDate
}) => {
  // Current viewed month and year
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const [y, m] = todayDateStr.split('-').map(Number);
    return new Date(y, m - 1, 1);
  });

  // Cached photo thumbnails from IndexedDB for completed days
  const [photosMap, setPhotosMap] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    getAllPhotosFromDB().then((photos) => {
      if (isMounted) {
        setPhotosMap(photos);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [entries]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleJumpToToday = () => {
    const [y, m] = todayDateStr.split('-').map(Number);
    setCurrentDate(new Date(y, m - 1, 1));
  };

  // Month name
  const monthName = currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  // Calculate days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayWeekday = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Days array
  const daysArray: number[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  // Calculate monthly completed days
  let monthlyCompletedCount = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (entries[dateStr]?.completed) {
      monthlyCompletedCount++;
    }
  }

  const monthlyPercentage = Math.round((monthlyCompletedCount / daysInMonth) * 100);

  const weekHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header card with month navigation */}
      <section className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#52796F] mb-1">
              <CalendarIcon className="w-4 h-4 text-[#2D5A40]" />
              <span>Field Calendar & Habit Tracker</span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#193826]">
              {monthName}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleJumpToToday}
              className="px-3 py-1.5 rounded-xl border border-[#D8D0C2] hover:bg-[#F3ECE1] text-xs font-bold text-[#193826] transition-colors"
            >
              Today
            </button>
            <div className="flex items-center bg-[#FAF7F0] rounded-xl border border-[#D8D0C2] p-0.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="p-1.5 rounded-lg hover:bg-white text-[#193826] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="p-1.5 rounded-lg hover:bg-white text-[#193826] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Month metrics bar */}
        <div className="mt-5 pt-4 border-t border-[#E8E2D5] grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#E8E2D5] flex items-center justify-between">
            <span className="text-xs text-[#52796F]">Completed this month</span>
            <span className="font-serif-title font-bold text-sm text-[#193826]">
              {monthlyCompletedCount} / {daysInMonth} days ({monthlyPercentage}%)
            </span>
          </div>

          <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#E8E2D5] flex items-center justify-between">
            <span className="text-xs text-[#52796F] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#D97706] fill-[#D97706]" /> Current Streak
            </span>
            <span className="font-serif-title font-bold text-sm text-[#B45309]">
              {stats.currentStreak} Days
            </span>
          </div>

          <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#E8E2D5] flex items-center justify-between">
            <span className="text-xs text-[#52796F] flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-emerald-700" /> Best Streak
            </span>
            <span className="font-serif-title font-bold text-sm text-[#193826]">
              {stats.longestStreak} Days
            </span>
          </div>
        </div>
      </section>

      {/* Calendar Grid */}
      <section className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E8E2D5] shadow-sm">
        {/* Week headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
          {weekHeaders.map((w, idx) => (
            <div 
              key={w} 
              className={`text-[11px] sm:text-xs font-bold py-1 ${
                idx === 0 || idx === 6 ? 'text-[#8C9E94]' : 'text-[#4E6759]'
              }`}
            >
              {w}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {/* Empty offset padding cells */}
          {Array.from({ length: firstDayWeekday }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-transparent" />
          ))}

          {/* Days */}
          {daysArray.map((day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const color = getDailyColorForDate(dateStr);
            const entry = entries[dateStr];
            const isCompleted = entry?.completed;
            const isPartial = !isCompleted && (entry?.natureUploaded || entry?.everydayUploaded);
            const isToday = dateStr === todayDateStr;
            const isPast = dateStr < todayDateStr;


            // Thumbnail if nature or everyday photo is in photosMap
            const thumbUrl = photosMap[`${dateStr}_nature`] || photosMap[`${dateStr}_everyday`];

            return (
              <div
                key={dateStr}
                onClick={() => {
                  if (entry || isPast || isToday) {
                    onSelectDate(dateStr);
                  }
                }}
                className={`relative aspect-square rounded-2xl sm:rounded-3xl border transition-all cursor-pointer group flex flex-col justify-between p-1.5 sm:p-2.5 overflow-hidden ${
                  isToday
                    ? 'ring-2 ring-[#193826] border-[#193826] shadow-sm'
                    : isCompleted
                    ? 'border-[#BDE3C7] bg-[#F4FAF6] hover:shadow-md hover:scale-102'
                    : isPast
                    ? 'border-[#EAE4D7] bg-[#FAF7F0] opacity-80 hover:opacity-100 hover:border-[#CFC5B4]'
                    : 'border-[#F0EBE1] bg-[#FDFCF9] opacity-60'
                }`}
              >
                {/* Completed Photo Background (Instagram story archived style!) */}
                {isCompleted && thumbUrl && (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={thumbUrl}
                      alt={color.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                  </div>
                )}

                {/* Top row: day number & assigned color pill */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className={`text-xs sm:text-sm font-bold ${
                    isCompleted && thumbUrl
                      ? 'text-white drop-shadow-sm font-mono'
                      : isToday
                      ? 'text-[#193826]'
                      : 'text-[#3E5C49]'
                  }`}>
                    {day}
                  </span>

                  {/* Daily assigned color badge */}
                  <div
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ring-1 ring-white/80 shadow-2xs shrink-0"
                    style={{ backgroundColor: color.hex }}
                    title={`Assigned Hue: ${color.name} (${color.hex})`}
                  />
                </div>

                {/* Bottom row: status indicator */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  {isCompleted ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                  ) : isPartial ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800">
                      1/2
                    </span>
                  ) : isToday ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-[#193826] text-white">
                      Today
                    </span>
                  ) : (
                    <span className="text-[9px] text-[#A2B5AB] truncate max-w-[50px] hidden sm:inline">
                      {color.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Guide explanation footer */}
      <section className="p-4 rounded-2xl bg-[#F1EBE1] border border-[#E2D9CA] flex items-center gap-3 text-xs text-[#4E6759]">
        <Info className="w-4 h-4 text-[#2D5A40] shrink-0" />
        <span>
          <strong>Calendar Story View:</strong> Completed dates reveal thumbnail snapshots from your outdoor field trips. Missed dates stay muted. Click any completed or past date to inspect its two-photo collection!
        </span>
      </section>
    </div>
  );
};
