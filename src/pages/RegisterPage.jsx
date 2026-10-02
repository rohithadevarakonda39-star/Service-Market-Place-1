import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User, Mail, Phone, Lock, MapPin, Briefcase, CheckCircle2 } from 'lucide-react';
import { categoriesData } from '../data/categoriesData';

export const RegisterPage = () => {
  const { navigateTo, setCurrentUser, addToast } = useApp();

  const [accountType, setAccountType] = useState('client'); // 'client' | 'provider'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Downtown Metro');
  const [password, setPassword] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(categoriesData[0].id);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!termsAgreed) {
      addToast('Please accept the ServiGo Safety & Escrow Terms to proceed', 'error');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setCurrentUser({
        id: `usr-${Date.now()}`,
        name: fullName || 'New Member',
        email: email || 'user@servigo.io',
        phone: phone || '+1 (555) 000-0000',
        address: `${city}, Central District`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        memberSince: 'Just joined',
        savedCardsCount: 0,
        role: accountType
      });

      addToast(`Account created successfully as a ${accountType === 'client' ? 'Client' : 'Service Contractor'}!`, 'success');
      navigateTo(accountType === 'client' ? 'home' : 'profile');
    }, 700);
  };

  return (
    <div className="auth-page-root container">
      <div className="auth-card-wrapper" style={{ maxWidth: '500px' }}>
        <div className="card auth-card">
          <div className="auth-header">
            <div className="logo-icon-box" style={{ margin: '0 auto 0.75rem' }}>
              <ShieldCheck size={24} color="#10b981" />
            </div>
            <h2 className="auth-title">Create Servi<span style={{ color: '#10b981' }}>Go</span> Account</h2>
            <p className="auth-subtitle">Join thousands booking & providing trusted services daily</p>
          </div>

          {/* Account Role Selector Tabs */}
          <div className="role-switch-container">
            <button
              type="button"
              onClick={() => setAccountType('client')}
              className={`role-tab-btn ${accountType === 'client' ? 'active' : ''}`}
            >
              <User size={16} />
              <span>Hire Services</span>
            </button>
            <button
              type="button"
              onClick={() => setAccountType('provider')}
              className={`role-tab-btn ${accountType === 'provider' ? 'active' : ''}`}
            >
              <Briefcase size={16} />
              <span>Offer Services (Pro)</span>
            </button>
          </div>

          <form onSubmit={handleRegister} className="auth-form">
            <div className="input-group">
              <label className="input-label"><User size={14} style={{ display: 'inline', marginRight: 4 }} /> Full Name</label>
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
                <label className="input-label"><Mail size={14} style={{ display: 'inline', marginRight: 4 }} /> Email</label>
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
                <label className="input-label"><Phone size={14} style={{ display: 'inline', marginRight: 4 }} /> Phone</label>
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

            {accountType === 'provider' && (
              <div className="input-group">
                <label className="input-label"><Briefcase size={14} style={{ display: 'inline', marginRight: 4 }} /> Primary Service Trade</label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="input-field"
                >
                  {categoriesData.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="input-group">
              <label className="input-label"><MapPin size={14} style={{ display: 'inline', marginRight: 4 }} /> Primary City / Region</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Downtown Metro"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label"><Lock size={14} style={{ display: 'inline', marginRight: 4 }} /> Create Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="input-field"
              />
            </div>

            <label className="terms-checkbox-label">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
              />
              <span>I agree to the <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> & <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a></span>
            </label>

            <button type="submit" disabled={submitting} className="btn btn-primary btn-lg btn-glow auth-submit-btn">
              {submitting ? 'Creating Profile...' : `Register as ${accountType === 'client' ? 'Client' : 'Service Pro'}`}
            </button>
          </form>

          <div className="auth-footer-switch">
            <span>Already have an account?</span>
            <button onClick={() => navigateTo('login')} className="switch-auth-link">
              Sign In
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .role-switch-container {
          display: flex;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.35rem;
          gap: 0.35rem;
        }

        .role-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }
        .role-tab-btn.active {
          background: var(--accent-primary);
          color: #ffffff;
        }

        .grid-2-inputs {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }
        @media (min-width: 500px) {
          .grid-2-inputs {
            grid-template-columns: 1fr 1fr;
          }
        }

        .terms-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
          cursor: pointer;
        }
        .terms-checkbox-label a {
          color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
};
