import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Briefcase,
  Music,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react';

export default function ApplyGigModal() {
  const {
    applyGigModalData,
    setApplyGigModalData,
    currentUser,
    applyToGig,
    playTrack,
    currentTrack,
    isPlaying
  } = useApp();

  const [pitch, setPitch] = useState('');
  const [selectedTrackId, setSelectedTrackId] = useState(() => {
    return currentUser.audioTracks?.[0]?.id || '';
  });
  const [rateRequirement, setRateRequirement] = useState('');

  if (!applyGigModalData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    applyToGig(applyGigModalData.id, {
      pitch,
      trackId: selectedTrackId,
      rate: rateRequirement
    });
    setApplyGigModalData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-[#E4D4BD] card-shadow w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1E5CF] bg-[#fdfbf7]">
          <div>
            <span className="text-[10px] font-bold uppercase bg-[#faedd8] text-amber-900 border border-amber-300 px-2 py-0.5 rounded-lg">
              Event Audition / RSVP
            </span>
            <h3 className="font-serif font-bold text-[#422315] text-base mt-1 truncate">
              {applyGigModalData.title}
            </h3>
            <p className="text-xs text-[#7d6148]">
              Compensation: <span className="text-emerald-700 font-bold">{applyGigModalData.pay}</span>
            </p>
          </div>
          <button
            onClick={() => setApplyGigModalData(null)}
            className="text-[#8a684b] hover:text-[#422315] p-1 rounded-xl hover:bg-[#F8EFDF] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          <div>
            <label className="text-xs font-bold text-[#7d6148] block mb-1">
              Select Demo Audio Track
            </label>
            <div className="space-y-2">
              {(currentUser.audioTracks || []).map((t) => {
                const isSelected = selectedTrackId === t.id;
                const isTrackPlaying = isPlaying && currentTrack?.id === t.id;

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTrackId(t.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#faedd8] border-amber-500'
                        : 'bg-[#F8EFDF] border-[#E4D4BD] hover:bg-[#f5ede2]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playTrack(t);
                        }}
                        className="w-8 h-8 rounded-full bg-amber-500 text-[#422315] flex items-center justify-center flex-shrink-0"
                      >
                        {isTrackPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </button>
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#422315] truncate">{t.title}</p>
                        <p className="text-[10px] text-[#7d6148]">{t.genre} • {t.duration}</p>
                      </div>
                    </div>

                    <div className="w-4 h-4 rounded-full border border-amber-700 flex items-center justify-center flex-shrink-0">
                      {isSelected && <div className="w-2 h-2 rounded-full bg-amber-700" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#7d6148] block mb-1">
              Brief Pitch & Experience
            </label>
            <textarea
              rows={3}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Mention your gharana training, previous sabha recitals, or studio experience..."
              className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl p-3 text-xs sm:text-sm text-[#422315] placeholder-[#9a7d66] focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-[#F1E5CF] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setApplyGigModalData(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7d6148] hover:text-[#422315]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#422315] hover:bg-[#422315] text-white shadow-sm transition"
            >
              Submit Audition
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
