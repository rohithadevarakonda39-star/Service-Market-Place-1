import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Mail, Lock, ArrowRight, User, Sparkles, ArrowLeft, Sun, Moon } from 'lucide-react';

export const ConsumerLoginPage = () => {
  const { navigateTo, login, addToast, theme, toggleTheme } = useApp();

  const [email, setEmail] = useState('alex.morgan@servigo.io');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      login({
        id: 'usr-101',
        name: 'Alex Morgan',
        email: email,
        phone: '+1 (555) 019-2834',
        address: '742 Evergreen Terrace, Apt 4B, Springfield Metro',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        memberSince: 'March 2025',
        savedCardsCount: 2,
        role: 'client'
      }, 'client');
      addToast('Welcome back! Signed in to Consumer Marketplace.', 'success');
      navigateTo('consumer-home');
    }, 600);
  };

  const handleFillDemo = () => {
    setEmail('alex.morgan@servigo.io');
    setPassword('password123');
    addToast('Filled demo consumer credentials', 'info');
  };

  return (
    <div className="auth-portal-root">
      {/* Top Navbar */}
      <header className="auth-nav-simple container">
        <button onClick={() => navigateTo('auth')} className="btn btn-secondary btn-sm back-auth-btn">
          <ArrowLeft size={16} />
          <span>Back to Roles</span>
        </button>

        <div className="logo-wrapper" onClick={() => navigateTo('auth')}>
          <div className="logo-icon-box">
            <ShieldCheck size={20} color="#10b981" />
          </div>
          <span className="logo-brand">Servi<span className="logo-brand-accent">Go</span></span>
        </div>

        <button onClick={toggleTheme} className="nav-icon-btn btn-sm">
          {theme === 'dark' ? <Sun size={16} color="#10b981" /> : <Moon size={16} color="#059669" />}
        </button>
      </header>

      <main className="container auth-form-container">
        <div className="card auth-portal-card">
          <div className="auth-card-top">
            <span className="badge badge-verified">
              <User size={13} /> Consumer Portal
            </span>
            <h2 className="auth-card-title">Welcome Back</h2>
            <p className="auth-card-sub">Sign in to book services, view bookings, and track specialists</p>
          </div>

          {/* Quick Demo Fill button */}
          <div className="demo-hint-box" onClick={handleFillDemo}>
            <Sparkles size={14} color="#10b981" />
            <div>
              <strong>Quick Demo:</strong>
              <span>Click to auto-fill Alex Morgan (Consumer)</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-inputs-form">
            <div className="input-group">
              <label className="input-label">Email or Phone Number</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com or phone"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <div className="label-with-link">
                <label className="input-label">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); addToast('Password reset link sent to email.', 'info'); }} className="text-link">
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <label className="remember-checkbox-label">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
              />
              <span>Remember me on this device</span>
            </label>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-glow auth-action-btn">
              {loading ? 'Authenticating...' : 'Sign In as Consumer'}
            </button>
          </form>

          <div className="auth-card-links">
            <p className="switch-text">
              Don't have an account?{' '}
              <button onClick={() => navigateTo('consumer-register')} className="inline-action-link">
                Register as Consumer
              </button>
            </p>
            <button onClick={() => navigateTo('auth')} className="btn btn-secondary btn-sm switch-role-btn">
              Continue as another role
            </button>
          </div>
        </div>
      </main>

      <style>{`
        .auth-portal-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #0B0F0D;
          color: #f9fafb;
        }
        [data-theme="light"] .auth-portal-root {
          background: #F7F9F8;
          color: #0f172a;
        }

        .auth-nav-simple {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 0;
        }

        .auth-form-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: 4rem;
        }

        .auth-portal-card {
          width: 100%;
          max-width: 440px;
          padding: 2.25rem 2rem;
          background: #151A17;
          border: 1.5px solid rgba(16, 185, 129, 0.2);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        [data-theme="light"] .auth-portal-card {
          background: #ffffff;
          border-color: rgba(15, 23, 42, 0.1);
        }

        .auth-card-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.4rem;
        }

        .auth-card-title {
          font-size: 1.75rem;
          margin-top: 0.25rem;
        }
        .auth-card-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .demo-hint-box {
          background: rgba(16, 185, 129, 0.1);
          border: 1px dashed var(--accent-primary);
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.8rem;
          cursor: pointer;
          color: var(--text-secondary);
          transition: background var(--transition-fast);
        }
        .demo-hint-box:hover {
          background: rgba(16, 185, 129, 0.18);
        }
        .demo-hint-box strong {
          color: var(--accent-neon);
          margin-right: 4px;
        }

        .auth-inputs-form {
          display: flex;
          flex-direction: column;
        }

        .label-with-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .text-link {
          font-size: 0.775rem;
          color: var(--accent-primary);
        }

        .remember-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
          cursor: pointer;
        }

        .auth-action-btn {
          width: 100%;
        }

        .auth-card-links {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-align: center;
          border-top: 1px solid var(--border-color);
          padding-top: 1rem;
        }
        .switch-text {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .inline-action-link {
          color: var(--accent-primary);
          font-weight: 700;
        }

        .switch-role-btn {
          width: 100%;
        }
      `}</style>
    </div>
  );
};
