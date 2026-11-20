import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export default function RightSidebar() {
  const {
    events,
    setActiveTab,
    setGlobalSearch,
    setApplyGigModalData,
    gigs
  } = useApp();

  const trendingTags = [
    '#IndianClassical',
    '#MusicProduction',
    '#IndieIndia',
    '#CarnaticMusic',
    '#Fusion'
  ];

  const handleEventClick = (eventItem) => {
    // Match event with gig if available for modal audition
    const matchedGig = gigs.find(g => g.title.toLowerCase().includes(eventItem.title.toLowerCase().split(' ')[0]));
    if (matchedGig) {
      setApplyGigModalData(matchedGig);
    }
  };

  const handleTagClick = (tag) => {
    setGlobalSearch(tag);
    setActiveTab('discover');
  };

  return (
    <aside className="w-72 flex-shrink-0 space-y-4 py-6 pr-2 hidden xl:block">
      
      {/* 1. Upcoming Events Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#D99A42]/25 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#422315]">
            Upcoming Events
          </h3>
        </div>

        <div className="space-y-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              onClick={() => handleEventClick(ev)}
              className="flex items-center justify-between gap-3 group cursor-pointer hover:bg-[#F8EFDF] p-1.5 -mx-1.5 rounded-2xl transition"
            >
              {/* Left Date Column */}
              <div className="w-12 text-left flex-shrink-0">
                <span className="block text-[11px] font-bold tracking-wider text-[#7d6148] uppercase">
                  {ev.dateMonth}
                </span>
                <span className="block text-2xl font-bold font-serif leading-none text-[#422315] mt-0.5">
                  {ev.dateDay}
                </span>
              </div>

              {/* Middle Title & Details */}
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="text-xs font-bold text-[#422315] group-hover:text-amber-800 transition truncate">
                  {ev.title}
                </h4>
                <p className="text-[11px] text-[#8a684b] mt-0.5 truncate">
                  {ev.location} • {ev.time}
                </p>
              </div>

              {/* Right Thumbnail Image */}
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-[#E4D4BD] bg-[#F8EFDF]">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Trending in Music Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#E4D4BD] card-shadow">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-base font-bold text-[#422315]">
            Trending in Music
          </h3>
          <button
            onClick={() => setActiveTab('discover')}
            className="text-xs font-semibold text-[#8a684b] hover:text-[#422315] flex items-center gap-1 transition"
          >
            <span>View all</span>
            <span className="text-sm">→</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#F8EFDF] hover:bg-[#F1E5CF] text-[#422315] transition border border-[#D99A42]"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Community Ad / Promo Card: "Find Your Musical Tribe" */}
      <div
        className="hidden h-[160px] rounded-2xl p-5 border border-[#D99A42]/30 bg-cover bg-center relative overflow-hidden card-shadow"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(31,18,12,.88) 0%, rgba(42,24,16,.58) 58%, rgba(42,24,16,.08) 100%), url('https://images.unsplash.com/photo-1506157786151-b8491531f063?w=700&auto=format&fit=crop&q=85')"
        }}
      >
        
        {/* Subtle decorative stars & notes */}
        <div className="absolute top-3 right-28 text-[#D99A42] opacity-60 text-xs">✦</div>
        <div className="absolute top-8 right-20 text-[#D99A42] opacity-70 text-sm">♪</div>
        <div className="absolute top-5 right-10 text-[#D99A42] opacity-60 text-base">♫</div>

        <div className="relative z-10 max-w-[190px]">
          <h3 className="text-lg font-serif font-bold text-[#F8EFDF] leading-tight mb-1">
            Find Your Musical Tribe
          </h3>
          <p className="text-[11px] text-[#F8EFDF]/75 font-medium leading-relaxed mb-4">
            Join collaborations, projects and communities!
          </p>

          <button
            onClick={() => setActiveTab('network')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#D99A42] hover:bg-[#e7ad5b] text-[#422315] shadow-md shadow-[#422315]/30 transition group"
          >
            <span>Explore Collaborations</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>

        {/* Singer Silhouette Art on the right side */}
        <div className="absolute bottom-0 right-0 w-28 h-36 pointer-events-none opacity-20 select-none">
          <svg viewBox="0 0 120 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="singerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#431c59" />
                <stop offset="100%" stopColor="#2b103b" />
              </linearGradient>
            </defs>

            {/* Microphone with stand */}
            <line x1="36" y1="80" x2="36" y2="160" stroke="#4a2562" strokeWidth="3" />
            <ellipse cx="36" cy="74" rx="7" ry="10" fill="#422315" stroke="#e9d5ff" strokeWidth="1" />
            <path d="M26 78 C26 90, 46 90, 46 78" stroke="#4a2562" strokeWidth="2" fill="none" />

            {/* Singing Woman Silhouette */}
            {/* Hair flowing back */}
            <path
              d="M75 52 C65 40, 70 25, 85 24 C100 23, 115 35, 112 55 C110 70, 95 78, 108 98 C115 110, 110 135, 110 160 L60 160 C60 135, 62 110, 68 100 C74 90, 68 82, 66 75 C62 65, 68 56, 75 52 Z"
              fill="url(#singerGrad)"
            />
            {/* Face profile singing towards microphone */}
            <path
              d="M72 45 C70 47, 60 48, 56 46 C52 50, 56 55, 50 56 C53 60, 50 63, 56 64 C58 70, 64 72, 68 76"
              fill="url(#singerGrad)"
            />
            {/* Hand holding microphone */}
            <path
              d="M48 85 C42 82, 34 82, 32 88 C30 94, 40 98, 48 95 C55 105, 62 115, 65 125 L75 120 C72 105, 60 92, 48 85 Z"
              fill="url(#singerGrad)"
            />
          </svg>
        </div>

      </div>

    </aside>
  );
}
