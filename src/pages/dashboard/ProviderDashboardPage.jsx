import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  DollarSign,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  ShieldCheck,
  TrendingUp,
  User,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  Calendar,
  Sparkles,
  ChevronRight,
  Eye,
  LogOut
} from 'lucide-react';

export const ProviderDashboardPage = () => {
  const {
    currentUser,
    logout,
    navigateTo,
    addToast,
    theme,
    toggleTheme,
    bookings = [],
    acceptBooking,
    rejectBooking,
    updateBookingStatus,
    openChatModal
  } = useApp();

  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming'); // incoming, ongoing, completed, availability, profile

  // Availability Management State
  const [workingDays, setWorkingDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [workHours, setWorkHours] = useState({ start: '08:00', end: '19:00' });
  const [breakHours, setBreakHours] = useState({ start: '13:00', end: '14:00' });
  const [blockedDates, setBlockedDates] = useState(['2026-10-12', '2026-10-15']);
  const [blockDateInput, setBlockDateInput] = useState('');

  // Profile Management State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Rahul Kumar',
    bio: 'Certified Master Technician with over 8 years experience in high-efficiency electrical and AC climate control installations.',
    skills: 'Central AC, Split AC Overhauls, Refrigerant Diagnostics, Smart Inverters',
    experience: '8+ Years',
    serviceArea: 'Downtown & Metro Suburbs (15 km)',
    basePrice: '499',
    bankName: 'HDFC Bank',
    accountNumber: '•••• •••• 4921',
    ifsc: 'HDFC0000240'
  });

  // Filter real bookings for this provider
  const activeProviderId = currentUser?.id || 'prov-1';

  const providerIncomingRequests = bookings.filter(b => 
    (b.status === 'REQUESTED') &&
    (b.providerId === activeProviderId || activeProviderId === 'prov-1' || !b.providerId)
  );

  const providerOngoingJobs = bookings.filter(b =>
    ['ACCEPTED', 'PROVIDER_ASSIGNED', 'PROVIDER_ON_THE_WAY', 'ARRIVED', 'SERVICE_STARTED', 'SERVICE_IN_PROGRESS', 'In Progress', 'Confirmed'].includes(b.status) &&
    (b.providerId === activeProviderId || activeProviderId === 'prov-1' || !b.providerId)
  );

  const providerCompletedJobs = bookings.filter(b =>
    ['COMPLETED', 'Completed', 'PAID'].includes(b.status) &&
    (b.providerId === activeProviderId || activeProviderId === 'prov-1' || !b.providerId)
  );

  // Stats
  const stats = [
    { label: "Today's Earnings", value: `$${(providerCompletedJobs.length * 75 + 180).toFixed(2)}`, change: "+18%", icon: DollarSign, color: "#10b981" },
    { label: "Active Jobs", value: providerOngoingJobs.length.toString(), change: `${providerIncomingRequests.length} pending`, icon: Briefcase, color: "#38bdf8" },
    { label: "Completion Rate", value: "98.4%", change: "+2.1%", icon: CheckCircle2, color: "#a855f7" },
    { label: "Overall Rating", value: "4.96", change: "148 Reviews", icon: Star, color: "#fbbf24" },
  ];

  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    addToast(nextState ? 'Status set to ONLINE. Visible to customers.' : 'Status set to OFFLINE. New bookings paused.', 'info');
  };

  const handleAcceptRequest = (bookingId) => {
    acceptBooking(bookingId);
    setActiveTab('ongoing');
  };

  const handleDeclineRequest = (bookingId) => {
    const reason = prompt('Reason for declining this request (optional):', 'Schedule conflict / Unavailable for selected time');
    if (reason !== null) {
      rejectBooking(bookingId, reason || 'Specialist unavailable');
    }
  };

  const handleAdvanceJobStatus = (bookingId, currentStatus) => {
    let nextStatus = 'COMPLETED';
    if (currentStatus === 'ACCEPTED' || currentStatus === 'Confirmed') {
      nextStatus = 'PROVIDER_ON_THE_WAY';
    } else if (currentStatus === 'PROVIDER_ON_THE_WAY') {
      nextStatus = 'ARRIVED';
    } else if (currentStatus === 'ARRIVED') {
      nextStatus = 'SERVICE_STARTED';
    } else if (currentStatus === 'SERVICE_STARTED' || currentStatus === 'In Progress') {
      nextStatus = 'SERVICE_IN_PROGRESS';
    } else if (currentStatus === 'SERVICE_IN_PROGRESS') {
      nextStatus = 'COMPLETED';
    }

    updateBookingStatus(bookingId, nextStatus);
    addToast(`Job #${bookingId} updated to: ${nextStatus}. Customer notified!`, 'success');
  };

  return (
    <div className="provider-dashboard-page">
      {/* Top Header */}
      <header className="provider-header-nav">
        <div className="container provider-header-inner">
          <div className="provider-brand-box">
            <div className="brand-logo">
              <Briefcase size={22} color="#10b981" />
            </div>
            <div>
              <h2 className="provider-brand-title">ServiGo Provider Center</h2>
              <span className="provider-tagline">Pro Contractor & Specialist Workspace</span>
            </div>
          </div>

          <div className="provider-header-actions">
            {/* Online Status Toggle */}
            <button
              onClick={handleToggleOnline}
              className={`status-pill-toggle ${isOnline ? 'status-online' : 'status-offline'}`}
            >
              <span className="status-dot"></span>
              <span>{isOnline ? 'Active & Receiving Jobs' : 'Offline / On Break'}</span>
            </button>

            {/* User info & Logout */}
            <div className="provider-user-badge">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80'}
                alt={currentUser?.name || 'Provider'}
                className="provider-avatar"
              />
              <div className="provider-name-box">
                <span className="p-name">{currentUser?.name || 'Master Specialist'}</span>
                <span className="p-cat">{currentUser?.category || 'Certified Expert'}</span>
              </div>
            </div>

            <button 
              onClick={() => navigateTo('provider-earnings')} 
              className="btn btn-secondary btn-sm flex items-center gap-1.5"
              title="View Earnings & Settlements"
            >
              <DollarSign size={16} className="text-emerald-400" />
              <span>Earnings Ledger</span>
            </button>

            <button onClick={logout} className="btn btn-secondary btn-sm" title="Log out">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="container provider-dashboard-main">
        {/* Verification banner if verified */}
        <div className="verification-banner-pro">
          <div className="banner-left">
            <ShieldCheck size={28} color="#10b981" />
            <div>
              <h4>ServiGo Verified Pro Member</h4>
              <p>Your business license, insurance, and background verification are active through December 2026.</p>
            </div>
          </div>
          <div className="banner-badge">
            <Sparkles size={14} color="#10b981" />
            <span>Priority Local Dispatch Active</span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="provider-kpi-grid">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="provider-kpi-card">
                <div className="kpi-top">
                  <span className="kpi-label">{stat.label}</span>
                  <div className="kpi-icon-box" style={{ background: `${stat.color}15`, color: stat.color }}>
                    <Icon size={20} />
                  </div>
                </div>
                <div className="kpi-value">{stat.value}</div>
                <div className="kpi-change">
                  <TrendingUp size={14} color="#10b981" />
                  <span>{stat.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dashboard Tabs & Work Area */}
        <div className="dashboard-content-columns">
          {/* Left Column: Job Queue & Active Work */}
          <div className="dashboard-main-col">
            <div className="dashboard-tabs-bar">
              <button
                className={`d-tab-btn ${activeTab === 'incoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('incoming')}
              >
                <span>Incoming Requests</span>
                {providerIncomingRequests.length > 0 && <span className="tab-counter">{providerIncomingRequests.length}</span>}
              </button>
              <button
                className={`d-tab-btn ${activeTab === 'ongoing' ? 'active' : ''}`}
                onClick={() => setActiveTab('ongoing')}
              >
                <span>Ongoing Jobs</span>
                {providerOngoingJobs.length > 0 && <span className="tab-counter ongoing-counter">{providerOngoingJobs.length}</span>}
              </button>
              <button
                className={`d-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                <span>Completed ({providerCompletedJobs.length})</span>
              </button>
              <button
                className={`d-tab-btn ${activeTab === 'availability' ? 'active' : ''}`}
                onClick={() => setActiveTab('availability')}
              >
                <span>Availability & Working Hours</span>
              </button>
              <button
                className={`d-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span>Profile & Payout Account</span>
              </button>
            </div>

            {/* TAB: INCOMING REQUESTS */}
            {activeTab === 'incoming' && (
              <div className="job-queue-wrapper">
                {providerIncomingRequests.length === 0 ? (
                  <div className="empty-queue-box">
                    <CheckCircle2 size={40} color="#10b981" />
                    <h3>No Pending Requests</h3>
                    <p>All client booking requests have been reviewed. New customer requests will appear here automatically.</p>
                  </div>
                ) : (
                  providerIncomingRequests.map((req) => (
                    <div key={req.id} className="incoming-job-card">
                      <div className="job-card-header">
                        <div>
                          <div className="job-tag-row">
                            {req.isEmergency ? (
                              <span className="job-tag tag-urgent"><Zap size={12} /> RAPID EMERGENCY (20 MIN)</span>
                            ) : (
                              <span className="job-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>STANDARD RESERVATION</span>
                            )}
                            <span className="job-tag" style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)' }}>ID: {req.id}</span>
                          </div>
                          <h3 className="job-service-name">{req.serviceName}</h3>
                        </div>
                        <div className="job-price-tag">
                          <span className="price-num">${req.pricing?.total ? Number(req.pricing.total).toFixed(2) : '85.00'}</span>
                          <span className="price-sub">est. payout</span>
                        </div>
                      </div>

                      {/* Problem summary */}
                      <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.65rem 0.85rem', borderRadius: '8px', margin: '0.75rem 0', fontSize: '0.82rem' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Issue: {req.problem || 'General Inspection'}</strong>
                        {req.problemDescription && <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', fontSize: '0.78rem' }}>"{req.problemDescription}"</p>}
                      </div>

                      <div className="job-details-grid">
                        <div className="j-detail">
                          <User size={15} color="#10b981" />
                          <span><strong>Customer:</strong> {req.customerName || 'Alex Morgan'}</span>
                        </div>
                        <div className="j-detail">
                          <Clock size={15} color="#10b981" />
                          <span><strong>Scheduled:</strong> {req.date} • {req.timeSlot}</span>
                        </div>
                        <div className="j-detail full-w">
                          <MapPin size={15} color="#10b981" />
                          <span><strong>Address:</strong> {req.address}</span>
                        </div>
                        {req.instructions && (
                          <div className="j-detail full-w">
                            <Info size={15} color="#38bdf8" />
                            <span><strong>Instructions:</strong> "{req.instructions}"</span>
                          </div>
                        )}
                      </div>

                      <div className="job-actions-row" style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="btn btn-primary btn-glow"
                        >
                          <CheckCircle2 size={16} />
                          <span>Accept Booking Request</span>
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(req.id)}
                          className="btn btn-secondary"
                        >
                          <XCircle size={16} />
                          <span>Decline</span>
                        </button>
                        <button
                          onClick={() => navigateTo('booking-details', { bookingId: req.id })}
                          className="btn btn-secondary"
                        >
                          <Eye size={16} />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: ONGOING JOBS */}
            {activeTab === 'ongoing' && (
              <div className="job-queue-wrapper">
                {providerOngoingJobs.length === 0 ? (
                  <div className="empty-queue-box">
                    <Briefcase size={40} color="#64748b" />
                    <h3>No Active Jobs in Progress</h3>
                    <p>Accept an incoming lead or check your upcoming schedule.</p>
                  </div>
                ) : (
                  providerOngoingJobs.map((job) => {
                    const currentStatus = job.status;
                    let nextLabel = 'Advance Milestone';
                    if (currentStatus === 'ACCEPTED' || currentStatus === 'Confirmed') nextLabel = 'Depart / On The Way';
                    else if (currentStatus === 'PROVIDER_ON_THE_WAY') nextLabel = 'Arrived On-Site';
                    else if (currentStatus === 'ARRIVED') nextLabel = 'Start Service';
                    else if (currentStatus === 'SERVICE_STARTED' || currentStatus === 'In Progress') nextLabel = 'Mark In Progress';
                    else if (currentStatus === 'SERVICE_IN_PROGRESS') nextLabel = 'Complete Service & Verification';

                    return (
                      <div key={job.id} className="ongoing-job-card">
                        <div className="ongoing-header">
                          <div>
                            <span className="badge badge-verified" style={{ marginBottom: '0.35rem' }}>Status: {job.status}</span>
                            <h3>{job.serviceName || job.service}</h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order #{job.id}</span>
                          </div>
                          <span className="ongoing-payout">${job.pricing?.total ? Number(job.pricing.total).toFixed(2) : (job.price || '85.00')}</span>
                        </div>

                        <div className="ongoing-meta-grid">
                          <div>
                            <span className="meta-label">Customer</span>
                            <p className="meta-val">{job.customerName || 'Alex Morgan'}</p>
                          </div>
                          <div>
                            <span className="meta-label">Scheduled</span>
                            <p className="meta-val">{job.date} • {job.timeSlot}</p>
                          </div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <span className="meta-label">Address</span>
                            <p className="meta-val">{job.address}</p>
                          </div>
                        </div>

                        {/* Interactive Lifecycle Advancement Control */}
                        <div className="ongoing-step-controls" style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '0.85rem' }}>
                          <p className="step-hint" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                            Update field milestone (syncs with customer live tracking):
                          </p>
                          <div className="action-buttons-wrap" style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => handleAdvanceJobStatus(job.id, job.status)}
                              className="btn btn-primary btn-sm btn-glow"
                            >
                              <span>Next Phase: {nextLabel}</span>
                              <ArrowRight size={14} />
                            </button>
                            <button
                              onClick={() => navigateTo('booking-details', { bookingId: job.id })}
                              className="btn btn-secondary btn-sm"
                            >
                              <Eye size={14} />
                              <span>Track Details</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB: COMPLETED JOBS */}
            {activeTab === 'completed' && (
              <div className="job-queue-wrapper">
                {providerCompletedJobs.length === 0 ? (
                  <div className="empty-queue-box">
                    <CheckCircle2 size={40} color="#10b981" />
                    <h3>No Completed Jobs Yet</h3>
                    <p>Finished work records will be filed here for payout reconciliation.</p>
                  </div>
                ) : (
                  providerCompletedJobs.map((job) => (
                    <div key={job.id} className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <span className="badge badge-verified" style={{ marginBottom: '0.25rem' }}>COMPLETED</span>
                        <h4 style={{ margin: '0.2rem 0', color: 'var(--text-primary)' }}>{job.serviceName || job.service}</h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Order #{job.id} • {job.date}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-primary)', display: 'block' }}>
                          ${job.pricing?.total ? Number(job.pricing.total).toFixed(2) : '85.00'}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#10b981' }}>Paid / Settlement Ready</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: AVAILABILITY & WORKING HOURS */}
            {activeTab === 'availability' && (
              <div className="card p-6 bg-surface border-border space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Provider Availability & Shift Schedule</h3>
                  <p className="text-xs text-muted">Manage operating hours, working days, break intervals, and blackout dates. Blocked slots are automatically removed from customer booking availability.</p>
                </div>

                {/* Working Days */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">Active Working Days</label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                      const isActive = workingDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                            isActive
                              ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                              : 'border-border bg-surface-elevated text-muted hover:border-border-hover'
                          }`}
                          onClick={() => {
                            if (isActive) {
                              setWorkingDays(workingDays.filter(d => d !== day));
                            } else {
                              setWorkingDays([...workingDays, day]);
                            }
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Operating Hours and Breaks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface-elevated border border-border">
                    <span className="text-xs font-bold text-foreground block mb-3">Daily Operating Hours</span>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-muted block mb-1">Shift Start</label>
                        <input
                          type="time"
                          className="input-field w-full text-xs"
                          value={workHours.start}
                          onChange={(e) => setWorkHours({ ...workHours, start: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-muted block mb-1">Shift End</label>
                        <input
                          type="time"
                          className="input-field w-full text-xs"
                          value={workHours.end}
                          onChange={(e) => setWorkHours({ ...workHours, end: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-elevated border border-border">
                    <span className="text-xs font-bold text-foreground block mb-3">Daily Break Window</span>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-muted block mb-1">Break Start</label>
                        <input
                          type="time"
                          className="input-field w-full text-xs"
                          value={breakHours.start}
                          onChange={(e) => setBreakHours({ ...breakHours, start: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-muted block mb-1">Break End</label>
                        <input
                          type="time"
                          className="input-field w-full text-xs"
                          value={breakHours.end}
                          onChange={(e) => setBreakHours({ ...breakHours, end: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blackout / Vacation Dates */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                    Blocked Dates & Vacation Days
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="date"
                      className="input-field text-xs flex-1"
                      value={blockDateInput}
                      onChange={(e) => setBlockDateInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        if (blockDateInput && !blockedDates.includes(blockDateInput)) {
                          setBlockedDates([...blockedDates, blockDateInput]);
                          setBlockDateInput('');
                          addToast(`Date ${blockDateInput} blocked from booking!`, 'success');
                        }
                      }}
                    >
                      Block Date
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {blockedDates.map(date => (
                      <span key={date} className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-lg text-xs font-mono">
                        <span>{date}</span>
                        <button
                          type="button"
                          className="hover:text-rose-200"
                          onClick={() => setBlockedDates(blockedDates.filter(d => d !== date))}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary w-full py-2.5 font-bold text-sm shadow-md"
                  onClick={() => addToast('Availability and working schedule successfully synced to platform!', 'success')}
                >
                  Save Availability Settings
                </button>
              </div>
            )}

            {/* TAB: PROFILE & PAYOUTS */}
            {activeTab === 'profile' && (
              <div className="card p-6 bg-surface border-border space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Specialist Profile & Financial Information</h3>
                  <p className="text-xs text-muted">Manage your public contractor credentials, trade experience, pricing structure, and masked settlement destination.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Contractor / Business Name</label>
                    <input
                      type="text"
                      className="input-field w-full text-sm"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Years of Field Experience</label>
                    <input
                      type="text"
                      className="input-field w-full text-sm"
                      value={profileForm.experience}
                      onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Professional Bio & Credentials</label>
                  <textarea
                    rows={3}
                    className="input-field w-full text-sm"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Base Diagnostic Callout (₹)</label>
                    <input
                      type="number"
                      className="input-field w-full text-sm"
                      value={profileForm.basePrice}
                      onChange={(e) => setProfileForm({ ...profileForm, basePrice: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-muted mb-1">Service Coverage Area</label>
                    <input
                      type="text"
                      className="input-field w-full text-sm"
                      value={profileForm.serviceArea}
                      onChange={(e) => setProfileForm({ ...profileForm, serviceArea: e.target.value })}
                    />
                  </div>
                </div>

                {/* Bank / Payout Information */}
                <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-foreground">Direct Bank Payout Details</span>
                    <span className="badge badge-verified text-[10px]">Encrypted & Tokenized</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-muted block mb-1">Bank Name</label>
                      <input
                        type="text"
                        className="input-field w-full text-xs"
                        value={profileForm.bankName}
                        onChange={(e) => setProfileForm({ ...profileForm, bankName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-muted block mb-1">Account Number (Masked)</label>
                      <input
                        type="text"
                        className="input-field w-full text-xs font-mono"
                        value={profileForm.accountNumber}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-muted block mb-1">IFSC Code</label>
                      <input
                        type="text"
                        className="input-field w-full text-xs font-mono"
                        value={profileForm.ifsc}
                        onChange={(e) => setProfileForm({ ...profileForm, ifsc: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary w-full py-2.5 font-bold text-sm shadow-md"
                  onClick={() => addToast('Contractor profile and credentials updated successfully!', 'success')}
                >
                  Save Profile & Payout Information
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Quick Profile summary, Service settings */}
          <div className="dashboard-sidebar-col">
            <div className="pro-side-card">
              <h4 className="side-card-title">Contractor Profile Details</h4>
              <div className="side-profile-summary">
                <p><strong>Primary Trade:</strong> {currentUser?.category || 'General Repair & Specialist'}</p>
                <p><strong>Experience:</strong> {currentUser?.experience || '8+ Years'}</p>
                <p><strong>Service Radius:</strong> 15 miles (Downtown & Suburbs)</p>
                <p><strong>Hourly / Base Rate:</strong> ${currentUser?.startingPrice || 85}/hr</p>
                <p><strong>Payout Account:</strong> Stripe Direct (•••• 4920)</p>
              </div>
              <button
                onClick={() => addToast('Contractor settings saved to cloud.', 'success')}
                className="btn btn-secondary btn-sm btn-block"
                style={{ marginTop: '1rem' }}
              >
                Update Rates & Territory
              </button>
            </div>

            <div className="pro-side-card">
              <h4 className="side-card-title">Recent Client Feedback</h4>
              <div className="side-review-item">
                <div className="sr-stars">
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                </div>
                <p className="sr-text">"Punctual, super knowledgeable, and fixed our issue in under 45 minutes. Will hire again!"</p>
                <span className="sr-author">— Sarah K. (Yesterday)</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
