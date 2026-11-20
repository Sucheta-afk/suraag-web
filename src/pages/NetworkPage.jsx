import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserCheck,
  UserPlus,
  MessageSquare,
  Sparkles,
  MapPin,
  Check,
  X,
  Music,
  CheckCircle2
} from 'lucide-react';

export default function NetworkPage() {
  const {
    currentUser,
    musicians,
    connections,
    toggleConnection,
    acceptConnection,
    viewProfile,
    setActiveTab,
    setInviteModalData
  } = useApp();

  const connectedMusicians = musicians.filter(m => 
    m.id !== currentUser.id && connections[m.id] === 'connected'
  );

  const pendingMusicians = musicians.filter(m => 
    m.id !== currentUser.id && connections[m.id] === 'pending'
  );

  const suggestedMusicians = musicians.filter(m => 
    m.id !== currentUser.id && (!connections[m.id] || connections[m.id] === 'none')
  );

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#422315] flex items-center gap-2">
            <span>Collaborations & Artist Network</span>
            <Users className="w-6 h-6 text-amber-600" />
          </h1>
          <p className="text-xs sm:text-sm text-[#7d6148] mt-1">
            Manage your network of accompanists, gurus, session players, and Sabha organizers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-[#E4D4BD] px-4 py-2 rounded-2xl text-xs card-shadow">
            <span className="text-[#7d6148]">Total Connections: </span>
            <strong className="text-amber-800 text-sm font-serif">{currentUser.connectionsCount || 840}</strong>
          </div>
        </div>
      </div>

      {/* 1. Pending Invitations */}
      {pendingMusicians.length > 0 && (
        <section className="bg-white rounded-3xl p-5 border border-[#E4D4BD] card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#422315] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Pending Collaboration Requests ({pendingMusicians.length})
            </h2>
          </div>

          <div className="space-y-3">
            {pendingMusicians.map((musician) => (
              <div
                key={musician.id}
                className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-[#F8EFDF] border border-[#E4D4BD]"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={musician.avatar}
                    alt={musician.name}
                    onClick={() => viewProfile(musician.id)}
                    className="w-12 h-12 rounded-2xl object-cover cursor-pointer flex-shrink-0"
                  />
                  <div>
                    <h4
                      onClick={() => viewProfile(musician.id)}
                      className="text-xs sm:text-sm font-bold text-[#422315] hover:text-amber-800 cursor-pointer"
                    >
                      {musician.name}
                    </h4>
                    <p className="text-xs text-[#7d6148] truncate">{musician.primaryRole} • {musician.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => acceptConnection(musician.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => toggleConnection(musician.id)}
                    className="p-1.5 rounded-xl text-xs text-[#8a684b] hover:bg-[#f5ede2] transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Connected Artists */}
      <section className="bg-white rounded-3xl p-6 border border-[#E4D4BD] card-shadow space-y-4">
        <h2 className="text-base font-bold text-[#422315] flex items-center gap-2">
          <span>Connected Artists ({connectedMusicians.length})</span>
        </h2>

        {connectedMusicians.length === 0 ? (
          <p className="text-xs text-[#7d6148] py-4">No connections yet. Browse suggested musicians below to collaborate!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectedMusicians.map((musician) => (
              <div
                key={musician.id}
                className="p-4 rounded-2xl bg-[#F8EFDF] border border-[#E4D4BD] flex items-center justify-between gap-3 hover:border-[#dfcbb7] transition"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={musician.avatar}
                    alt={musician.name}
                    onClick={() => viewProfile(musician.id)}
                    className="w-12 h-12 rounded-2xl object-cover cursor-pointer flex-shrink-0"
                  />
                  <div className="truncate">
                    <h4
                      onClick={() => viewProfile(musician.id)}
                      className="text-xs sm:text-sm font-bold text-[#422315] hover:text-amber-800 cursor-pointer truncate"
                    >
                      {musician.name}
                    </h4>
                    <p className="text-[11px] text-[#7d6148] truncate">{musician.primaryRole}</p>
                    <p className="text-[10px] text-[#9a7d66] truncate">{musician.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setInviteModalData(musician)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#422315] hover:bg-[#422315] text-white shadow-sm transition"
                  >
                    Jugalbandi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Suggested Collaborators */}
      <section className="bg-white rounded-3xl p-6 border border-[#E4D4BD] card-shadow space-y-4">
        <h2 className="text-base font-bold text-[#422315]">
          Suggested Artists for You
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedMusicians.map((musician) => (
            <div
              key={musician.id}
              className="p-4 rounded-2xl bg-[#F8EFDF] border border-[#E4D4BD] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={musician.avatar}
                  alt={musician.name}
                  onClick={() => viewProfile(musician.id)}
                  className="w-12 h-12 rounded-2xl object-cover cursor-pointer flex-shrink-0"
                />
                <div className="truncate">
                  <h4
                    onClick={() => viewProfile(musician.id)}
                    className="text-xs sm:text-sm font-bold text-[#422315] hover:text-amber-800 cursor-pointer truncate"
                  >
                    {musician.name}
                  </h4>
                  <p className="text-[11px] text-[#7d6148] truncate">{musician.primaryRole}</p>
                  <p className="text-[10px] text-[#9a7d66] truncate">{musician.location}</p>
                </div>
              </div>

              <button
                onClick={() => toggleConnection(musician.id)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-[#422315] shadow-sm transition flex-shrink-0"
              >
                + Connect
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
