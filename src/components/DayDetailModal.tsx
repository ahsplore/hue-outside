import React, { useEffect, useState } from 'react';
import { X, Trash2, Calendar, Download, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import type { DayChallengeEntry } from '../types';

import { getPhotoFromDB } from '../utils/db';
import { formatFriendlyDate, getDailyColorForDate } from '../utils/colors';

interface DayDetailModalProps {
  entry: DayChallengeEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteEntry: (date: string) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  entry,
  isOpen,
  onClose,
  onDeleteEntry
}) => {
  const [naturePhoto, setNaturePhoto] = useState<string | null>(null);
  const [everydayPhoto, setEverydayPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !entry) {
      setNaturePhoto(null);
      setEverydayPhoto(null);
      setShowConfirmDelete(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    Promise.all([
      entry.natureUploaded ? getPhotoFromDB(entry.date, 'nature') : Promise.resolve(null),
      entry.everydayUploaded ? getPhotoFromDB(entry.date, 'everyday') : Promise.resolve(null)
    ])
      .then(([nat, ev]) => {
        if (isMounted) {
          setNaturePhoto(nat);
          setEverydayPhoto(ev);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.error('Error fetching photos for modal:', e);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, entry]);

  if (!isOpen || !entry) return null;

  const color = getDailyColorForDate(entry.date);

  const downloadImage = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = () => {
    onDeleteEntry(entry.date);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#FAF7F0] rounded-3xl shadow-2xl border border-[#E8E2D5] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with color swatch ribbon */}
        <div 
          className="p-5 text-white relative transition-colors"
          style={{ backgroundColor: color.hex }}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold tracking-wider uppercase opacity-90">
                Daily Color Challenge
              </span>
              <h2 className="font-serif-title text-2xl font-bold tracking-tight">
                {color.name}
              </h2>
              <div className="flex items-center gap-2 text-xs opacity-90">
                <span className="font-mono bg-black/25 px-2 py-0.5 rounded-md">{color.hex}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatFriendlyDate(entry.date)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/35 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Status banner */}
          <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#E8E2D5] shadow-2xs">
            <div className="flex items-center gap-2.5">
              {entry.completed ? (
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="font-semibold text-sm text-[#193826]">
                  {entry.completed ? 'Challenge Completed!' : 'In Progress (1/2 Found)'}
                </p>
                <p className="text-xs text-[#52796F]">
                  {entry.completed 
                    ? 'Both nature and everyday life captures confirmed. Grass touched! 🌿'
                    : 'Upload both required photos to continue your streak.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="text-[#9E2A2B] hover:bg-red-50 p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Delete this day's entry"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete Entry</span>
            </button>
          </div>

          {/* Delete confirmation box */}
          {showConfirmDelete && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 space-y-2 animate-pop-in">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-red-700" />
                <span>Delete both photos for {formatFriendlyDate(entry.date)}?</span>
              </div>
              <p className="text-xs text-red-800">
                This will remove photos from local IndexedDB and update streak calculations.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3.5 py-1.5 rounded-xl bg-red-700 text-white text-xs font-bold hover:bg-red-800 transition-colors"
                >
                  Yes, Delete Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-red-300 text-red-900 text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Dual photo grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nature Photo */}
            <div className="bg-white rounded-2xl p-3 border border-[#E8E2D5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#193826]">🌿 In Nature</span>
                  </div>
                  {naturePhoto && (
                    <button
                      type="button"
                      onClick={() => downloadImage(naturePhoto, `hue_nature_${entry.date}.jpg`)}
                      className="text-[#52796F] hover:text-[#193826] p-1 rounded-lg hover:bg-[#F3ECE1]"
                      title="Download photo"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#F3ECE1] flex items-center justify-center">
                  {loading ? (
                    <div className="text-xs text-[#52796F] animate-pulse">Loading photo...</div>
                  ) : naturePhoto ? (
                    <img
                      src={naturePhoto}
                      alt={`Nature capture of ${color.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-xs text-[#8C9E94]">
                      No nature photo uploaded
                    </div>
                  )}
                </div>
              </div>

              {entry.natureCaption && (
                <p className="mt-2.5 text-xs text-[#2D5A40] italic bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8E2D5]">
                  "{entry.natureCaption}"
                </p>
              )}
            </div>

            {/* Everyday Photo */}
            <div className="bg-white rounded-2xl p-3 border border-[#E8E2D5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#193826]">☕ In Everyday Life</span>
                  </div>
                  {everydayPhoto && (
                    <button
                      type="button"
                      onClick={() => downloadImage(everydayPhoto, `hue_everyday_${entry.date}.jpg`)}
                      className="text-[#52796F] hover:text-[#193826] p-1 rounded-lg hover:bg-[#F3ECE1]"
                      title="Download photo"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#F3ECE1] flex items-center justify-center">
                  {loading ? (
                    <div className="text-xs text-[#52796F] animate-pulse">Loading photo...</div>
                  ) : everydayPhoto ? (
                    <img
                      src={everydayPhoto}
                      alt={`Everyday capture of ${color.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-xs text-[#8C9E94]">
                      No everyday photo uploaded
                    </div>
                  )}
                </div>
              </div>

              {entry.everydayCaption && (
                <p className="mt-2.5 text-xs text-[#2D5A40] italic bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8E2D5]">
                  "{entry.everydayCaption}"
                </p>
              )}
            </div>
          </div>

          {/* Nature fact footer */}
          <div className="bg-[#F1EBE1] p-3.5 rounded-2xl border border-[#E2D9CA] text-xs text-[#446252]">
            <span className="font-bold text-[#193826]">Natural Pigment Trivia: </span>
            {color.natureFact}
          </div>
        </div>
      </div>
    </div>
  );
};
