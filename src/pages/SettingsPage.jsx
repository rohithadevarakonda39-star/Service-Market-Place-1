import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sun, 
  Moon, 
  Bell, 
  ShieldCheck, 
  Lock, 
  Phone, 
  Globe, 
  Check, 
  AlertTriangle, 
  KeyRound, 
  Smartphone 
} from 'lucide-react';

export const SettingsPage = () => {
  const { theme, toggleTheme, addToast } = useApp();

  // Notification states
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [marketingPromo, setMarketingPromo] = useState(false);

  // Security states
  const [twoFactor, setTwoFactor] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState('+1 (555) 919-4820 (Family Member)');

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    addToast('Security settings updated successfully!', 'success');
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    addToast('Notification preferences saved!', 'success');
  };

  return (
    <div className="settings-page-root container">
      <div className="settings-header">
        <h1 className="settings-title">Settings & System Preferences</h1>
        <p className="settings-sub">Customize platform aesthetics, alerts, security, and emergency safety protocols</p>
      </div>

      <div className="settings-grid">
        {/* Left Column: Theme & Appearance + Security */}
        <div className="settings-col">
          {/* Theme & Display Mode */}
          <div className="card-static details-block">
            <h3 className="block-title">Appearance & Color Scheme</h3>
            <p className="block-sub">Choose your visual environment. Dark mode features high-contrast neon accents, while Light mode provides crisp readability.</p>
            
            <div className="theme-selector-grid">
              <div 
                className={`theme-box-card ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => { if (theme !== 'dark') toggleTheme(); }}
              >
                <div className="theme-preview dark-preview">
                  <div className="preview-accent-dot"></div>
                </div>
                <div className="theme-info-line">
                  <Moon size={16} />
                  <strong>Dark Mode (Default)</strong>
                </div>
                <span>Charcoal & Emerald Glow</span>
              </div>

              <div 
                className={`theme-box-card ${theme === 'light' ? 'active' : ''}`}
                onClick={() => { if (theme !== 'light') toggleTheme(); }}
              >
                <div className="theme-preview light-preview">
                  <div className="preview-accent-dot"></div>
                </div>
                <div className="theme-info-line">
                  <Sun size={16} />
                  <strong>Light Mode</strong>
                </div>
                <span>Crisp Clean & Emerald</span>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="card-static details-block">
            <h3 className="block-title">Account Security & Verification</h3>
            <form onSubmit={handleSaveSecurity} className="security-form">
              <div className="setting-toggle-row" onClick={() => setTwoFactor(!twoFactor)}>
                <div className="toggle-info">
                  <div className="toggle-title-row">
                    <Smartphone size={16} color="#10b981" />
                    <strong>Two-Factor Authentication (2FA)</strong>
                  </div>
                  <p>Send one-time SMS verification passcode upon sign in</p>
                </div>
                <div className={`switch ${twoFactor ? 'on' : ''}`}>
                  <div className="switch-handle"></div>
                </div>
              </div>

              <div className="input-group" style={{ marginTop: '0.85rem' }}>
                <label className="input-label"><KeyRound size={14} style={{ display: 'inline', marginRight: 4 }} /> Change Password</label>
                <input 
                  type="password" 
                  placeholder="New password (min 8 chars)" 
                  className="input-field" 
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm btn-glow" style={{ alignSelf: 'flex-start' }}>
                Update Security Settings
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Notifications & Emergency Contact */}
        <div className="settings-col">
          {/* Notifications */}
          <div className="card-static details-block">
            <h3 className="block-title">Notification Preferences</h3>
            <form onSubmit={handleSaveNotifications} className="notifications-form">
              <div className="setting-toggle-row" onClick={() => setSmsAlerts(!smsAlerts)}>
                <div className="toggle-info">
                  <div className="toggle-title-row">
                    <Bell size={16} color="#10b981" />
                    <strong>Live Dispatch SMS Alerts</strong>
                  </div>
                  <p>Receive SMS updates when technician is en route and arrives on site</p>
                </div>
                <div className={`switch ${smsAlerts ? 'on' : ''}`}>
                  <div className="switch-handle"></div>
                </div>
              </div>

              <div className="setting-toggle-row" onClick={() => setEmailReceipts(!emailReceipts)}>
                <div className="toggle-info">
                  <div className="toggle-title-row">
                    <Check size={16} color="#10b981" />
                    <strong>Automatic PDF Invoices & Receipts</strong>
                  </div>
                  <p>Email instant tax invoices as soon as service completion is approved</p>
                </div>
                <div className={`switch ${emailReceipts ? 'on' : ''}`}>
                  <div className="switch-handle"></div>
                </div>
              </div>

              <div className="setting-toggle-row" onClick={() => setEmergencyAlerts(!emergencyAlerts)}>
                <div className="toggle-info">
                  <div className="toggle-title-row">
                    <AlertTriangle size={16} color="#ef4444" />
                    <strong>Severe Weather & Emergency Notifications</strong>
                  </div>
                  <p>Proactive notices for storm preparation, pipe freeze alerts, and local blackout priority</p>
                </div>
                <div className={`switch danger-switch ${emergencyAlerts ? 'on' : ''}`}>
                  <div className="switch-handle"></div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-sm btn-glow" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                Save Notification Preferences
              </button>
            </form>
          </div>

          {/* Emergency Safety Protocol */}
          <div className="card-static details-block emergency-protocol-card">
            <div className="emergency-protocol-header">
              <ShieldCheck size={22} color="#ef4444" />
              <div>
                <h4 style={{ color: '#ef4444' }}>Emergency 911 / Hazard Backup Contact</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>This contact will be pinged if an urgent distress trigger is activated during an on-site service.</p>
              </div>
            </div>

            <div className="input-group" style={{ marginTop: '0.85rem' }}>
              <label className="input-label">Emergency Authorized Contact</label>
              <input 
                type="text" 
                value={emergencyContact} 
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="input-field" 
              />
            </div>

            <button 
              type="button" 
              onClick={() => addToast('Emergency contact verified and saved', 'success')}
              className="btn btn-danger btn-sm"
              style={{ alignSelf: 'flex-start' }}
            >
              Verify Contact
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Styles */}
      <style>{`
        .settings-page-root {
          padding-top: 2rem;
          padding-bottom: 4rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .settings-title {
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
        }
        .settings-sub {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 900px) {
          .settings-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .settings-col {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .block-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .theme-selector-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .theme-box-card {
          border: 1.5px solid var(--border-color);
          background: var(--bg-input);
          border-radius: var(--radius-md);
          padding: 1rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .theme-box-card:hover {
          border-color: var(--accent-primary);
        }
        .theme-box-card.active {
          border-color: var(--accent-primary);
          background: var(--accent-light);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.15);
        }

        .theme-preview {
          height: 60px;
          border-radius: var(--radius-sm);
          position: relative;
          padding: 8px;
        }
        .dark-preview {
          background: #090c0b;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .light-preview {
          background: #f8fafc;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        .preview-accent-dot {
          width: 14px;
          height: 14px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 8px #10b981;
        }

        .theme-info-line {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
        }
        .theme-box-card span {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .setting-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 0;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
        }
        .toggle-title-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }
        .toggle-title-row strong {
          font-size: 0.875rem;
          color: var(--text-primary);
        }
        .toggle-info p {
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-top: 2px;
          max-width: 320px;
        }

        .security-form, .notifications-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .emergency-protocol-card {
          border: 1px solid rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.04);
        }
        .emergency-protocol-header {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
        }
      `}</style>
    </div>
  );
};
