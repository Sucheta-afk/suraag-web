import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Users,
  Compass,
  Briefcase,
  MessageSquare,
  Bell,
  Search,
  PlusCircle,
  Music,
  ChevronDown,
  UserCheck,
  Disc,
  Radio,
  Sliders,
  Check,
  Sparkles,
  User
} from 'lucide-react';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    musicians,
    switchUser,
    viewProfile,
    viewedProfileId,
    globalSearch,
    setGlobalSearch,
    connections,
    conversations,
    notifications,
    setIsPostModalOpen,
    setIsGigModalOpen
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Unread counts
  const pendingRequestsCount = Object.values(connections).filter(c => c === 'pending').length;
  const unreadMessagesCount = conversations.filter(c => c.unread).length;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      setActiveTab('discover');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-warm-900/95 backdrop-blur-md border-b border-warm-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo & Search */}
          <div className="flex items-center gap-3 sm:gap-6 flex-1 max-w-md">
            <button
              onClick={() => setActiveTab('feed')}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-gold-500 to-amber-700 flex items-center justify-center shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform border border-gold-400/30">
                <Music className="w-5 h-5 text-warm-950 font-bold" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                  Sound<span className="text-gold-400">Link</span>
                  <span className="text-[10px] bg-amber-950/80 text-gold-300 border border-gold-700/60 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider ml-1">
                    IND
                  </span>
                </span>
                <p className="text-[10px] text-warm-400 font-medium">Indian Music Network</p>
              </div>
            </button>

            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isSearchFocused ? 'text-gold-400' : 'text-warm-400'}`} />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search tabla, sitar, Raag Yaman, Mumbai, gigs..."
                  className="w-full bg-warm-950/80 border border-warm-750 rounded-full pl-9 pr-4 py-1.5 text-xs sm:text-sm text-warm-100 placeholder-warm-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/40 transition-all"
                />
              </div>
            </form>
          </div>

          {/* Navigation Items (LinkedIn style top tabs) */}
          <nav className="flex items-center gap-1 sm:gap-2">
            
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-xs font-medium transition-colors relative ${
                activeTab === 'feed'
                  ? 'text-gold-400 font-semibold'
                  : 'text-warm-400 hover:text-warm-100 hover:bg-warm-800/50'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="hidden md:inline">Feed</span>
              {activeTab === 'feed' && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold-400 rounded-full shadow-sm shadow-gold-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('network')}
              className="hidden"
            >
              <div className="relative">
                <Users className="w-5 h-5 mb-0.5" />
                {pendingRequestsCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-amber-600 text-warm-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {pendingRequestsCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Network</span>
              {activeTab === 'network' && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold-400 rounded-full shadow-sm shadow-gold-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('discover')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-xs font-medium transition-colors relative ${
                activeTab === 'discover'
                  ? 'text-gold-400 font-semibold'
                  : 'text-warm-400 hover:text-warm-100 hover:bg-warm-800/50'
              }`}
            >
              <Compass className="w-5 h-5 mb-0.5" />
              <span className="hidden md:inline">Artists</span>
              {activeTab === 'discover' && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold-400 rounded-full shadow-sm shadow-gold-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('gigs')}
              className="hidden"
            >
              <Briefcase className="w-5 h-5 mb-0.5" />
              <span className="hidden md:inline">Gigs & Baithaks</span>
              {activeTab === 'gigs' && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold-400 rounded-full shadow-sm shadow-gold-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className="hidden"
            >
              <div className="relative">
                <MessageSquare className="w-5 h-5 mb-0.5" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-warm-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {unreadMessagesCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Messages</span>
              {activeTab === 'messages' && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold-400 rounded-full shadow-sm shadow-gold-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className="hidden"
            >
              <div className="relative">
                <Bell className="w-5 h-5 mb-0.5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-gold-500 text-warm-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {unreadNotifsCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Alerts</span>
              {activeTab === 'notifications' && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold-400 rounded-full shadow-sm shadow-gold-400" />
              )}
            </button>

            {/* Separate Dedicated Tab for Viewing Own Profile */}
            <button
              onClick={() => viewProfile(currentUser.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-xs font-medium transition-colors relative ${
                activeTab === 'profile' && viewedProfileId === currentUser.id
                  ? 'text-gold-400 font-semibold'
                  : 'text-warm-400 hover:text-warm-100 hover:bg-warm-800/50'
              }`}
            >
              <User className="w-5 h-5 mb-0.5" />
              <span className="hidden md:inline">My Profile</span>
              {activeTab === 'profile' && viewedProfileId === currentUser.id && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold-400 rounded-full shadow-sm shadow-gold-400" />
              )}
            </button>

            <div className="h-7 w-[1px] bg-warm-800 mx-1 hidden sm:block" />

            {/* Quick Action Buttons */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-warm-850 hover:bg-warm-800 text-warm-200 border border-warm-700 transition"
              >
                <PlusCircle className="w-3.5 h-3.5 text-gold-400" />
                <span>Share Bandish</span>
              </button>
              <button
                onClick={() => setIsGigModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-600 via-gold-600 to-amber-700 hover:from-amber-500 hover:to-gold-500 text-warm-950 shadow-sm shadow-gold-600/30 transition"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Post a Gig</span>
              </button>
            </div>

            {/* User Profile & Persona Switcher */}
            <div className="relative ml-1">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-warm-800 transition focus:outline-none"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gold-500/80 shadow"
                />
                <ChevronDown className="w-3.5 h-3.5 text-warm-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown & Musician Persona Switcher */}
              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-2xl glass-dropdown shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 border border-gold-700/40"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  {/* Current User Snapshot */}
                  <div className="flex items-center gap-3 p-2 border-b border-warm-750">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-full object-cover border border-gold-400"
                    />
                    <div className="overflow-hidden">
                      <div className="font-semibold text-sm text-white truncate">{currentUser.name}</div>
                      <div className="text-xs text-gold-400 font-medium">{currentUser.primaryRole}</div>
                      <div className="text-[11px] text-warm-400 truncate">{currentUser.location}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => viewProfile(currentUser.id)}
                    className="w-full mt-2 py-1.5 px-3 text-center text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-600 to-gold-600 hover:from-amber-500 hover:to-gold-500 text-warm-950 transition"
                  >
                    View My Full Profile
                  </button>

                  {/* Switch Persona Section */}
                  <div className="mt-3 pt-2 border-t border-warm-750">
                    <div className="px-2 pb-1.5 text-[11px] font-semibold text-warm-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Switch Active Musician</span>
                      <span className="text-[9px] bg-warm-800 px-1.5 py-0.5 rounded text-gold-300">Testing</span>
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {musicians.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => switchUser(m.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition ${
                            m.id === currentUser.id
                              ? 'bg-gold-950/40 border border-gold-600/50 text-gold-200'
                              : 'hover:bg-warm-800/80 text-warm-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                            <div className="truncate">
                              <span className="font-medium text-white">{m.name}</span>
                              <span className="text-warm-400 text-[10px] block truncate">{m.primaryRole} • {m.location}</span>
                            </div>
                          </div>
                          {m.id === currentUser.id && <Check className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

          </nav>
        </div>
      </div>
    </header>
  );
}
