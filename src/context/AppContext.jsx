import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_MUSICIANS,
  INITIAL_GIGS,
  INITIAL_POSTS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_EVENTS
} from '../data/mockData';
import { audioEngine } from '../utils/audioEngine';

const AppContext = createContext();
const DISABLED_TABS = new Set(['network', 'gigs', 'messages', 'notifications']);
const musiciansStorageKey = `soundlink_musicians_${__APP_BUILD_ID__}`;

export function AppProvider({ children }) {
  // Current user persona (defaults to Arjun Mehta from mockup)
  const [currentUserId, setCurrentUserId] = useState(() => {
    const saved = localStorage.getItem('soundlink_current_user_v3');
    return saved || 'user-arjun';
  });

  const [musicians, setMusicians] = useState(() => {
    const saved = localStorage.getItem(musiciansStorageKey);
    return saved ? JSON.parse(saved) : INITIAL_MUSICIANS;
  });

  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('soundlink_posts_v3');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [gigs, setGigs] = useState(() => {
    const saved = localStorage.getItem('soundlink_gigs_v3');
    return saved ? JSON.parse(saved) : INITIAL_GIGS;
  });

  const [events, setEvents] = useState(INITIAL_EVENTS);

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('soundlink_conversations_v3');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('soundlink_notifications_v3');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Track connections map:
  const [connections, setConnections] = useState(() => {
    const saved = localStorage.getItem('soundlink_connections_v3');
    return saved ? JSON.parse(saved) : {
      'user-diya': 'connected',
      'user-rohan': 'connected',
      'user-kabir': 'none',
      'user-aavya': 'none'
    };
  });

  // Active navigation tab
  const [activeTab, setActiveTabState] = useState('discover');
  const [viewedProfileId, setViewedProfileId] = useState('user-arjun');

  // Search keyword in navbar
  const [globalSearch, setGlobalSearch] = useState('');

  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0); // 0 to 100
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState('0:00');
  const [durationFormatted, setDurationFormatted] = useState('0:00');
  const [volume, setVolume] = useState(0.8);

  // Modals
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isGigModalOpen, setIsGigModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [inviteModalData, setInviteModalData] = useState(null); // musician object to invite
  const [applyGigModalData, setApplyGigModalData] = useState(null); // gig object to apply

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const setActiveTab = (tab) => {
    if (DISABLED_TABS.has(tab)) {
      showToast('This section is currently hidden.', 'info');
      return;
    }

    setActiveTabState(tab);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(musiciansStorageKey, JSON.stringify(musicians));
  }, [musicians]);

  useEffect(() => {
    localStorage.setItem('soundlink_posts_v3', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('soundlink_gigs_v3', JSON.stringify(gigs));
  }, [gigs]);

  useEffect(() => {
    localStorage.setItem('soundlink_conversations_v3', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('soundlink_connections_v3', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('soundlink_current_user_v3', currentUserId);
  }, [currentUserId]);

  const currentUser = musicians.find(m => m.id === currentUserId) || musicians[0];
  const viewedUser = musicians.find(m => m.id === viewedProfileId) || currentUser;

  // Change current user persona
  const switchUser = (userId) => {
    setCurrentUserId(userId);
    setViewedProfileId(userId);
    showToast(`Switched active profile to ${musicians.find(m => m.id === userId)?.name}`, 'info');
  };

  // Audio control functions
  const playTrack = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      if (isPlaying) {
        audioEngine.stop();
        setIsPlaying(false);
      } else {
        resumeTrack(track);
      }
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    setPlaybackProgress(0);

    audioEngine.playTrack(
      track,
      (currentSec, totalSec) => {
        const pct = (currentSec / totalSec) * 100;
        setPlaybackProgress(pct);

        const curMin = Math.floor(currentSec / 60);
        const curSecPart = Math.floor(currentSec % 60).toString().padStart(2, '0');
        setCurrentTimeFormatted(`${curMin}:${curSecPart}`);

        const durMin = Math.floor(totalSec / 60);
        const durSecPart = Math.floor(totalSec % 60).toString().padStart(2, '0');
        setDurationFormatted(`${durMin}:${durSecPart}`);
      },
      () => {
        setIsPlaying(false);
        setPlaybackProgress(0);
        setCurrentTimeFormatted('0:00');
      }
    );
  };

  const resumeTrack = (track) => {
    setIsPlaying(true);
    audioEngine.playTrack(
      track,
      (currentSec, totalSec) => {
        const pct = (currentSec / totalSec) * 100;
        setPlaybackProgress(pct);
        const curMin = Math.floor(currentSec / 60);
        const curSecPart = Math.floor(currentSec % 60).toString().padStart(2, '0');
        setCurrentTimeFormatted(`${curMin}:${curSecPart}`);
      },
      () => {
        setIsPlaying(false);
        setPlaybackProgress(0);
      }
    );
  };

  const togglePlayPause = () => {
    if (!currentTrack) {
      // Pick first track of current user or post
      if (currentUser.audioTracks && currentUser.audioTracks.length > 0) {
        playTrack(currentUser.audioTracks[0]);
      }
      return;
    }

    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
    } else {
      resumeTrack(currentTrack);
    }
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    audioEngine.setVolume(newVol);
  };

  // Connection management
  const toggleConnection = (targetUserId) => {
    const currentStatus = connections[targetUserId] || 'none';
    let newStatus = 'none';

    if (currentStatus === 'none') {
      newStatus = 'pending';
      showToast(`Connection request sent to ${musicians.find(m => m.id === targetUserId)?.name}!`);
    } else if (currentStatus === 'pending') {
      newStatus = 'none';
      showToast('Connection request withdrawn.');
    } else if (currentStatus === 'connected') {
      newStatus = 'none';
      showToast('Connection removed.');
    }

    setConnections(prev => ({
      ...prev,
      [targetUserId]: newStatus
    }));
  };

  const acceptConnection = (targetUserId) => {
    setConnections(prev => ({
      ...prev,
      [targetUserId]: 'connected'
    }));

    // Update connections count
    setMusicians(prev => prev.map(m => {
      if (m.id === currentUserId || m.id === targetUserId) {
        return { ...m, connectionsCount: (m.connectionsCount || 0) + 1 };
      }
      return m;
    }));

    showToast(`Connected with ${musicians.find(m => m.id === targetUserId)?.name}! 🎸`);
  };

  // Endorse a skill
  const endorseSkill = (musicianId, skillName) => {
    setMusicians(prev => prev.map(m => {
      if (m.id === musicianId) {
        const updatedSkills = (m.skills || []).map(s => {
          if (s.name === skillName) {
            return { ...s, endorsements: s.endorsements + 1 };
          }
          return s;
        });
        return { ...m, skills: updatedSkills };
      }
      return m;
    }));
    showToast(`Endorsed ${skillName}!`);
  };

  // Post Likes & Comments
  const togglePostLike = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const hasLiked = !post.hasLiked;
        return {
          ...post,
          hasLiked,
          likesCount: hasLiked ? post.likesCount + 1 : post.likesCount - 1
        };
      }
      return post;
    }));
  };

  const addComment = (postId, text) => {
    if (!text.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      timestamp: 'Just now',
      text: text.trim()
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: (p.commentsCount || 0) + 1,
          comments: [...(p.comments || []), newComment]
        };
      }
      return p;
    }));
    showToast('Comment posted!');
  };

  // Create new post
  const createPost = (postData) => {
    const newPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      timestamp: 'Just now',
      content: postData.content,
      tags: postData.tags || [],
      track: postData.track || null,
      video: postData.video || null,
      likesCount: 0,
      commentsCount: 0,
      hasLiked: false,
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);

    // If an audio track was attached, also add it to user's audio tracks
    if (postData.track) {
      setMusicians(prev => prev.map(m => {
        if (m.id === currentUser.id) {
          const existingTracks = m.audioTracks || [];
          return {
            ...m,
            audioTracks: [postData.track, ...existingTracks]
          };
        }
        return m;
      }));
    }

    showToast('Your post has been published to the community!');
  };

  // Post a new gig
  const postGig = (gigData) => {
    const newGig = {
      id: `gig-${Date.now()}`,
      title: gigData.title,
      postedBy: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        id: currentUser.id
      },
      location: gigData.location,
      type: gigData.type,
      pay: gigData.pay,
      instrumentsNeeded: gigData.instrumentsNeeded || [],
      genre: gigData.genre,
      date: gigData.date,
      postedDate: 'Just now',
      description: gigData.description,
      applicantsCount: 0,
      status: 'Active'
    };

    setGigs(prev => [newGig, ...prev]);
    showToast('Gig opportunity published successfully!');
  };

  // Apply to a gig
  const applyToGig = (gigId, applicationData) => {
    setGigs(prev => prev.map(g => {
      if (g.id === gigId) {
        return {
          ...g,
          applicantsCount: (g.applicantsCount || 0) + 1
        };
      }
      return g;
    }));

    showToast('Your application & demo have been submitted to the gig organizer!');
  };

  // Update profile
  const updateProfile = (updatedData) => {
    setMusicians(prev => prev.map(m => {
      if (m.id === currentUserId) {
        return {
          ...m,
          ...updatedData
        };
      }
      return m;
    }));
    showToast('Profile updated successfully!');
  };

  // Add custom audio track to profile
  const addAudioTrack = (trackData) => {
    const newTrack = {
      id: `tr-${Date.now()}`,
      title: trackData.title,
      genre: trackData.genre || 'Neo-Soul',
      duration: trackData.duration || '3:20',
      durationSec: trackData.durationSec || 35,
      plays: 1,
      bpm: trackData.bpm || 100,
      key: trackData.key || 'C Major',
      stemsAvailable: trackData.stemsAvailable || false,
      fileUrl: trackData.fileUrl || null,
      waveform: [30, 50, 75, 90, 65, 80, 95, 70, 85, 90, 80, 60, 75, 85, 90, 60, 45, 30]
    };

    setMusicians(prev => prev.map(m => {
      if (m.id === currentUserId) {
        return {
          ...m,
          audioTracks: [newTrack, ...(m.audioTracks || [])]
        };
      }
      return m;
    }));
    showToast(`Track "${newTrack.title}" added to your showcase!`);
  };

  // Send message
  const sendMessage = (targetUserId, text, trackAttachment = null) => {
    if (!text.trim() && !trackAttachment) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      senderId: currentUserId,
      text: text.trim(),
      track: trackAttachment,
      timestamp: 'Just now'
    };

    // Find conversation or create one
    setConversations(prev => {
      const exists = prev.find(c => c.withUserId === targetUserId);
      if (exists) {
        return prev.map(c => {
          if (c.withUserId === targetUserId) {
            return {
              ...c,
              lastMessage: text.trim() || `Sent track: ${trackAttachment?.title}`,
              timestamp: 'Just now',
              messages: [...c.messages, newMessage]
            };
          }
          return c;
        });
      } else {
        const newConv = {
          id: `conv-${Date.now()}`,
          withUserId: targetUserId,
          lastMessage: text.trim() || `Sent track: ${trackAttachment?.title}`,
          timestamp: 'Just now',
          unread: false,
          messages: [newMessage]
        };
        return [newConv, ...prev];
      }
    });

    showToast('Message sent!');
  };

  // Navigate to profile
  const viewProfile = (musicianId) => {
    setViewedProfileId(musicianId);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        currentUserId,
        currentUser,
        musicians,
        switchUser,
        viewedProfileId,
        viewedUser,
        viewProfile,
        activeTab,
        setActiveTab,
        globalSearch,
        setGlobalSearch,
        posts,
        gigs,
        events,
        conversations,
        notifications,
        connections,
        toggleConnection,
        acceptConnection,
        endorseSkill,
        togglePostLike,
        addComment,
        createPost,
        postGig,
        applyToGig,
        updateProfile,
        addAudioTrack,
        sendMessage,
        // Audio Player
        currentTrack,
        isPlaying,
        playbackProgress,
        currentTimeFormatted,
        durationFormatted,
        volume,
        playTrack,
        togglePlayPause,
        handleVolumeChange,
        // Modals
        isPostModalOpen,
        setIsPostModalOpen,
        isGigModalOpen,
        setIsGigModalOpen,
        isEditProfileModalOpen,
        setIsEditProfileModalOpen,
        inviteModalData,
        setInviteModalData,
        applyGigModalData,
        setApplyGigModalData,
        // Toast
        toastMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
