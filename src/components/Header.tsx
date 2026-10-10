import React from 'react';
import { Sparkles, Flame, Volume2, VolumeX, Leaf, Compass, Calendar as CalendarIcon, Image as ImageIcon, Palette, Settings as SettingsIcon, Sun } from 'lucide-react';
import type { ActiveTab, UserStats } from '../types';


interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: UserStats;
  soundEnabled: boolean;
  toggleSound: () => void;
  todayColorHex: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stats,
  soundEnabled,
  toggleSound,
  todayColorHex
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E8E2D5] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('today')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#193826] text-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
            {/* Color Accent bar inside logo */}
            <div 
              className="absolute bottom-0 inset-x-0 h-1.5 transition-colors"
              style={{ backgroundColor: todayColorHex }}
            />
            <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-[#98D8AA]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-title text-xl sm:text-2xl font-bold tracking-tight text-[#193826]">
                HUE OUTSIDE
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8E2D5] text-[#2D5A40]">
                Touch Grass AI
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#52796F] font-medium hidden sm:block">
              Daily outdoor color challenge
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F1EBE1] p-1.5 rounded-full border border-[#E2D9CA]">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'today'
                ? 'bg-[#193826] text-white shadow-sm'
                : 'text-[#3E5C49] hover:text-[#193826] hover:bg-black/5'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            Today
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'calendar'
                ? 'bg-[#193826] text-white shadow-sm'
                : 'text-[#3E5C49] hover:text-[#193826] hover:bg-black/5'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            Calendar
          </button>

          <button
            onClick={() => setActiveTab('archive')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'archive'
                ? 'bg-[#193826] text-white shadow-sm'
                : 'text-[#3E5C49] hover:text-[#193826] hover:bg-black/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            My Archive
          </button>

          <button
            onClick={() => setActiveTab('scout')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'scout'
                ? 'bg-[#193826] text-white shadow-sm'
                : 'text-[#3E5C49] hover:text-[#193826] hover:bg-black/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#E8A838]" />
            Color Scout <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-[#E8A838]/20 text-[#193826]">AI</span>
          </button>

          <button
            onClick={() => setActiveTab('discovery')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'discovery'
                ? 'bg-[#193826] text-white shadow-sm'
                : 'text-[#3E5C49] hover:text-[#193826] hover:bg-black/5'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Palette
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-[#193826] text-white shadow-sm'
                : 'text-[#3E5C49] hover:text-[#193826] hover:bg-black/5'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Right side stats pill and sound toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak pill */}
          <div 
            onClick={() => setActiveTab('calendar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8EB] border border-[#F3DFB7] text-[#B45309] font-bold text-xs sm:text-sm cursor-pointer hover:bg-[#FEF3C7] transition-colors shadow-2xs"
            title="Current Streak: Consecutive days completed"
          >
            <Flame className="w-4 h-4 text-[#D97706] fill-[#D97706] animate-pulse" />
            <span>{stats.currentStreak} {stats.currentStreak === 1 ? 'Day' : 'Days'}</span>
          </div>

          {/* Grass Touched Badge */}
          {stats.hasCompletedToday && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#EBF6EE] border border-[#BDE3C7] text-[#1E6B39] font-semibold text-xs animate-pop-in">
              <Sparkles className="w-3.5 h-3.5 text-[#1E6B39]" />
              <span>Grass Touched!</span>
            </div>
          )}

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute nature sounds' : 'Enable nature sounds'}
            title={soundEnabled ? 'Chime sound enabled' : 'Chime sound muted'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#52796F] hover:text-[#193826] hover:bg-[#EAE4D7] transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 opacity-50" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
