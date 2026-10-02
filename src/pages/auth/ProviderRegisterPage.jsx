import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { categoriesData } from '../../data/categoriesData';
import { ShieldCheck, Wrench, Mail, Phone, Lock, MapPin, DollarSign, Clock, FileText, ArrowLeft, Sun, Moon, Upload, CheckCircle2 } from 'lucide-react';

export const ProviderRegisterPage = () => {
  const { navigateTo, login, addToast, theme, toggleTheme } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
  const [serviceCategory, setServiceCategory] = useState(categoriesData[0].name);
  const [skills, setSkills] = useState('Wiring, Smart Home, Circuit Breakers, EV Chargers');
  const [experience, setExperience] = useState('5 - 8 Years');
  const [serviceArea, setServiceArea] = useState('Downtown & Metro Core');
  const [startingPrice, setStartingPrice] = useState('55');
  const [availability, setAvailability] = useState('Available Today');
  const [description, setDescription] = useState('');
  const [hasLicense, setHasLicense] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const newProvider = {
        id: `prov-${Date.now()}`,
        name: fullName || 'New Specialist',
        email: email || 'pro@servigo.pro',
        phone: phone || '+1 (555) 234-8901',
        address: serviceArea,
        avatar: profilePhoto,
        service: `${serviceCategory} Specialist`,
        skills: skills.split(',').map(s => s.trim()),
        experience,
        startingPrice: Number(startingPrice) || 50,
        rateType: 'hr',
        availability,
        bio: description || 'Licensed independent trade specialist registered with ServiGo guarantee.',
        verified: true,
        memberSince: 'Just joined',
        completedJobs: 0,
        rating: 5.0,
        role: 'provider'
      };

      login(newProvider, 'provider');
      addToast(`Registration submitted! License approved. Welcome to ServiGo Pro, ${newProvider.name}!`, 'success');
      navigateTo('provider-dashboard');
    }, 750);
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
        <div className="card auth-portal-card" style={{ maxWidth: '620px' }}>
          <div className="auth-card-top">
            <span className="badge badge-verified">
              <Wrench size={13} /> Provider Pro Onboarding
            </span>
            <h2 className="auth-card-title">Join as Verified Provider</h2>
            <p className="auth-card-sub">Get direct customer dispatches, transparent milestone payouts, and $1M coverage</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-inputs-form">
            {/* Personal Details */}
            <div className="grid-2-inputs">
              <div className="input-group">
                <label className="input-label">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Pro Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid-2-inputs">
              <div className="input-group">
                <label className="input-label">Direct Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Service Category</label>
                <select 
                  value={serviceCategory} 
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="input-field"
                >
                  {categoriesData.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service & Operational Parameters */}
            <div className="grid-2-inputs">
              <div className="input-group">
                <label className="input-label">Years of Experience</label>
                <select 
                  value={experience} 
                  onChange={(e) => setExperience(e.target.value)}
                  className="input-field"
                >
                  <option value="1 - 3 Years">1 - 3 Years</option>
                  <option value="3 - 5 Years">3 - 5 Years</option>
                  <option value="5 - 8 Years">5 - 8 Years (Senior)</option>
                  <option value="9+ Years">9+ Years (Master)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Starting Hourly / Job Rate ($)</label>
                <input
                  type="number"
                  required
                  min="20"
                  max="500"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  placeholder="55"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid-2-inputs">
              <div className="input-group">
                <label className="input-label">Primary Service Area</label>
                <input
                  type="text"
                  required
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  placeholder="e.g. Downtown & Westside Metro"
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Availability Schedule</label>
                <select 
                  value={availability} 
                  onChange={(e) => setAvailability(e.target.value)}
                  className="input-field"
                >
                  <option value="Available Today">Available Today</option>
                  <option value="Instant (20 mins)">Instant 20-Min Emergency</option>
                  <option value="Tomorrow">Next Day Dispatch</option>
                  <option value="Flexible Weekends">Weekends Only</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Skills & Specializations (comma separated)</label>
              <input
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Hydro-jetting, Pipe freezing, Smart dimmer setup"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Professional Bio / Overview</label>
              <textarea
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your equipment, past commercial/residential work, and guarantees..."
                className="input-field"
                style={{ resize: 'none' }}
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

            {/* Certifications & Identity Checkbox */}
            <div className="pro-vetting-box">
              <label className="remember-checkbox-label" style={{ marginBottom: 0 }}>
                <input 
                  type="checkbox" 
                  checked={hasLicense} 
                  onChange={(e) => setHasLicense(e.target.checked)} 
                />
                <span>I certify that I hold valid trade qualifications, identity documents, and agree to ServiGo's Background Audit Policy.</span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-glow auth-action-btn" style={{ marginTop: '0.5rem' }}>
              {loading ? 'Submitting Application...' : 'Complete Provider Registration'}
            </button>
          </form>

          <div className="auth-card-links">
            <p className="switch-text">
              Already have an account?{' '}
              <button onClick={() => navigateTo('provider-login')} className="inline-action-link">
                Sign In
              </button>
            </p>
            <button onClick={() => navigateTo('auth')} className="btn btn-secondary btn-sm switch-role-btn">
              Continue as another role
            </button>
          </div>
        </div>
      </main>

      <style>{`
        .pro-vetting-box {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};
