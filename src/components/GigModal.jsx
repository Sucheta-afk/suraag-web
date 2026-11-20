import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Briefcase,
  MapPin,
  Calendar,
  Music,
  Plus
} from 'lucide-react';

export default function GigModal() {
  const {
    isGigModalOpen,
    setIsGigModalOpen,
    postGig
  } = useApp();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Masterclass Workshop');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [pay, setPay] = useState('Free / Networking');
  const [genre, setGenre] = useState('Indo-Fusion');
  const [date, setDate] = useState('November 2026');
  const [description, setDescription] = useState('');
  const [instrumentInput, setInstrumentInput] = useState('');
  const [instrumentsNeeded, setInstrumentsNeeded] = useState(['Producers', 'Songwriters']);

  if (!isGigModalOpen) return null;

  const handleAddInstrument = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = instrumentInput.trim();
      if (val && !instrumentsNeeded.includes(val)) {
        setInstrumentsNeeded([...instrumentsNeeded, val]);
        setInstrumentInput('');
      }
    }
  };

  const removeInstrument = (inst) => {
    setInstrumentsNeeded(instrumentsNeeded.filter(i => i !== inst));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    postGig({
      title,
      type,
      location,
      pay,
      genre,
      date,
      description,
      instrumentsNeeded
    });

    setIsGigModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-[#E4D4BD] card-shadow w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1E5CF] bg-[#fdfbf7]">
          <div>
            <h3 className="font-serif font-bold text-[#422315] text-base">Post an Event, Workshop or Baithak</h3>
            <p className="text-xs text-[#7d6148]">Find musicians, accompanists, or workshop attendees</p>
          </div>
          <button
            onClick={() => setIsGigModalOpen(false)}
            className="text-[#8a684b] hover:text-[#422315] p-1 rounded-xl hover:bg-[#F8EFDF] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          <div>
            <label className="text-xs font-bold text-[#7d6148] block mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Carnatic Lo-Fi Live Rehearsal & Beat Workshop"
              className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl px-4 py-2 text-xs sm:text-sm text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#7d6148] block mb-1">Event Format</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl px-3 py-2 text-xs text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option>Masterclass Workshop</option>
                <option>Community Jam</option>
                <option>Concert Kacheri</option>
                <option>Classical Baithak</option>
                <option>Studio Recording Session</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#7d6148] block mb-1">Compensation / Pay</label>
              <input
                type="text"
                value={pay}
                onChange={(e) => setPay(e.target.value)}
                placeholder="e.g. ₹35,000 / recital or Free"
                className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl px-3 py-2 text-xs text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#7d6148] block mb-1">Location / Venue</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Online (Zoom) or Bengaluru"
                className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl px-3 py-2 text-xs text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#7d6148] block mb-1">Date & Time</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Nov 28, 2026 • 6 PM"
                className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl px-3 py-2 text-xs text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#7d6148] block mb-1">Event Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the repertoire, requirements, recording stem flow, or workshop expectations..."
              className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl p-3 text-xs sm:text-sm text-[#422315] placeholder-[#9a7d66] focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Instruments Tag List */}
          <div>
            <label className="text-xs font-bold text-[#7d6148] block mb-1.5">Instruments Needed</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {instrumentsNeeded.map((inst) => (
                <span
                  key={inst}
                  className="bg-[#faedd8] border border-amber-300 text-amber-900 text-xs px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-semibold"
                >
                  <span>{inst}</span>
                  <button type="button" onClick={() => removeInstrument(inst)} className="hover:text-red-600">×</button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={instrumentInput}
              onChange={(e) => setInstrumentInput(e.target.value)}
              onKeyDown={handleAddInstrument}
              placeholder="Type instrument and press Enter..."
              className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-xl px-3 py-1.5 text-xs text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#F1E5CF] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsGigModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7d6148] hover:text-[#422315]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#422315] hover:bg-[#422315] text-white shadow-sm transition"
            >
              Post Opportunity
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
