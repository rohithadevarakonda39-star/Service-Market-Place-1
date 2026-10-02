import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Briefcase,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  ExternalLink,
  LogOut,
  Sparkles,
  Server,
  CreditCard,
  MessageSquare,
  Filter,
  Eye,
  Trash2,
  Lock,
  Unlock,
  Check,
  X,
  Star,
  Clock,
  Layers,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { servicesData } from '../../data/servicesData';
import { providersData } from '../../data/providersData';
import { categoriesData } from '../../data/categoriesData';

export const AdminDashboardPage = () => {
  const { 
    currentUser, 
    logout, 
    navigateTo, 
    addToast, 
    bookings = [], 
    updateBookingStatus,
    openInvoiceModal,
    payments = []
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'providers', 'services', 'bookings', 'payments', 'reviews', 'support'

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // 1. Users Management State
  const [usersList, setUsersList] = useState([
    { id: 'usr-101', name: 'Alex Morgan', email: 'alex.morgan@servigo.io', phone: '+1 (555) 019-2834', role: 'Consumer', bookingsCount: 6, status: 'Active', joinedDate: 'Jan 2025' },
    { id: 'usr-102', name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '+1 (555) 392-1104', role: 'Consumer', bookingsCount: 3, status: 'Active', joinedDate: 'Feb 2025' },
    { id: 'usr-103', name: 'Michael Chang', email: 'mchang@techcorp.io', phone: '+1 (555) 882-9021', role: 'Consumer', bookingsCount: 1, status: 'Active', joinedDate: 'Mar 2025' },
    { id: 'usr-104', name: 'Devin Torres', email: 'devin.t@junkmail.org', phone: '+1 (555) 771-4402', role: 'Consumer', bookingsCount: 0, status: 'Suspended', joinedDate: 'May 2025' }
  ]);

  // 2. Providers Management State
  const [managedProviders, setManagedProviders] = useState(
    providersData.map(p => ({
      ...p,
      status: p.verified ? 'Approved' : 'Pending',
      licenseNo: `LIC-CA-${Math.floor(100000 + Math.random() * 900000)}`,
      insuranceDoc: 'Verified Policy Active'
    }))
  );

  // 3. Services Management State
  const [managedServices, setManagedServices] = useState(
    servicesData.slice(0, 12).map(s => ({
      ...s,
      isActive: true
    }))
  );

  // 4. Reviews Moderation State
  const [reviewsList, setReviewsList] = useState([
    { id: 'rev-1', providerName: 'Rahul Kumar', customerName: 'Alex Morgan', rating: 5, comment: 'Phenomenal work on our AC unit. Arrived within 25 minutes and solved the cooling blockage.', status: 'PUBLISHED', date: 'Oct 01, 2026' },
    { id: 'rev-2', providerName: 'David Miller', customerName: 'Linda Bell', rating: 1, comment: 'Spam review text containing inappropriate links. Click here for discounts www.fake.com', status: 'FLAGGED', date: 'Sep 29, 2026' },
    { id: 'rev-3', providerName: 'Amina Al-Mansoor', customerName: 'Carlos Ray', rating: 5, comment: 'Very meticulous electrical diagnostic. Certified all breakers in the home panel.', status: 'PUBLISHED', date: 'Sep 26, 2026' },
    { id: 'rev-4', providerName: 'Marcus Vance', customerName: 'Tanya Smith', rating: 2, comment: 'Arrived 15 minutes later than expected window due to traffic.', status: 'PUBLISHED', date: 'Sep 24, 2026' }
  ]);

  // 5. Support Tickets Management State
  const [supportTickets, setSupportTickets] = useState([
    { id: 'TCK-901', customer: 'David Chen', bookingId: 'SV-20261001-9042', subject: 'Technician arrival 20 mins behind schedule', status: 'OPEN', priority: 'Medium', date: 'Oct 02, 2026', type: 'Delay Complaint' },
    { id: 'TCK-892', customer: 'Karen Miller', bookingId: 'SV-20260928-3190', subject: 'Refund request for duplicate authorization check', status: 'IN_PROGRESS', priority: 'High', date: 'Oct 01, 2026', type: 'Billing' },
    { id: 'TCK-870', customer: 'Robert Vance', bookingId: 'SV-20260925-1082', subject: 'Commercial GST invoice copy required with company name', status: 'RESOLVED', priority: 'Low', date: 'Sep 29, 2026', type: 'Invoice Re-issue' }
  ]);

  // Financial aggregates
  const totalGrossRevenue = 158420.00;
  const platformNetCommission = (totalGrossRevenue * 0.10).toFixed(2);
  const activeBookingsCount = bookings.filter(b => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(b.status)).length;
  const completedBookingsCount = bookings.filter(b => b.status === 'COMPLETED' || b.paymentStatus === 'PAID').length;
  const cancelledBookingsCount = bookings.filter(b => b.status === 'CANCELLED' || b.status === 'REJECTED').length;

  // Handlers for User actions
  const toggleUserStatus = (userId) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const next = u.status === 'Active' ? 'Suspended' : 'Active';
        addToast(`User ${u.name} status updated to: ${next}`, 'info');
        return { ...u, status: next };
      }
      return u;
    }));
  };

  // Handlers for Provider actions
  const toggleProviderApproval = (proId) => {
    setManagedProviders(prev => prev.map(p => {
      if (p.id === proId) {
        const next = p.status === 'Approved' ? 'Suspended' : 'Approved';
        addToast(`Provider ${p.name} approval status: ${next}`, 'info');
        return { ...p, status: next, verified: next === 'Approved' };
      }
      return p;
    }));
  };

  const toggleProviderVerified = (proId) => {
    setManagedProviders(prev => prev.map(p => {
      if (p.id === proId) {
        const next = !p.verified;
        addToast(`Provider ${p.name} Verified Badge: ${next ? 'Granted' : 'Revoked'}`, 'success');
        return { ...p, verified: next };
      }
      return p;
    }));
  };

  // Handlers for Service actions
  const toggleServiceActive = (serviceId) => {
    setManagedServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        const next = !s.isActive;
        addToast(`Service "${s.title}" is now ${next ? 'ACTIVE' : 'DEACTIVATED'}`, 'info');
        return { ...s, isActive: next };
      }
      return s;
    }));
  };

  // Handlers for Review actions
  const toggleReviewStatus = (reviewId) => {
    setReviewsList(prev => prev.map(r => {
      if (r.id === reviewId) {
        const next = r.status === 'PUBLISHED' ? 'HIDDEN' : 'PUBLISHED';
        addToast(`Review #${reviewId} set to: ${next}`, 'info');
        return { ...r, status: next };
      }
      return r;
    }));
  };

  // Handlers for Support Ticket actions
  const updateTicketStatus = (ticketId, nextStatus) => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        addToast(`Ticket #${ticketId} status changed to ${nextStatus}`, 'success');
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  return (
    <div className="admin-dashboard-page animate-fade-in">
      {/* Top Header */}
      <header className="admin-header-nav">
        <div className="container admin-header-inner">
          <div className="admin-brand-box">
            <div className="admin-logo-box">
              <ShieldAlert size={22} color="#10b981" />
            </div>
            <div>
              <h2 className="admin-brand-title">ServiGo Control Hub</h2>
              <span className="admin-tagline">Master Governance, Trust & Safety Center</span>
            </div>
          </div>

          <div className="admin-header-actions">
            <div className="system-health-pill">
              <span className="health-dot"></span>
              <span>All Systems Operational (99.98% SLA)</span>
            </div>

            <div className="admin-user-pill">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt="Admin"
                className="admin-avatar"
              />
              <span className="admin-name">{currentUser?.name || 'Platform Administrator'}</span>
            </div>

            <button onClick={logout} className="btn btn-secondary btn-sm" title="Log out">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="container py-8">
        {/* Navigation Tabs Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-border">
          {[
            { id: 'overview', label: 'Platform Overview', icon: Activity },
            { id: 'users', label: 'Users Directory', icon: Users, count: usersList.length },
            { id: 'providers', label: 'Provider Vetting', icon: Briefcase, count: managedProviders.length },
            { id: 'services', label: 'Service Catalog', icon: Layers, count: managedServices.length },
            { id: 'bookings', label: 'Master Bookings', icon: FileText, count: bookings.length },
            { id: 'payments', label: 'Payments & Escrow', icon: DollarSign, count: payments.length },
            { id: 'reviews', label: 'Review Moderation', icon: Star, count: reviewsList.filter(r => r.status === 'FLAGGED').length || null },
            { id: 'support', label: 'Support & Disputes', icon: HelpCircle, count: supportTickets.filter(t => t.status === 'OPEN').length || null }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                    : 'bg-surface-elevated text-muted hover:text-foreground border border-border'
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.count !== null && tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-black/20 text-black' : 'bg-surface text-muted'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card p-5 bg-surface border-border">
                <span className="text-xs font-semibold text-muted uppercase">Gross Marketplace Volume</span>
                <h3 className="text-2xl font-extrabold text-foreground mt-1">₹{totalGrossRevenue.toLocaleString()}</h3>
                <span className="text-[11px] text-emerald-400 block mt-1">+24.6% platform growth</span>
              </div>

              <div className="card p-5 bg-surface border-border">
                <span className="text-xs font-semibold text-muted uppercase">Platform Commission (10%)</span>
                <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">₹{Number(platformNetCommission).toLocaleString()}</h3>
                <span className="text-[11px] text-muted block mt-1">Direct retained earnings</span>
              </div>

              <div className="card p-5 bg-surface border-border">
                <span className="text-xs font-semibold text-muted uppercase">Active Service Orders</span>
                <h3 className="text-2xl font-extrabold text-sky-400 mt-1">{activeBookingsCount} Active</h3>
                <span className="text-[11px] text-muted block mt-1">{completedBookingsCount} completed • {cancelledBookingsCount} cancelled</span>
              </div>

              <div className="card p-5 bg-surface border-border">
                <span className="text-xs font-semibold text-muted uppercase">Pending Provider Apps</span>
                <h3 className="text-2xl font-extrabold text-amber-400 mt-1">2 Pending Review</h3>
                <span className="text-[11px] text-amber-400 block mt-1">Requires license background check</span>
              </div>
            </div>

            {/* Platform Health and Quick Audits */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 card p-6 bg-surface border-border">
                <h3 className="text-base font-bold text-foreground mb-4">Live Service Traffic & Activity Telemetry</h3>
                <div className="space-y-3">
                  {[
                    { title: "Booking #SV-20261002-4821 Accepted", desc: "Rahul Kumar confirmed AC repair in Downtown Metro", time: "10 mins ago", type: "success" },
                    { title: "Payment #TXN-20261001-8921 Settled", desc: "₹526.45 received via UPI gateway (Razorpay Test)", time: "25 mins ago", type: "info" },
                    { title: "Rapid Emergency Dispatch Activated", desc: "Plumbing specialist en route for water pipe burst (~18 mins)", time: "42 mins ago", type: "warning" },
                    { title: "Provider Document Verification Submitted", desc: "CleanMasters Eco Services submitted commercial general liability certificate", time: "1 hour ago", type: "info" }
                  ].map((act, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-foreground block">{act.title}</span>
                        <span className="text-xs text-muted block mt-0.5">{act.desc}</span>
                      </div>
                      <span className="text-[11px] text-muted whitespace-nowrap font-mono">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 card p-6 bg-surface border-border space-y-4">
                <h3 className="text-base font-bold text-foreground">Platform Health Metrics</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted">API Gateway Response</span>
                    <span className="font-mono text-emerald-400 font-bold">24ms (Optimal)</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted">Payment Gateway Webhook</span>
                    <span className="font-mono text-emerald-400 font-bold">100% Delivery</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted">Background GPS Telemetry</span>
                    <span className="font-mono text-emerald-400 font-bold">Active Simulation</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted">Database Replica Status</span>
                    <span className="font-mono text-emerald-400 font-bold">Synchronized</span>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300 flex items-center gap-2">
                  <ShieldCheck size={18} className="shrink-0" />
                  <span>Enterprise SOC-2 Security & GDPR Data Protection Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. USERS MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="card p-6 bg-surface border-border animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-foreground">Registered Customers & Account Access</h3>
                <p className="text-xs text-muted">Manage consumer accounts, view booking counts, and suspend accounts if needed.</p>
              </div>
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  className="input-field w-full text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-elevated text-xs font-semibold text-muted uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-center">Bookings</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {usersList
                    .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(u => (
                      <tr key={u.id} className="hover:bg-surface-elevated/40">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-foreground block text-xs">{u.name}</span>
                          <span className="text-[11px] text-muted">{u.email}</span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono text-muted">{u.phone}</td>
                        <td className="py-3.5 px-4 text-xs font-medium text-foreground">{u.role}</td>
                        <td className="py-3.5 px-4 text-center text-xs font-bold text-emerald-400">{u.bookingsCount} orders</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            className={`btn btn-sm text-xs py-1 px-2.5 ${u.status === 'Active' ? 'btn-danger' : 'btn-primary'}`}
                            onClick={() => toggleUserStatus(u.id)}
                          >
                            {u.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. PROVIDER MANAGEMENT TAB */}
        {activeTab === 'providers' && (
          <div className="card p-6 bg-surface border-border animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-foreground">Service Specialist Directory & Governance</h3>
                <p className="text-xs text-muted">Verify licenses, approve background checks, grant Verified Badges, or suspend accounts.</p>
              </div>
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter specialists by name or trade..."
                  className="input-field w-full text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-elevated text-xs font-semibold text-muted uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Specialist</th>
                    <th className="py-3 px-4">Trade & Experience</th>
                    <th className="py-3 px-4">License & Docs</th>
                    <th className="py-3 px-4 text-center">Rating</th>
                    <th className="py-3 px-4 text-center">Verified Badge</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Approval Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {managedProviders
                    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.service || '').toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(p => (
                      <tr key={p.id} className="hover:bg-surface-elevated/40">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-9 h-9 rounded-full object-cover border border-border" />
                            <div>
                              <span className="font-bold text-foreground block text-xs">{p.name}</span>
                              <span className="text-[11px] text-muted">{p.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-medium text-foreground block">{p.service}</span>
                          <span className="text-[11px] text-muted">{p.experience}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-muted">
                          <span>{p.licenseNo}</span>
                          <span className="text-[10px] text-emerald-400 block">✓ Insurance on file</span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs font-bold text-foreground">
                          ★ {p.rating}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            className={`badge text-[10px] py-0.5 px-2 cursor-pointer ${p.verified ? 'badge-verified' : 'bg-surface-elevated text-muted'}`}
                            onClick={() => toggleProviderVerified(p.id)}
                            title="Click to toggle Verified badge"
                          >
                            {p.verified ? '✓ Verified Pro' : 'Unverified'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            className={`btn btn-sm text-xs py-1 px-2.5 ${p.status === 'Approved' ? 'btn-danger' : 'btn-primary'}`}
                            onClick={() => toggleProviderApproval(p.id)}
                          >
                            {p.status === 'Approved' ? 'Suspend' : 'Approve'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. SERVICE CATALOG MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="card p-6 bg-surface border-border animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-foreground">Platform Service Catalog & Visibility</h3>
                <p className="text-xs text-muted">Manage live services, base pricing, categories, and enable/disable services.</p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm flex items-center gap-1.5"
                onClick={() => addToast('Create Service Modal opened (Ready for catalog input)', 'info')}
              >
                <span>+ Add New Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {managedServices.map(s => (
                <div key={s.id} className="p-4 rounded-xl bg-surface-elevated border border-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {s.categoryName || 'Home Repair'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {s.isActive ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground mb-1">{s.title}</h4>
                    <p className="text-xs text-muted line-clamp-2 mb-3">{s.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                    <span className="font-bold text-foreground">Base: ₹{s.startingPrice || s.price || 499}</span>
                    <button
                      type="button"
                      className={`btn btn-sm text-xs py-1 px-2.5 ${s.isActive ? 'btn-outline text-rose-400' : 'btn-primary'}`}
                      onClick={() => toggleServiceActive(s.id)}
                    >
                      {s.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. MASTER BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="card p-6 bg-surface border-border animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-foreground">Master Platform Bookings & Dispatches</h3>
                <p className="text-xs text-muted">Complete global audit log of customer service orders across all providers.</p>
              </div>
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search Booking ID or Customer..."
                  className="input-field w-full text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-elevated text-xs font-semibold text-muted uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Service & Provider</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Scheduled Slot</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Lifecycle Status</th>
                    <th className="py-3 px-4 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings
                    .filter(b => 
                      (b.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                      (b.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (b.providerName || '').toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(b => (
                      <tr key={b.id} className="hover:bg-surface-elevated/40">
                        <td className="py-3.5 px-4 font-mono text-xs font-bold text-emerald-400">
                          {b.bookingId || b.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-foreground block text-xs">{b.serviceName}</span>
                          <span className="text-[11px] text-muted">{b.providerName}</span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-foreground font-medium">
                          {b.customerName || 'Alex Morgan'}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-muted">
                          {b.date} • {b.timeSlot || b.time}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-foreground text-xs">
                          ₹{b.pricing?.total || b.price || 499}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="badge badge-verified text-[10px] py-0.5 px-2">
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            className="btn btn-outline btn-sm py-1 px-2.5 text-xs"
                            onClick={() => openInvoiceModal(b)}
                          >
                            Tax Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. PAYMENTS & ESCROW TAB */}
        {activeTab === 'payments' && (
          <div className="card p-6 bg-surface border-border animate-fade-in space-y-6">
            <div>
              <h3 className="text-base font-bold text-foreground">Escrow Ledger, Gateways & Platform Commissions</h3>
              <p className="text-xs text-muted">Audit log of customer checkouts, retained 10% platform margins, and provider bank disbursements.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-elevated text-xs font-semibold text-muted uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Txn Ref</th>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Specialist</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4 text-right">Gross Total</th>
                    <th className="py-3 px-4 text-right">Platform Fee (10%)</th>
                    <th className="py-3 px-4 text-center">Gateway Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(payments.length > 0 ? payments : [
                    { transactionId: 'TXN-20261001-8921', bookingId: 'SV-20261001-9042', providerName: 'Rahul Kumar', paymentMethod: 'UPI', finalAmount: 526.45, status: 'SUCCESS' },
                    { transactionId: 'TXN-20260928-4412', bookingId: 'SV-20260928-3190', providerName: 'David Miller', paymentMethod: 'Credit Card', finalAmount: 126.00, status: 'SUCCESS' }
                  ]).map(p => {
                    const gross = p.finalAmount || p.amount || 499;
                    const commission = (gross * 0.10).toFixed(2);

                    return (
                      <tr key={p.transactionId} className="hover:bg-surface-elevated/40">
                        <td className="py-3 px-4 font-mono text-xs font-bold text-foreground">{p.transactionId}</td>
                        <td className="py-3 px-4 font-mono text-xs text-emerald-400">{p.bookingId}</td>
                        <td className="py-3 px-4 text-xs font-medium text-foreground">{p.providerName}</td>
                        <td className="py-3 px-4 text-xs text-muted">{p.paymentMethod}</td>
                        <td className="py-3 px-4 text-right font-bold text-foreground text-xs">₹{gross}</td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-400 text-xs">₹{commission}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="badge badge-verified text-[10px] py-0.5 px-2">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. REVIEWS MODERATION TAB */}
        {activeTab === 'reviews' && (
          <div className="card p-6 bg-surface border-border animate-fade-in space-y-6">
            <div>
              <h3 className="text-base font-bold text-foreground">Customer Reviews & Reputation Moderation</h3>
              <p className="text-xs text-muted">Review feedback submitted by verified customers. Flagged or abusive comments can be hidden from public profiles.</p>
            </div>

            <div className="space-y-3">
              {reviewsList.map(rev => (
                <div key={rev.id} className="p-4 rounded-xl bg-surface-elevated border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="#fbbf24" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-foreground">For: {rev.providerName}</span>
                      <span className="text-[11px] text-muted">• By {rev.customerName} on {rev.date}</span>
                    </div>
                    <p className="text-xs text-muted italic">"{rev.comment}"</p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rev.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {rev.status}
                    </span>
                    <button
                      type="button"
                      className={`btn btn-sm text-xs py-1 px-2.5 ${rev.status === 'PUBLISHED' ? 'btn-outline text-rose-400' : 'btn-primary'}`}
                      onClick={() => toggleReviewStatus(rev.id)}
                    >
                      {rev.status === 'PUBLISHED' ? 'Hide / Censor' : 'Restore'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. SUPPORT & DISPUTES TAB */}
        {activeTab === 'support' && (
          <div className="card p-6 bg-surface border-border animate-fade-in space-y-6">
            <div>
              <h3 className="text-base font-bold text-foreground">Customer Disputes & Support Tickets</h3>
              <p className="text-xs text-muted">Manage complaints, refund disputes, provider conflicts, and billing inquiries.</p>
            </div>

            <div className="space-y-3">
              {supportTickets.map(ticket => (
                <div key={ticket.id} className="p-4 rounded-xl bg-surface-elevated border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-emerald-400">{ticket.id}</span>
                      <span className="text-[10px] bg-surface border border-border px-2 py-0.5 rounded font-medium text-muted">
                        {ticket.type}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ticket.status === 'OPEN' ? 'bg-amber-500/10 text-amber-400' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-sky-500/10 text-sky-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{ticket.subject}</h4>
                    <p className="text-xs text-muted mt-0.5">Raised by {ticket.customer} • Ref: {ticket.bookingId} • Priority: {ticket.priority}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {ticket.status !== 'RESOLVED' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm text-xs py-1 px-3"
                        onClick={() => updateTicketStatus(ticket.id, 'RESOLVED')}
                      >
                        Mark Resolved
                      </button>
                    )}
                    {ticket.status === 'OPEN' && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm text-xs py-1 px-3"
                        onClick={() => updateTicketStatus(ticket.id, 'IN_PROGRESS')}
                      >
                        Investigate
                      </button>
                    )}
                    {ticket.status === 'RESOLVED' && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm text-xs py-1 px-3"
                        onClick={() => updateTicketStatus(ticket.id, 'CLOSED')}
                      >
                        Close Ticket
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
