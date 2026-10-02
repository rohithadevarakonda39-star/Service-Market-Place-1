import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Mail, Lock, ArrowRight, CheckCircle2, User, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { navigateTo, setCurrentUser, addToast } = useApp();

  const [email, setEmail] = useState('alex.morgan@servigo.io');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setCurrentUser({
        id: 'usr-101',
        name: 'Alex Morgan',
        email: email,
        phone: '+1 (555) 019-2834',
        address: '742 Evergreen Terrace, Apt 4B, Springfield Metro',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        memberSince: 'March 2025',
        savedCardsCount: 2,
        role: 'client'
      });
      addToast('Welcome back, Alex! Signed in successfully.', 'success');
      navigateTo('home');
    }, 600);
  };

  const handleQuickClientLogin = () => {
    setEmail('alex.morgan@servigo.io');
    setPassword('password123');
    addToast('Client credentials filled. Signing in...', 'info');
    setCurrentUser({
      id: 'usr-101',
      name: 'Alex Morgan',
      email: 'alex.morgan@servigo.io',
      phone: '+1 (555) 019-2834',
      address: '742 Evergreen Terrace, Apt 4B, Springfield Metro',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      memberSince: 'March 2025',
      savedCardsCount: 2,
      role: 'client'
    });
    setTimeout(() => navigateTo('home'), 400);
  };

  const handleQuickProLogin = () => {
    setEmail('marcus.vance@servigo.pro');
    setPassword('providerPass123');
    addToast('Provider account activated. Welcome Marcus!', 'info');
    setCurrentUser({
      id: 'prov-1',
      name: 'Marcus Vance',
      email: 'marcus.vance@servigo.pro',
      phone: '+1 (555) 234-8901',
      address: 'Downtown Electrician Depot #4',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      memberSince: 'Jan 2024',
      savedCardsCount: 1,
      role: 'provider'
    });
    setTimeout(() => navigateTo('providers'), 400);
  };

  return (
    <div className="auth-page-root container">
      <div className="auth-card-wrapper">
        <div className="card auth-card">
          {/* Logo & Header */}
          <div className="auth-header">
            <div className="logo-icon-box" style={{ margin: '0 auto 0.75rem' }}>
              <ShieldCheck size={24} color="#10b981" />
            </div>
            <h2 className="auth-title">Welcome to Servi<span style={{ color: '#10b981' }}>Go</span></h2>
            <p className="auth-subtitle">Sign in to manage appointments, track specialists & view receipts</p>
          </div>

          {/* 1-Click Fast Demo Logins */}
          <div className="demo-login-box">
            <span className="demo-caption"><Sparkles size={12} color="#10b981" /> Quick One-Click Demo Access</span>
            <div className="demo-buttons-row">
              <button 
                type="button" 
                onClick={handleQuickClientLogin}
                className="btn btn-secondary btn-sm demo-btn"
              >
                <span>Client (Alex)</span>
              </button>
              <button 
                type="button" 
                onClick={handleQuickProLogin}
                className="btn btn-secondary btn-sm demo-btn"
              >
                <span>Pro (Marcus)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <label className="input-label"><Mail size={14} style={{ display: 'inline', marginRight: 4 }} /> Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label"><Lock size={14} style={{ display: 'inline', marginRight: 4 }} /> Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); addToast('Reset link sent to your email!', 'info'); }} className="forgot-link">
                  Forgot?
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

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-glow auth-submit-btn">
              {loading ? 'Authenticating...' : 'Sign In to ServiGo'}
            </button>
          </form>

          <div className="auth-footer-switch">
            <span>Don't have an account yet?</span>
            <button onClick={() => navigateTo('register')} className="switch-auth-link">
              Create an account
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page-root {
          padding: 3rem 1rem 5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 200px);
        }

        .auth-card-wrapper {
          width: 100%;
          max-width: 440px;
        }

        .auth-card {
          padding: 2.25rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .auth-header {
          text-align: center;
        }
        .auth-title {
          font-size: 1.65rem;
          margin-bottom: 0.35rem;
        }
        .auth-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .demo-login-box {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .demo-caption {
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--accent-neon);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          text-transform: uppercase;
        }
        .demo-buttons-row {
          display: flex;
          gap: 0.5rem;
        }
        .demo-btn {
          flex: 1;
          font-size: 0.775rem;
          padding: 0.4rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
        }

        .forgot-link {
          font-size: 0.75rem;
          color: var(--accent-primary);
        }

        .auth-submit-btn {
          width: 100%;
          margin-top: 0.5rem;
        }

        .auth-footer-switch {
          text-align: center;
          font-size: 0.825rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
        }
        .switch-auth-link {
          color: var(--accent-primary);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
