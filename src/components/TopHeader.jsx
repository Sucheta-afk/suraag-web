import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Sparkles } from 'lucide-react';

export default function TopHeader() {
  const {
    globalSearch,
    setGlobalSearch,
    setActiveTab
  } = useApp();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      setActiveTab('discover');
    }
  };

  return (
    <header className="py-3 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30 bg-[#F8EFDF]/95 backdrop-blur-md">
      
      {/* Mobile Title on small screens */}
      <div
        className="lg:hidden flex items-center flex-shrink-0 cursor-pointer"
        onClick={() => setActiveTab('feed')}
        title="SURAAG"
      >
        <span className="font-serif text-lg font-bold tracking-[0.14em] text-[#422315]">
          SURAAG
        </span>
      </div>

      {/* Search Input Bar (Matches Mockup) */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex-1 max-w-xl relative"
      >
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#8a684b] absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            aria-label="Search artists"
            placeholder="Search artists, genres, instruments..."
            className="w-full bg-white/95 hover:bg-white focus:bg-white text-xs sm:text-sm text-[#422315] placeholder-[#9a7d66] pl-10 pr-4 py-2 sm:py-2.5 rounded-full border border-[#E4D4BD] focus:outline-none focus:ring-2 focus:ring-amber-400/50 shadow-sm transition"
          />
        </div>
      </form>

      {/* Discover shortcut */}
      <div className="flex items-center gap-3">
        {/* Golden Sparkle Icon */}
        <button
          onClick={() => setActiveTab('discover')}
          className="relative p-2 rounded-full text-[#D99A42] bg-gradient-to-br from-[#FFF6DE] via-[#F8EFDF] to-[#EFC17F] border border-[#D99A42]/35 shadow-[0_4px_14px_rgba(217,154,66,0.28),inset_0_1px_6px_rgba(255,255,255,0.9)] hover:scale-105 hover:shadow-[0_6px_18px_rgba(217,154,66,0.42),inset_0_1px_7px_rgba(255,255,255,1)] transition duration-200"
          title="Discover Featured Indian Artists"
        >
          <span className="absolute inset-1 rounded-full bg-gradient-to-br from-white/70 to-[#D99A42]/10 blur-[1px]" />
          <Sparkles className="relative w-5 h-5 fill-[#D99A42]/35 drop-shadow-[0_1px_3px_rgba(217,154,66,0.55)]" />
        </button>
      </div>

    </header>
  );
}
