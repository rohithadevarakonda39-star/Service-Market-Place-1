import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Users, 
  Home, 
  MessageSquare, 
  Bell, 
  ShieldCheck, 
  User, 
  Search,
  Settings,
  LogOut,
  ChevronDown,
  Heart,
  Trash2,
  Zap
} from 'lucide-react';

export const Navbar = () => {
  const { 
    theme, 
    toggleTheme, 
    currentPage, 
    navigateTo, 
    bookings, 
    currentUser,
    logout,
    favorites,
    providerFavorites,
    searchLocation,
    setSearchLocation,
    openChatModal,
    notifications = [],
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const activeBookingsCount = bookings.filter(b => 
    b.status === 'In Progress' || 
    b.status === 'Confirmed' || 
    b.status === 'REQUESTED' || 
    b.status === 'ACCEPTED' || 
    b.status === 'PROVIDER_ON_THE_WAY' || 
    b.status === 'ARRIVED' || 
    b.status === 'SERVICE_IN_PROGRESS' || 
    b.status === 'SERVICE_STARTED'
  ).length;

  const totalFavoritesCount = (favorites?.length || 0) + (providerFavorites?.length || 0);
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'providers', label: 'Providers', icon: Users },
    { 
      id: 'bookings', 
      label: 'Bookings', 
      icon: Calendar, 
      badge: activeBookingsCount > 0 ? activeBookingsCount : null 
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      badge: totalFavoritesCount > 0 ? totalFavoritesCount : null
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare
    }
  ];

  const handleNavClick = (pageId) => {
    navigateTo(pageId);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setNotificationsOpen(false);
  };

  return (
    <>
      <header className="navbar-root">
        <div className="container">
          <div className="navbar-container">
            {/* Logo */}
            <div className="logo-wrapper" onClick={() => handleNavClick('home')}>
              <div className="logo-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="logo-text-group">
                <span className="logo-brand">Servi<span className="logo-brand-accent">Go</span></span>
                <span className="logo-sub">Smart Marketplace</span>
              </div>
            </div>

            {/* Location Pill (Desktop) */}
            <div className="navbar-location-pill">
              <MapPin size={15} className="location-icon" />
              <input 
                type="text" 
                value={searchLocation} 
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Your City / Area"
                className="location-input"
                title="Service Location"
              />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Icons & Profile */}
            <div className="navbar-actions">
              {/* Emergency Dispatch Button */}
              <button
                className="btn btn-outline btn-sm text-xs font-bold text-rose-400 border-rose-500/40 hover:bg-rose-500/10 flex items-center gap-1.5 py-1 px-2.5 rounded-full"
                title="24/7 Rapid Emergency Dispatch"
                onClick={() => handleNavClick('emergency')}
              >
                <Zap size={14} className="text-rose-400 animate-pulse" />
                <span className="hidden sm:inline">Emergency</span>
              </button>

              {/* Messages button */}
              <button 
                className="nav-icon-btn" 
                title="Messages & Chat"
                onClick={() => handleNavClick('messages')}
              >
                <MessageSquare size={18} />
              </button>

              {/* Notifications Toggle */}
              <div className="relative-container">
                <button 
                  className="nav-icon-btn" 
                  title="Notifications"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell size={18} />
                  {unreadNotifsCount > 0 && (
                    <span className="notification-dot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 800 }}>
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="dropdown-panel notifications-dropdown">
                    <div className="dropdown-header">
                      <h6>Notifications</h6>
                      {unreadNotifsCount > 0 ? (
                        <button
                          type="button"
                          className="badge badge-verified"
                          style={{ border: 'none', cursor: 'pointer' }}
                          onClick={markAllNotificationsRead}
                        >
                          Mark all read ({unreadNotifsCount})
                        </button>
                      ) : (
                        <span className="badge" style={{ fontSize: '0.7rem' }}>All caught up</span>
                      )}
                    </div>
                    <div className="notifications-list" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                      {notifications.length > 0 ? (
                        notifications.slice(0, 8).map((notif) => (
                          <div
                            key={notif.id}
                            className={`notification-item ${!notif.read ? 'unread' : ''}`}
                            onClick={() => {
                              markNotificationRead(notif.id);
                              if (notif.bookingId) {
                                navigateTo('booking-details', { bookingId: notif.bookingId });
                              } else {
                                handleNavClick('bookings');
                              }
                              setNotificationsOpen(false);
                            }}
                          >
                            {!notif.read && <div className="notif-indicator"></div>}
                            <div style={{ flex: 1 }}>
                              <p className="notif-title" style={{ fontWeight: !notif.read ? 700 : 500 }}>
                                {notif.title}
                              </p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.15rem 0' }}>
                                {notif.message}
                              </p>
                              <span className="notif-time">{notif.time}</span>
                            </div>
                            <button
                              type="button"
                              className="text-muted hover:text-rose-400 p-1 transition-colors self-center"
                              title="Delete notification"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif.id);
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          No notifications at this time
                        </div>
                      )}
                    </div>
                    <div className="dropdown-footer">
                      <button className="text-btn" onClick={() => handleNavClick('bookings')}>View All Bookings</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Dark / Light Mode Toggle */}
              <button 
                onClick={toggleTheme} 
                className="nav-icon-btn theme-toggle-btn"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun size={18} className="theme-icon sun" />
                ) : (
                  <Moon size={18} className="theme-icon moon" />
                )}
              </button>

              {/* User Profile Pill & Dropdown */}
              {currentUser ? (
                <div className="relative-container">
                  <button 
                    className="profile-pill-btn"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    <img src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'} alt={currentUser.name} className="profile-avatar" />
                    <span className="profile-name-text">{currentUser.name ? currentUser.name.split(' ')[0] : 'User'}</span>
                    <ChevronDown size={14} className="profile-chevron" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="dropdown-panel profile-dropdown">
                      <div className="profile-dropdown-user">
                        <p className="profile-user-name">{currentUser.name}</p>
                        <p className="profile-user-email">{currentUser.email}</p>
                        <span className="badge badge-verified" style={{ marginTop: '0.4rem' }}>Verified Member</span>
                      </div>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item" onClick={() => handleNavClick('profile')}>
                        <User size={16} />
                        <span>My Profile</span>
                      </button>
                      <button className="dropdown-item" onClick={() => handleNavClick('bookings')}>
                        <Calendar size={16} />
                        <span>My Bookings</span>
                      </button>
                      <button className="dropdown-item" onClick={() => handleNavClick('favorites')}>
                        <Heart size={16} />
                        <span>My Favorites</span>
                      </button>
                      <button className="dropdown-item" onClick={() => handleNavClick('settings')}>
                        <Settings size={16} />
                        <span>Settings & Security</span>
                      </button>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item dropdown-item-danger" onClick={() => { setProfileDropdownOpen(false); logout(); }}>
                        <LogOut size={16} />
                        <span>Sign Out / Switch</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => navigateTo('auth')} className="btn btn-primary btn-sm">
                  Sign In
                </button>
              )}

              {/* Mobile Hamburger Toggle */}
              <button 
                className="mobile-hamburger-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="logo-wrapper">
                <div className="logo-icon-box">
                  <ShieldCheck size={20} color="#10b981" />
                </div>
                <span className="logo-brand">Servi<span className="logo-brand-accent">Go</span></span>
              </div>
              <button className="nav-icon-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Mobile Location Input */}
            <div className="mobile-location-box">
              <MapPin size={16} color="#10b981" />
              <input 
                type="text" 
                value={searchLocation} 
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Current Location"
                className="input-field"
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
              />
            </div>

            <div className="mobile-links-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </button>
                );
              })}
              <div className="dropdown-divider"></div>
              <button onClick={() => handleNavClick('profile')} className="mobile-nav-item">
                <User size={18} />
                <span>My Profile</span>
              </button>
              <button onClick={() => handleNavClick('settings')} className="mobile-nav-item">
                <Settings size={18} />
                <span>Settings</span>
              </button>
              {currentUser ? (
                <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="mobile-nav-item danger">
                  <LogOut size={18} />
                  <span>Logout ({currentUser.name ? currentUser.name.split(' ')[0] : 'User'})</span>
                </button>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); navigateTo('auth'); }} className="mobile-nav-item">
                  <LogOut size={18} />
                  <span>Sign In / Select Role</span>
                </button>
              )}
            </div>

            <div className="mobile-drawer-footer">
              <div className="theme-toggle-row">
                <span>Theme Mode</span>
                <button onClick={toggleTheme} className="btn btn-secondary btn-sm">
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Navbar Styles */}
      <style>{`
        .navbar-root {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(9, 12, 11, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-color);
          transition: background 0.3s ease;
        }
        [data-theme="light"] .navbar-root {
          background: rgba(255, 255, 255, 0.9);
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }

        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          gap: 1rem;
        }

        .logo-wrapper {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          cursor: pointer;
          user-select: none;
        }

        .logo-icon-box {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.4));
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-primary);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.25);
        }

        .logo-text-group {
          display: flex;
          flex-direction: column;
        }

        .logo-brand {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          line-height: 1;
        }

        .logo-brand-accent {
          color: var(--accent-primary);
        }

        .logo-sub {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 2px;
        }

        .navbar-location-pill {
          display: none;
          align-items: center;
          gap: 0.4rem;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          transition: border-color var(--transition-fast);
        }
        @media (min-width: 1024px) {
          .navbar-location-pill {
            display: flex;
          }
        }
        .navbar-location-pill:focus-within {
          border-color: var(--accent-primary);
        }
        .location-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }
        .location-input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.825rem;
          font-family: inherit;
          width: 130px;
          outline: none;
        }

        .desktop-nav {
          display: none;
          align-items: center;
          gap: 0.5rem;
        }
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
          }
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          position: relative;
        }
        .nav-link:hover {
          color: var(--accent-primary);
          background: var(--accent-light);
        }
        .nav-link-active {
          color: var(--accent-primary);
          background: var(--accent-light);
        }

        .nav-badge {
          background: var(--accent-primary);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-full);
          line-height: 1;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          position: relative;
        }
        .nav-icon-btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          background: var(--bg-card-hover);
        }

        .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: var(--accent-neon);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--accent-primary);
        }

        .theme-toggle-btn {
          color: var(--accent-primary);
        }

        .profile-pill-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.65rem 0.35rem 0.35rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          transition: border-color var(--transition-fast);
        }
        .profile-pill-btn:hover {
          border-color: var(--accent-primary);
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--accent-primary);
        }

        .profile-name-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          display: none;
        }
        @media (min-width: 640px) {
          .profile-name-text {
            display: inline;
          }
        }

        .profile-chevron {
          color: var(--text-muted);
        }

        .mobile-hamburger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-primary);
        }
        @media (min-width: 768px) {
          .mobile-hamburger-btn {
            display: none;
          }
        }

        .relative-container {
          position: relative;
        }

        .dropdown-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: var(--bg-card-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
          animation: slideUp 0.15s ease-out;
          z-index: 1000;
        }

        .profile-dropdown {
          width: 230px;
          padding: 0.75rem 0;
        }

        .profile-dropdown-user {
          padding: 0.5rem 1rem 0.75rem;
        }
        .profile-user-name {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 0.95rem;
        }
        .profile-user-email {
          font-size: 0.775rem;
          color: var(--text-muted);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border-color);
          margin: 0.4rem 0;
        }

        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.6rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-align: left;
          transition: background var(--transition-fast);
        }
        .dropdown-item:hover {
          background: var(--accent-light);
          color: var(--accent-primary);
        }
        .dropdown-item-danger:hover {
          background: var(--danger-light);
          color: var(--danger);
        }

        .notifications-dropdown {
          width: 320px;
          padding: 0.75rem 0 0;
        }
        .dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1rem;
        }
        .notifications-list {
          max-height: 250px;
          overflow-y: auto;
        }
        .notification-item {
          padding: 0.75rem 1rem;
          display: flex;
          gap: 0.65rem;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .notification-item:hover {
          background: var(--bg-card-hover);
        }
        .notification-item.unread {
          background: rgba(16, 185, 129, 0.05);
        }
        .notif-indicator {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent-primary);
          margin-top: 6px;
          flex-shrink: 0;
        }
        .notif-title {
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .notif-time {
          font-size: 0.725rem;
          color: var(--text-muted);
        }
        .dropdown-footer {
          padding: 0.5rem 1rem;
          text-align: center;
          border-top: 1px solid var(--border-color);
        }
        .text-btn {
          font-size: 0.8rem;
          color: var(--accent-primary);
          font-weight: 600;
        }

        /* Mobile Drawer */
        .mobile-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 999;
          animation: fadeIn 0.2s ease-out;
        }
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 80%;
          max-width: 320px;
          height: 100%;
          background: var(--bg-primary);
          border-left: 1px solid var(--border-color);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          animation: slideDrawer 0.25s ease-out;
        }
        @keyframes slideDrawer {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .mobile-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .mobile-location-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .mobile-links-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1;
        }
        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .mobile-nav-item.active {
          background: var(--accent-light);
          color: var(--accent-primary);
        }
        .mobile-drawer-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }
        .theme-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
      `}</style>
    </>
  );
};
