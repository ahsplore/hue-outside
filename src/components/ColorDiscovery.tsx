import React, { useState } from 'react';
import { Palette, Eye, EyeOff, Leaf, Coffee, Compass } from 'lucide-react';
import { COLOR_PALETTE } from '../utils/colors';
import type { DailyColor } from '../types';


interface ColorDiscoveryProps {
  onSelectScoutColor?: (color: DailyColor) => void;
}

export const ColorDiscovery: React.FC<ColorDiscoveryProps> = ({ onSelectScoutColor }) => {
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});

  const toggleHint = (colorId: string) => {
    setRevealedHints((prev) => ({
      ...prev,
      [colorId]: !prev[colorId]
    }));
  };

  const filteredColors = COLOR_PALETTE.filter((c) => {
    if (selectedFamily === 'all') return true;
    return c.family === selectedFamily;
  });

  const families = [
    { id: 'all', label: 'All Palette Hues' },
    { id: 'green', label: 'Greens & Moss' },
    { id: 'blue', label: 'Blues & Waters' },
    { id: 'yellow', label: 'Yellows & Golds' },
    { id: 'pink', label: 'Pinks & Sakura' },
    { id: 'purple', label: 'Purples & Lilacs' },
    { id: 'terracotta', label: 'Terracotta & Clay' },
    { id: 'earth', label: 'Earth & Ochre' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <section className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#52796F] mb-1">
              <Palette className="w-4 h-4 text-[#2D5A40]" />
              <span>Curated Natural Spectrum</span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#193826]">
              Seasonal Color Discovery
            </h1>
            <p className="text-xs sm:text-sm text-[#52796F] mt-1">
              Discover the chemistry of pigments in the wild. Click to reveal hidden field hints when you need clues!
            </p>
          </div>

          {/* Family pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {families.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFamily(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedFamily === f.id
                    ? 'bg-[#193826] text-white shadow-2xs'
                    : 'bg-[#FAF7F0] border border-[#E8E2D5] text-[#52796F] hover:text-[#193826]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Colors Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColors.map((color) => {
          const isRevealed = Boolean(revealedHints[color.id]);

          return (
            <div
              key={color.id}
              className="bg-white rounded-3xl border border-[#E8E2D5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Big Swatch Banner */}
                <div
                  className="p-5 text-white relative transition-colors"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block">
                        {color.family} spectrum
                      </span>
                      <h3 className="font-serif-title font-bold text-xl leading-tight">
                        {color.name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold bg-black/25 px-2 py-0.5 rounded-md block">
                        {color.hex}
                      </span>
                      <span className="text-[10px] opacity-75 font-mono">
                        rgb({color.rgb})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Science / Trivia Body */}
                <div className="p-5 space-y-4">
                  <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#E8E2D5] text-xs text-[#446252] leading-relaxed">
                    <strong className="text-[#193826] block mb-0.5">Biological Pigment:</strong>
                    {color.natureFact}
                  </div>

                  {/* Hidden / Revealed Hints Section */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => toggleHint(color.id)}
                      className="w-full py-2 px-3 rounded-xl border border-[#D8D0C2] hover:bg-[#FAF7F0] text-xs font-bold text-[#193826] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {isRevealed ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-[#52796F]" />
                          <span>Hide Field Clues</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-[#2D5A40]" />
                          <span>Reveal Scout Clues (Optional Hints)</span>
                        </>
                      )}
                    </button>

                    {isRevealed && (
                      <div className="space-y-3 pt-2 text-xs animate-pop-in">
                        {/* Nature clues */}
                        <div className="bg-[#F4FAF6] p-3 rounded-2xl border border-[#BDE3C7]">
                          <span className="font-bold text-[#1E6B39] flex items-center gap-1 mb-1.5">
                            <Leaf className="w-3.5 h-3.5" /> Outdoor Nature Clues
                          </span>
                          <ul className="space-y-1 text-[#2D5A40]">
                            {color.natureHints.map((hint, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="opacity-60">•</span>
                                <span>{hint}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Everyday clues */}
                        <div className="bg-[#FFF8F3] p-3 rounded-2xl border border-[#F3DFB7]">
                          <span className="font-bold text-[#B45309] flex items-center gap-1 mb-1.5">
                            <Coffee className="w-3.5 h-3.5" /> Everyday Life Clues
                          </span>
                          <ul className="space-y-1 text-[#78350F]">
                            {color.everydayHints.map((hint, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="opacity-60">•</span>
                                <span>{hint}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              {onSelectScoutColor && (
                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => onSelectScoutColor(color)}
                    className="w-full py-2 px-3 rounded-xl bg-[#FAF7F0] hover:bg-[#F1EBE1] text-[#193826] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8E2D5]"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#E8A838]" />
                    <span>Scout this Hue with AI</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
};
