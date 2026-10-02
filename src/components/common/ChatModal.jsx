import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Phone, ShieldCheck, CheckCheck, Smile, Paperclip } from 'lucide-react';
import { providersData } from '../../data/providersData';

export const ChatModal = () => {
  const { chatModal, closeChatModal, openBookingModal } = useApp();
  const { isOpen, provider } = chatModal;

  const activeProvider = provider || providersData[0];

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'provider',
      text: `Hello! I'm ${activeProvider?.name}. How can I assist you with your service requirements today?`,
      time: '10:04 AM'
    },
    {
      id: 2,
      sender: 'provider',
      text: `I'm currently active in ${activeProvider?.location || 'your area'} and equipped for same-day dispatch.`,
      time: '10:05 AM'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulated provider reply
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        `Understood! I have my tools and parts ready in the van. Would you like me to reserve an arrival slot today?`,
        `That sounds very manageable. Standard diagnostic and resolution typically takes under 90 minutes.`,
        `Yes, I can assist with that. Feel free to hit 'Book Appointment' to lock in your slot with full insurance coverage!`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'provider',
          text: randomResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={closeChatModal}>
      <div className="modal-content chat-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-pro-info">
            <div className="chat-avatar-wrapper">
              <img src={activeProvider.image} alt={activeProvider.name} className="chat-avatar" />
              <span className="online-beacon"></span>
            </div>
            <div>
              <div className="chat-pro-name-row">
                <h5>{activeProvider.name}</h5>
                <ShieldCheck size={16} color="#10b981" />
              </div>
              <span className="chat-status-text">Online • Responds in &lt; 10 mins</span>
            </div>
          </div>
          <div className="chat-header-actions">
            <a href={`tel:${activeProvider.phone}`} className="nav-icon-btn" title="Call Provider">
              <Phone size={16} />
            </a>
            <button className="nav-icon-btn" onClick={closeChatModal} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="chat-thread">
          <div className="chat-security-banner">
            <ShieldCheck size={14} color="#10b981" />
            <span>End-to-end encrypted messaging via ServiGo SafeConnect</span>
          </div>

          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div key={m.id} className={`chat-message-row ${isUser ? 'user-row' : 'pro-row'}`}>
                {!isUser && <img src={activeProvider.image} alt="Pro" className="chat-bubble-avatar" />}
                <div className={`chat-bubble ${isUser ? 'user-bubble' : 'pro-bubble'}`}>
                  <p>{m.text}</p>
                  <div className="bubble-meta">
                    <span className="bubble-time">{m.time}</span>
                    {isUser && <CheckCheck size={14} color="#10b981" />}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="chat-message-row pro-row">
              <img src={activeProvider.image} alt="Pro" className="chat-bubble-avatar" />
              <div className="chat-bubble pro-bubble typing-bubble">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Suggestion */}
        <div className="chat-quick-actions">
          <button 
            className="quick-chip"
            onClick={() => setInputVal('Are you available to come by today?')}
          >
            Available today?
          </button>
          <button 
            className="quick-chip"
            onClick={() => setInputVal('What is the estimated cost and warranty?')}
          >
            Cost & warranty?
          </button>
          <button 
            className="quick-chip primary-chip"
            onClick={() => {
              closeChatModal();
              openBookingModal(null, activeProvider);
            }}
          >
            Book Now
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="chat-input-bar">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Message ${activeProvider.name}...`}
            className="chat-input"
          />
          <button type="submit" className="btn btn-primary btn-icon chat-send-btn" aria-label="Send message">
            <Send size={16} />
          </button>
        </form>
      </div>

      <style>{`
        .chat-modal-content {
          max-width: 480px;
          height: 600px;
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
        }

        .chat-header {
          padding: 1rem 1.25rem;
          background: var(--bg-card-elevated);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-pro-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .chat-avatar-wrapper {
          position: relative;
        }

        .chat-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--accent-primary);
        }

        .online-beacon {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          background: var(--accent-neon);
          border-radius: 50%;
          border: 2px solid var(--bg-card);
        }

        .chat-pro-name-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .chat-pro-name-row h5 {
          font-size: 0.95rem;
          margin: 0;
        }

        .chat-status-text {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .chat-header-actions {
          display: flex;
          gap: 0.4rem;
        }

        .chat-thread {
          flex: 1;
          padding: 1rem 1.25rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          background: var(--bg-primary);
        }

        .chat-security-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.725rem;
          color: var(--text-muted);
          background: var(--bg-card);
          padding: 0.4rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          margin-bottom: 0.5rem;
        }

        .chat-message-row {
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
        }
        .user-row {
          justify-content: flex-end;
        }

        .chat-bubble-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }

        .chat-bubble {
          max-width: 75%;
          padding: 0.75rem 0.95rem;
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .pro-bubble {
          background: var(--bg-card-elevated);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          border-bottom-left-radius: 4px;
        }

        .user-bubble {
          background: var(--accent-primary);
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }
        .user-bubble p {
          color: #ffffff;
        }

        .bubble-meta {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.35rem;
          margin-top: 4px;
          font-size: 0.675rem;
          opacity: 0.75;
        }

        .typing-bubble {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0.65rem 0.85rem;
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          background: var(--text-muted);
          border-radius: 50%;
          animation: blink 1.4s infinite both;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.1); }
        }

        .chat-quick-actions {
          padding: 0.5rem 1.25rem;
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          background: var(--bg-card);
          border-top: 1px solid var(--border-color);
        }

        .quick-chip {
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-input);
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
          transition: all var(--transition-fast);
        }
        .quick-chip:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }
        .primary-chip {
          background: var(--accent-light);
          color: var(--accent-primary);
          border-color: var(--accent-primary);
          font-weight: 600;
        }

        .chat-input-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--bg-card-elevated);
          border-top: 1px solid var(--border-color);
        }

        .chat-input {
          flex: 1;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-input);
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
        }
        .chat-input:focus {
          border-color: var(--accent-primary);
        }

        .chat-send-btn {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};
