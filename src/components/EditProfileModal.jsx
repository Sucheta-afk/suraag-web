import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  Music,
  MapPin,
  Plus,
  Trash2,
  Check
} from 'lucide-react';

export default function EditProfileModal() {
  const {
    isEditProfileModalOpen,
    setIsEditProfileModalOpen,
    currentUser,
    updateProfile,
    addAudioTrack
  } = useApp();

  const [headline, setHeadline] = useState(currentUser.headline || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [rate, setRate] = useState(currentUser.rate || '₹45,000 - ₹90,000 / project');
  const [openToGigs, setOpenToGigs] = useState(currentUser.openToGigs ?? true);
  
  // Instruments & Genres
  const [instruments, setInstruments] = useState(currentUser.instruments || []);
  const [instInput, setInstInput] = useState('');
  
  const [genres, setGenres] = useState(currentUser.genres || []);
  const [genreInput, setGenreInput] = useState('');

  // Gear
  const [gear, setGear] = useState(currentUser.gear || []);
  const [gearInput, setGearInput] = useState('');

  // Add new track state
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackGenre, setNewTrackGenre] = useState('Indo-Fusion');

  if (!isEditProfileModalOpen) return null;

  const handleAddInst = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = instInput.trim();
      if (val && !instruments.includes(val)) {
        setInstruments([...instruments, val]);
        setInstInput('');
      }
    }
  };

  const handleAddGenre = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = genreInput.trim();
      if (val && !genres.includes(val)) {
        setGenres([...genres, val]);
        setGenreInput('');
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      headline,
      bio,
      location,
      rate,
      openToGigs,
      instruments,
      genres,
      gear
    });

    if (newTrackTitle.trim()) {
      addAudioTrack({
        title: newTrackTitle.trim(),
        genre: newTrackGenre,
        duration: '3:20',
        durationSec: 35,
        bpm: 96,
        key: 'Charukesi',
        stemsAvailable: true
      });
    }

    setIsEditProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-[#E4D4BD] card-shadow w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1E5CF] bg-[#fdfbf7]">
          <div>
            <h3 className="font-serif font-bold text-[#422315] text-base">Edit Musician Profile</h3>
            <p className="text-xs text-[#7d6148]">Update your headline, bio, instruments, and showcase tracks</p>
          </div>
          <button
            onClick={() => setIsEditProfileModalOpen(false)}
            className="text-[#8a684b] hover:text-[#422315] p-1 rounded-xl hover:bg-[#F8EFDF] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
          
          <div>
            <label className="text-xs font-bold text-[#7d6148] block mb-1">Professional Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl px-4 py-2 text-xs sm:text-sm text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#7d6148] block mb-1">Base Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl px-4 py-2 text-xs sm:text-sm text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#7d6148] block mb-1">Standard Honorarium / Rate</label>
              <input
                type="text"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl px-4 py-2 text-xs sm:text-sm text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Open to Concerts Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8EFDF] border border-[#E4D4BD]">
            <div>
              <p className="text-xs font-bold text-[#422315]">Available for Concerts & Studio Takes</p>
              <p className="text-[11px] text-[#7d6148]">Shows the green availability badge on your profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={openToGigs}
                onChange={(e) => setOpenToGigs(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#D99A42] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div>
            <label className="text-xs font-bold text-[#7d6148] block mb-1">Detailed Artist Bio & Guru Lineage</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl p-3 text-xs sm:text-sm text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Instruments */}
          <div>
            <label className="text-xs font-bold text-[#7d6148] block mb-1">Instruments</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {instruments.map((inst) => (
                <span key={inst} className="bg-[#faedd8] border border-amber-300 text-amber-900 text-xs px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-semibold">
                  <span>{inst}</span>
                  <button type="button" onClick={() => setInstruments(instruments.filter(i => i !== inst))} className="hover:text-red-600">×</button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={instInput}
              onChange={(e) => setInstInput(e.target.value)}
              onKeyDown={handleAddInst}
              placeholder="Add instrument and press Enter..."
              className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-xl px-3 py-1.5 text-xs text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Add a Demo Audio Track */}
          <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#E4D4BD] space-y-3">
            <span className="text-xs font-bold text-[#422315] flex items-center gap-1.5">
              <Music className="w-4 h-4 text-amber-600" /> Upload Demo Track (Procedural Tanpura Audio)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newTrackTitle}
                onChange={(e) => setNewTrackTitle(e.target.value)}
                placeholder="Track Title (e.g. Raag Yaman Alap)"
                className="w-full bg-white border border-[#E4D4BD] rounded-xl px-3 py-1.5 text-xs text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <select
                value={newTrackGenre}
                onChange={(e) => setNewTrackGenre(e.target.value)}
                className="w-full bg-white border border-[#E4D4BD] rounded-xl px-3 py-1.5 text-xs text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option>Indo-Fusion</option>
                <option>Carnatic Classical</option>
                <option>Hindustani Classical</option>
                <option>Indie Folk</option>
                <option>Bollywood Playback</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#F1E5CF] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsEditProfileModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7d6148] hover:text-[#422315]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#422315] hover:bg-[#422315] text-white shadow-sm transition"
            >
              Save Profile Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
