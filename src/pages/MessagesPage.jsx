import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Phone, 
  MoreVertical, 
  Check, 
  CheckCheck, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Smile, 
  X, 
  FileText, 
  ArrowLeft,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { providersData } from '../data/providersData';

export const MessagesPage = () => {
  const { bookings, navigateTo, addToast, theme } = useApp();

  // Initial Conversations linked to real providers and active bookings
  const [conversations, setConversations] = useState([
    {
      id: 'conv-1',
      providerId: 'p1',
      providerName: 'Rahul Kumar',
      providerAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80',
      service: 'AC Repair & Maintenance',
      bookingId: 'SV-20261002-4821',
      online: true,
      lastMessage: 'I am currently 2.4 km away and turning onto your street.',
      lastMessageTime: '10:42 AM',
      unreadCount: 1,
      isEmergency: false,
      messages: [
        {
          id: 1,
          sender: 'provider',
          text: 'Hi Alex! I received your booking for AC Deep Clean & Coil Overhaul. I have the replacement coils and refrigerant gauges loaded in my van.',
          time: '10:20 AM',
          read: true
        },
        {
          id: 2,
          sender: 'user',
          text: 'Great! The compressor makes a slight buzzing sound when starting up. Please check that first.',
          time: '10:25 AM',
          read: true
        },
        {
          id: 3,
          sender: 'provider',
          text: 'Noted! I will run an electrical load check on the capacitor first thing upon arrival.',
          time: '10:28 AM',
          read: true
        },
        {
          id: 4,
          sender: 'provider',
          text: 'I am currently 2.4 km away and turning onto your street.',
          time: '10:42 AM',
          read: false
        }
      ]
    },
    {
      id: 'conv-2',
      providerId: 'p2',
      providerName: 'David Miller',
      providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      service: 'Kitchen Pipe Burst Emergency Repair',
      bookingId: 'SV-20260928-3190',
      online: false,
      lastMessage: 'The high-pressure copper solder is completed and holding steady at 60 PSI.',
      lastMessageTime: 'Sep 28',
      unreadCount: 0,
      isEmergency: true,
      messages: [
        {
          id: 1,
          sender: 'provider',
          text: 'Emergency dispatch confirmed. I arrived in 18 minutes with the pipe clamp kit.',
          time: 'Sep 28, 11:18 AM',
          read: true
        },
        {
          id: 2,
          sender: 'provider',
          text: 'The high-pressure copper solder is completed and holding steady at 60 PSI.',
          time: 'Sep 28, 12:45 PM',
          read: true
        }
      ]
    },
    {
      id: 'conv-3',
      providerId: 'p3',
      providerName: 'Amina Al-Mansoor',
      providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      service: 'Electrical Panel Inspection',
      bookingId: 'SV-20260925-1082',
      online: true,
      lastMessage: 'Happy to help! Keep my contact for any future circuit upgrades.',
      lastMessageTime: 'Sep 25',
      unreadCount: 0,
      isEmergency: false,
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'Thanks for diagnosing the flickering circuit in the garage so quickly.',
          time: 'Sep 25, 4:10 PM',
          read: true
        },
        {
          id: 2,
          sender: 'provider',
          text: 'Happy to help! Keep my contact for any future circuit upgrades.',
          time: 'Sep 25, 4:12 PM',
          read: true
        }
      ]
    }
  ]);

  const [activeConvId, setActiveConvId] = useState('conv-1');
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isTyping]);

  // Mark active conversation messages as read
  useEffect(() => {
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId && c.unreadCount > 0) {
        return {
          ...c,
          unreadCount: 0,
          messages: c.messages.map(m => ({ ...m, read: true }))
        };
      }
      return c;
    }));
  }, [activeConvId]);

  // Quick reply prompt chips
  const quickReplies = [
    "How long will you take?",
    "Please call me.",
    "I am waiting at the location.",
    "Can you arrive earlier?",
    "I have shared the problem image."
  ];

  // Handle Send Message
  const handleSendMessage = (textToSend = inputText, imageAttachment = selectedImage) => {
    const text = (textToSend || '').trim();
    if (!text && !imageAttachment) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: text || 'Shared an image attachment',
      image: imageAttachment || null,
      time: timeNow,
      read: false
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          lastMessage: text || 'Shared an image attachment',
          lastMessageTime: timeNow,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setInputText('');
    setSelectedImage(null);

    // Simulate provider typing and intelligent response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      let replyText = `Thanks for the update, Alex! I've noted that down. Proceeding accordingly.`;
      if (text.includes('How long')) {
        replyText = `I am navigating through traffic right now. Live GPS ETA shows approximately 10 to 12 minutes!`;
      } else if (text.includes('call me')) {
        replyText = `Sure thing! I am pulling over safely to ring your registered mobile number now.`;
      } else if (text.includes('waiting')) {
        replyText = `Great! I will park right in front of the gate/doorway in a few minutes.`;
      } else if (text.includes('earlier')) {
        replyText = `I have dispatched immediately ahead of schedule and am taking the fastest route on Highway 101.`;
      } else if (imageAttachment || text.includes('image')) {
        replyText = `Received the diagnostic photo! The model and connections look clear. I have the exact matching replacement parts ready.`;
      }

      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setConversations(prev => prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: replyText,
            lastMessageTime: replyTime,
            messages: [
              ...c.messages.map(m => ({ ...m, read: true })),
              {
                id: Date.now() + 1,
                sender: 'provider',
                text: replyText,
                time: replyTime,
                read: true
              }
            ]
          };
        }
        return c;
      }));
    }, 1500);
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        addToast('File too large (max 15MB).', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        addToast('Image ready to share. Press send.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.providerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.service.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.bookingId.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="container max-w-6xl py-6 animate-fade-in">
      <div className="card overflow-hidden bg-surface border-border shadow-xl grid grid-cols-1 md:grid-cols-12 min-h-[680px]">
        {/* Left Column: Conversations Sidebar */}
        <div className="md:col-span-4 border-r border-border flex flex-col bg-surface-elevated/30">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground mb-3">Service Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-muted" size={15} />
              <input
                type="text"
                placeholder="Search specialists or booking ref..."
                className="input-field w-full pl-9 text-xs"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filteredConversations.map(conv => (
              <div
                key={conv.id}
                className={`p-4 cursor-pointer transition-all flex items-start gap-3 ${
                  conv.id === activeConvId
                    ? 'bg-emerald-500/10 border-l-4 border-emerald-500'
                    : 'hover:bg-surface-elevated/80'
                }`}
                onClick={() => setActiveConvId(conv.id)}
              >
                {/* Avatar with beacon */}
                <div className="relative shrink-0">
                  <img
                    src={conv.providerAvatar}
                    alt={conv.providerName}
                    className="w-12 h-12 rounded-full object-cover border border-border"
                  />
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-surface" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-sm font-bold text-foreground truncate">{conv.providerName}</span>
                    <span className="text-[10px] text-muted whitespace-nowrap">{conv.lastMessageTime}</span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {conv.bookingId}
                    </span>
                    {conv.isEmergency && (
                      <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1 rounded uppercase">
                        Emergency
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted truncate">
                    {conv.lastMessage}
                  </p>
                </div>

                {/* Unread badge */}
                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold flex items-center justify-center shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Chat Thread Area */}
        <div className="md:col-span-8 flex flex-col h-full bg-surface">
          {/* Thread Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-surface-elevated/40">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeConv.providerAvatar}
                  alt={activeConv.providerName}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
                />
                {activeConv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">{activeConv.providerName}</h3>
                  <ShieldCheck size={14} className="text-emerald-400" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>{activeConv.service}</span>
                  <span>•</span>
                  <span className={activeConv.online ? "text-emerald-400 font-medium" : ""}>
                    {activeConv.online ? "Active Now" : "Offline"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-outline btn-sm py-1.5 px-3 text-xs flex items-center gap-1.5"
                onClick={() => navigateTo('tracking', { bookingId: activeConv.bookingId })}
              >
                <span>Live Radar</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm py-1.5 px-3 text-xs flex items-center gap-1.5"
                onClick={() => navigateTo('booking-details', { bookingId: activeConv.bookingId })}
              >
                <FileText size={13} />
                <span>Job Details</span>
              </button>
            </div>
          </div>

          {/* Booking Context Banner */}
          <div className="bg-surface-elevated/60 border-b border-border px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-emerald-400" />
              <span className="text-muted">Linked Order:</span>
              <span className="font-mono font-bold text-foreground">{activeConv.bookingId}</span>
            </div>
            <span className="text-[11px] text-muted">Direct encrypted channel with assigned specialist</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {activeConv.messages.map(msg => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl p-3 text-sm shadow-sm ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-surface-elevated border border-border text-foreground rounded-tl-none'
                    }`}
                  >
                    {/* Attached Image */}
                    {msg.image && (
                      <div className="mb-2 rounded-lg overflow-hidden border border-black/20">
                        <img 
                          src={msg.image} 
                          alt="Diagnostic Attachment" 
                          className="max-h-48 w-full object-cover" 
                        />
                      </div>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>

                  {/* Message meta */}
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-muted px-1">
                    <span>{msg.time}</span>
                    {isUser && (
                      msg.read ? <CheckCheck size={12} className="text-emerald-400" /> : <Check size={12} />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-muted italic animate-pulse">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <span>{activeConv.providerName} is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Chips */}
          <div className="px-4 py-2 bg-surface border-t border-border flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold text-muted uppercase shrink-0 flex items-center gap-1">
              <Sparkles size={11} className="text-emerald-400" /> Quick:
            </span>
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                type="button"
                className="text-[11px] bg-surface-elevated hover:bg-emerald-500/10 hover:text-emerald-400 border border-border px-2.5 py-1 rounded-full whitespace-nowrap transition-all"
                onClick={() => handleSendMessage(reply)}
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Image Attachment Preview in Composer */}
          {selectedImage && (
            <div className="p-3 bg-surface-elevated border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={selectedImage} alt="Attachment Preview" className="w-12 h-12 rounded object-cover border border-emerald-500" />
                <span className="text-xs text-foreground font-medium">Diagnostic Image Attached</span>
              </div>
              <button 
                type="button" 
                className="text-muted hover:text-rose-400"
                onClick={() => setSelectedImage(null)}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Message Input Box */}
          <form 
            className="p-3 border-t border-border bg-surface flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload} 
            />

            <button
              type="button"
              className="btn btn-outline p-2.5 text-muted hover:text-emerald-400 rounded-xl"
              onClick={() => fileInputRef.current?.click()}
              title="Attach diagnostic photo"
            >
              <ImageIcon size={18} />
            </button>

            <input
              type="text"
              placeholder={`Message ${activeConv.providerName}...`}
              className="input-field flex-1 text-sm py-2.5"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <button
              type="submit"
              className="btn btn-primary p-2.5 rounded-xl shadow-md"
              disabled={!inputText.trim() && !selectedImage}
              title="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
