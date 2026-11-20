import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Hand,
  MessageSquare,
  Users,
  PhoneOff,
  Settings,
  Sparkles,
  Send,
  CheckCircle,
  MoreVertical,
  Volume2,
  Share2,
  LayoutGrid,
  Maximize2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export const LiveClassroom = () => {
  const { batchId } = useParams();
  const { user, role } = useAuth();
  const { batches, courses } = useStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Find batch info
  const batch = batches.find((b) => b.id === batchId || b._id === batchId) || batches[0];
  const course = courses.find((c) => c.id === batch?.courseId || c._id === batch?.course) || courses[0];

  // Classroom controls state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState('chat'); // 'chat', 'participants', null
  const [chatMessage, setChatMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef(null);

  // Mock initial small-batch participants
  const [participants, setParticipants] = useState([
    {
      id: 'p-inst',
      name: batch?.instructorName || 'Dr. Ananya Roy',
      role: 'Instructor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isMicOn: true,
      isVideoOn: true,
      isHandRaised: false,
    },
    {
      id: 'p-1',
      name: user?.name ? `${user.name} (You)` : 'Priya Sharma (You)',
      role: role === 'instructor' ? 'Instructor' : 'Student',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      isMicOn: true,
      isVideoOn: true,
      isHandRaised: false,
    },
    {
      id: 'p-2',
      name: 'Kabir Sen',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isMicOn: false,
      isVideoOn: true,
      isHandRaised: false,
    },
    {
      id: 'p-3',
      name: 'Ritu Phogat',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isMicOn: false,
      isVideoOn: true,
      isHandRaised: true,
    },
  ]);

  // Real-time chat messages
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: batch?.instructorName || 'Dr. Ananya Roy',
      time: '10:02 AM',
      text: 'Good morning everyone! Please have your materials ready on your desk.',
    },
    {
      id: 'm2',
      sender: 'Kabir Sen',
      time: '10:03 AM',
      text: 'My room temperature is around 26°C today, should I adjust fermentation time?',
    },
  ]);

  const messagesEndRef = useRef(null);

  // Connect to live backend Socket.io
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-classroom', {
        batchId: batch?.id || batch?._id || 'demo-batch',
        user: {
          id: user?.id || user?._id || 'guest',
          name: user?.name || 'Guest Student',
          avatar: user?.avatar,
          role: user?.role || 'student',
        },
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('new-message', (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    socket.on('hand-toggled', ({ userName, isHandRaised: raised }) => {
      if (raised) {
        addToast(`${userName} raised their hand with a question!`, 'info');
      }
    });

    socket.on('screen-share-changed', ({ userName, isSharing }) => {
      if (isSharing) {
        addToast(`${userName} started sharing their screen.`, 'info');
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [batch?.id, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleToggleHand = () => {
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);
    if (socketRef.current?.connected) {
      socketRef.current.emit('toggle-hand', { isHandRaised: nextState });
    }
    if (nextState) {
      addToast('You raised your hand. Instructor has been notified.', 'info');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const messageText = chatMessage.trim();

    if (socketRef.current?.connected) {
      socketRef.current.emit('send-message', { text: messageText });
    } else {
      // Local fallback
      const newMsg = {
        id: `m-${Date.now()}`,
        sender: user?.name || 'Priya Sharma',
        time: new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }).format(new Date()),
        text: messageText,
      };
      setMessages((prev) => [...prev, newMsg]);
    }

    setChatMessage('');
  };

  const handleLeaveClass = () => {
    if (window.confirm('Are you sure you want to exit the live classroom?')) {
      addToast('Left the live classroom session.', 'info');
      if (role === 'instructor') {
        navigate('/instructor/classes');
      } else {
        navigate('/student/classes');
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-950 text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Top Bar */}
      <header className="h-16 bg-brand-900/90 border-b border-brand-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              LIVE
            </span>
          </div>

          <div className="h-4 w-px bg-brand-700 hidden sm:block" />

          <div>
            <h2 className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
              {course?.title}
            </h2>
            <p className="text-[11px] text-gray-300 truncate">
              {batch?.name} • Small Batch (Max {batch?.maxCapacity || 12} Students)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Socket Connection Indicator */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
              isConnected
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                : 'bg-brand-900 border-brand-800 text-gray-400'
            }`}
            title={isConnected ? 'Connected to live Socket.io backend' : 'Local mode active'}
          >
            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isConnected ? 'Socket Connected' : 'Local Classroom'}</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-800/80 border border-brand-700 text-xs text-gray-300">
            <Users className="w-3.5 h-3.5 text-accent" />
            <span>{participants.length} in Cohort</span>
          </div>

          <Button
            onClick={handleLeaveClass}
            variant="danger"
            size="sm"
            icon={PhoneOff}
          >
            Leave
          </Button>
        </div>
      </header>

      {/* Main Classroom Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Video Area */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          {/* Main Stage (Instructor / Screen share) */}
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-brand-900 border border-brand-800 flex items-center justify-center min-h-[360px] shadow-2xl">
            {isScreenSharing ? (
              <div className="w-full h-full p-8 flex flex-col items-center justify-center bg-gray-900 text-center">
                <Monitor className="w-16 h-16 text-brand-400 mb-4 animate-bounce" />
                <h3 className="text-lg font-bold text-white mb-1">
                  {user?.name || 'Instructor'} is Sharing Screen
                </h3>
                <p className="text-xs text-gray-400 max-w-sm">
                  Live demonstration of techniques and real-time critique.
                </p>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-brand-950">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&auto=format&fit=crop&q=80"
                  alt="Live Kitchen Stage"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-black/30" />

                {/* Instructor badge overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-brand-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-brand-800 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-white">
                    {batch?.instructorName || 'Dr. Ananya Roy'}
                  </span>
                  <Badge variant="accent" size="sm" className="ml-1 text-[10px]">
                    Instructor (Main Feed)
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] text-gray-300">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Speaking • High Definition</span>
                </div>
              </div>
            )}
          </div>

          {/* Student Small-Batch Video Grid */}
          <div className="h-32 mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            {participants.map((p) => (
              <div
                key={p.id}
                className="relative rounded-xl overflow-hidden bg-brand-900 border border-brand-800 flex items-center justify-center shadow-subtle group"
              >
                {p.isVideoOn ? (
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-brand-800 text-white flex items-center justify-center font-bold text-sm">
                    {p.name[0]}
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] bg-brand-950/80 backdrop-blur-md px-2 py-0.5 rounded-md truncate">
                  <span className="truncate text-gray-200">{p.name}</span>
                  {p.isHandRaised && (
                    <span className="text-amber-400 font-bold ml-1 animate-pulse" title="Hand Raised">
                      ✋
                    </span>
                  )}
                </div>

                <div className="absolute top-2 right-2 p-1 rounded-md bg-black/50 text-white text-[10px]">
                  {p.isMicOn ? (
                    <Mic className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <MicOff className="w-3 h-3 text-rose-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Collapsible Panel (Chat / Participants) */}
        {activeSidePanel && (
          <aside className="w-80 md:w-96 bg-brand-900 border-l border-brand-800 flex flex-col shrink-0 animate-in slide-in-from-right duration-200">
            {/* Panel Tabs */}
            <div className="h-12 border-b border-brand-800 flex items-center px-4 justify-between bg-brand-950/50">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveSidePanel('chat')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    activeSidePanel === 'chat'
                      ? 'bg-brand-800 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Live Chat
                </button>
                <button
                  onClick={() => setActiveSidePanel('participants')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    activeSidePanel === 'participants'
                      ? 'bg-brand-800 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Cohort ({participants.length})
                </button>
              </div>

              <button
                onClick={() => setActiveSidePanel(null)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Panel Content */}
            {activeSidePanel === 'chat' ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-brand-950/60 border border-brand-800 text-[11px] text-gray-400 leading-relaxed text-center">
                    Welcome to this live cohort session! Feel free to ask questions directly.
                  </div>

                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex items-baseline justify-between text-[11px]">
                        <span className="font-semibold text-accent">{msg.sender}</span>
                        <span className="text-gray-500 text-[10px]">{msg.time}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-brand-950/80 border border-brand-800 text-gray-200 leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-brand-800 bg-brand-950/60 flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask a question in cohort chat..."
                    className="flex-1 rounded-xl bg-brand-900 border border-brand-700 px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition shadow-subtle shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-2">
                  Cohort Members (Max {batch?.maxCapacity || 12} Students)
                </p>
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-brand-950/70 border border-brand-800"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-brand-700"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-200 truncate">{p.name}</p>
                        <span className="text-[10px] text-gray-400 capitalize">{p.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {p.isHandRaised && (
                        <span className="text-amber-400 text-xs font-bold" title="Question / Hand Raised">
                          ✋ Hand
                        </span>
                      )}
                      {p.isMicOn ? (
                        <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <MicOff className="w-3.5 h-3.5 text-gray-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <footer className="h-20 bg-brand-950 border-t border-brand-800 px-4 sm:px-8 flex items-center justify-between shrink-0">
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
          <span>Batch Cap: <strong className="text-white">{batch?.maxCapacity || 12}</strong></span>
          <span>•</span>
          <span>Class duration: <strong className="text-white">{batch?.durationMinutes || 90}m</strong></span>
        </div>

        <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3 rounded-2xl border transition-all ${
              isMicOn
                ? 'bg-brand-800 border-brand-700 text-white hover:bg-brand-700'
                : 'bg-rose-600/90 border-rose-500 text-white hover:bg-rose-700'
            }`}
            title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3 rounded-2xl border transition-all ${
              isVideoOn
                ? 'bg-brand-800 border-brand-700 text-white hover:bg-brand-700'
                : 'bg-rose-600/90 border-rose-500 text-white hover:bg-rose-700'
            }`}
            title={isVideoOn ? 'Stop Camera' : 'Start Camera'}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              const nextShare = !isScreenSharing;
              setIsScreenSharing(nextShare);
              if (socketRef.current?.connected) {
                socketRef.current.emit('screen-share-status', { isSharing: nextShare });
              }
              addToast(
                nextShare ? 'Started screen sharing.' : 'Stopped screen sharing.',
                'info'
              );
            }}
            className={`p-3 rounded-2xl border transition-all ${
              isScreenSharing
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-brand-800 border-brand-700 text-white hover:bg-brand-700'
            }`}
            title="Share Screen"
          >
            <Monitor className="w-5 h-5" />
          </button>

          <button
            onClick={handleToggleHand}
            className={`p-3 rounded-2xl border transition-all ${
              isHandRaised
                ? 'bg-amber-500 border-amber-400 text-brand-950 font-bold'
                : 'bg-brand-800 border-brand-700 text-white hover:bg-brand-700'
            }`}
            title="Raise Hand to Ask Question"
          >
            <Hand className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSidePanel(activeSidePanel === 'chat' ? null : 'chat')}
            className={`p-2.5 rounded-xl border transition ${
              activeSidePanel === 'chat'
                ? 'bg-brand-500 border-brand-400 text-white'
                : 'bg-brand-800 border-brand-700 text-gray-300 hover:text-white'
            }`}
            title="Toggle Live Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveSidePanel(activeSidePanel === 'participants' ? null : 'participants')}
            className={`p-2.5 rounded-xl border transition ${
              activeSidePanel === 'participants'
                ? 'bg-brand-500 border-brand-400 text-white'
                : 'bg-brand-800 border-brand-700 text-gray-300 hover:text-white'
            }`}
            title="Toggle Cohort Members"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LiveClassroom;
