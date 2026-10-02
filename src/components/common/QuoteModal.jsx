import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, FileText, CheckCircle2, Phone, Calendar, Upload } from 'lucide-react';

export const QuoteModal = () => {
  const { quoteModal, closeQuoteModal, addToast, currentUser } = useApp();
  const { isOpen, service, provider } = quoteModal;

  const [description, setDescription] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('$100 - $250');
  const [timeline, setTimeline] = useState('Within 48 Hours');
  const [contactPhone, setContactPhone] = useState(currentUser.phone || '');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !service) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      addToast(`Quote request dispatched to ${provider?.name || service.providerName}! You'll receive itemized estimate via SMS/Email within 2 hours.`, 'success');
      closeQuoteModal();
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={closeQuoteModal}>
      <div className="modal-content quote-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <div>
            <h4 className="modal-title">Request Custom Free Quote</h4>
            <p className="modal-subtitle">Direct proposal from verified contractor</p>
          </div>
          <button className="nav-icon-btn" onClick={closeQuoteModal} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="provider-quote-badge">
          <img 
            src={provider?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
            alt={provider?.name || 'Pro'} 
            className="quote-pro-avatar"
          />
          <div>
            <div className="quote-pro-name">{provider?.name || service.providerName}</div>
            <span className="badge badge-verified">{provider?.service || service.name}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="quote-form">
          <div className="input-group">
            <label className="input-label">Project Requirements & Scope</label>
            <textarea
              required
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what needs to be repaired, installed, or cleaned (e.g. 3-bedroom deep scrub, replace 4 circuit breakers, or install 3 ceiling fans)..."
              className="input-field"
            />
          </div>

          <div className="grid-2-col">
            <div className="input-group">
              <label className="input-label">Estimated Budget Expectation</label>
              <select 
                value={estimatedBudget} 
                onChange={(e) => setEstimatedBudget(e.target.value)} 
                className="input-field"
              >
                <option value="Under $100">Under $100</option>
                <option value="$100 - $250">$100 - $250</option>
                <option value="$250 - $500">$250 - $500</option>
                <option value="$500 - $1,000">$500 - $1,000</option>
                <option value="$1,000+">$1,000+ (Commercial/Large)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Target Completion Timeline</label>
              <select 
                value={timeline} 
                onChange={(e) => setTimeline(e.target.value)} 
                className="input-field"
              >
                <option value="Immediately (Today)">Immediately (Today)</option>
                <option value="Within 48 Hours">Within 48 Hours</option>
                <option value="Next Week">Next Week</option>
                <option value="Flexible Schedule">Flexible Schedule</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label"><Phone size={14} style={{ display: 'inline', marginRight: 4 }} /> Callback Phone Number</label>
            <input 
              type="tel"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="input-field"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Simulated File Upload Dropzone */}
          <div className="quote-upload-dropzone" onClick={() => addToast('Photos attached to quote specification.', 'info')}>
            <Upload size={20} color="#10b981" />
            <p className="upload-title">Attach Photos / Floorplans (Optional)</p>
            <span className="upload-hint">Click to attach relevant job site photos (JPEG, PNG up to 10MB)</span>
          </div>

          <div className="quote-guarantee-note">
            <CheckCircle2 size={16} color="#10b981" />
            <span>Zero obligation. You will receive a written scope and transparent pricing before committing.</span>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary btn-lg btn-glow" style={{ width: '100%' }}>
            {submitting ? 'Sending Request...' : 'Send Free Quote Request'}
          </button>
        </form>
      </div>

      <style>{`
        .quote-modal-content {
          padding: 1.75rem;
          max-width: 540px;
        }

        .provider-quote-badge {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: var(--bg-card-elevated);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          margin-bottom: 1.25rem;
        }

        .quote-pro-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--accent-primary);
        }

        .quote-pro-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        @media (min-width: 600px) {
          .grid-2-col {
            grid-template-columns: 1fr 1fr;
          }
        }

        .quote-upload-dropzone {
          border: 1.5px dashed var(--border-subtle);
          background: var(--bg-input);
          border-radius: var(--radius-md);
          padding: 1.25rem 1rem;
          text-align: center;
          cursor: pointer;
          margin-bottom: 1.25rem;
          transition: border-color var(--transition-fast);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }
        .quote-upload-dropzone:hover {
          border-color: var(--accent-primary);
        }
        .upload-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .upload-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .quote-guarantee-note {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.775rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
        }
      `}</style>
    </div>
  );
};
