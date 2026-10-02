import React from 'react';
import { useApp } from '../../context/AppContext';
import { RoleIllustration } from '../../components/auth/RoleIllustrations';
import { ShieldCheck, User, Wrench, Lock, ArrowRight, Sun, Moon, Sparkles, CheckCircle2 } from 'lucide-react';

export const RoleSelectPage = () => {
  const { navigateTo, theme, toggleTheme, loginAsQuickDemo } = useApp();

  return (
    <div className="role-select-root">
      {/* Background glow effects */}
      <div className="auth-ambient-glow glow-top-left"></div>
      <div className="auth-ambient-glow glow-bottom-right"></div>

      {/* Top Bar with Logo & Theme Toggle */}
      <header className="auth-topbar container">
        <div className="logo-wrapper">
          <div className="logo-icon-box">
            <ShieldCheck size={22} color="#10b981" />
          </div>
          <div className="logo-text-group">
            <span className="logo-brand">Servi<span className="logo-brand-accent">Go</span></span>
            <span className="logo-sub">Smart Service Marketplace</span>
          </div>
        </div>

        <button 
          onClick={toggleTheme} 
          className="nav-icon-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} color="#10b981" /> : <Moon size={18} color="#059669" />}
        </button>
      </header>

      {/* Main Container */}
      <main className="container auth-hero-container">
        {/* Title & Headline */}
        <div className="auth-hero-heading">
          <div className="badge badge-verified welcome-pill">
            <Sparkles size={13} color="#10b981" />
            <span>Select Your Access Portal</span>
          </div>
          <h1 className="welcome-main-title">
            Welcome to <span className="text-highlight">ServiGo</span>
          </h1>
          <p className="welcome-main-subtitle">
            Find trusted professionals, book services, make secure payments, and track your service in real time.
          </p>
        </div>

        {/* 3 Role Selection Rectangular Cards */}
        <div className="role-cards-grid">
          {/* Card 1: Service Consumer */}
          <div className="card role-card consumer-role-card">
            <div className="role-card-badge">
              <User size={14} color="#10b981" />
              <span>Role 01</span>
            </div>

            <div className="role-illust-container">
              <RoleIllustration role="consumer" />
            </div>

            <div className="role-card-content">
              <div className="role-title-row">
                <span className="role-emoji">👤</span>
                <h3 className="role-title">Service Consumer</h3>
              </div>
              <p className="role-desc">
                Find and book trusted services near you. Enjoy upfront fixed pricing, instant scheduling, and escrow protection.
              </p>
            </div>

            <div className="role-actions-group">
              <button 
                onClick={() => navigateTo('consumer-login')} 
                className="btn btn-primary btn-glow w-100"
              >
                <span>Sign In</span>
                <ArrowRight size={15} />
              </button>
              <button 
                onClick={() => navigateTo('consumer-register')} 
                className="btn btn-secondary w-100"
              >
                <span>Register</span>
              </button>
            </div>
          </div>

          {/* Card 2: Service Provider */}
          <div className="card role-card provider-role-card">
            <div className="role-card-badge">
              <Wrench size={14} color="#10b981" />
              <span>Role 02</span>
            </div>

            <div className="role-illust-container">
              <RoleIllustration role="provider" />
            </div>

            <div className="role-card-content">
              <div className="role-title-row">
                <span className="role-emoji">🛠️</span>
                <h3 className="role-title">Service Provider</h3>
              </div>
              <p className="role-desc">
                Offer your services and connect with customers. Manage job dispatch requests, view earnings, and build verified reputation.
              </p>
            </div>

            <div className="role-actions-group">
              <button 
                onClick={() => navigateTo('provider-login')} 
                className="btn btn-primary btn-glow w-100"
              >
                <span>Sign In</span>
                <ArrowRight size={15} />
              </button>
              <button 
                onClick={() => navigateTo('provider-register')} 
                className="btn btn-secondary w-100"
              >
                <span>Register as Pro</span>
              </button>
            </div>
          </div>

          {/* Card 3: Admin */}
          <div className="card role-card admin-role-card">
            <div className="role-card-badge admin-badge">
              <Lock size={14} color="#fbbf24" />
              <span>Role 03</span>
            </div>

            <div className="role-illust-container">
              <RoleIllustration role="admin" />
            </div>

            <div className="role-card-content">
              <div className="role-title-row">
                <span className="role-emoji">🔐</span>
                <h3 className="role-title">System Admin</h3>
              </div>
              <p className="role-desc">
                Manage users, providers, services, bookings and platform operations. Oversee verifications and monitor live city dispatches.
              </p>
            </div>

            <div className="role-actions-group">
              <button 
                onClick={() => navigateTo('admin-login')} 
                className="btn btn-primary btn-glow w-100 admin-btn"
              >
                <span>Admin Sign In</span>
                <ArrowRight size={15} />
              </button>
              <span className="admin-notice-pill">
                Public registration disabled for security
              </span>
            </div>
          </div>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="quick-demo-banner">
          <div className="demo-banner-text">
            <Sparkles size={16} color="#10b981" />
            <strong>Instant Evaluation Mode:</strong>
            <span>One-click test access for pair-programming & QA review:</span>
          </div>
          <div className="demo-chips-group">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => loginAsQuickDemo('client')}
            >
              <span>👤 Quick Consumer Demo</span>
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => loginAsQuickDemo('provider')}
            >
              <span>🛠️ Quick Provider Demo</span>
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => loginAsQuickDemo('admin')}
            >
              <span>🔐 Quick Admin Demo</span>
            </button>
          </div>
        </div>
      </main>

      {/* Scoped Styles */}
      <style>{`
        .role-select-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          background: #0B0F0D; /* Near black dark mode */
          color: #f9fafb;
          overflow-x: hidden;
        }

        [data-theme="light"] .role-select-root {
          background: #F7F9F8;
          color: #0f172a;
        }

        .auth-ambient-glow {
          position: absolute;
          width: 550px;
          height: 550px;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.12;
          pointer-events: none;
        }
        .glow-top-left {
          top: -150px;
          left: -150px;
          background: #10b981;
        }
        .glow-bottom-right {
          bottom: -150px;
          right: -150px;
          background: #00e676;
        }

        .auth-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.5rem;
          padding-bottom: 1rem;
          position: relative;
          z-index: 10;
        }

        .auth-hero-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 2rem;
          padding-bottom: 4rem;
          position: relative;
          z-index: 5;
        }

        .auth-hero-heading {
          text-align: center;
          max-width: 760px;
          margin-bottom: 2.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .welcome-pill {
          margin-bottom: 0.85rem;
        }

        .welcome-main-title {
          font-family: var(--font-heading);
          font-size: clamp(2.2rem, 5vw, 3.6rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
        }
        .text-highlight {
          color: #10b981;
          text-shadow: 0 0 25px rgba(16, 185, 129, 0.4);
        }

        .welcome-main-subtitle {
          font-size: clamp(0.95rem, 2vw, 1.15rem);
          color: var(--text-muted);
          margin-top: 0.75rem;
          line-height: 1.6;
          max-width: 640px;
        }

        /* 3 Role Cards Grid */
        .role-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem;
          width: 100%;
          max-width: 1120px;
        }
        @media (min-width: 768px) {
          .role-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .role-card {
          background: #151A17;
          border: 1.5px solid rgba(16, 185, 129, 0.18);
          border-radius: 20px;
          padding: 2rem 1.6rem 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        [data-theme="light"] .role-card {
          background: #ffffff;
          border: 1.5px solid rgba(15, 23, 42, 0.1);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        }

        .role-card:hover {
          transform: translateY(-8px);
          border-color: #10b981;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(16, 185, 129, 0.3);
        }

        [data-theme="light"] .role-card:hover {
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.15), 0 0 20px rgba(5, 150, 105, 0.25);
        }

        .role-card-badge {
          position: absolute;
          top: 1.25rem;
          left: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-neon);
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .admin-badge {
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.12);
          border-color: rgba(245, 158, 11, 0.25);
        }

        .role-illust-container {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .role-illust-wrapper {
          width: 130px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .role-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .role-card-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .role-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .role-emoji {
          font-size: 1.4rem;
        }
        .role-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .role-desc {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin-bottom: 1.75rem;
        }

        .role-actions-group {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .w-100 {
          width: 100%;
        }

        .admin-notice-pill {
          font-size: 0.725rem;
          color: var(--text-muted);
          text-align: center;
          padding: 0.35rem 0;
          font-style: italic;
        }

        /* Quick Demo Access Bar */
        .quick-demo-banner {
          margin-top: 3.5rem;
          width: 100%;
          max-width: 1120px;
          background: rgba(19, 26, 23, 0.8);
          border: 1px dashed var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
        }
        @media (min-width: 860px) {
          .quick-demo-banner {
            flex-direction: row;
          }
        }

        [data-theme="light"] .quick-demo-banner {
          background: #ffffff;
          border-color: rgba(5, 150, 105, 0.3);
        }

        .demo-banner-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          flex-wrap: wrap;
        }
        .demo-banner-text strong {
          color: var(--accent-primary);
        }

        .demo-chips-group {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};
