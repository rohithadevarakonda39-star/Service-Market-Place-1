import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { servicesData } from '../data/servicesData';
import { providersData } from '../data/providersData';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  Phone, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  Zap,
  Navigation,
  RotateCcw,
  CreditCard,
  Star,
  RefreshCw,
  X,
  Check
} from 'lucide-react';

export const BookingsPage = () => {
  const { 
    bookings = [], 
    navigateTo, 
    openInvoiceModal, 
    openChatModal, 
    openBookingModal, 
    cancelBooking, 
    rescheduleBooking,
    checkSlotAvailability,
    addToast 
  } = useApp();

  // Tabs: Upcoming, Active, Completed, Cancelled, All
  const [activeTab, setActiveTab] = useState('upcoming');

  // Modal States
  const [rescheduleModalData, setRescheduleModalData] = useState(null); // booking
  const [rescheduleDate, setRescheduleDate] = useState('Tomorrow, Oct 3');
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState('10:30 AM - 12:00 PM');

  const [cancelModalData, setCancelModalData] = useState(null); // booking
  const [cancelReason, setCancelReason] = useState('Changed my mind');

  const [reviewModalData, setReviewModalData] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Tab counts & filters
  const upcomingStatuses = ['REQUESTED', 'ACCEPTED', 'PROVIDER_ASSIGNED', 'Confirmed'];
  const activeStatuses = ['PROVIDER_ON_THE_WAY', 'ARRIVED', 'SERVICE_STARTED', 'SERVICE_IN_PROGRESS', 'In Progress'];
  const completedStatuses = ['COMPLETED', 'Completed', 'PAID'];
  const cancelledStatuses = ['CANCELLED', 'Cancelled', 'REJECTED', 'Rejected'];

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return upcomingStatuses.includes(b.status);
    if (activeTab === 'active') return activeStatuses.includes(b.status);
    if (activeTab === 'completed') return completedStatuses.includes(b.status);
    if (activeTab === 'cancelled') return cancelledStatuses.includes(b.status);
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'REQUESTED':
        return (
          <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <span className="live-pulse" style={{ background: '#f59e0b' }}></span> Booking Requested
          </span>
        );
      case 'ACCEPTED':
      case 'Confirmed':
        return (
          <span className="badge badge-verified">
            <CheckCircle2 size={12} /> Provider Accepted
          </span>
        );
      case 'PROVIDER_ASSIGNED':
        return (
          <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            Specialist Assigned
          </span>
        );
      case 'PROVIDER_ON_THE_WAY':
        return (
          <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
            <span className="live-pulse" style={{ background: '#3b82f6' }}></span> On The Way (Live)
          </span>
        );
      case 'ARRIVED':
        return (
          <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
            Arrived On-Site
          </span>
        );
      case 'SERVICE_STARTED':
      case 'SERVICE_IN_PROGRESS':
      case 'In Progress':
        return (
          <span className="badge badge-verified" style={{ background: 'rgba(16, 185, 129, 0.25)' }}>
            <span className="live-pulse"></span> Service In Progress
          </span>
        );
      case 'COMPLETED':
      case 'Completed':
      case 'PAID':
        return (
          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle2 size={12} /> Completed
          </span>
        );
      case 'PAYMENT_PENDING':
        return (
          <span className="badge" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>
            Payment Pending
          </span>
        );
      case 'CANCELLED':
      case 'Cancelled':
        return (
          <span className="badge badge-emergency">
            <XCircle size={12} /> Cancelled
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge badge-emergency">
            <XCircle size={12} /> Declined by Pro
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleModalData) return;
    const success = rescheduleBooking(rescheduleModalData.id, rescheduleDate, rescheduleTimeSlot);
    if (success) {
      setRescheduleModalData(null);
    }
  };

  const handleConfirmCancel = () => {
    if (!cancelModalData) return;
    cancelBooking(cancelModalData.id, cancelReason);
    setCancelModalData(null);
  };

  const handleConfirmReview = () => {
    addToast(`Thank you! Review of ${reviewRating} stars submitted.`, 'success');
    setReviewModalData(null);
    setReviewText('');
  };

  const handleBookAgain = (booking) => {
    const s = servicesData.find(item => item.id === booking.serviceId) || {
      id: booking.serviceId,
      name: booking.serviceName,
      image: booking.serviceImage,
      categoryName: booking.categoryName,
      startingPrice: booking.pricing?.basePrice || 65
    };
    const p = providersData.find(item => item.id === booking.providerId) || null;
    openBookingModal(s, p, { label: booking.problem || 'Routine Check' });
  };

  return (
    <div className="bookings-page-root container">
      {/* Page Title */}
      <div className="bookings-page-header">
        <div>
          <h1 className="bookings-title">My Service Bookings</h1>
          <p className="bookings-sub">Track active dispatches, reschedule appointments, review invoices & manage services</p>
        </div>
        <button 
          className="btn btn-primary btn-glow"
          onClick={() => navigateTo('services')}
        >
          <span>Book New Service</span>
        </button>
      </div>

      {/* Primary Category Tabs */}
      <div className="bookings-tabs-bar">
        {[
          { id: 'upcoming', label: 'Upcoming', count: bookings.filter(b => upcomingStatuses.includes(b.status)).length },
          { id: 'active', label: 'Active', count: bookings.filter(b => activeStatuses.includes(b.status)).length },
          { id: 'completed', label: 'Completed', count: bookings.filter(b => completedStatuses.includes(b.status)).length },
          { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => cancelledStatuses.includes(b.status)).length },
          { id: 'all', label: 'All Bookings', count: bookings.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`booking-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span>{tab.label}</span>
            <span className="tab-pill-badge">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="bookings-list-stack">
          {filteredBookings.map((b) => {
            const isCompleted = completedStatuses.includes(b.status);
            const isCancelled = cancelledStatuses.includes(b.status);
            const isUpcoming = upcomingStatuses.includes(b.status);
            const isActive = activeStatuses.includes(b.status);

            return (
              <div key={b.id} className="card booking-item-card">
                {/* Card Header */}
                <div className="booking-card-top-bar">
                  <div className="booking-id-group">
                    <span className="order-id-tag">Booking #{b.id}</span>
                    <span className="booking-date-stamp">{b.date} • {b.timeSlot}</span>
                  </div>
                  <div className="booking-status-box">
                    {getStatusBadge(b.status)}
                  </div>
                </div>

                {/* Main Service Row */}
                <div className="booking-service-row">
                  <img src={b.serviceImage} alt={b.serviceName} className="booking-service-img" />
                  <div className="booking-service-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-verified">{b.categoryName}</span>
                      {b.problem && (
                        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--text-primary)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                          Issue: {b.problem}
                        </span>
                      )}
                    </div>
                    <h4 className="booking-service-title">{b.serviceName}</h4>
                    <div className="booking-address-line">
                      <MapPin size={13} color="#10b981" />
                      <span>{b.address}</span>
                    </div>
                    {b.isEmergency && (
                      <div className="booking-rush-alert">
                        <Zap size={13} color="#ef4444" />
                        <span>20-Minute Rapid Emergency Priority</span>
                      </div>
                    )}
                  </div>

                  {/* Provider Avatar Box */}
                  <div className="booking-pro-snapshot">
                    <img src={b.providerImage} alt={b.providerName} className="booking-pro-avatar" />
                    <div className="booking-pro-text">
                      <span className="pro-label">Assigned Specialist</span>
                      <strong className="pro-name">{b.providerName}</strong>
                      <div className="booking-pro-actions">
                        <button 
                          className="pro-action-link"
                          onClick={() => openChatModal({ name: b.providerName, image: b.providerImage, phone: b.providerPhone })}
                        >
                          <MessageSquare size={13} /> Chat
                        </button>
                        <a href={`tel:${b.providerPhone}`} className="pro-action-link">
                          <Phone size={13} /> Call
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="booking-price-col">
                    <span className="price-label">Total Amount</span>
                    <span className="price-val">
                      ${b.pricing?.total ? Number(b.pricing.total).toFixed(2) : '75.00'}
                    </span>
                    <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>
                      {b.paymentStatus || 'Paid Online'}
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="booking-card-footer">
                  <div className="footer-tracking-status">
                    <Navigation size={15} color="#10b981" />
                    <span>{b.liveTracking?.statusText || 'Status up to date with provider'}</span>
                  </div>

                  {/* Status-dependent buttons: Track, View Details, Cancel, Reschedule, Contact, Pay, Review, Book Again */}
                  <div className="footer-buttons">
                    {/* Track / Details */}
                    {!isCancelled && (
                      <button 
                        className="btn btn-primary btn-sm btn-glow"
                        onClick={() => navigateTo('tracking', { bookingId: b.id || b.bookingId })}
                      >
                        <Navigation size={14} />
                        <span>Track</span>
                      </button>
                    )}

                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigateTo('booking-details', { bookingId: b.id })}
                    >
                      <FileText size={14} />
                      <span>View Details</span>
                    </button>

                    {/* Reschedule (for upcoming / active bookings) */}
                    {(isUpcoming || b.status === 'ACCEPTED' || b.status === 'REQUESTED') && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setRescheduleModalData(b)}
                      >
                        <RotateCcw size={14} />
                        <span>Reschedule</span>
                      </button>
                    )}

                    {/* Cancel (for bookings not yet completed) */}
                    {!isCompleted && !isCancelled && (
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => setCancelModalData(b)}
                      >
                        <XCircle size={14} />
                        <span>Cancel</span>
                      </button>
                    )}

                    {/* Invoice */}
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => openInvoiceModal(b)}
                    >
                      <span>Invoice</span>
                    </button>

                    {/* Pay button if payment is pending */}
                    {b.paymentStatus !== 'PAID' && !isCancelled && b.status !== 'REJECTED' && (
                      <button
                        className="btn btn-primary btn-sm btn-glow"
                        onClick={() => navigateTo('payment', { bookingId: b.id || b.bookingId })}
                      >
                        <CreditCard size={14} />
                        <span>Pay</span>
                      </button>
                    )}

                    {/* Review for completed */}
                    {isCompleted && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setReviewModalData(b)}
                      >
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <span>Review</span>
                      </button>
                    )}

                    {/* Book Again */}
                    {isCompleted && (
                      <button
                        className="btn btn-primary btn-sm btn-glow"
                        onClick={() => handleBookAgain(b)}
                      >
                        <RefreshCw size={14} />
                        <span>Book Again</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card empty-bookings-card">
          <Calendar size={48} color="#94a3b8" />
          <h3>No bookings in "{activeTab}"</h3>
          <p>You don't have any appointments currently filed under this category.</p>
          <button onClick={() => navigateTo('services')} className="btn btn-primary btn-sm">
            Explore Services
          </button>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalData && (
        <div className="modal-overlay" onClick={() => setRescheduleModalData(null)}>
          <div className="modal-content reschedule-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header-line">
              <div>
                <h4>Reschedule Appointment</h4>
                <p>Order #{rescheduleModalData.id} • {rescheduleModalData.providerName}</p>
              </div>
              <button className="nav-icon-btn" onClick={() => setRescheduleModalData(null)}>
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
                  const check = checkSlotAvailability(rescheduleModalData.providerId, rescheduleDate, slot, rescheduleModalData.id);
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
              <button className="btn btn-secondary" onClick={() => setRescheduleModalData(null)}>
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

      {/* Cancellation Modal with Reason */}
      {cancelModalData && (
        <div className="modal-overlay" onClick={() => setCancelModalData(null)}>
          <div className="modal-content cancel-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header-line">
              <div>
                <h4 style={{ color: '#ef4444' }}>Cancel Booking #{cancelModalData.id}</h4>
                <p>Please share your reason for cancelling this appointment</p>
              </div>
              <button className="nav-icon-btn" onClick={() => setCancelModalData(null)}>
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
              <button className="btn btn-secondary" onClick={() => setCancelModalData(null)}>
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

      {/* Review Modal */}
      {reviewModalData && (
        <div className="modal-overlay" onClick={() => setReviewModalData(null)}>
          <div className="modal-content review-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header-line">
              <div>
                <h4>Review {reviewModalData.providerName}</h4>
                <p>{reviewModalData.serviceName}</p>
              </div>
              <button className="nav-icon-btn" onClick={() => setReviewModalData(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', margin: '1.25rem 0' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={28}
                  fill={star <= reviewRating ? '#fbbf24' : 'none'}
                  color={star <= reviewRating ? '#fbbf24' : 'var(--border-color)'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setReviewRating(star)}
                />
              ))}
            </div>

            <textarea
              className="form-input"
              rows={3}
              placeholder="How was your service experience? (Punctuality, quality of work, cleanliness)..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              style={{ width: '100%', marginBottom: '1rem' }}
            />

            <div className="modal-actions-row">
              <button className="btn btn-secondary" onClick={() => setReviewModalData(null)}>
                Skip
              </button>
              <button className="btn btn-primary btn-glow" onClick={handleConfirmReview}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .bookings-page-root {
          padding-top: 2rem;
          padding-bottom: 4rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .bookings-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .bookings-title {
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
        }
        .bookings-sub {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .bookings-tabs-bar {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .booking-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.15rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .booking-tab-btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }
        .booking-tab-btn.active {
          background: var(--accent-primary);
          color: #ffffff;
          border-color: var(--accent-primary);
          box-shadow: 0 0 14px rgba(16, 185, 129, 0.4);
        }

        .tab-pill-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.1rem 0.45rem;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
        }
        .booking-tab-btn:not(.active) .tab-pill-badge {
          background: var(--bg-surface);
          color: var(--text-muted);
        }

        .bookings-list-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .booking-item-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border-radius: var(--radius-xl);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          transition: border-color var(--transition-fast);
        }
        .booking-item-card:hover {
          border-color: rgba(16, 185, 129, 0.4);
        }

        .booking-card-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-color);
        }

        .booking-id-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .order-id-tag {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
          background: var(--bg-surface);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        .booking-date-stamp {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .booking-service-row {
          display: grid;
          grid-template-columns: 90px 1.5fr 1fr 140px;
          gap: 1.25rem;
          align-items: center;
        }
        @media (max-width: 900px) {
          .booking-service-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        .booking-service-img {
          width: 90px;
          height: 90px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .booking-service-info {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .booking-service-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .booking-address-line {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .booking-rush-alert {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #ef4444;
        }

        .booking-pro-snapshot {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-surface);
          padding: 0.75rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .booking-pro-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .booking-pro-text {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .pro-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .pro-name {
          font-size: 0.88rem;
          color: var(--text-primary);
        }

        .booking-pro-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.2rem;
        }

        .pro-action-link {
          font-size: 0.72rem;
          color: var(--accent-primary);
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }
        .pro-action-link:hover {
          text-decoration: underline;
        }

        .booking-price-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }
        @media (max-width: 900px) {
          .booking-price-col {
            align-items: flex-start;
          }
        }

        .price-label {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .price-val {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--accent-primary);
        }

        .booking-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.85rem;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border-color);
        }

        .footer-tracking-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .footer-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .empty-bookings-card {
          text-align: center;
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        /* Modal Styles */
        .reschedule-modal-box,
        .cancel-modal-box,
        .review-modal-box {
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
          transition: all var(--transition-fast);
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
