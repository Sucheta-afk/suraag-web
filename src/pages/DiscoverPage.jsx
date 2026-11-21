import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Play,
  Pause,
  Sparkles,
  Grid,
  List,
  CheckCircle2
} from 'lucide-react';
import { artistSlug } from '../utils/artistSlug';

const FOUNDING_ARTIST_LIMIT = 30;

function ArtistCard({ musician, isOwn, connectionStatus, toggleConnection, playTrack, currentTrack, isPlaying }) {
  const profileUrl = `/${artistSlug(musician)}`;
  const primaryTrack = musician.audioTracks?.[0];
  const isTrackPlaying = isPlaying && currentTrack?.id === primaryTrack?.id;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#E4D4BD] card-shadow hover:border-[#dfcbb7] transition flex flex-col justify-between">
      <div>
        <div className="h-28 relative bg-gradient-to-r from-amber-950 via-warm-900 to-amber-900">
          <img
            src={musician.coverImage}
            alt="Cover"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {musician.openToGigs && (
            <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Open for Gigs
            </span>
          )}
        </div>

        <div className="px-5 pb-2 -mt-12 relative flex items-end justify-between">
          <img
            src={musician.avatar}
            alt={musician.name}
            onClick={() => { window.location.href = profileUrl; }}
            className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md cursor-pointer"
          />
          {primaryTrack && (
            <button
              onClick={() => playTrack(primaryTrack)}
              className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-[#422315] flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-95 transition"
              title={`Play ${primaryTrack.title}`}
            >
              {isTrackPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          )}
        </div>

        <div className="p-5 pt-2 space-y-2">
          <div className="flex items-center gap-1.5">
            <h3
              onClick={() => { window.location.href = profileUrl; }}
              className="font-bold text-base text-[#422315] hover:text-amber-800 cursor-pointer transition"
            >
              {musician.name}
            </h3>
            {musician.isVerified && (
              <CheckCircle2 className="w-4 h-4 text-[#2563eb] fill-[#2563eb] text-white flex-shrink-0" />
            )}
          </div>

          <p className="text-xs font-semibold text-amber-800">{musician.primaryRole}</p>
          <p className="text-[11px] text-[#7d6148] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>{musician.location}</span>
          </p>
          <p className="text-xs text-[#4b3523] line-clamp-2 pt-1 leading-relaxed">{musician.headline}</p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {(musician.instruments || []).slice(0, 3).map(inst => (
              <span key={inst} className="text-[10px] font-medium bg-[#F8EFDF] text-[#7d6148] border border-[#E4D4BD] px-2 py-0.5 rounded-lg">
                {inst}
              </span>
            ))}
            {(musician.genres || []).slice(0, 2).map(genre => (
              <span key={genre} className="text-[10px] font-medium bg-[#F8EFDF] text-[#422315] border border-[#D99A42] px-2 py-0.5 rounded-lg">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 border-t border-[#F1E5CF] mt-3 flex items-center gap-2">
        <a
          href={profileUrl}
          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[#F8EFDF] hover:bg-[#f5ede2] text-[#422315] border border-[#E4D4BD] transition text-center"
        >
          View Profile
        </a>
        {!isOwn && (
          <button
            onClick={() => toggleConnection(musician.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              connectionStatus === 'connected'
                ? 'bg-[#e5d5c6] text-[#422315]'
                : connectionStatus === 'pending'
                ? 'bg-[#faedd8] text-amber-800'
                : 'bg-amber-500 hover:bg-amber-400 text-[#422315] shadow-sm'
            }`}
          >
            {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'pending' ? 'Pending' : '+ Connect'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const {
    musicians,
    currentUser,
    globalSearch,
    connections,
    toggleConnection,
    playTrack,
    currentTrack,
    isPlaying
  } = useApp();

  const [viewMode, setViewMode] = useState('grid');

  const searchTerms = globalSearch.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const filteredMusicians = musicians.filter(musician => {
    const searchableText = [
      musician.name,
      musician.stageName,
      musician.headline,
      musician.primaryRole,
      musician.location,
      musician.musicalIdentity,
      musician.artistStatement,
      ...(musician.genres || []),
      ...(musician.instruments || []),
      ...(musician.specialisations || []),
      ...(musician.skills || []).map(skill => typeof skill === 'string' ? skill : skill?.name),
      ...(musician.gigTypes || [])
    ].filter(Boolean).join(' ').toLowerCase();

    return searchTerms.every(term => searchableText.includes(term));
  });
  const foundingArtistIds = new Set(musicians.slice(0, FOUNDING_ARTIST_LIMIT).map(musician => musician.id));
  const foundingArtists = filteredMusicians.filter(musician => foundingArtistIds.has(musician.id));
  const otherArtists = filteredMusicians.filter(musician => !foundingArtistIds.has(musician.id));
  const artistGridClass = `grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#422315] flex items-center gap-2">
            <span>Discover Indian Artists & Masters</span>
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-[#7d6148] mt-1">
            Browse verified classical ustads, pandits, vidwans, session accompanists, and fusion performers ready for baithaks and studio takes
          </p>
        </div>

        {/* View Mode & Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#7d6148] bg-white px-3.5 py-1.5 rounded-full border border-[#E4D4BD] card-shadow font-medium">
            <strong className="text-amber-700 font-bold">{filteredMusicians.length}</strong> {searchTerms.length ? 'artists found' : 'artists available'}
          </span>
          <div className="flex items-center bg-white rounded-xl p-1 border border-[#E4D4BD] card-shadow">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-[#faedd8] text-amber-900 font-bold' : 'text-[#8a684b] hover:text-[#422315]'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-[#faedd8] text-amber-900 font-bold' : 'text-[#8a684b] hover:text-[#422315]'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredMusicians.length === 0 ? (
        <p className="rounded-2xl border border-[#E4D4BD] bg-white/70 px-6 py-10 text-center text-sm text-[#7d6148]">
          No artists match “{globalSearch.trim()}”. Try another keyword.
        </p>
      ) : (
        <>
          {foundingArtists.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#422315]">Founding Artist Profiles</h2>
              <div className={artistGridClass}>
                {foundingArtists.map(musician => (
                  <ArtistCard
                    key={musician.id}
                    musician={musician}
                    isOwn={musician.id === currentUser.id}
                    connectionStatus={connections[musician.id] || 'none'}
                    toggleConnection={toggleConnection}
                    playTrack={playTrack}
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                  />
                ))}
              </div>
            </section>
          )}
          {otherArtists.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#422315]">Other Artist Profiles</h2>
              <div className={artistGridClass}>
                {otherArtists.map(musician => (
                  <ArtistCard
                    key={musician.id}
                    musician={musician}
                    isOwn={musician.id === currentUser.id}
                    connectionStatus={connections[musician.id] || 'none'}
                    toggleConnection={toggleConnection}
                    playTrack={playTrack}
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

    </div>
  );
}
