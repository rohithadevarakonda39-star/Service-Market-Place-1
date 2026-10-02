import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Mail, Lock, ArrowRight, ShieldAlert, ArrowLeft, Sun, Moon, KeyRound } from 'lucide-react';

export const AdminLoginPage = () => {
  const { navigateTo, login, addToast, theme, toggleTheme } = useApp();

  const [adminIdentifier, setAdminIdentifier] = useState('admin@servigo.io');
  const [password, setPassword] = useState('supersecretadmin');
  const [securityPin, setSecurityPin] = useState('9942');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      login({
        id: 'adm-001',
        name: 'Master Platform Admin',
        email: adminIdentifier,
        role: 'admin',
        title: 'Super Administrator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        permissions: ['all', 'provider_vetting', 'financial_disputes', 'system_config'],
      }, 'admin');
      addToast('Authenticated as Administrator. Welcome to Executive Console.', 'success');
      navigateTo('admin-dashboard');
    }, 600);
  };

  const handleFillDemo = () => {
    setAdminIdentifier('admin@servigo.io');
    setPassword('supersecretadmin');
    setSecurityPin('9942');
    addToast('Filled official demo administrator credentials', 'info');
  };

  return (
    <div className="auth-portal-root">
      {/* Top Simple Nav */}
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

      {/* Main Form Center */}
      <main className="container auth-form-container">
        <div className="auth-card-box">
          <div className="auth-card-header">
            <div className="auth-role-pill admin-pill">
              <ShieldAlert size={14} color="#f59e0b" />
              <span>Admin Access Portal</span>
            </div>
            <h1 className="auth-title">Administrator Sign In</h1>
            <p className="auth-subtitle">
              Secure operations console for ServiGo platform administration, vetting, and disputes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Admin Email or Username</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="text"
                  required
                  value={adminIdentifier}
                  onChange={(e) => setAdminIdentifier(e.target.value)}
                  placeholder="admin@servigo.io or root"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Master Password</label>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">2FA / Security PIN (Optional)</label>
              <div className="input-with-icon">
                <KeyRound size={18} className="input-icon" />
                <input
                  type="password"
                  maxLength={6}
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder="4-digit PIN (e.g. 9942)"
                  className="form-input"
                />
              </div>
            </div>

            <div className="auth-checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember this workstation</span>
              </label>
              <span className="auth-link text-muted" style={{ fontSize: '0.82rem' }}>
                Hardware Key Supported
              </span>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? (
                <div className="btn-spinner" />
              ) : (
                <>
                  <span>Sign In as Administrator</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Box */}
          <div className="demo-credentials-box">
            <div className="demo-creds-header">
              <ShieldAlert size={14} color="#f59e0b" />
              <span>Restricted Demo Credentials</span>
            </div>
            <div className="demo-creds-body">
              <p>Email: <code>admin@servigo.io</code></p>
              <p>Password: <code>supersecretadmin</code></p>
            </div>
            <button type="button" onClick={handleFillDemo} className="btn btn-secondary btn-sm btn-block">
              Auto-Fill Admin Credentials
            </button>
          </div>

          {/* Notice: No public registration */}
          <div className="auth-card-footer">
            <div className="notice-badge-admin">
              <span>Public registration is permanently disabled for platform security.</span>
            </div>
            <div className="role-switch-link">
              <button type="button" onClick={() => navigateTo('auth')} className="btn-link">
                ← Continue as another role
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
