import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Leaf, 
  Coffee, 
  Trash2, 
  Eye, 
  ArrowRight
} from 'lucide-react';
import type { DayChallengeEntry, ActiveTab } from '../types';
import { formatFriendlyDate, getDailyColorForDate } from '../utils/colors';
import { getAllPhotosFromDB } from '../utils/db';

interface ArchiveViewProps {
  entries: Record<string, DayChallengeEntry>;
  onSelectDate: (dateStr: string) => void;
  onDeleteEntry: (dateStr: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  entries,
  onSelectDate,
  onDeleteEntry,
  setActiveTab
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'nature' | 'everyday'>('all');
  const [filterColorFamily, setFilterColorFamily] = useState<string>('all');
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


  // Convert entries object to sorted list (newest first)
  const entriesList = Object.values(entries).sort((a, b) => b.date.localeCompare(a.date));

  // Filter list
  const filteredList = entriesList.filter((entry) => {
    const color = getDailyColorForDate(entry.date);

    // Color family filter
    if (filterColorFamily !== 'all' && color.family !== filterColorFamily) {
      return false;
    }

    // Category filter
    if (filterCategory === 'nature' && !entry.natureUploaded) return false;
    if (filterCategory === 'everyday' && !entry.everydayUploaded) return false;

    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header card */}
      <section className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#52796F] mb-1">
              <ImageIcon className="w-4 h-4 text-[#2D5A40]" />
              <span>Personal Visual Diary</span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#193826]">
              My Field Archive
            </h1>
            <p className="text-xs sm:text-sm text-[#52796F] mt-1">
              {entriesList.length} {entriesList.length === 1 ? 'day' : 'days'} documented in nature & everyday life.
            </p>
          </div>

          {/* Filter bars */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <div className="flex items-center bg-[#FAF7F0] p-1 rounded-2xl border border-[#D8D0C2]">
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterCategory === 'all'
                    ? 'bg-[#193826] text-white shadow-2xs'
                    : 'text-[#52796F] hover:text-[#193826]'
                }`}
              >
                All Pairs
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('nature')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  filterCategory === 'nature'
                    ? 'bg-[#193826] text-white shadow-2xs'
                    : 'text-[#52796F] hover:text-[#193826]'
                }`}
              >
                <Leaf className="w-3 h-3" /> Nature
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('everyday')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  filterCategory === 'everyday'
                    ? 'bg-[#193826] text-white shadow-2xs'
                    : 'text-[#52796F] hover:text-[#193826]'
                }`}
              >
                <Coffee className="w-3 h-3" /> Everyday
              </button>
            </div>

            {/* Color Family Dropdown */}
            <select
              value={filterColorFamily}
              onChange={(e) => setFilterColorFamily(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-[#FAF7F0] border border-[#D8D0C2] text-xs font-bold text-[#193826] focus:outline-none"
            >
              <option value="all">All Color Palettes</option>
              <option value="green">Greens</option>
              <option value="blue">Blues</option>
              <option value="yellow">Yellows & Golds</option>
              <option value="pink">Pinks</option>
              <option value="purple">Purples & Lilacs</option>
              <option value="terracotta">Terracotta & Coral</option>
              <option value="earth">Earthy & Ochres</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid of Journal Entries */}
      {filteredList.length === 0 ? (
        /* Empty State */
        <section className="bg-white rounded-3xl p-12 border border-[#E8E2D5] text-center space-y-4 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-[#FAF7F0] border border-[#E8E2D5] mx-auto flex items-center justify-center text-[#2D5A40]">
            <Leaf className="w-10 h-10 animate-bounce" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-serif-title text-xl font-bold text-[#193826]">
              Your Field Journal is Fresh & Clear
            </h3>
            <p className="text-xs sm:text-sm text-[#52796F]">
              Step outside, look for today's color in nature and everyday objects, and save your very first photos.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('today')}
              className="px-5 py-3 rounded-2xl bg-[#193826] text-white font-bold text-sm hover:bg-[#234B34] transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Start Today's Color Hunt</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((entry) => {
            const color = getDailyColorForDate(entry.date);
            const naturePhoto = photosMap[`${entry.date}_nature`];
            const everydayPhoto = photosMap[`${entry.date}_everyday`];

            return (
              <div
                key={entry.date}
                className="bg-white rounded-3xl border border-[#E8E2D5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Color Banner */}
                  <div
                    className="p-4 text-white relative transition-colors flex items-center justify-between"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div>
                      <span className="text-[10px] font-bold tracking-widest uppercase opacity-90 block">
                        {formatFriendlyDate(entry.date)}
                      </span>
                      <h3 className="font-serif-title font-bold text-lg leading-tight">
                        {color.name}
                      </h3>
                    </div>

                    <span className="font-mono text-xs font-bold bg-black/25 px-2 py-0.5 rounded-md">
                      {color.hex}
                    </span>
                  </div>

                  {/* Dual Photo Presentation */}
                  <div className="p-4 grid grid-cols-2 gap-2">
                    {/* Nature Photo */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#2D5A40]">
                        <Leaf className="w-3 h-3" /> Nature
                      </div>
                      <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF7F0] border border-[#E8E2D5] relative flex items-center justify-center">
                        {naturePhoto ? (
                          <img
                            src={naturePhoto}
                            alt="Nature capture"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <span className="text-[10px] text-[#A2B5AB] p-2 text-center">
                            Missing
                          </span>
                        )}
                      </div>
                      {entry.natureCaption && (
                        <p className="text-[11px] text-[#52796F] truncate italic">
                          "{entry.natureCaption}"
                        </p>
                      )}
                    </div>

                    {/* Everyday Photo */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#C86343]">
                        <Coffee className="w-3 h-3" /> Everyday
                      </div>
                      <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF7F0] border border-[#E8E2D5] relative flex items-center justify-center">
                        {everydayPhoto ? (
                          <img
                            src={everydayPhoto}
                            alt="Everyday capture"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <span className="text-[10px] text-[#A2B5AB] p-2 text-center">
                            Missing
                          </span>
                        )}
                      </div>
                      {entry.everydayCaption && (
                        <p className="text-[11px] text-[#52796F] truncate italic">
                          "{entry.everydayCaption}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-0 border-t border-[#F0EBE1] mt-2 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    entry.completed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {entry.completed ? 'Grass Touched 🌿' : '1/2 Complete'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectDate(entry.date)}
                      className="p-2 rounded-xl text-[#193826] hover:bg-[#FAF7F0] text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Inspect entry"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteEntry(entry.date)}
                      className="p-2 rounded-xl text-[#9E2A2B] hover:bg-red-50 text-xs transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
};
