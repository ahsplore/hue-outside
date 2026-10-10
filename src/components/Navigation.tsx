import React from 'react';
import { Sun, Calendar, Image as ImageIcon, Compass, Palette, Settings } from 'lucide-react';
import type { ActiveTab } from '../types';


interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  todayColorHex: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  todayColorHex
}) => {
  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      tab: 'today',
      label: 'Today',
      icon: <Sun className="w-5 h-5" />
    },
    {
      tab: 'calendar',
      label: 'Calendar',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      tab: 'archive',
      label: 'Archive',
      icon: <ImageIcon className="w-5 h-5" />
    },
    {
      tab: 'scout',
      label: 'Scout',
      icon: <Compass className="w-5 h-5" />,
      badge: 'AI'
    },
    {
      tab: 'discovery',
      label: 'Palette',
      icon: <Palette className="w-5 h-5" />
    },
    {
      tab: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-t border-[#E8E2D5] py-2 px-2 pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-[#193826] font-bold'
                  : 'text-[#6C8578] hover:text-[#193826] font-medium'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-2 text-[8px] font-black uppercase px-1 rounded bg-[#E8A838] text-white">
                    {item.badge}
                  </span>
                )}
                {isActive && item.tab === 'today' && (
                  <span 
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: todayColorHex }}
                  />
                )}
              </div>
              <span className="text-[10px] mt-1">{item.label}</span>
              {isActive && (
                <div className="w-3 h-0.5 rounded-full bg-[#193826] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
