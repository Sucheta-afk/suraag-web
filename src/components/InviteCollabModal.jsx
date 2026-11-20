import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  Calendar,
  Send,
  Music,
  MapPin
} from 'lucide-react';

export default function InviteCollabModal() {
  const {
    inviteModalData,
    setInviteModalData,
    sendMessage,
    setActiveTab,
    showToast
  } = useApp();

  const [collabType, setCollabType] = useState('Classical Jugalbandi / Baithak');
  const [offerRate, setOfferRate] = useState('₹40,000');
  const [dates, setDates] = useState('Next Month');
  const [message, setMessage] = useState('');

  if (!inviteModalData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullProposal = `[COLLABORATION INVITATION: ${collabType.toUpperCase()}]
Offer: ${offerRate} | Timeline: ${dates}
Note: ${message || 'Namaste! I admire your music and style. Would love to collaborate on an upcoming project or live session!'}`;

    sendMessage(inviteModalData.id, fullProposal);
    setInviteModalData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-[#E4D4BD] card-shadow w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1E5CF] bg-[#fdfbf7]">
          <div className="flex items-center gap-3">
            <img
              src={inviteModalData.avatar}
              alt={inviteModalData.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-[#422315] text-base">{inviteModalData.name}</h3>
                <span className="text-[10px] bg-[#faedd8] text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-semibold">
                  {inviteModalData.primaryRole}
                </span>
              </div>
              <p className="text-xs text-[#7d6148] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-600" />
                {inviteModalData.location}
              </p>
            </div>
          </div>
          <button
            onClick={() => setInviteModalData(null)}
            className="text-[#8a684b] hover:text-[#422315] p-1 rounded-xl hover:bg-[#F8EFDF] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          <div>
            <label className="text-xs font-bold text-[#7d6148] block mb-1">Collaboration Type</label>
            <select
              value={collabType}
              onChange={(e) => setCollabType(e.target.value)}
              className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl px-3 py-2 text-xs text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option>Classical Jugalbandi / Baithak</option>
              <option>Studio Track / Song Recording</option>
              <option>Lo-Fi / Fusion Sample Tracking</option>
              <option>Sabha Festival Tour</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#7d6148] block mb-1">Projected Dates</label>
              <input
                type="text"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                placeholder="e.g. Next Month"
                className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl px-3 py-2 text-xs text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#7d6148] block mb-1">Budget / Honorarium</label>
              <input
                type="text"
                value={offerRate}
                onChange={(e) => setOfferRate(e.target.value)}
                placeholder="e.g. ₹40,000"
                className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl px-3 py-2 text-xs text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#7d6148] block mb-1">Custom Message / Project Vision</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce your concept, raga/track reference, and what part you'd like them to record or perform..."
              className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl p-3 text-xs sm:text-sm text-[#422315] placeholder-[#9a7d66] focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#F1E5CF] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setInviteModalData(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7d6148] hover:text-[#422315]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#422315] hover:bg-[#422315] text-white shadow-sm transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Invitation</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
