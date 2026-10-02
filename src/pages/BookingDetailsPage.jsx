import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialBookings } from '../data/initialBookings';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  FileText, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  Zap, 
  HelpCircle,
  Truck,
  RotateCcw,
  XCircle,
  AlertTriangle,
  Info,
  Calendar,
  X,
  Check,
  CreditCard,
  Image as ImageIcon
} from 'lucide-react';

export const BookingDetailsPage = () => {
  const { 
    pageParams, 
    bookings, 
    navigateTo, 
    openInvoiceModal, 
    openChatModal, 
    rescheduleBooking, 
    cancelBooking, 
    checkSlotAvailability, 
    addToast 
  } = useApp();

  const bookingId = pageParams.bookingId || 'SVG-9042';
  const booking = bookings.find(b => b.id === bookingId) || initialBookings[0];

  // 6-step standardized lifecycle timeline
  const steps = [
    { num: 1, key: 'REQUESTED', title: 'Booking Requested', desc: 'Order received & specialist alerted' },
    { num: 2, key: 'ACCEPTED', title: 'Provider Accepted', desc: 'Technician confirmed arrival slot' },
    { num: 3, key: 'PROVIDER_ON_THE_WAY', title: 'Provider On The Way', desc: 'Technician departed en route' },
    { num: 4, key: 'ARRIVED', title: 'Provider Arrived', desc: 'Technician checked in on-site' },
    { num: 5, key: 'SERVICE_STARTED', title: 'Service Started', desc: 'Diagnostic & repair underway' },
    { num: 6, key: 'COMPLETED', title: 'Service Completed', desc: 'Work finished & verified' }
  ];

  const getStepNumberForStatus = (status) => {
    switch (status) {
      case 'REQUESTED': return 1;
      case 'ACCEPTED':
      case 'Confirmed':
      case 'PROVIDER_ASSIGNED': return 2;
      case 'PROVIDER_ON_THE_WAY': return 3;
      case 'ARRIVED': return 4;
      case 'SERVICE_STARTED':
      case 'SERVICE_IN_PROGRESS':
      case 'In Progress': return 5;
      case 'COMPLETED':
      case 'Completed':
      case 'PAID': return 6;
      default: return 1;
    }
  };

  const currentStepNum = getStepNumberForStatus(booking.status);
  const isCancelled = booking.status === 'CANCELLED' || booking.status === 'Cancelled' || booking.status === 'REJECTED';
  const isCompleted = booking.status === 'COMPLETED' || booking.status === 'Completed' || booking.status === 'PAID';

  // Reschedule & Cancel Modals State
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('Tomorrow, Oct 3');
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState('10:30 AM - 12:00 PM');

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Changed my mind');

  const handleSimulateNextStep = () => {
    addToast('Live status update received from provider telemetry!', 'info');
  };

  const handleConfirmReschedule = () => {
    const success = rescheduleBooking(booking.id, rescheduleDate, rescheduleTimeSlot);
    if (success) {
      setIsRescheduleOpen(false);
    }
  };

  const handleConfirmCancel = () => {
    cancelBooking(booking.id, cancelReason);
    setIsCancelOpen(false);
  };

  const pricing = booking.pricing || {
    basePrice: 55,
    serviceFee: 5.5,
    emergencyFee: booking.isEmergency ? 20 : 0,
    tax: 6.44,
    total: 86.94
  };

  return (
    <div className="booking-details-root container">
      {/* Header bar */}
      <div className="booking-details-header">
        <button onClick={() => navigateTo('bookings')} className="btn btn-secondary btn-sm back-nav-btn">
          <ArrowLeft size={16} />
          <span>Back to All Bookings</span>
        </button>

        <div className="header-order-info">
          <h2>Booking #{booking.id}</h2>
          <span className="badge badge-verified">
            <span className="live-pulse"></span> {booking.status}
          </span>
        </div>
      </div>

      {/* Cancellation Notice Banner if Cancelled */}
      {isCancelled && (
        <div className="card cancel-alert-banner">
          <AlertTriangle size={24} color="#ef4444" />
          <div>
            <strong>Booking Cancelled / Declined</strong>
            <p>{booking.cancellationReason ? `Reason: ${booking.cancellationReason}` : 'This service appointment has been cancelled. No cancellation fees charged.'}</p>
          </div>
        </div>
      )}

      <div className="tracking-grid-layout">
        {/* Left Column: Live Map & 6-Step Visual Timeline */}
        <div className="tracking-main-col">
          {/* Simulated Live Vector Map Card */}
          <div className="card live-map-card">
            <div className="map-display-area">
              <div className="map-grid-bg">
                {/* SVG Route Line */}
                <svg className="map-svg-routes" viewBox="0 0 800 400" preserveAspectRatio="none">
                  <path 
                    d="M 160 300 C 280 280, 360 180, 520 160 S 680 120, 720 100" 
                    fill="none" 
                    stroke="rgba(16, 185, 129, 0.6)" 
                    strokeWidth="4" 
                    strokeDasharray="8 6"
                  />
                </svg>

                {/* Destination Pin (User Home) */}
                <div className="map-pin destination-pin" style={{ left: '72%', top: '24%' }}>
                  <div className="pin-pulse"></div>
                  <div className="pin-bubble home-bubble">
                    <MapPin size={18} color="#ffffff" />
                  </div>
                  <span className="pin-label">Your Location</span>
                </div>

                {/* Provider Vehicle Pin */}
                <div className="map-pin provider-vehicle-pin" style={{ left: currentStepNum >= 4 ? '70%' : currentStepNum >= 3 ? '48%' : '20%', top: currentStepNum >= 4 ? '26%' : '44%' }}>
                  <div className="vehicle-beacon"></div>
                  <div className="pin-bubble vehicle-bubble">
                    <Truck size={18} color="#090c0b" />
                  </div>
                  <div className="vehicle-eta-card">
                    <div className="vehicle-avatar-row">
                      <img src={booking.providerImage} alt={booking.providerName} className="eta-avatar" />
                      <div>
                        <strong>{booking.providerName}</strong>
                        <span>{booking.liveTracking?.etaMinutes ? `~${booking.liveTracking.etaMinutes} mins away` : 'On Schedule'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card Footer Bar */}
            <div className="map-card-footer">
              <div className="tracking-status-badge">
                <Navigation size={18} color="#10b981" />
                <div>
                  <strong>{booking.liveTracking?.statusText || 'Technician telemetry active'}</strong>
                  <p>Scheduled arrival window: {booking.date} • {booking.timeSlot}</p>
                </div>
              </div>

              {/* Action Buttons: Reschedule & Cancel */}
              <div className="map-footer-btns">
                {!isCompleted && !isCancelled && (
                  <>
                    <button
                      onClick={() => setIsRescheduleOpen(true)}
                      className="btn btn-secondary btn-sm"
                    >
                      <RotateCcw size={14} />
                      <span>Reschedule</span>
                    </button>
                    <button
                      onClick={() => setIsCancelOpen(true)}
                      className="btn btn-danger btn-sm"
                    >
                      <XCircle size={14} />
                      <span>Cancel</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Visual 6-Step Booking Timeline */}
            <div className="six-step-timeline-container">
              <div className="stepper-title-row">
                <span className="stepper-sub-header">BOOKING LIFECYCLE TIMELINE</span>
                <span className="stepper-step-indicator">Stage {Math.min(6, currentStepNum)} of 6</span>
              </div>

              <div className="stepper-nodes-row">
                {steps.map((st) => {
                  const isPassed = !isCancelled && st.num <= currentStepNum;
                  const isCurrent = !isCancelled && st.num === currentStepNum;
                  return (
                    <div key={st.num} className={`timeline-node ${isPassed ? 'passed' : ''} ${isCurrent ? 'current' : ''}`}>
                      <div className="node-circle">
                        {isPassed ? <Check size={13} color="#ffffff" /> : st.num}
                      </div>
                      <div className="node-text">
                        <span className="node-title">{st.title}</span>
                        <span className="node-desc">{st.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Diagnostic Problem & Special Instructions Card */}
          <div className="card-static details-block">
            <h3 className="block-title">Problem Details & Inspection Notes</h3>
            <div className="problem-info-card">
              <div className="p-header-line">
                <div>
                  <span className="p-category-label">REPORTED ISSUE</span>
                  <h4 className="p-title">{booking.problem || 'Standard System Inspection'}</h4>
                </div>
                {booking.severity && (
                  <span className="badge" style={{ background: booking.severity === 'Emergency' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: booking.severity === 'Emergency' ? '#ef4444' : '#10b981' }}>
                    Severity: {booking.severity}
                  </span>
                )}
              </div>
              {booking.problemDescription && (
                <p className="p-desc-text">
                  "{booking.problemDescription}"
                </p>
              )}
              {booking.instructions && (
                <div className="p-instruction-box">
                  <Info size={15} color="#38bdf8" />
                  <span><strong>Arrival Instructions:</strong> "{booking.instructions}"</span>
                </div>
              )}
            </div>

            {/* Attached Images / Media Gallery */}
            {booking.images && booking.images.length > 0 && (
              <div className="media-gallery-section">
                <span className="gallery-title">
                  <ImageIcon size={14} color="#10b981" /> Attached Proof Photos ({booking.images.length})
                </span>
                <div className="media-gallery-grid">
                  {booking.images.map((imgUrl, i) => (
                    <div key={i} className="gallery-thumb-wrap">
                      <img src={imgUrl} alt={`Proof ${i + 1}`} className="gallery-thumb" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="card-static details-block">
            <h3 className="block-title">Dispatch Activity Log</h3>
            <div className="timeline-items-list">
              {booking.timeline?.map((evt, idx) => (
                <div key={idx} className="timeline-row">
                  <div className="timeline-marker">
                    <div className="timeline-dot"></div>
                    {idx < booking.timeline.length - 1 && <div className="timeline-line"></div>}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-time-row">
                      <strong className="timeline-item-title">{evt.title}</strong>
                      <span className="timeline-time-badge">{evt.time}</span>
                    </div>
                    <p className="timeline-item-desc">{evt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Specialist Card & Pricing Receipt */}
        <div className="tracking-side-col">
          {/* Provider Card */}
          <div className="card provider-contact-card">
            <div className="provider-head-row">
              <img src={booking.providerImage} alt={booking.providerName} className="side-pro-avatar" />
              <div>
                <h4 className="side-pro-name">{booking.providerName}</h4>
                <span className="badge badge-verified">Certified Specialist</span>
                <p className="side-pro-phone">{booking.providerPhone}</p>
              </div>
            </div>

            <div className="side-pro-actions">
              <a href={`tel:${booking.providerPhone}`} className="btn btn-primary btn-sm btn-glow w-100">
                <Phone size={15} />
                <span>Call Specialist</span>
              </a>
              <button 
                onClick={() => openChatModal({ name: booking.providerName, image: booking.providerImage, phone: booking.providerPhone })}
                className="btn btn-secondary btn-sm w-100"
              >
                <MessageSquare size={15} />
                <span>Live Chat</span>
              </button>
            </div>
          </div>

          {/* Service Details & Address */}
          <div className="card-static order-summary-box">
            <h4 className="block-title">Service Details</h4>
            
            <div className="order-service-meta">
              <img src={booking.serviceImage} alt={booking.serviceName} className="meta-thumb" />
              <div>
                <strong>{booking.serviceName}</strong>
                <p className="meta-category">{booking.categoryName}</p>
              </div>
            </div>

            <div className="order-address-box">
              <MapPin size={16} color="#10b981" />
              <div>
                <span className="address-label">Destination</span>
                <p>{booking.address}</p>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="pricing-breakdown-box">
              <div className="p-row">
                <span>Base Service</span>
                <span>${pricing.basePrice?.toFixed(2) || '60.00'}</span>
              </div>
              {pricing.emergencyFee > 0 && (
                <div className="p-row text-danger">
                  <span>Emergency Priority Fee</span>
                  <span>+${pricing.emergencyFee.toFixed(2)}</span>
                </div>
              )}
              <div className="p-row">
                <span>Platform Escrow Protection</span>
                <span>${(pricing.serviceFee || 5.00).toFixed(2)}</span>
              </div>
              <div className="p-row">
                <span>Taxes & Fees</span>
                <span>${(pricing.tax || 5.20).toFixed(2)}</span>
              </div>
              <div className="p-divider"></div>
              <div className="p-row grand-total-line">
                <strong>Total Amount</strong>
                <strong className="grand-val">${(pricing.total || 75.00).toFixed(2)}</strong>
              </div>
            </div>

            {booking.paymentStatus !== 'PAID' && booking.status !== 'CANCELLED' && booking.status !== 'REJECTED' && (
              <button 
                onClick={() => navigateTo('payment', { bookingId: booking.id || booking.bookingId })}
                className="btn btn-primary w-100 mb-2 font-bold flex items-center justify-center gap-2"
              >
                <CreditCard size={16} />
                <span>Complete Payment / Checkout</span>
              </button>
            )}

            <button 
              onClick={() => openInvoiceModal(booking)}
              className="btn btn-secondary w-100 invoice-action-btn"
            >
              <FileText size={16} />
              <span>Official Tax Invoice</span>
            </button>
          </div>

          {/* Escrow Guarantee */}
          <div className="card-static escrow-card">
            <ShieldCheck size={24} color="#10b981" />
            <div>
              <strong>Payment Protected in Escrow</strong>
              <p>Funds are only released to {booking.providerName} after you inspect and sign off on completed work.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {isRescheduleOpen && (
        <div className="modal-overlay" onClick={() => setIsRescheduleOpen(false)}>
          <div className="modal-content reschedule-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header-line">
              <div>
                <h4>Reschedule Appointment</h4>
                <p>Order #{booking.id} • {booking.providerName}</p>
              </div>
              <button className="nav-icon-btn" onClick={() => setIsRescheduleOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="input-group" style={{ margin: '1rem 0' }}>
              <label className="input-label">Select New Date</label>
              <div className="pill-group">
                {['Today, Oct 2', 'Tomorrow, Oct 3', 'Saturday, Oct 4', 'Sunday, Oct 5', 'Monday, Oct 6'].map(d => (
                  <button
                    key={d}
                    type="button"
                    className={`pill-btn ${rescheduleDate === d ? 'active' : ''}`}
                    onClick={() => setRescheduleDate(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <label className="input-label">Select New Arrival Window</label>
              <div className="pill-group">
                {['09:00 AM - 10:30 AM', '10:30 AM - 12:00 PM', '02:00 PM - 03:30 PM', '04:00 PM - 05:30 PM', '06:00 PM - 07:30 PM'].map(slot => {
                  const check = checkSlotAvailability(booking.providerId, rescheduleDate, slot, booking.id);
                  const isAvail = check.available;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={!isAvail}
                      className={`pill-btn ${rescheduleTimeSlot === slot ? 'active' : ''}`}
                      onClick={() => setRescheduleTimeSlot(slot)}
                    >
                      {slot} {!isAvail && '(Booked)'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="modal-actions-row">
              <button className="btn btn-secondary" onClick={() => setIsRescheduleOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary btn-glow" onClick={handleConfirmReschedule}>
                <Check size={16} />
                <span>Confirm Reschedule</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {isCancelOpen && (
        <div className="modal-overlay" onClick={() => setIsCancelOpen(false)}>
          <div className="modal-content cancel-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header-line">
              <div>
                <h4 style={{ color: '#ef4444' }}>Cancel Booking #{booking.id}</h4>
                <p>Please share your reason for cancelling this appointment</p>
              </div>
              <button className="nav-icon-btn" onClick={() => setIsCancelOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="cancellation-policy-callout">
              <ShieldCheck size={16} color="#10b981" />
              <p>
                <strong>Cancellation Policy:</strong> Cancellation before technician dispatch incurs <strong>$0 fee</strong>. Any pre-authorized charges will be immediately released back to your original payment method.
              </p>
            </div>

            <div className="input-group" style={{ margin: '1rem 0' }}>
              <label className="input-label">Select Reason for Cancellation</label>
              <div className="reason-options-list">
                {[
                  'Changed my mind',
                  'Found another provider',
                  'Provider unavailable for required time',
                  'Wrong service booked by accident',
                  'Issue resolved on my own',
                  'Other'
                ].map(r => (
                  <label key={r} className={`reason-radio-item ${cancelReason === r ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="cancel_reason"
                      checked={cancelReason === r}
                      onChange={() => setCancelReason(r)}
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="modal-actions-row">
              <button className="btn btn-secondary" onClick={() => setIsCancelOpen(false)}>
                Keep Appointment
              </button>
              <button className="btn btn-danger" onClick={handleConfirmCancel}>
                <XCircle size={16} />
                <span>Confirm Cancellation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Styles */}
      <style>{`
        .booking-details-root {
          padding-top: 2rem;
          padding-bottom: 4rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .booking-details-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-order-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .cancel-alert-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.35);
          border-radius: var(--radius-lg);
          color: #ef4444;
        }
        .cancel-alert-banner p {
          color: var(--text-secondary);
          margin-top: 0.2rem;
          font-size: 0.85rem;
        }

        .tracking-grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 1024px) {
          .tracking-grid-layout {
            grid-template-columns: 1fr 380px;
          }
        }

        .live-map-card {
          padding: 0;
          overflow: hidden;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
        }

        .map-display-area {
          height: 320px;
          position: relative;
          background: radial-gradient(circle at center, #0f1c18 0%, #090e0c 100%);
          overflow: hidden;
        }
        [data-theme="light"] .map-display-area {
          background: radial-gradient(circle at center, #e6f4ea 0%, #d8ece0 100%);
        }

        .map-grid-bg {
          position: absolute;
          inset: 0;
        }

        .map-svg-routes {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .map-pin {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 5;
        }

        .pin-bubble {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.4);
        }
        .home-bubble {
          background: var(--accent-primary);
        }
        .vehicle-bubble {
          background: #ffffff;
        }

        .pin-pulse {
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.4);
          animation: mapRadar 2s infinite;
        }

        .vehicle-beacon {
          position: absolute;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          animation: mapRadar 1.6s infinite;
        }

        @keyframes mapRadar {
          0% { transform: scale(0.4); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .pin-label {
          background: rgba(0,0,0,0.8);
          color: #ffffff;
          font-size: 0.72rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          margin-top: 4px;
          white-space: nowrap;
        }

        .vehicle-eta-card {
          position: absolute;
          bottom: 46px;
          background: rgba(9, 12, 11, 0.95);
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 0.4rem 0.65rem;
          border-radius: var(--radius-md);
          box-shadow: 0 4px 15px rgba(0,0,0,0.4);
          white-space: nowrap;
        }
        [data-theme="light"] .vehicle-eta-card {
          background: #ffffff;
          border-color: rgba(16, 185, 129, 0.5);
        }
        .vehicle-avatar-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .eta-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }
        .vehicle-avatar-row div {
          display: flex;
          flex-direction: column;
        }
        .vehicle-avatar-row strong {
          font-size: 0.76rem;
          color: var(--text-primary);
        }
        .vehicle-avatar-row span {
          font-size: 0.68rem;
          color: var(--accent-primary);
          font-weight: 700;
        }

        .map-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem;
          background: var(--bg-surface);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .tracking-status-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .tracking-status-badge strong {
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .tracking-status-badge p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .map-footer-btns {
          display: flex;
          gap: 0.5rem;
        }

        /* 6-step Timeline */
        .six-step-timeline-container {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .stepper-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .stepper-sub-header {
          font-size: 0.74rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }
        .stepper-step-indicator {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        .stepper-nodes-row {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.5rem;
          position: relative;
        }
        @media (max-width: 768px) {
          .stepper-nodes-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        .timeline-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.4rem;
          opacity: 0.45;
          transition: all var(--transition-fast);
        }
        @media (max-width: 768px) {
          .timeline-node {
            flex-direction: row;
            text-align: left;
            gap: 0.75rem;
          }
        }

        .timeline-node.passed {
          opacity: 0.9;
        }
        .timeline-node.current {
          opacity: 1;
        }

        .node-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--bg-surface);
          border: 1.5px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
        }
        .timeline-node.passed .node-circle {
          background: #059669;
          border-color: #059669;
          color: #ffffff;
        }
        .timeline-node.current .node-circle {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
          color: #ffffff;
        }

        .node-text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .node-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .node-desc {
          font-size: 0.66rem;
          color: var(--text-muted);
        }

        /* Problem Info Card */
        .problem-info-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .p-header-line {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }
        .p-category-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }
        .p-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 0.15rem;
        }
        .p-desc-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.45;
          font-style: italic;
        }
        .p-instruction-box {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.82rem;
          color: var(--text-primary);
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-md);
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.25);
        }

        /* Gallery */
        .media-gallery-section {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .gallery-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .media-gallery-grid {
          display: flex;
          gap: 0.65rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }
        .gallery-thumb-wrap {
          width: 85px;
          height: 85px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-color);
          flex-shrink: 0;
        }
        .gallery-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Activity Log List */
        .timeline-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .timeline-row {
          display: flex;
          gap: 0.75rem;
        }
        .timeline-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 16px;
        }
        .timeline-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent-primary);
        }
        .timeline-line {
          width: 2px;
          flex: 1;
          background: var(--border-color);
          margin-top: 4px;
        }
        .timeline-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .timeline-time-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .timeline-item-title {
          font-size: 0.85rem;
          color: var(--text-primary);
        }
        .timeline-time-badge {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .timeline-item-desc {
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        /* Right column */
        .tracking-side-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .provider-contact-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .provider-head-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .side-pro-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-primary);
        }
        .side-pro-name {
          font-size: 1.1rem;
          color: var(--text-primary);
        }
        .side-pro-phone {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }
        .side-pro-actions {
          display: flex;
          gap: 0.65rem;
        }

        .order-summary-box {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .order-service-meta {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .meta-thumb {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }
        .meta-category {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .order-address-box {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          padding: 0.75rem;
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }
        .address-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .order-address-box p {
          font-size: 0.8rem;
          color: var(--text-primary);
          line-height: 1.4;
          margin-top: 0.15rem;
        }

        .pricing-breakdown-box {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .p-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.84rem;
          color: var(--text-secondary);
        }
        .p-divider {
          height: 1px;
          background: var(--border-color);
          margin: 0.35rem 0;
        }
        .grand-total-line {
          font-size: 1rem;
          color: var(--text-primary);
        }
        .grand-val {
          font-size: 1.25rem;
          color: var(--accent-primary);
        }

        .escrow-card {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          padding: 1.15rem;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: var(--radius-lg);
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .escrow-card strong {
          color: var(--text-primary);
        }

        /* Modal Styles */
        .reschedule-modal-box, .cancel-modal-box {
          max-width: 500px;
          width: 100%;
        }
        .modal-header-line {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .modal-header-line h4 {
          font-size: 1.15rem;
          color: var(--text-primary);
        }
        .modal-header-line p {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }
        .cancellation-policy-callout {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          padding: 0.75rem 0.9rem;
          border-radius: var(--radius-md);
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 1rem 0 0.5rem 0;
        }
        .reason-options-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.4rem;
        }
        .reason-radio-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-surface);
          cursor: pointer;
          font-size: 0.82rem;
          color: var(--text-primary);
        }
        .reason-radio-item:hover, .reason-radio-item.active {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.08);
        }
        .modal-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.25rem;
        }
      `}</style>
    </div>
  );
};
