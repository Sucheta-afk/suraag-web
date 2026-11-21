import React from 'react';
import { useApp } from '../context/AppContext';
import sidebarArtwork from '../assets/sidebar-artwork.png';
import {
  Home,
  Compass
} from 'lucide-react';

export default function SidebarNav() {
  const {
    activeTab,
    setActiveTab
  } = useApp();

  const navItems = [
    {
      id: 'feed',
      label: 'Home',
      icon: Home,
      onClick: () => setActiveTab('feed'),
      isActive: activeTab === 'feed'
    },
    {
      id: 'discover',
      label: 'Discover',
      icon: Compass,
      onClick: () => setActiveTab('discover'),
      isActive: activeTab === 'discover'
    }
  ];

  return (
    <aside className="sidebar-panel fixed left-0 top-0 z-30 w-56 h-screen flex-shrink-0 flex flex-col overflow-hidden overscroll-none py-4 px-5 border-r border-[#D99A42]/20 bg-[#F8EFDF]/70">
      
      {/* Top Section: Brand & Navigation List */}
      <div className="relative z-10 flex flex-col gap-5">
        
        {/* Brand Header */}
        <div
          onClick={() => setActiveTab('feed')}
          className="cursor-pointer group flex flex-col items-start select-none"
        >
          <h1 className="font-serif text-2xl font-bold tracking-[0.16em] text-[#422315] group-hover:text-amber-800 transition">
            SURAAG
          </h1>
          
          <p className="text-[11px] font-medium text-[#422315]/70 tracking-wide ml-0.5 mt-0.5">
            Create • Collaborate • Belong
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${
                  item.isActive
                    ? 'bg-[#F1E5CF] text-[#422315] shadow-sm font-bold'
                    : 'text-[#6b533f] hover:text-[#422315] hover:bg-[#faf4ec]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-5 h-5 ${
                      item.isActive ? 'text-[#422315]' : 'text-[#7d6148]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span className="w-5 h-5 rounded-full bg-[#e0524a] text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      <img
        src={sidebarArtwork}
        alt=""
        aria-hidden="true"
        className="sidebar-artwork absolute bottom-0 left-0 z-0 h-auto max-h-[40vh] w-full max-w-full select-none pointer-events-none"
      />

    </aside>
  );
}
