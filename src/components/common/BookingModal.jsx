import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, MapPin, Zap, ShieldCheck, CreditCard, Check, AlertCircle } from 'lucide-react';

export const BookingModal = () => {
  const { bookingModal, closeBookingModal, createBooking, navigateTo, currentUser } = useApp();
  const { isOpen, service, provider, problem } = bookingModal;

  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('11:00 AM - 01:00 PM');
  const [address, setAddress] = useState(currentUser.address || '');
  const [isEmergency, setIsEmergency] = useState(false);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !service) return null;

  const basePrice = service.startingPrice || 60;
  const platformFee = 5.00;
  const emergencyFee = isEmergency ? 20.00 : 0.00;
  const tax = Number(((basePrice + emergencyFee) * 0.08).toFixed(2));
  const total = Number((basePrice + platformFee + emergencyFee + tax).toFixed(2));

  const timeSlots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:30 PM - 06:30 PM',
    '07:00 PM - 09:00 PM'
  ];

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newBookingId = createBooking({
        serviceId: service.id,
        serviceName: service.name,
        serviceImage: service.image,
        categoryName: service.categoryName,
        problemSelected: problem?.label || null,
        providerId: provider?.id || service.providerId,
        providerName: provider?.name || service.providerName,
        providerImage: provider?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        providerPhone: provider?.phone || '+1 (555) 234-8901',
        date: selectedDate === 'Today' ? 'Today, Scheduled' : selectedDate === 'Tomorrow' ? 'Tomorrow, Scheduled' : selectedDate,
        timeSlot: selectedTime,
        address: address || 'Current Location',
        notes,
        isEmergency,
        paymentMethod: paymentMethod === 'card' ? 'Credit Card (ending •••• 4242)' : paymentMethod === 'apple' ? 'Apple Pay' : 'Pay After Service',
        pricing: {
          basePrice,
          serviceFee: platformFee,
          emergencyFee,
          tax,
          total
        }
      });

      setLoading(false);
      closeBookingModal();
      navigateTo('booking-details', { bookingId: newBookingId });
    }, 700);
  };

  return (
    <div className="modal-overlay" onClick={closeBookingModal}>
      <div className="modal-content booking-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="booking-modal-header">
          <div>
            <h4 className="modal-title">Book Service Appointment</h4>
            <p className="modal-subtitle">Instant reservation with guaranteed verified specialist</p>
          </div>
          <button className="nav-icon-btn" onClick={closeBookingModal} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Selected Service Snippet */}
        <div className="service-snippet-card">
          <img src={service.image} alt={service.name} className="snippet-img" />
          <div className="snippet-info">
            <span className="badge badge-verified">{service.categoryName}</span>
            <h5 className="snippet-name">{service.name}</h5>
            <div className="snippet-provider-row">
              <span>Pro: <strong>{provider?.name || service.providerName}</strong></span>
              <span className="snippet-dot">•</span>
              <span className="snippet-duration">{service.duration}</span>
            </div>
          </div>
          <div className="snippet-price">
            <span className="price-tag">${basePrice}</span>
          </div>
        </div>

        {problem && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 0.9rem',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            marginBottom: '1rem',
            fontSize: '0.84rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.05rem' }}>🔧</span>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Issue: {problem.label}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Estimated diagnosis: {problem.duration || '30-45 mins'} • Avg part cost: {problem.typicalCost || 'Included'}</div>
              </div>
            </div>
            <span className="badge badge-verified" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}>Symptom Attached</span>
          </div>
        )}

        <form onSubmit={handleConfirmBooking} className="booking-form">
          {/* Emergency Priority Toggle */}
          <div className={`emergency-toggle-card ${isEmergency ? 'active' : ''}`} onClick={() => setIsEmergency(!isEmergency)}>
            <div className="emergency-icon-box">
              <Zap size={20} />
            </div>
            <div className="emergency-text">
              <div className="emergency-title-row">
                <strong>Emergency 20-Min Priority Dispatch</strong>
                <span className="badge badge-emergency">+$20</span>
              </div>
              <p>Specialist will be dispatched immediately with priority route tracking.</p>
            </div>
            <div className="custom-checkbox">
              {isEmergency && <Check size={14} color="#ffffff" />}
            </div>
          </div>

          {/* Date Picker Buttons */}
          <div className="input-group">
            <label className="input-label"><Calendar size={14} style={{ display: 'inline', marginRight: 4 }} /> Select Date</label>
            <div className="pill-group">
              {['Today', 'Tomorrow', 'This Weekend', 'Pick Later'].map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`pill-btn ${selectedDate === day ? 'active' : ''}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Picker */}
          <div className="input-group">
            <label className="input-label"><Clock size={14} style={{ display: 'inline', marginRight: 4 }} /> Preferred Arrival Window</label>
            <div className="slot-grid">
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`slot-btn ${selectedTime === slot ? 'active' : ''}`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Service Location */}
          <div className="input-group">
            <label className="input-label"><MapPin size={14} style={{ display: 'inline', marginRight: 4 }} /> Service Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Apartment, Street address, Landmark"
              className="input-field"
            />
          </div>

          {/* Special Instructions */}
          <div className="input-group">
            <label className="input-label">Notes or Symptoms (Optional)</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Gate code is #1024, leak is under kitchen sink"
              className="input-field"
              style={{ resize: 'none' }}
            />
          </div>

          {/* Payment Method */}
          <div className="input-group">
            <label className="input-label"><CreditCard size={14} style={{ display: 'inline', marginRight: 4 }} /> Payment Method</label>
            <div className="payment-options">
              <label className={`payment-pill ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input type="radio" name="pay" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <span>Card (•••• 4242)</span>
              </label>
              <label className={`payment-pill ${paymentMethod === 'apple' ? 'active' : ''}`}>
                <input type="radio" name="pay" value="apple" checked={paymentMethod === 'apple'} onChange={() => setPaymentMethod('apple')} />
                <span>Digital Wallet</span>
              </label>
              <label className={`payment-pill ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input type="radio" name="pay" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <span>Pay After Job</span>
              </label>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="pricing-summary-card">
            <div className="pricing-row">
              <span>Service Base Fee</span>
              <span>${basePrice.toFixed(2)}</span>
            </div>
            {isEmergency && (
              <div className="pricing-row text-danger">
                <span>Emergency Rush Dispatch</span>
                <span>+$20.00</span>
              </div>
            )}
            <div className="pricing-row">
              <span>Platform & Insurance Fee</span>
              <span>${platformFee.toFixed(2)}</span>
            </div>
            <div className="pricing-row">
              <span>Estimated Taxes</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="pricing-divider"></div>
            <div className="pricing-row total-row">
              <strong>Total Amount</strong>
              <strong className="total-highlight">${total.toFixed(2)}</strong>
            </div>
          </div>

          {/* Escrow Guarantee Note */}
          <div className="escrow-notice">
            <ShieldCheck size={16} color="#10b981" />
            <span>ServiGo Guarantee: Payment is held in secure escrow until you approve the completed service.</span>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-glow submit-book-btn">
            {loading ? (
              <span className="btn-loading">Securing Appointment...</span>
            ) : (
              <span>Confirm & Lock Appointment (${total.toFixed(2)})</span>
            )}
          </button>
        </form>
      </div>

      <style>{`
        .booking-modal-content {
          padding: 1.75rem;
          max-width: 580px;
        }

        .booking-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .modal-title {
          font-size: 1.25rem;
          color: var(--text-primary);
        }
        .modal-subtitle {
          font-size: 0.825rem;
          color: var(--text-muted);
        }

        .service-snippet-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: var(--bg-card-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.85rem;
          margin-bottom: 1.25rem;
        }

        .snippet-img {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          flex-shrink: 0;
        }

        .snippet-info {
          flex: 1;
        }

        .snippet-name {
          font-size: 0.95rem;
          margin: 0.2rem 0;
          color: var(--text-primary);
        }

        .snippet-provider-row {
          font-size: 0.775rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .snippet-dot { opacity: 0.5; }

        .snippet-price .price-tag {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--accent-primary);
        }

        .emergency-toggle-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          cursor: pointer;
          margin-bottom: 1.2rem;
          transition: all var(--transition-fast);
        }

        .emergency-toggle-card.active {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.08);
        }

        .emergency-icon-box {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .emergency-text {
          flex: 1;
        }
        .emergency-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-primary);
        }
        .emergency-text p {
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .custom-checkbox {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 1.5px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-card);
        }
        .emergency-toggle-card.active .custom-checkbox {
          background: #ef4444;
          border-color: #ef4444;
        }

        .pill-group {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .pill-btn {
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .pill-btn.active {
          background: var(--accent-light);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .slot-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 0.5rem;
        }

        .slot-btn {
          padding: 0.5rem 0.4rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-align: center;
          transition: all var(--transition-fast);
        }
        .slot-btn.active {
          background: var(--accent-light);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .payment-options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .payment-pill {
          flex: 1;
          min-width: 120px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 0.85rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          font-size: 0.825rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .payment-pill.active {
          border-color: var(--accent-primary);
          background: var(--accent-light);
          color: var(--accent-primary);
        }

        .pricing-summary-card {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1rem;
          margin: 1.25rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .pricing-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .pricing-divider {
          height: 1px;
          background: var(--border-color);
          margin: 0.25rem 0;
        }

        .total-row {
          font-size: 1rem;
          color: var(--text-primary);
        }

        .total-highlight {
          color: var(--accent-primary);
          font-size: 1.25rem;
        }

        .escrow-notice {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.775rem;
          color: var(--text-secondary);
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid var(--border-subtle);
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
        }

        .submit-book-btn {
          width: 100%;
        }
      `}</style>
    </div>
  );
};
