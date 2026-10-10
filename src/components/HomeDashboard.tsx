import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Leaf, 
  Coffee, 
  Camera, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  Flame, 
  Trophy, 
  Compass, 
  Clock, 
  Eye, 
  RotateCcw,
  Footprints,
  Info
} from 'lucide-react';
import type { DailyColor, DayChallengeEntry, PhotoType, UserStats } from '../types';

import { formatFriendlyDate } from '../utils/colors';

interface HomeDashboardProps {
  todayColor: DailyColor;
  todayEntry: DayChallengeEntry;
  todayDateStr: string;
  stats: UserStats;
  naturePhotoUrl: string | null;
  everydayPhotoUrl: string | null;
  onOpenUpload: (type: PhotoType) => void;
  onRemovePhoto: (type: PhotoType) => void;
  onViewDayDetail: () => void;
  onOpenColorScout: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  todayColor,
  todayEntry,
  todayDateStr,
  stats,
  naturePhotoUrl,
  everydayPhotoUrl,
  onOpenUpload,
  onRemovePhoto,
  onViewDayDetail,
  onOpenColorScout
}) => {
  // Countdown to midnight timer
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diffMs = endOfDay.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeLeft('Day Resetting...');
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s left`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const completedCount = (todayEntry.natureUploaded ? 1 : 0) + (todayEntry.everydayUploaded ? 1 : 0);

  // Motivational quote based on completion
  const getMotivationalMessage = () => {
    if (todayEntry.completed) {
      return {
        title: "🌿 Challenge Complete! You touched grass today.",
        subtitle: "Both hues logged into your field journal. Your streak continues! Take a deep breath and enjoy the fresh air.",
        tag: "Grass Touched"
      };
    }
    if (completedCount === 1) {
      return {
        title: "✨ Halfway there! 1 of 2 photos found.",
        subtitle: todayEntry.natureUploaded
          ? "Nature capture logged! Now keep your eyes open for this hue in everyday life."
          : "Everyday item captured! Now take a short stroll outside to find it in nature.",
        tag: "In Progress"
      };
    }
    return {
      title: "Step away from screens. Step into the world.",
      subtitle: `Today's mission: Spot ${todayColor.name} in both the natural outdoors and everyday objects.`,
      tag: "Daily Hunt Active"
    };
  };

  const message = getMotivationalMessage();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-[#E8E2D5] shadow-sm p-6 sm:p-8">
        {/* Background ambient color glow */}
        <div 
          className="absolute -right-24 -top-24 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundColor: todayColor.hex }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="px-3 py-1 rounded-full bg-[#EAE4D7] text-[#193826] flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-[#2D5A40]" />
                {formatFriendlyDate(todayDateStr)}
              </span>

              <span className="px-3 py-1 rounded-full bg-[#FFF8EB] border border-[#F3DFB7] text-[#B45309] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                {timeLeft}
              </span>

              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                todayEntry.completed
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {message.tag}
              </span>
            </div>

            <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#193826] leading-tight">
              {todayColor.name}
            </h1>

            <p className="text-sm sm:text-base text-[#4E6759] leading-relaxed">
              {message.subtitle}
            </p>

            {/* Quick action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenColorScout}
                className="px-4 py-2.5 rounded-2xl bg-[#193826] text-white hover:bg-[#234B34] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-102"
              >
                <Compass className="w-4 h-4 text-[#F4B942]" />
                Ask Color Scout AI
              </button>

              <button
                type="button"
                onClick={onViewDayDetail}
                className="px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0C2] text-[#193826] hover:bg-[#F3ECE1] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4 text-[#52796F]" />
                View Today's Journal
              </button>
            </div>
          </div>

          {/* Color swatch badge */}
          <div className="w-full lg:w-auto flex flex-col items-center sm:items-end">
            <div 
              className="w-full sm:w-64 p-5 rounded-2xl shadow-md border-4 border-white flex flex-col justify-between text-white transition-all transform hover:-translate-y-1"
              style={{ 
                backgroundColor: todayColor.hex,
                color: todayColor.lightText ? '#FFFFFF' : '#193826'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md bg-black/20">
                  Hue of the Day
                </span>
                <span className="font-mono text-xs font-bold bg-black/20 px-2 py-0.5 rounded-md">
                  {todayColor.hex}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xl font-serif-title font-bold leading-tight">
                  {todayColor.name}
                </p>
                <p className="text-[11px] opacity-80 font-mono">
                  rgb({todayColor.rgb})
                </p>
              </div>

              {/* Completion indicator */}
              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                <span>Challenge Status:</span>
                <span className="font-bold">
                  {completedCount}/2 Found
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress tracker banner */}
      <section className="bg-[#FAF7F0] rounded-2xl p-4 border border-[#E8E2D5] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
            todayEntry.completed 
              ? 'bg-emerald-600 text-white' 
              : 'bg-[#193826] text-white'
          }`}>
            {completedCount}/2
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#193826]">
              {todayEntry.completed ? '🎉 Today’s Challenge Completed!' : 'Upload 2 Photos to Unlock Calendar & Streak'}
            </h4>
            <p className="text-[11px] text-[#52796F]">
              1 from living nature + 1 from everyday life.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-48 h-2.5 rounded-full bg-[#E2D9CA] overflow-hidden">
          <div 
            className="h-full transition-all duration-500 rounded-full"
            style={{ 
              width: `${(completedCount / 2) * 100}%`,
              backgroundColor: todayColor.hex 
            }}
          />
        </div>
      </section>

      {/* Two Upload Cards: Nature & Everyday Life */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: Nature */}
        <div className={`relative rounded-3xl p-6 transition-all border ${
          todayEntry.natureUploaded
            ? 'bg-white border-emerald-300 shadow-sm'
            : 'bg-white border-[#E8E2D5] hover:border-[#193826] shadow-xs'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF2EC] text-[#2D5A40] flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#52796F]">
                  Required Photo 1
                </span>
                <h3 className="font-serif-title font-bold text-lg text-[#193826]">
                  Find it in Nature
                </h3>
              </div>
            </div>

            {todayEntry.natureUploaded && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Found
              </span>
            )}
          </div>

          <p className="text-xs text-[#52796F] mb-4">
            Look for this hue in flowers, leaves, bark, skies, bird feathers, mushrooms, stones, or water reflections.
          </p>

          {/* Photo Slot / Preview */}
          {todayEntry.natureUploaded && naturePhotoUrl ? (
            <div className="space-y-3">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-black/5 border border-[#E8E2D5] group shadow-inner">
                <img
                  src={naturePhotoUrl}
                  alt="Nature capture"
                  className="w-full h-full object-cover transition-transform group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenUpload('nature')}
                    className="p-2 rounded-xl bg-white/90 text-[#193826] hover:bg-white text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemovePhoto('nature')}
                    className="p-2 rounded-xl bg-red-600/90 text-white hover:bg-red-700 text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>

              {todayEntry.natureCaption && (
                <p className="text-xs text-[#2D5A40] italic bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8E2D5]">
                  "{todayEntry.natureCaption}"
                </p>
              )}

              <div className="flex items-center justify-between text-[11px] text-[#52796F] pt-1">
                <span>Captured today</span>
                <button
                  type="button"
                  onClick={() => onOpenUpload('nature')}
                  className="font-semibold text-[#193826] hover:underline"
                >
                  Change Photo
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenUpload('nature')}
              className="w-full aspect-4/3 rounded-2xl border-2 border-dashed border-[#CFC5B4] hover:border-[#193826] bg-[#FAF7F0] hover:bg-[#F3ECE1] transition-all flex flex-col items-center justify-center gap-3 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-white group-hover:scale-105 shadow-xs flex items-center justify-center text-[#193826] transition-transform">
                <Camera className="w-5 h-5 text-[#2D5A40]" />
              </div>
              <div className="text-center px-4">
                <p className="text-xs font-bold text-[#193826]">
                  Take or Upload Nature Photo
                </p>
                <p className="text-[11px] text-[#6C8578] mt-0.5">
                  Spot {todayColor.name} outside
                </p>
              </div>
            </button>
          )}
        </div>

        {/* CARD 2: Everyday Life */}
        <div className={`relative rounded-3xl p-6 transition-all border ${
          todayEntry.everydayUploaded
            ? 'bg-white border-emerald-300 shadow-sm'
            : 'bg-white border-[#E8E2D5] hover:border-[#193826] shadow-xs'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F6EFEA] text-[#C86343] flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#52796F]">
                  Required Photo 2
                </span>
                <h3 className="font-serif-title font-bold text-lg text-[#193826]">
                  Find it in Everyday Life
                </h3>
              </div>
            </div>

            {todayEntry.everydayUploaded && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Found
              </span>
            )}
          </div>

          <p className="text-xs text-[#52796F] mb-4">
            Look for this hue in clothing, books, mugs, bicycles, food, furniture, street signs, or interior items.
          </p>

          {/* Photo Slot / Preview */}
          {todayEntry.everydayUploaded && everydayPhotoUrl ? (
            <div className="space-y-3">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-black/5 border border-[#E8E2D5] group shadow-inner">
                <img
                  src={everydayPhotoUrl}
                  alt="Everyday capture"
                  className="w-full h-full object-cover transition-transform group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenUpload('everyday')}
                    className="p-2 rounded-xl bg-white/90 text-[#193826] hover:bg-white text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemovePhoto('everyday')}
                    className="p-2 rounded-xl bg-red-600/90 text-white hover:bg-red-700 text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>

              {todayEntry.everydayCaption && (
                <p className="text-xs text-[#2D5A40] italic bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8E2D5]">
                  "{todayEntry.everydayCaption}"
                </p>
              )}

              <div className="flex items-center justify-between text-[11px] text-[#52796F] pt-1">
                <span>Captured today</span>
                <button
                  type="button"
                  onClick={() => onOpenUpload('everyday')}
                  className="font-semibold text-[#193826] hover:underline"
                >
                  Change Photo
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenUpload('everyday')}
              className="w-full aspect-4/3 rounded-2xl border-2 border-dashed border-[#CFC5B4] hover:border-[#193826] bg-[#FAF7F0] hover:bg-[#F3ECE1] transition-all flex flex-col items-center justify-center gap-3 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-white group-hover:scale-105 shadow-xs flex items-center justify-center text-[#193826] transition-transform">
                <Upload className="w-5 h-5 text-[#C86343]" />
              </div>
              <div className="text-center px-4">
                <p className="text-xs font-bold text-[#193826]">
                  Take or Upload Everyday Photo
                </p>
                <p className="text-[11px] text-[#6C8578] mt-0.5">
                  Spot {todayColor.name} in objects or clothing
                </p>
              </div>
            </button>
          )}
        </div>
      </section>

      {/* Stats Summary Row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#52796F] block">Current Streak</span>
            <span className="font-serif-title font-bold text-xl text-[#193826]">{stats.currentStreak} Days</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#52796F] block">Longest Streak</span>
            <span className="font-serif-title font-bold text-xl text-[#193826]">{stats.longestStreak} Days</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#52796F] block">Total Photos</span>
            <span className="font-serif-title font-bold text-xl text-[#193826]">{stats.totalPhotos}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#52796F] block">Days Completed</span>
            <span className="font-serif-title font-bold text-xl text-[#193826]">{stats.totalCompletedDays}</span>
          </div>
        </div>
      </section>

      {/* Nature Insight Box */}
      <section className="bg-[#FAF7F0] rounded-3xl p-6 border border-[#E8E2D5] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#193826]">
          <Info className="w-4 h-4 text-[#2D5A40]" />
          <span>Why is {todayColor.name} in Nature?</span>
        </div>
        <p className="text-xs sm:text-sm text-[#4E6759] leading-relaxed">
          {todayColor.natureFact}
        </p>
      </section>
    </div>
  );
};
