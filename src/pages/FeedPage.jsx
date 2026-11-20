import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Music,
  Video,
  Calendar,
  Users,
  Send,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Globe
} from 'lucide-react';

export default function FeedPage() {
  const {
    currentUser,
    musicians,
    posts,
    createPost,
    togglePostLike,
    addComment,
    playTrack,
    currentTrack,
    isPlaying,
    viewProfile,
    setIsPostModalOpen,
    setIsGigModalOpen,
    setActiveTab,
    showToast
  } = useApp();

  const [commentInputs, setCommentInputs] = useState({});
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});

  const toggleBookmark = (postId) => {
    setBookmarkedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    showToast('Post saved to your bookmarks', 'info');
  };

  const handleCommentSubmit = (postId) => {
    const text = commentInputs[postId] || '';
    if (text.trim()) {
      addComment(postId, text);
      setCommentInputs({ ...commentInputs, [postId]: '' });
      showToast('Comment posted successfully');
    }
  };

  const handleShare = (post) => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Post link copied to clipboard!');
  };

  return (
    <div className="space-y-5 pb-12">

      {/* ================= 1. HERO COMMUNITY BANNER ================= */}
      {/* Matches the deep royal plum banner with gold Tanpura, Tabla & Lotus illustration in the reference mockup */}
      <div
        className="relative h-[214px] rounded-2xl overflow-hidden text-[#F8EFDF] p-6 sm:p-8 banner-shadow bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(31,18,12,.92) 0%, rgba(42,24,16,.72) 42%, rgba(42,24,16,.12) 100%), url('https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=1200&auto=format&fit=crop&q=85')"
        }}
      >
        
        {/* Subtle background ambient musical notes & sparkles */}
        <div className="absolute top-4 left-1/2 text-purple-300 opacity-30 text-sm pointer-events-none">♪</div>
        <div className="absolute bottom-4 left-1/3 text-amber-300 opacity-20 text-xs pointer-events-none">✦</div>

        <div className="relative z-10 max-w-md sm:max-w-lg">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
            India's Music Community <br />
            <span className="font-serif italic font-normal text-[#D99A42]">
              for Dreamers & Doers
            </span>
          </h2>
          
          <p className="mt-2 text-xs sm:text-sm text-[#d4bede] font-light leading-relaxed">
            Network with artists • Find collaborators • Grow your musical journey
          </p>

          <div className="mt-5">
            <button
              onClick={() => setActiveTab('discover')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-gradient-to-r from-[#f7ba43] to-[#e69f26] text-[#241304] hover:from-[#ffc454] hover:to-[#f0ab35] shadow-lg shadow-amber-900/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore Now</span>
              <span className="text-base leading-none">→</span>
            </button>
          </div>
        </div>

        {/* Right Illustration: Tanpura, Tabla & Lotus Petals */}
        <div className="absolute right-0 bottom-0 top-0 w-64 sm:w-80 pointer-events-none select-none opacity-15">
          <svg
            viewBox="0 0 320 200"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bannerTanpura" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d99b52" />
                <stop offset="60%" stopColor="#96522c" />
                <stop offset="100%" stopColor="#50240f" />
              </linearGradient>
              <linearGradient id="bannerTabla" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e6ab62" />
                <stop offset="100%" stopColor="#6e3713" />
              </linearGradient>
              <linearGradient id="bannerLotus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f7d08b" />
                <stop offset="100%" stopColor="#cf8223" />
              </linearGradient>
            </defs>

            {/* Lotus Petal Layers along the bottom */}
            <path d="M120 200 C150 160, 190 160, 220 200 Z" fill="url(#bannerLotus)" opacity="0.35" />
            <path d="M140 200 C170 145, 210 145, 240 200 Z" fill="url(#bannerLotus)" opacity="0.45" />
            <path d="M180 200 C205 160, 235 160, 260 200 Z" fill="url(#bannerLotus)" opacity="0.35" />

            {/* Sitar / Tanpura angled diagonally */}
            <g transform="rotate(-38 200 120)">
              {/* Resonator Gourd */}
              <circle cx="200" cy="130" r="34" fill="url(#bannerTanpura)" stroke="#f7d08b" strokeWidth="1.5" />
              <circle cx="200" cy="130" r="18" fill="#3d1808" stroke="#f7d08b" strokeWidth="1" />
              
              {/* Long Stem Neck */}
              <rect x="195" y="-10" width="10" height="130" rx="3" fill="url(#bannerTanpura)" stroke="#f7d08b" strokeWidth="1" />
              
              {/* Pegbox at the top */}
              <rect x="192" y="-20" width="16" height="20" rx="3" fill="#2d1105" />
              <circle cx="186" cy="-14" r="3.5" fill="#f7d08b" />
              <line x1="186" y1="-14" x2="194" y2="-14" stroke="#f7d08b" strokeWidth="1.5" />
              <circle cx="214" cy="-14" r="3.5" fill="#f7d08b" />
              <line x1="206" y1="-14" x2="214" y2="-14" stroke="#f7d08b" strokeWidth="1.5" />
              <circle cx="186" cy="-6" r="3.5" fill="#f7d08b" />
              <line x1="186" y1="-6" x2="194" y2="-6" stroke="#f7d08b" strokeWidth="1.5" />
              <circle cx="214" cy="-6" r="3.5" fill="#f7d08b" />
              <line x1="206" y1="-6" x2="214" y2="-6" stroke="#f7d08b" strokeWidth="1.5" />

              {/* Strings */}
              <line x1="198" y1="-8" x2="198" y2="135" stroke="#fff" strokeWidth="0.8" opacity="0.85" />
              <line x1="200" y1="-8" x2="200" y2="135" stroke="#fff" strokeWidth="0.8" opacity="0.85" />
              <line x1="202" y1="-8" x2="202" y2="135" stroke="#fff" strokeWidth="0.8" opacity="0.85" />
            </g>

            {/* Bayah (Bass Tabla drum) */}
            <g transform="translate(200, 125)">
              <ellipse cx="25" cy="40" rx="20" ry="24" fill="url(#bannerTabla)" stroke="#e6ab62" strokeWidth="1" />
              {/* Syahi (Black tuning spot) */}
              <circle cx="22" cy="35" r="9" fill="#1c0e04" stroke="#8c4718" strokeWidth="1" />
              {/* Straps (Gajara) */}
              <line x1="9" y1="26" x2="14" y2="58" stroke="#4a220a" strokeWidth="1" />
              <line x1="17" y1="20" x2="25" y2="62" stroke="#4a220a" strokeWidth="1" />
              <line x1="33" y1="20" x2="35" y2="62" stroke="#4a220a" strokeWidth="1" />
              <line x1="41" y1="26" x2="38" y2="58" stroke="#4a220a" strokeWidth="1" />
            </g>

            {/* Dayah (Treble Tabla drum) */}
            <g transform="translate(245, 110)">
              <ellipse cx="22" cy="40" rx="18" ry="22" fill="url(#bannerTabla)" stroke="#e6ab62" strokeWidth="1" />
              <circle cx="22" cy="38" r="8" fill="#1c0e04" stroke="#8c4718" strokeWidth="1" />
              <line x1="8" y1="28" x2="12" y2="58" stroke="#4a220a" strokeWidth="1" />
              <line x1="16" y1="22" x2="20" y2="60" stroke="#4a220a" strokeWidth="1" />
              <line x1="28" y1="22" x2="26" y2="60" stroke="#4a220a" strokeWidth="1" />
              <line x1="36" y1="28" x2="32" y2="58" stroke="#4a220a" strokeWidth="1" />
            </g>

            {/* Floating musical notes */}
            <text x="75" y="80" fill="#f7d08b" fontSize="16" opacity="0.6">♫</text>
            <text x="145" y="60" fill="#f7d08b" fontSize="14" opacity="0.7">♪</text>
            <text x="270" y="70" fill="#f7d08b" fontSize="18" opacity="0.6">♩</text>
          </svg>
        </div>

      </div>

      {/* ================= 2. POST CREATION CARD ================= */}
      {/* Matches the clean composer with Post, Share a Reel, Add an Event, and Find Collaborators button */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E4D4BD] card-shadow">
        
        {/* Top Input Bar */}
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            onClick={() => viewProfile(currentUser.id)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-[#E4D4BD] cursor-pointer flex-shrink-0"
          />
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex-1 text-left bg-[#F8EFDF] hover:bg-[#f5ede2] text-[#8a684b] hover:text-[#422315] px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm border border-[#E4D4BD] transition font-medium"
          >
            Share an update...
          </button>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-3 mt-3 border-t border-[#F1E5CF]">
          
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Post (Audio) */}
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#614530] hover:text-[#422315] hover:bg-[#F8EFDF] transition"
            >
              <Music className="w-4 h-4 text-[#8a684b]" />
              <span>Post</span>
            </button>

            {/* Share a Reel */}
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#614530] hover:text-[#422315] hover:bg-[#F8EFDF] transition"
            >
              <Video className="w-4 h-4 text-[#8a684b]" />
              <span>Share a Reel</span>
            </button>

            {/* Add an Event */}
            <button
              onClick={() => setIsGigModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#614530] hover:text-[#422315] hover:bg-[#F8EFDF] transition"
            >
              <Calendar className="w-4 h-4 text-[#8a684b]" />
              <span>Add an Event</span>
            </button>
          </div>

          <div className="hidden">
            <span className="text-xs text-[#b39982] hidden sm:inline">Or</span>

            {/* Find Collaborators Button */}
            <button
              onClick={() => setActiveTab('network')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#422315] hover:bg-[#422315] text-white shadow-sm transition"
            >
              <Users className="w-3.5 h-3.5 text-purple-200" />
              <span>Find Collaborators</span>
            </button>
          </div>

        </div>
      </div>

      {/* ================= 3. FEED STREAM ================= */}
      <div className="space-y-4">
        {posts.map((post) => {
          const author = musicians.find(m => m.id === post.authorId) || currentUser;
          const isTrackPlaying = isPlaying && currentTrack?.id === post.track?.id;
          const isBookmarked = bookmarkedPosts[post.id] ?? post.hasBookmarked;

          return (
            <article
              key={post.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E4D4BD] card-shadow space-y-3.5 transition hover:border-[#dfcbb7]"
            >
              
              {/* Header: Author + Verified + Timestamp + More Options */}
              <div className="flex items-start justify-between gap-3">
                
                <div className="flex items-center gap-3">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    onClick={() => viewProfile(author.id)}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-[#E4D4BD] cursor-pointer flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4
                        onClick={() => viewProfile(author.id)}
                        className="font-bold text-sm sm:text-base text-[#422315] hover:text-amber-800 cursor-pointer transition"
                      >
                        {author.name}
                      </h4>
                      {/* Verified Badge */}
                      {author.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-[#2563eb] fill-[#2563eb] text-white flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-[#7d6148]">
                      {author.primaryRole} • {author.location.split(',')[0]}
                    </p>

                    <p className="text-[11px] text-[#9a7d66] flex items-center gap-1 mt-0.5">
                      <span>{post.timestamp}</span>
                      <span>•</span>
                      <Globe className="w-3 h-3 text-[#9a7d66]" />
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => showToast(`Post options for ${author.name}`, 'info')}
                  className="text-[#9a7d66] hover:text-[#422315] p-1 rounded-lg hover:bg-[#F8EFDF] transition"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Post Content */}
              <p className="text-sm text-[#422315] whitespace-pre-line leading-relaxed">
                {post.content}
              </p>

              {/* Embedded Media Preview (Raaga Reimagined track card from mockup) */}
              {post.track && (
                <div className="rounded-2xl overflow-hidden border border-[#ebdccf] bg-[#fdf9f3] flex flex-col sm:flex-row items-stretch shadow-inner">
                  
                  {/* Left Media Thumbnail with Center Play Button */}
                  <div className="relative sm:w-56 h-40 sm:h-auto flex-shrink-0 bg-neutral-900 overflow-hidden group">
                    <img
                      src={post.track.thumbnail || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80"}
                      alt={post.track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                    />
                    
                    {/* Centered Circular Play/Pause Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => playTrack(post.track)}
                        className="w-12 h-12 rounded-full bg-white/95 text-[#422315] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition"
                        title={isTrackPlaying ? "Pause Audio" : "Play Indian Classical Audio"}
                      >
                        {isTrackPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>

                    {/* Playing indicator */}
                    {isTrackPlaying && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                        Playing
                      </span>
                    )}
                  </div>

                  {/* Right Track Information */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center">
                    <h5 className="font-serif font-bold text-base sm:text-lg text-[#422315]">
                      {post.track.title}
                    </h5>
                    <p className="text-xs text-[#7d6148] mt-1">
                      {post.track.subtitle || "A fusion of tradition and tranquility"}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <a
                        href={`https://${post.track.link || 'open.spotify.com'}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#8a684b] hover:text-[#422315] flex items-center gap-1 font-medium transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{post.track.link || 'open-spotify.com'}</span>
                      </a>
                    </div>
                  </div>

                </div>
              )}

              {/* Engagement Controls: Likes, Comments, Share, Bookmark */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F1E5CF] text-xs text-[#614530]">
                
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Like / Appreciation */}
                  <button
                    onClick={() => togglePostLike(post.id)}
                    className="flex items-center gap-1.5 hover:text-[#422315] transition font-medium"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        post.hasLiked ? 'text-[#e0524a] fill-[#e0524a]' : 'text-[#8a684b]'
                      }`}
                    />
                    <span>{post.likesCount}</span>
                  </button>

                  {/* Comments count */}
                  <button
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 hover:text-[#422315] transition font-medium"
                  >
                    <MessageCircle className="w-4 h-4 text-[#8a684b]" />
                    <span>{post.commentsCount || (post.comments ? post.comments.length : 0)}</span>
                  </button>

                  {/* Share button */}
                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-1.5 hover:text-[#422315] transition font-medium"
                  >
                    <Share2 className="w-4 h-4 text-[#8a684b]" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Bookmark Icon */}
                <button
                  onClick={() => toggleBookmark(post.id)}
                  className="p-1 rounded-lg hover:bg-[#F8EFDF] text-[#8a684b] hover:text-[#422315] transition"
                  title="Bookmark Post"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      isBookmarked ? 'text-amber-600 fill-amber-600' : ''
                    }`}
                  />
                </button>

              </div>

              {/* Expandable Comments Drawer */}
              {activeCommentPostId === post.id && (
                <div className="pt-3 border-t border-[#F1E5CF] space-y-3 animate-in fade-in">
                  
                  {/* Comment Input */}
                  <div className="flex items-center gap-2">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                        placeholder="Write a comment or appreciation..."
                        className="w-full bg-[#F8EFDF] border border-[#E4D4BD] rounded-full pl-3.5 pr-9 py-1.5 text-xs text-[#422315] placeholder-[#9a7d66] focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-900"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Comment List */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {post.comments.map((c) => (
                        <div key={c.id} className="flex items-start gap-2.5 p-2 rounded-xl bg-[#F8EFDF] border border-[#f0e3d6]">
                          <img
                            src={c.authorAvatar}
                            alt={c.authorName}
                            className="w-6 h-6 rounded-full object-cover mt-0.5 cursor-pointer"
                            onClick={() => viewProfile(c.authorId)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span
                                onClick={() => viewProfile(c.authorId)}
                                className="font-semibold text-xs text-[#422315] hover:text-amber-800 cursor-pointer"
                              >
                                {c.authorName}
                              </span>
                              <span className="text-[10px] text-[#9a7d66]">{c.timestamp}</span>
                            </div>
                            <p className="text-xs text-[#4b3523] mt-0.5">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

            </article>
          );
        })}
      </div>

    </div>
  );
}
