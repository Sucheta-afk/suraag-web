import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle2,
  Users,
  Award,
  Briefcase,
  Music,
  Check,
  X
} from 'lucide-react';

export default function NotificationsPage() {
  const {
    notifications,
    musicians,
    viewProfile,
    acceptConnection,
    toggleConnection,
    setActiveTab,
    showToast
  } = useApp();

  const [filter, setFilter] = useState('all');

  const getIcon = (type) => {
    switch (type) {
      case 'connection_request':
        return <Users className="w-5 h-5 text-amber-600" />;
      case 'endorsement':
        return <Award className="w-5 h-5 text-amber-500" />;
      case 'gig_match':
        return <Briefcase className="w-5 h-5 text-emerald-600" />;
      case 'track_play':
        return <Music className="w-5 h-5 text-amber-700" />;
      default:
        return <Bell className="w-5 h-5 text-amber-600" />;
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#422315] flex items-center gap-2">
            <span>Activity & Notifications</span>
            <Bell className="w-5 h-5 text-amber-600" />
          </h1>
          <p className="text-xs sm:text-sm text-[#7d6148] mt-0.5">
            Baithak invitations, peer endorsements, bandish plays, and connection requests
          </p>
        </div>

        <div className="flex items-center bg-white rounded-xl p-1 border border-[#E4D4BD] card-shadow text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-amber-500 text-[#422315]'
                : 'text-[#7d6148] hover:text-[#422315]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              filter === 'unread'
                ? 'bg-amber-500 text-[#422315]'
                : 'text-[#7d6148] hover:text-[#422315]'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-[#E4D4BD] card-shadow divide-y divide-[#F1E5CF] overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-[#7d6148] text-xs">
            No notifications to display.
          </div>
        ) : (
          filteredNotifs.map((notif) => {
            const sender = notif.fromUserId ? musicians.find(m => m.id === notif.fromUserId) : null;

            return (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition ${
                  !notif.read ? 'bg-[#fdfbf7]' : 'bg-white hover:bg-[#faf5ed]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-[#F8EFDF] border border-[#E4D4BD] mt-0.5 flex-shrink-0">
                    {getIcon(notif.type)}
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-[#422315] font-medium leading-relaxed">
                      {notif.title}
                    </p>
                    <span className="text-[11px] text-[#9a7d66] block mt-1">
                      {notif.time}
                    </span>
                  </div>
                </div>

                {sender && notif.type === 'connection_request' && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => acceptConnection(sender.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => toggleConnection(sender.id)}
                      className="p-1.5 rounded-xl text-xs text-[#8a684b] hover:bg-[#f5ede2] transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
