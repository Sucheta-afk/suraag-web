import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Sparkles, ChevronDown, Check, User, Edit3, LogOut, Radio } from 'lucide-react';

export default function TopHeader() {
  const {
    currentUser,
    musicians,
    switchUser,
    viewProfile,
    globalSearch,
    setGlobalSearch,
    setActiveTab,
    setIsEditProfileModalOpen
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
            placeholder="Search artists, genres, events..."
            className="w-full bg-white/95 hover:bg-white focus:bg-white text-xs sm:text-sm text-[#422315] placeholder-[#9a7d66] pl-10 pr-4 py-2 sm:py-2.5 rounded-full border border-[#E4D4BD] focus:outline-none focus:ring-2 focus:ring-amber-400/50 shadow-sm transition"
          />
        </div>
      </form>

      {/* Right User Bar: Sparkle + Profile Avatar Dropdown */}
      <div className="flex items-center gap-3 relative">
        
        {/* Golden Sparkle Icon */}
        <button
          onClick={() => setActiveTab('discover')}
          className="relative p-2 rounded-full text-[#D99A42] bg-gradient-to-br from-[#FFF6DE] via-[#F8EFDF] to-[#EFC17F] border border-[#D99A42]/35 shadow-[0_4px_14px_rgba(217,154,66,0.28),inset_0_1px_6px_rgba(255,255,255,0.9)] hover:scale-105 hover:shadow-[0_6px_18px_rgba(217,154,66,0.42),inset_0_1px_7px_rgba(255,255,255,1)] transition duration-200"
          title="Discover Featured Indian Artists"
        >
          <span className="absolute inset-1 rounded-full bg-gradient-to-br from-white/70 to-[#D99A42]/10 blur-[1px]" />
          <Sparkles className="relative w-5 h-5 fill-[#D99A42]/35 drop-shadow-[0_1px_3px_rgba(217,154,66,0.55)]" />
        </button>

        {/* User Avatar with Dropdown Indicator */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-amber-400/60 transition group"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-[#D99A42] shadow-sm"
            />
            <ChevronDown className="w-3.5 h-3.5 text-[#7d6148] group-hover:text-[#422315] transition" />
          </button>

          {/* User Menu Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E4D4BD] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              
              {/* Current Profile Summary */}
              <div
                onClick={() => {
                  viewProfile(currentUser.id);
                  setIsDropdownOpen(false);
                }}
                className="px-4 py-2.5 border-b border-[#f0e3d6] cursor-pointer hover:bg-[#F8EFDF] flex items-center gap-3 transition"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-400"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-[#422315] truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-[#8a684b] truncate">{currentUser.primaryRole}</p>
                  <span className="text-[10px] text-amber-700 font-semibold hover:underline">View Profile →</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="py-1 border-b border-[#f0e3d6]">
                <button
                  onClick={() => {
                    setIsEditProfileModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 text-xs text-[#4b3523] hover:bg-[#F8EFDF] flex items-center gap-2 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#8a684b]" />
                  <span>Edit My Profile</span>
                </button>
              </div>

              {/* Persona Switcher for Quick Testing */}
              <div className="px-4 pt-2 pb-1">
                <span className="text-[10px] font-bold text-[#9a7d66] uppercase tracking-wider">
                  Switch Persona (Demo)
                </span>
              </div>
              <div className="space-y-0.5">
                {musicians.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      switchUser(m.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between transition ${
                      m.id === currentUser.id
                        ? 'bg-[#faedd8] font-bold text-[#422315]'
                        : 'text-[#583f2e] hover:bg-[#F8EFDF]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="truncate">{m.name}</span>
                    </div>
                    {m.id === currentUser.id && (
                      <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>

            </div>
          )}
        </div>

      </div>

    </header>
  );
}
