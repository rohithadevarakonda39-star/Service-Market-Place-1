import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Mail, Lock, ArrowRight, Wrench, Sparkles, ArrowLeft, Sun, Moon } from 'lucide-react';
import { providersData } from '../../data/providersData';

export const ProviderLoginPage = () => {
  const { navigateTo, login, addToast, theme, toggleTheme } = useApp();

  const [email, setEmail] = useState('marcus.vance@servigo.pro');
  const [password, setPassword] = useState('provider123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Log in as Marcus Vance or active provider
      const activePro = providersData[0];
      login({
        id: activePro.id,
        name: activePro.name,
        email: email,
        phone: activePro.phone,
        address: activePro.location,
        avatar: activePro.image,
        service: activePro.service,
        rating: activePro.rating,
        experience: activePro.experience,
        startingPrice: activePro.startingPrice,
        verified: true,
        memberSince: 'Jan 2024',
        role: 'provider'
      }, 'provider');

      addToast(`Welcome back, ${activePro.name}! Accessing Provider Operations.`, 'success');
      navigateTo('provider-dashboard');
    }, 600);
  };

  const handleFillDemo = () => {
    setEmail('marcus.vance@servigo.pro');
    setPassword('provider123');
    addToast('Filled demo provider credentials (Marcus Vance)', 'info');
  };

  return (
    <div className="auth-portal-root">
      <header className="auth-nav-simple container">
        <button onClick={() => navigateTo('auth')} className="btn btn-secondary btn-sm back-auth-btn">
          <ArrowLeft size={16} />
          <span>Back to Roles</span>
        </button>

        <div className="logo-wrapper" onClick={() => navigateTo('auth')}>
          <div className="logo-icon-box">
            <ShieldCheck size={20} color="#10b981" />
          </div>
          <span className="logo-brand">Servi<span className="logo-brand-accent">Go</span> Pro</span>
        </div>

        <button onClick={toggleTheme} className="nav-icon-btn btn-sm">
          {theme === 'dark' ? <Sun size={16} color="#10b981" /> : <Moon size={16} color="#059669" />}
        </button>
      </header>

      <main className="container auth-form-container">
        <div className="card auth-portal-card">
          <div className="auth-card-top">
            <span className="badge badge-verified">
              <Wrench size={13} /> Provider Pro Portal
            </span>
            <h2 className="auth-card-title">Provider Sign In</h2>
            <p className="auth-card-sub">Access your jobs, accept on-demand dispatches, and manage earnings</p>
          </div>

          <div className="demo-hint-box" onClick={handleFillDemo}>
            <Sparkles size={14} color="#10b981" />
            <div>
              <strong>Quick Demo:</strong>
              <span>Click to auto-fill Marcus Vance (Master Pro)</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-inputs-form">
            <div className="input-group">
              <label className="input-label">Provider Email or ID</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pro@servigo.pro"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <div className="label-with-link">
                <label className="input-label">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); addToast('Password recovery sent to phone.', 'info'); }} className="text-link">
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

            <label className="remember-checkbox-label">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
              />
              <span>Keep me signed in for job dispatch alerts</span>
            </label>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-glow auth-action-btn">
              {loading ? 'Verifying Pro License...' : 'Sign In to Provider Dashboard'}
            </button>
          </form>

          <div className="auth-card-links">
            <p className="switch-text">
              Want to partner with ServiGo?{' '}
              <button onClick={() => navigateTo('provider-register')} className="inline-action-link">
                Register as Provider
              </button>
            </p>
            <button onClick={() => navigateTo('auth')} className="btn btn-secondary btn-sm switch-role-btn">
              Continue as another role
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
