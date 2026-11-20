import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Disc3,
  User,
  Share2,
  Download,
  Sparkles,
  Maximize2
} from 'lucide-react';

export default function AudioPlayerBar() {
  const {
    currentTrack,
    isPlaying,
    playbackProgress,
    currentTimeFormatted,
    durationFormatted,
    volume,
    togglePlayPause,
    handleVolumeChange,
    musicians,
    viewProfile,
    setInviteModalData
  } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);

  if (!currentTrack) {
    return null;
  }

  // Find the artist who owns this track
  const artist = musicians.find(m => 
    (m.audioTracks || []).some(t => t.id === currentTrack.id) ||
    currentTrack.artist === m.name
  ) || {
    name: currentTrack.artist || 'Featured Artist',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80',
    primaryRole: 'Musician'
  };

  const toggleMute = () => {
    if (isMuted) {
      handleVolumeChange(prevVolume || 0.8);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      handleVolumeChange(0);
      setIsMuted(true);
    }
  };

  // Generate stylized waveform bars
  const waveformHeights = currentTrack.waveform || [35, 60, 80, 45, 90, 75, 40, 85, 95, 70, 30, 65, 80, 50, 90, 45, 60, 40];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#24140b]/95 backdrop-blur-xl border-t border-[#4a2e1d] shadow-2xl py-2.5 px-4 sm:px-6 transition-all text-[#F8EFDF]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Track & Artist Info */}
        <div className="flex items-center gap-3 min-w-[200px] max-w-xs">
          <div className="relative group cursor-pointer" onClick={() => artist.id && viewProfile(artist.id)}>
            <img
              src={artist.avatar}
              alt={artist.name}
              className={`w-11 h-11 rounded-xl object-cover border border-[#D99A42]/50 shadow-md ${isPlaying ? 'ring-2 ring-amber-500' : ''}`}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-amber-950/40 rounded-xl flex items-center justify-center">
                <Disc3 className="w-5 h-5 text-amber-300 animate-spin" />
              </div>
            )}
          </div>

          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-semibold text-white truncate hover:text-amber-300 cursor-pointer transition">
                {currentTrack.title}
              </h4>
              {currentTrack.genre && (
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/60 px-1.5 py-0.2 rounded font-mono">
                  {currentTrack.genre}
                </span>
              )}
            </div>
            <p
              onClick={() => artist.id && viewProfile(artist.id)}
              className="text-[11px] text-[#c4a893] truncate hover:underline cursor-pointer"
            >
              {artist.name} {currentTrack.bpm ? `• ${currentTrack.bpm} BPM` : ''} {currentTrack.key ? `• ${currentTrack.key}` : ''}
            </p>
          </div>
        </div>

        {/* Center: Playback Controls & Waveform */}
        <div className="flex-1 max-w-xl flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#241304] flex items-center justify-center shadow-lg shadow-amber-900/40 transform hover:scale-105 active:scale-95 transition"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>
          </div>

          {/* Time & Waveform Progress Bar */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#a88a74] w-8 text-right">
              {currentTimeFormatted}
            </span>

            {/* Stylized waveform preview */}
            <div className="flex-1 flex items-center justify-between gap-1 h-5 cursor-pointer px-1 py-0.5 bg-[#170c06]/60 rounded-lg">
              {waveformHeights.map((h, i) => {
                const percentPosition = (i / waveformHeights.length) * 100;
                const isPlayed = percentPosition <= playbackProgress;

                return (
                  <span
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-150 ${
                      isPlayed
                        ? 'bg-amber-400'
                        : 'bg-[#5a3b27]'
                    }`}
                    style={{
                      height: `${h}%`,
                      transform: isPlaying && isPlayed ? 'scaleY(1.15)' : 'scaleY(1)'
                    }}
                  />
                );
              })}
            </div>

            <span className="text-[11px] font-mono text-[#a88a74] w-8">
              {durationFormatted}
            </span>
          </div>
        </div>

        {/* Right: Tanpura/Synth indicator & Volume */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-[11px] font-semibold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-800/60 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Tanpura & Tabla Live Synth</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-[#a88a74] hover:text-white transition"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1 bg-[#4a2e1d] rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
