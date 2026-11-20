import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Compass,
  User,
  PlusCircle
} from 'lucide-react';

export default function MobileBottomNav() {
  const {
    activeTab,
    setActiveTab,
    viewProfile,
    currentUser,
    viewedProfileId,
    setIsPostModalOpen,
    currentTrack
  } = useApp();

  const isMyProfileActive = activeTab === 'profile' && viewedProfileId === currentUser.id;

  return (
    <nav
      className={`lg:hidden fixed left-0 right-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-xl border-t border-[#E4D4BD] shadow-xl transition-all duration-200 ${
        currentTrack ? 'bottom-[68px]' : 'bottom-0'
      }`}
    >
      <div className="grid grid-cols-4 h-14 max-w-md mx-auto px-2">
        
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

        {/* 3. Post Action */}
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-[11px] font-medium text-[#422315] hover:text-amber-800 transition"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-700 text-white flex items-center justify-center shadow-lg shadow-amber-600/30 -mt-2">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 text-amber-800 font-semibold">Post</span>
        </button>

        {/* 4. Separate Tab for Viewing Own Profile */}
        <button
          onClick={() => viewProfile(currentUser.id)}
          className={`flex flex-col items-center justify-center py-1 text-[11px] font-medium transition ${
            isMyProfileActive
              ? 'text-amber-800 font-bold'
              : 'text-[#8a684b] hover:text-[#422315]'
          }`}
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className={`w-5 h-5 rounded-full object-cover mb-0.5 border ${
                isMyProfileActive ? 'border-amber-700 ring-1 ring-amber-700' : 'border-[#D99A42]'
              }`}
            />
          </div>
          <span>Profile</span>
          {isMyProfileActive && (
            <div className="w-4 h-0.5 bg-amber-700 rounded-full mt-0.5" />
          )}
        </button>

      </div>
    </nav>
  );
}
