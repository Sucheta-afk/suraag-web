import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Send,
  Music,
  Play,
  Pause,
  Sparkles,
  MapPin,
  CheckCheck,
  Search,
  Paperclip
} from 'lucide-react';

export default function MessagesPage() {
  const {
    conversations,
    currentUserId,
    currentUser,
    musicians,
    sendMessage,
    viewProfile,
    playTrack,
    currentTrack,
    isPlaying,
    setInviteModalData
  } = useApp();

  const [activeConvId, setActiveConvId] = useState(() => {
    return conversations[0]?.id || null;
  });
  const [inputText, setInputText] = useState('');
  const [attachTrackId, setAttachTrackId] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const chatPartner = activeConv ? musicians.find(m => m.id === activeConv.withUserId) : null;

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !attachTrackId) return;

    let trackAttachment = null;
    if (attachTrackId) {
      trackAttachment = currentUser.audioTracks?.find(t => t.id === attachTrackId);
    }

    if (chatPartner) {
      sendMessage(chatPartner.id, inputText, trackAttachment);
      setInputText('');
      setAttachTrackId('');
      setShowAttachMenu(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl border border-[#E4D4BD] card-shadow overflow-hidden flex flex-col md:flex-row h-[680px]">
        
        {/* Left: Conversations List */}
        <div className="w-full md:w-80 border-r border-[#E4D4BD] flex flex-col bg-[#F8EFDF]">
          <div className="p-4 border-b border-[#E4D4BD]">
            <h2 className="text-base font-bold text-[#422315] mb-3">Messages & Collabs</h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8a684b] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search artists..."
                className="w-full bg-white border border-[#E4D4BD] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#422315] placeholder-[#9a7d66] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#F1E5CF]">
            {conversations.map((conv) => {
              const partner = musicians.find(m => m.id === conv.withUserId) || {
                name: 'Musician',
                avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'
              };
              const isSelected = activeConv?.id === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition ${
                    isSelected ? 'bg-[#faedd8]' : 'hover:bg-[#f8f2e9]'
                  }`}
                >
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#E4D4BD]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#422315] truncate">{partner.name}</h4>
                      <span className="text-[10px] text-[#9a7d66]">{conv.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#7d6148] truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        {chatPartner ? (
          <div className="flex-1 flex flex-col bg-white">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-[#E4D4BD] flex items-center justify-between bg-[#fdfbf7]">
              <div className="flex items-center gap-3">
                <img
                  src={chatPartner.avatar}
                  alt={chatPartner.name}
                  onClick={() => viewProfile(chatPartner.id)}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                />
                <div>
                  <h3
                    onClick={() => viewProfile(chatPartner.id)}
                    className="text-sm font-bold text-[#422315] hover:text-amber-800 cursor-pointer"
                  >
                    {chatPartner.name}
                  </h3>
                  <p className="text-[11px] text-[#7d6148]">{chatPartner.primaryRole} • {chatPartner.location}</p>
                </div>
              </div>

              <button
                onClick={() => setInviteModalData(chatPartner)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#422315] hover:bg-[#422315] text-white transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                <span>Invite to Jam</span>
              </button>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#faf6ee]">
              {(activeConv.messages || []).map((msg) => {
                const isMe = msg.senderId === currentUserId;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-[#422315] text-[#F8EFDF] rounded-br-none'
                          : 'bg-white text-[#422315] border border-[#E4D4BD] rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-[#9a7d66] mt-1 px-1">{msg.timestamp}</span>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3.5 border-t border-[#E4D4BD] bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${chatPartner.name}...`}
                className="flex-1 bg-[#F8EFDF] border border-[#E4D4BD] rounded-2xl px-4 py-2 text-xs sm:text-sm text-[#422315] placeholder-[#9a7d66] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#422315] flex items-center justify-center shadow-sm transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[#7d6148]">
            Select a conversation to start chatting.
          </div>
        )}

      </div>
    </div>
  );
}
