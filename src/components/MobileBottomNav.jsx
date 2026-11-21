import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Compass
} from 'lucide-react';

export default function MobileBottomNav() {
  const {
    activeTab,
    setActiveTab,
    currentTrack
  } = useApp();

  return (
    <nav
      className={`lg:hidden fixed left-0 right-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-xl border-t border-[#E4D4BD] shadow-xl transition-all duration-200 ${
        currentTrack ? 'bottom-[68px]' : 'bottom-0'
      }`}
    >
      <div className="grid grid-cols-2 h-14 max-w-md mx-auto px-2">
        
        {/* 1. Feed / Home (pure feed without owner profile on mobile) */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center py-1 text-[11px] font-medium transition ${
            activeTab === 'feed'
              ? 'text-amber-800 font-bold'
              : 'text-[#8a684b] hover:text-[#422315]'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
          {activeTab === 'feed' && (
            <div className="w-4 h-0.5 bg-amber-700 rounded-full mt-0.5" />
          )}
        </button>

        {/* 2. Discover Artists */}
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center justify-center py-1 text-[11px] font-medium transition ${
            activeTab === 'discover'
              ? 'text-amber-800 font-bold'
              : 'text-[#8a684b] hover:text-[#422315]'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Discover</span>
          {activeTab === 'discover' && (
            <div className="w-4 h-0.5 bg-amber-700 rounded-full mt-0.5" />
          )}
        </button>

      </div>
    </nav>
  );
}
