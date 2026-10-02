import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, User, Mail, Phone, Lock, MapPin, ArrowLeft, Sun, Moon, CheckCircle2 } from 'lucide-react';

export const ConsumerRegisterPage = () => {
  const { navigateTo, login, addToast, theme, toggleTheme } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Downtown Metro');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      addToast('Passwords do not match. Please verify.', 'error');
      return;
    }

    if (!termsAgreed) {
      addToast('Please agree to the ServiGo terms to proceed.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const newConsumer = {
        id: `usr-${Date.now()}`,
        name: fullName || 'New Customer',
        email: email || 'user@servigo.io',
        phone: phone || '+1 (555) 000-0000',
        address: location,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        memberSince: 'Just joined',
        savedCardsCount: 0,
        role: 'client'
      };

      login(newConsumer, 'client');
      addToast(`Account created! Welcome to ServiGo, ${newConsumer.name}.`, 'success');
      navigateTo('consumer-home');
    }, 700);
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
          <span className="logo-brand">Servi<span className="logo-brand-accent">Go</span></span>
        </div>

        <button onClick={toggleTheme} className="nav-icon-btn btn-sm">
          {theme === 'dark' ? <Sun size={16} color="#10b981" /> : <Moon size={16} color="#059669" />}
        </button>
      </header>

      <main className="container auth-form-container">
        <div className="card auth-portal-card" style={{ maxWidth: '500px' }}>
          <div className="auth-card-top">
            <span className="badge badge-verified">
              <User size={13} /> Consumer Registration
            </span>
            <h2 className="auth-card-title">Create Account</h2>
            <p className="auth-card-sub">Join ServiGo to hire verified home & emergency professionals</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-inputs-form">
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jordan Miller"
                className="input-field"
              />
            </div>

            <div className="grid-2-inputs">
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@example.com"
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="input-field"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Delivery & Service Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or Neighborhood (e.g. Downtown Metro)"
                className="input-field"
              />
            </div>

            <div className="grid-2-inputs">
              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="input-field"
                />
              </div>
            </div>

            <label className="remember-checkbox-label">
              <input 
                type="checkbox" 
                checked={termsAgreed} 
                onChange={(e) => setTermsAgreed(e.target.checked)} 
              />
              <span>I agree to ServiGo's Terms of Service & Privacy Policy</span>
            </label>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-glow auth-action-btn">
              {loading ? 'Creating Consumer Profile...' : 'Complete Registration'}
            </button>
          </form>

          <div className="auth-card-links">
            <p className="switch-text">
              Already have an account?{' '}
              <button onClick={() => navigateTo('consumer-login')} className="inline-action-link">
                Sign In
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
