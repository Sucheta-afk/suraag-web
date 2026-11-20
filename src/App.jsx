import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import SidebarNav from './components/SidebarNav';
import RightSidebar from './components/RightSidebar';
import TopHeader from './components/TopHeader';
import MobileBottomNav from './components/MobileBottomNav';
import AudioPlayerBar from './components/AudioPlayerBar';

import PostModal from './components/PostModal';
import GigModal from './components/GigModal';
import ApplyGigModal from './components/ApplyGigModal';
import InviteCollabModal from './components/InviteCollabModal';
import EditProfileModal from './components/EditProfileModal';

import FeedPage from './pages/FeedPage';
import DiscoverPage from './pages/DiscoverPage';
import ProfilePage from './pages/ProfilePage';
import GigsPage from './pages/GigsPage';
import NetworkPage from './pages/NetworkPage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import PublicArtistPage from './pages/PublicArtistPage';
import { artistSlug } from './utils/artistSlug';

import { CheckCircle, Info } from 'lucide-react';

function MainLayout() {
  const { activeTab, currentTrack, toastMessage, musicians } = useApp();
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (path) {
    const artist = musicians.find(m => artistSlug(m) === path);
    if (artist) return <PublicArtistPage artist={artist} />;
    return (
      <main className="grid min-h-screen place-items-center bg-[#F8EFDF] px-6 text-center text-[#422315]">
        <div>
          <h1 className="font-serif text-3xl font-bold">Artist Profile Not Found</h1>
          <p className="mt-2 text-[#7d6148] text-sm">This artist profile may have moved or is not published.</p>
        </div>
      </main>
    );
  }

  return (
    <div className={`min-h-screen bg-[#F8EFDF] text-[#422315] selection:bg-[#D99A42] selection:text-[#422315] flex ${
      activeTab === 'profile' ? '' : currentTrack ? 'pb-24' : 'pb-10'
    }`}>
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#422315] text-[#F8EFDF] shadow-2xl border border-[#D99A42]/40">
            {toastMessage.type === 'info' ? (
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
            <span className="text-xs font-semibold">{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* ================= 1. LEFT COLUMN: VERTICAL NAVIGATION SIDEBAR (Desktop) ================= */}
      <div className="hidden lg:block w-56 flex-shrink-0">
        <SidebarNav />
      </div>

      {/* ================= 2. MIDDLE + RIGHT COLUMNS ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header: Search Bar + Sparkles + User Avatar Dropdown */}
        {activeTab !== 'profile' && <TopHeader />}

        {/* Dynamic Page Content */}
        <div
          className={`flex-1 w-full mx-auto ${
            activeTab === 'profile'
              ? 'max-w-none px-0'
              : 'max-w-[1320px] px-3 sm:px-6'
          }`}
        >
          {activeTab === 'feed' ? (
            /* 3-Column Layout on Home/Feed: Middle Feed + Right Events/Trending/Ads */
            <div className="flex gap-6 items-start justify-center">
              {/* Middle Feed Column */}
              <div className="flex-1 max-w-2xl min-w-0">
                <FeedPage />
              </div>

              {/* Right Sidebar Column */}
              <RightSidebar />
            </div>
          ) : (
            /* Other Tabs: Discover, Collaborations, Events, Messages, Notifications, Profile */
            <div className={activeTab === 'profile' ? '' : 'py-4'}>
              {activeTab === 'discover' && <DiscoverPage />}
              {activeTab === 'network' && <NetworkPage />}
              {activeTab === 'gigs' && <GigsPage />}
              {activeTab === 'messages' && <MessagesPage />}
              {activeTab === 'notifications' && <NotificationsPage />}
              {activeTab === 'profile' && <ProfilePage />}
            </div>
          )}
        </div>

      </div>

      {/* Modals */}
      <PostModal />
      <GigModal />
      <ApplyGigModal />
      <InviteCollabModal />
      <EditProfileModal />

      {/* Persistent Audio Player Bar */}
      <AudioPlayerBar />

      {/* Phone App View Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
