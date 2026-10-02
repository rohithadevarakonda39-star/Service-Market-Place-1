import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Briefcase, Users, Calendar, User } from 'lucide-react';

export const BottomNav = () => {
  const { currentPage, navigateTo, bookings } = useApp();

  const activeBookingsCount = bookings.filter(b => b.status === 'In Progress' || b.status === 'Confirmed').length;

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'providers', label: 'Providers', icon: Users },
    { 
      id: 'bookings', 
      label: 'Bookings', 
      icon: Calendar,
      badge: activeBookingsCount > 0 ? activeBookingsCount : null
    },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <>
      <nav className="bottom-nav-root" aria-label="Mobile Navigation">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentPage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`bottom-nav-btn ${isActive ? 'active' : ''}`}
              aria-label={tab.label}
            >
              <div className="bottom-icon-container">
                <Icon size={20} />
                {tab.badge && <span className="bottom-badge">{tab.badge}</span>}
              </div>
              <span className="bottom-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        .bottom-nav-root {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: rgba(15, 20, 18, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 95;
          padding: 0 0.5rem;
        }

        [data-theme="light"] .bottom-nav-root {
          background: rgba(255, 255, 255, 0.95);
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.04);
        }

        @media (min-width: 768px) {
          .bottom-nav-root {
            display: none;
          }
        }

        .bottom-nav-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          height: 100%;
          color: var(--text-muted);
          transition: color var(--transition-fast), transform var(--transition-fast);
        }

        .bottom-nav-btn.active {
          color: var(--accent-primary);
        }

        .bottom-nav-btn:active {
          transform: scale(0.92);
        }

        .bottom-icon-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bottom-badge {
          position: absolute;
          top: -4px;
          right: -8px;
          background: var(--accent-primary);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 700;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .bottom-label {
          font-size: 0.7rem;
          font-weight: 600;
        }
      `}</style>
    </>
  );
};
