import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LiveTrackingMap } from '../components/tracking/LiveTrackingMap';
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Star, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Circle, 
  Truck, 
  Wrench, 
  Zap, 
  AlertCircle,
  FileText,
  UserCheck,
  Check
} from 'lucide-react';

export const TrackingPage = () => {
  const { 
    pageParams, 
    bookings, 
    updateBookingStatus, 
    openChatModal, 
    openInvoiceModal, 
    navigateTo, 
    addToast 
  } = useApp();

  const bookingId = pageParams?.bookingId;
  const booking = bookings.find(b => b.id === bookingId || b.bookingId === bookingId) || bookings[0];

  const [callModalOpen, setCallModalOpen] = useState(false);

  if (!booking) {
    return (
      <div className="container py-12 text-center">
        <AlertCircle size={48} className="text-warning mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Active Tracking Record</h2>
        <p className="text-muted mb-6">We could not locate this booking session for live radar tracking.</p>
        <button className="btn btn-primary" onClick={() => navigateTo('bookings')}>
          Back to Bookings
        </button>
      </div>
    );
  }

  // 6 Standard Tracking Milestone Stages
  const trackingStages = [
    { key: 'ACCEPTED', label: 'Booking Accepted', desc: 'Specialist confirmed appointment' },
    { key: 'PROVIDER_ASSIGNED', label: 'Provider Assigned', desc: 'Specialist dispatch queued' },
    { key: 'PROVIDER_ON_THE_WAY', label: 'Provider On The Way', desc: 'Specialist in transit with tools' },
    { key: 'ARRIVED', label: 'Provider Arrived', desc: 'Specialist parked at service address' },
    { key: 'SERVICE_STARTED', label: 'Service Started', desc: 'Diagnostics & servicing active' },
    { key: 'COMPLETED', label: 'Service Completed', desc: 'Final sign-off & invoice ready' }
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'REQUESTED': return 0;
      case 'ACCEPTED': return 1;
      case 'PROVIDER_ASSIGNED': return 2;
      case 'PROVIDER_ON_THE_WAY': return 3;
      case 'ARRIVED': return 4;
      case 'SERVICE_STARTED':
      case 'SERVICE_IN_PROGRESS': return 5;
      case 'COMPLETED': return 6;
      default: return 3;
    }
  };

  const currentStageIndex = getStageIndex(booking.status);

  // Status Updater Trigger
  const handleUpdateStatus = (newStatus) => {
    updateBookingStatus(booking.id, newStatus);
    addToast(`Telemetry status updated to: ${newStatus}`, 'info');
  };

  return (
    <div className="container max-w-6xl py-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          className="btn btn-outline btn-sm flex items-center gap-2 self-start"
          onClick={() => navigateTo('booking-details', { bookingId: booking.id || booking.bookingId })}
        >
          <ArrowLeft size={16} />
          <span>Booking #{booking.bookingId || booking.id}</span>
        </button>

        <div className="flex items-center gap-3">
          {booking.isEmergency && (
            <span className="badge badge-danger flex items-center gap-1.5 text-xs py-1 px-3">
              <Zap size={14} /> Rapid 20-Min Emergency Response
            </span>
          )}
          <span className="badge badge-verified text-xs py-1 px-3">
            Status: {booking.status?.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Real-Time Radar Map & Telemetry Controls */}
        <div className="lg:col-span-8 space-y-6">
          <LiveTrackingMap
            customerLocation={booking.location || { lat: 37.7749, lng: -122.4194 }}
            status={booking.status}
            isEmergency={booking.isEmergency}
            onStatusUpdate={handleUpdateStatus}
          />

          {/* Quick Simulation Advancement Bar */}
          <div className="card p-4 bg-surface border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Truck size={14} className="text-emerald-400" />
                Provider Status Telemetry Controls (Simulation)
              </span>
              <span className="text-[11px] text-muted">Simulate Specialist Milestones</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { status: 'PROVIDER_ON_THE_WAY', label: 'On The Way' },
                { status: 'ARRIVED', label: 'Arrived' },
                { status: 'SERVICE_STARTED', label: 'Started' },
                { status: 'SERVICE_IN_PROGRESS', label: 'In Progress' },
                { status: 'COMPLETED', label: 'Completed' }
              ].map(btn => (
                <button
                  key={btn.status}
                  type="button"
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all border ${
                    booking.status === btn.status
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-sm'
                      : 'border-border bg-surface-elevated text-muted hover:text-foreground'
                  }`}
                  onClick={() => handleUpdateStatus(btn.status)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service & Destination Card */}
          <div className="card p-6 bg-surface border-border">
            <h3 className="text-base font-bold text-foreground mb-4">Destination & Diagnostic Specs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
                <div className="flex items-start gap-3">
                  <MapPin className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="text-xs text-muted uppercase font-bold block">Service Address</span>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {typeof booking.address === 'object'
                        ? `${booking.address.houseNumber || ''}, ${booking.address.street || ''}, ${booking.address.city || ''} ${booking.address.pincode || ''}`
                        : (booking.address || 'Customer Primary Address')}
                    </p>
                    {booking.address?.landmark && (
                      <span className="text-xs text-muted block mt-1">Landmark: {booking.address.landmark}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
                <div className="flex items-start gap-3">
                  <Wrench className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="text-xs text-muted uppercase font-bold block">Diagnostic Issue</span>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {booking.problem || booking.serviceName || 'General Servicing'}
                    </p>
                    {booking.instructions && (
                      <span className="text-xs text-emerald-300 block mt-1">Note: "{booking.instructions}"</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Provider Card & Live Milestones */}
        <div className="lg:col-span-4 space-y-6">
          {/* Provider Contact Card */}
          <div className="card p-6 bg-surface border-border text-center shadow-md">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={booking.providerAvatar || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80"}
                alt={booking.providerName}
                className="w-full h-full rounded-full object-cover border-2 border-emerald-500 shadow-lg"
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-surface text-black flex items-center justify-center text-xs font-bold" title="Verified Specialist">
                ✓
              </span>
            </div>

            <h3 className="text-xl font-bold text-foreground">{booking.providerName}</h3>
            <p className="text-xs text-muted mb-2">Licensed Service Specialist</p>

            <div className="flex items-center justify-center gap-3 text-xs text-muted mb-6">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                4.9 (184 reviews)
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">98% On-Time</span>
            </div>

            {/* Communication Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                className="btn btn-primary flex items-center justify-center gap-2 py-2.5 text-xs font-bold shadow-md"
                onClick={() => setCallModalOpen(true)}
              >
                <Phone size={14} />
                <span>Call Specialist</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary flex items-center justify-center gap-2 py-2.5 text-xs font-bold"
                onClick={() => {
                  openChatModal({
                    id: booking.providerId || 'p1',
                    name: booking.providerName,
                    avatar: booking.providerAvatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80'
                  });
                }}
              >
                <MessageSquare size={14} />
                <span>Chat</span>
              </button>
            </div>

            <div className="bg-surface-elevated rounded-lg p-3 text-left border border-border text-xs text-muted flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
              <span>Background checked & verified with ServiGo SafeCare Guarantee.</span>
            </div>
          </div>

          {/* Live Progress Timeline */}
          <div className="card p-6 bg-surface border-border">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Live Progress Journey
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {trackingStages.map((stage, idx) => {
                const isPassed = currentStageIndex >= idx + 1;
                const isCurrent = currentStageIndex === idx + 1;

                return (
                  <div key={stage.key} className="relative">
                    <div 
                      className={`absolute -left-[27px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                        isPassed
                          ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/40'
                          : isCurrent
                          ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 animate-pulse'
                          : 'bg-surface-elevated border border-border text-muted'
                      }`}
                    >
                      {isPassed ? <Check size={13} /> : <Circle size={10} />}
                    </div>

                    <div>
                      <h5 className={`text-xs font-bold ${isPassed || isCurrent ? 'text-foreground' : 'text-muted'}`}>
                        {stage.label}
                      </h5>
                      <p className="text-[11px] text-muted mt-0.5">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {booking.status === 'COMPLETED' && (
              <button
                type="button"
                className="btn btn-outline w-full mt-6 text-xs flex items-center justify-center gap-2"
                onClick={() => openInvoiceModal(booking)}
              >
                <FileText size={14} />
                <span>Download Tax Invoice</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Simulated Call Modal */}
      {callModalOpen && (
        <div className="modal-overlay" onClick={() => setCallModalOpen(false)}>
          <div className="modal-content max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Phone size={32} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">Direct Driver Contact</h3>
            <p className="text-xs text-muted mb-4">Connecting securely through ServiGo Call Shield Masking</p>
            <p className="text-lg font-mono font-bold text-emerald-400 mb-6">+1 (555) 019-2834</p>
            <div className="flex gap-2">
              <a
                href="tel:+15550192834"
                className="btn btn-primary flex-1 text-xs py-2.5 font-bold"
                onClick={() => setCallModalOpen(false)}
              >
                Dial Now
              </a>
              <button
                type="button"
                className="btn btn-outline text-xs py-2.5"
                onClick={() => setCallModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
