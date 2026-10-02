import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Search, 
  Zap, 
  Calendar, 
  CreditCard, 
  MapPin, 
  ChevronRight, 
  HelpCircle,
  Wrench,
  Flame,
  CheckCircle,
  RotateCcw
} from 'lucide-react';
import { servicesData } from '../../data/servicesData';
import { providersData } from '../../data/providersData';

export const AiServiceAssistant = () => {
  const { navigateTo, bookings, openBookingModal, theme } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I am ServiGo AI, your intelligent home & commercial service assistant. Tell me what issue you are experiencing, or ask me for service recommendations.",
      time: 'Now',
      suggestions: ['My AC is running but not cooling', 'Emergency burst pipe repair', 'Track my active booking', 'How do payments work?']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, isOpen]);

  // Quick Action Buttons
  const quickActions = [
    { label: 'Find Service', icon: Search, action: () => navigateTo('services') },
    { label: 'Emergency Help', icon: Zap, action: () => navigateTo('emergency') },
    { label: 'Track Booking', icon: MapPin, action: () => navigateTo('bookings') },
    { label: 'Payment Help', icon: CreditCard, action: () => navigateTo('payments') }
  ];

  // Intelligent Natural Response Engine (Rule-based & Pluggable for Real AI SDK)
  const generateAiResponse = (query) => {
    const q = query.toLowerCase();

    // 1. AC / Heating issues
    if (q.includes('ac') || q.includes('cooling') || q.includes('air condition') || q.includes('compressor')) {
      const topPro = providersData[0]; // Rahul Kumar
      return {
        text: `Based on your description, this is typically caused by a clogged air filter, low refrigerant level, or a faulty capacitor. I recommend our top-rated AC specialist **${topPro.name}** (4.9 ★, 8 yrs exp). Would you like to schedule an inspection?`,
        actionLabel: 'Book AC Inspection',
        action: () => openBookingModal(servicesData[0], topPro, { title: 'AC not cooling / warm airflow' }),
        suggestions: ['Book AC Inspection', 'View AC Services', 'Emergency AC Repair']
      };
    }

    // 2. Plumbing / Water leak
    if (q.includes('pipe') || q.includes('leak') || q.includes('plumb') || q.includes('water') || q.includes('drain')) {
      const plumbPro = providersData[1] || providersData[0];
      return {
        text: `Water leaks and pipe bursts require immediate containment to prevent property damage. Shut off the nearest isolation valve if safe. Would you like emergency dispatch or a scheduled repair?`,
        actionLabel: 'Dispatch Emergency Plumber',
        action: () => navigateTo('emergency'),
        suggestions: ['Dispatch Emergency Plumber', 'Schedule Standard Plumbing', 'Contact Support']
      };
    }

    // 3. Electrical / Sparks
    if (q.includes('electric') || q.includes('spark') || q.includes('breaker') || q.includes('light') || q.includes('power')) {
      return {
        text: `Electrical issues like tripping breakers or sparking sockets present a fire hazard. Our licensed electricians carry thermal load scanners. You can book an immediate diagnosis.`,
        actionLabel: 'Find Electricians',
        action: () => navigateTo('services'),
        suggestions: ['Find Electricians', 'Emergency Electrician', 'Home Safety Check']
      };
    }

    // 4. Tracking
    if (q.includes('track') || q.includes('where is') || q.includes('arrival') || q.includes('status')) {
      const activeBooking = bookings.find(b => b.status === 'PROVIDER_ON_THE_WAY' || b.status === 'ACCEPTED');
      if (activeBooking) {
        return {
          text: `You have an active booking **#${activeBooking.bookingId || activeBooking.id}** with **${activeBooking.providerName}**. Current status: ${activeBooking.status.replace(/_/g, ' ')}. Would you like to view the live radar tracking?`,
          actionLabel: 'Open Live Radar',
          action: () => navigateTo('tracking', { bookingId: activeBooking.id || activeBooking.bookingId }),
          suggestions: ['Open Live Radar', 'Call Specialist', 'View Booking Details']
        };
      }
      return {
        text: `You can track all active technician dispatches in the My Bookings section with real-time GPS telemetry and estimated arrival times.`,
        actionLabel: 'Go to My Bookings',
        action: () => navigateTo('bookings'),
        suggestions: ['Go to My Bookings', 'Help with New Booking']
      };
    }

    // 5. Payment questions
    if (q.includes('pay') || q.includes('refund') || q.includes('price') || q.includes('cost') || q.includes('card') || q.includes('upi')) {
      return {
        text: `ServiGo payments are 100% protected in Escrow! We support UPI, Cards, NetBanking, Wallets, and Cash on Service. Funds are only transferred after you inspect and sign off on completed work.`,
        actionLabel: 'View Payment Ledger',
        action: () => navigateTo('payments'),
        suggestions: ['View Payment Ledger', 'Check Active Coupons', 'Escrow Policy']
      };
    }

    // 6. Emergency
    if (q.includes('emergency') || q.includes('urgent') || q.includes('now') || q.includes('asap')) {
      return {
        text: `For urgent emergencies (burst pipes, lockouts, electrical hazards), ServiGo guarantees dispatch in under 20 minutes with high-priority verified specialists.`,
        actionLabel: 'Open 24/7 Emergency Dispatch',
        action: () => navigateTo('emergency'),
        suggestions: ['Open 24/7 Emergency Dispatch', 'Call 911 / 112']
      };
    }

    // Generic helpful fallback
    return {
      text: `I understand! ServiGo offers certified specialists across 12+ categories including Appliance Repair, Plumbing, Electrical, Cleaning, and Security. Would you like me to recommend a top specialist near you?`,
      actionLabel: 'Explore All Services',
      action: () => navigateTo('services'),
      suggestions: ['Explore All Services', 'Compare Providers', 'Emergency Help']
    };
  };

  const handleSend = (textToSend = inputText) => {
    const text = (textToSend || '').trim();
    if (!text) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const aiReply = generateAiResponse(text);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: aiReply.text,
          actionLabel: aiReply.actionLabel,
          action: aiReply.action,
          suggestions: aiReply.suggestions,
          time: 'Just now'
        }
      ]);
    }, 900);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 font-bold text-sm border-2 border-emerald-400 group"
          onClick={() => setIsOpen(true)}
          title="Open ServiGo AI Assistant"
        >
          <div className="relative">
            <Bot size={22} className="text-black" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
          </div>
          <span className="hidden sm:inline font-extrabold tracking-tight">ServiGo AI</span>
        </button>
      )}

      {/* Expanded AI Chat Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] rounded-2xl bg-surface border border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-950 via-surface to-surface border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-black flex items-center justify-center shadow">
                <Bot size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-foreground">ServiGo AI Assistant</h4>
                  <Sparkles size={13} className="text-emerald-400" />
                </div>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ready to diagnose & help
                </span>
              </div>
            </div>

            <button
              type="button"
              className="nav-icon-btn btn-sm text-muted hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Action Pills Header */}
          <div className="p-2.5 bg-surface-elevated/50 border-b border-border flex items-center gap-2 overflow-x-auto">
            {quickActions.map((qa, i) => {
              const Icon = qa.icon;
              return (
                <button
                  key={i}
                  type="button"
                  className="text-[11px] font-semibold bg-surface hover:bg-emerald-500/10 hover:text-emerald-400 text-muted border border-border px-2.5 py-1 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0"
                  onClick={() => {
                    qa.action();
                    setIsOpen(false);
                  }}
                >
                  <Icon size={12} className="text-emerald-400" />
                  <span>{qa.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map(msg => {
              const isAssistant = msg.sender === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-surface-elevated border border-border text-foreground rounded-tl-none'
                        : 'bg-emerald-600 text-white rounded-tr-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Embedded Action Button if available */}
                    {msg.actionLabel && msg.action && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm w-full mt-2.5 text-xs py-1.5 font-bold flex items-center justify-center gap-1.5"
                        onClick={() => {
                          msg.action();
                          setIsOpen(false);
                        }}
                      >
                        <span>{msg.actionLabel}</span>
                        <ChevronRight size={13} />
                      </button>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full transition-all text-left"
                          onClick={() => handleSend(sug)}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-muted mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-muted italic animate-pulse">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <span>ServiGo AI is diagnosing your query...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer Form */}
          <form
            className="p-3 border-t border-border bg-surface flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Describe your issue or ask a question..."
              className="input-field flex-1 text-xs py-2"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary p-2 rounded-xl"
              disabled={!inputText.trim()}
              title="Send to AI Assistant"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
