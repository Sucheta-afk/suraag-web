import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Search,
  MapPin,
  Calendar,
  PlusCircle,
  Users,
  CheckCircle,
  Filter,
  Sparkles,
  Music
} from 'lucide-react';

export default function GigsPage() {
  const {
    gigs,
    setIsGigModalOpen,
    setApplyGigModalData,
    viewProfile,
    currentUser
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedInstrument, setSelectedInstrument] = useState('All');

  const gigTypes = [
    'All',
    'Masterclass Workshop',
    'Community Jam',
    'Concert Kacheri',
    'Classical Baithak',
    'Studio Session'
  ];

  const filteredGigs = gigs.filter(g => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = g.title.toLowerCase().includes(q);
      const matchLoc = g.location.toLowerCase().includes(q);
      const matchGenre = (g.genre || '').toLowerCase().includes(q);
      const matchDesc = g.description.toLowerCase().includes(q);
      const matchInst = (g.instrumentsNeeded || []).some(i => i.toLowerCase().includes(q));
      if (!matchTitle && !matchLoc && !matchGenre && !matchDesc && !matchInst) return false;
    }

    if (selectedType !== 'All' && !g.type.toLowerCase().includes(selectedType.toLowerCase().split(' ')[0])) {
      return false;
    }

    if (selectedInstrument !== 'All' && !(g.instrumentsNeeded || []).some(i => i.toLowerCase().includes(selectedInstrument.toLowerCase()))) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#422315] flex items-center gap-2">
            <span>Events, Workshops & Baithaks</span>
            <Calendar className="w-6 h-6 text-amber-600" />
          </h1>
          <p className="text-xs sm:text-sm text-[#7d6148] mt-1">
            Apply to paid concerts, workshops, jam sessions, and studio bookings across India
          </p>
        </div>

        <button
          onClick={() => setIsGigModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-[#422315] shadow-sm transition self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post an Event / Gig</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-[#E4D4BD] card-shadow space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8a684b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title, instrument, city (e.g. Bengaluru, Workshop, Sitar)..."
            className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-[#422315] placeholder-[#9a7d66] focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {gigTypes.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                selectedType === t
                  ? 'bg-amber-500 text-[#422315] shadow-sm'
                  : 'bg-[#F8EFDF] hover:bg-[#f5ede2] text-[#614530] border border-[#E4D4BD]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Gigs List */}
      <div className="space-y-4">
        {filteredGigs.length === 0 ? (
          <div className="bg-white border border-[#E4D4BD] rounded-3xl p-12 text-center space-y-3 card-shadow">
            <Briefcase className="w-12 h-12 text-[#b39982] mx-auto" />
            <h3 className="text-base font-bold text-[#422315]">No events found matching criteria</h3>
            <p className="text-xs text-[#7d6148]">Try adjusting your search keywords or post a new event.</p>
          </div>
        ) : (
          filteredGigs.map((gig) => (
            <div
              key={gig.id}
              className="bg-white border border-[#E4D4BD] hover:border-[#dfcbb7] rounded-3xl p-6 card-shadow transition flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              {/* Left Column: Details */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold bg-[#faedd8] text-amber-900 px-2.5 py-0.5 rounded-lg border border-amber-300">
                    {gig.type}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {gig.pay}
                  </span>
                  <span className="text-[11px] text-[#8a684b]">
                    Posted {gig.postedDate}
                  </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-[#422315]">
                  {gig.title}
                </h3>

                <p className="text-xs text-[#4b3523] leading-relaxed">
                  {gig.description}
                </p>

                {/* Instruments Needed */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-semibold text-[#8a684b]">Instruments:</span>
                  {(gig.instrumentsNeeded || []).map((inst, i) => (
                    <span key={i} className="text-xs font-medium bg-[#F8EFDF] text-[#7d6148] border border-[#E4D4BD] px-2.5 py-0.5 rounded-lg">
                      {inst}
                    </span>
                  ))}
                </div>

                {/* Meta location & date */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#7d6148] pt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{gig.location}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{gig.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>{gig.applicantsCount} Musicians Interested</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Poster Info & Audition CTA */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-[#F1E5CF] pt-4 md:pt-0 md:pl-6">
                <div className="flex items-center gap-2">
                  <img
                    src={gig.postedBy.avatar}
                    alt={gig.postedBy.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-left md:text-right">
                    <p className="text-xs font-semibold text-[#422315]">{gig.postedBy.name}</p>
                    <p className="text-[10px] text-[#8a684b]">Host</p>
                  </div>
                </div>

                <button
                  onClick={() => setApplyGigModalData(gig)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#422315] hover:bg-[#422315] text-white shadow-sm transition"
                >
                  Quick Audition
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
