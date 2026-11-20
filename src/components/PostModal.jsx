import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Music,
  Video,
  Sparkles,
  Upload,
  Tag,
  CheckCircle,
  Volume2
} from 'lucide-react';

export default function PostModal() {
  const {
    isPostModalOpen,
    setIsPostModalOpen,
    currentUser,
    createPost
  } = useApp();

  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['#IndianClassical', '#MusicProduction', '#Fusion']);
  const [isLookingForBand, setIsLookingForBand] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('Indo-Fusion');
  
  // Audio attachment state
  const [attachAudio, setAttachAudio] = useState(false);
  const [audioTitle, setAudioTitle] = useState('');
  const [audioDuration, setAudioDuration] = useState('3:18');
  const [audioBpm, setAudioBpm] = useState('82');
  const [audioKey, setAudioKey] = useState('Charukesi');

  // Video attachment state
  const [attachVideo, setAttachVideo] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');

  if (!isPostModalOpen) return null;

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      let clean = tagInput.trim();
      if (clean) {
        if (!clean.startsWith('#')) clean = `#${clean}`;
        if (!tags.includes(clean)) {
          setTags([...tags, clean]);
        }
        setTagInput('');
      }
    }
  };

  const removeTag = (tToRemove) => {
    setTags(tags.filter(t => t !== tToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !attachAudio && !attachVideo) return;

    let trackData = null;
    if (attachAudio) {
      trackData = {
        id: `tr-${Date.now()}`,
        title: audioTitle.trim() || 'Raaga Reimagined',
        subtitle: 'A fusion of tradition and tranquility',
        artist: currentUser.name,
        genre: selectedGenre,
        duration: audioDuration || '3:18',
        durationSec: 35,
        bpm: parseInt(audioBpm) || 82,
        key: audioKey || 'Charukesi',
        link: 'open-spotify.com',
        thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        waveform: [25, 50, 75, 90, 60, 85, 95, 80, 65, 80, 90, 60, 45, 30]
      };
    }

    let videoData = null;
    if (attachVideo) {
      videoData = {
        title: videoTitle.trim() || 'Live Riyaz Session Take',
        thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        duration: '1:45'
      };
    }

    const finalTags = [...tags];
    if (isLookingForBand && !finalTags.includes('#Collaboration')) {
      finalTags.push('#Collaboration');
    }

    createPost({
      content,
      tags: finalTags,
      track: trackData,
      video: videoData
    });

    setIsPostModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-[#E4D4BD] card-shadow w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1E5CF] bg-[#fdfbf7]">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-amber-400"
            />
            <div>
              <h3 className="font-bold text-[#422315] text-base">{currentUser.name}</h3>
              <p className="text-xs text-amber-800 font-medium">Post to SwarConnect</p>
            </div>
          </div>
          <button
            onClick={() => setIsPostModalOpen(false)}
            className="text-[#8a684b] hover:text-[#422315] p-1 rounded-xl hover:bg-[#F8EFDF] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Share an update, recent track release, rehearsal insight, or collaboration call..."
            className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl p-4 text-xs sm:text-sm text-[#422315] placeholder-[#9a7d66] focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none transition"
          />

          {/* Looking for Collab Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8EFDF] border border-[#E4D4BD]">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-xs font-bold text-[#422315]">Looking for Accompanist / Jugalbandi Partner</p>
                <p className="text-[11px] text-[#7d6148]">Highlights post for other musicians in the community</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isLookingForBand}
                onChange={(e) => setIsLookingForBand(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#D99A42] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {/* Media Attachment Toggles */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAttachAudio(!attachAudio)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                  attachAudio
                    ? 'bg-[#faedd8] border-amber-500 text-amber-900'
                    : 'bg-[#F8EFDF] border-[#E4D4BD] text-[#7d6148] hover:bg-[#f5ede2]'
                }`}
              >
                <Music className="w-4 h-4 text-amber-600" />
                <span>{attachAudio ? '✓ Audio Track Attached' : '+ Attach Audio / Bandish'}</span>
              </button>

              <button
                type="button"
                onClick={() => setAttachVideo(!attachVideo)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                  attachVideo
                    ? 'bg-[#faedd8] border-amber-500 text-amber-900'
                    : 'bg-[#F8EFDF] border-[#E4D4BD] text-[#7d6148] hover:bg-[#f5ede2]'
                }`}
              >
                <Video className="w-4 h-4 text-amber-600" />
                <span>{attachVideo ? '✓ Video Reel Attached' : '+ Attach Reel'}</span>
              </button>
            </div>

            {/* Audio Details Form */}
            {attachAudio && (
              <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#E4D4BD] space-y-3 animate-in fade-in">
                <span className="text-xs font-bold text-[#422315] flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-amber-600" /> Audio Track Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#7d6148] block mb-1">Track Title</label>
                    <input
                      type="text"
                      value={audioTitle}
                      onChange={(e) => setAudioTitle(e.target.value)}
                      placeholder="e.g. Raaga Reimagined"
                      className="w-full bg-white border border-[#E4D4BD] rounded-xl px-3 py-1.5 text-xs text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#7d6148] block mb-1">Genre</label>
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="w-full bg-white border border-[#E4D4BD] rounded-xl px-3 py-1.5 text-xs text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option>Indo-Fusion</option>
                      <option>Carnatic Classical</option>
                      <option>Hindustani Classical</option>
                      <option>Indie Folk</option>
                      <option>Bollywood Playback</option>
                      <option>Sufi</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-bold text-[#7d6148] block mb-1.5">
              Hashtags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="bg-[#F8EFDF] border border-[#E4D4BD] text-amber-900 text-xs px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-medium"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag and press Enter..."
              className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-xl px-3 py-1.5 text-xs text-[#422315] focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F1E5CF] bg-[#fdfbf7] flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsPostModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7d6148] hover:text-[#422315] transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#422315] hover:bg-[#422315] text-white shadow-sm transition"
          >
            Publish Post
          </button>
        </div>

      </div>
    </div>
  );
}
