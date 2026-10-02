import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Check, 
  Star, 
  MapPin, 
  Clock, 
  Briefcase, 
  ShieldCheck, 
  DollarSign, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export const ProviderComparisonModal = () => {
  const { 
    compareProviders, 
    removeFromCompare, 
    isCompareModalOpen, 
    setIsCompareModalOpen,
    openBookingModal,
    navigateTo 
  } = useApp();

  if (!isCompareModalOpen || compareProviders.length === 0) return null;

  const handleBook = (provider) => {
    setIsCompareModalOpen(false);
    openBookingModal(null, provider);
  };

  const handleView = (providerId) => {
    setIsCompareModalOpen(false);
    navigateTo('provider-details', { providerId });
  };

  const getStatusBadge = (status, nextTime) => {
    switch (status) {
      case 'available_now':
        return <span className="cmp-badge cmp-now">🟢 Available Now</span>;
      case 'available_today':
        return <span className="cmp-badge cmp-today">🟡 Available Today</span>;
      case 'available_tomorrow':
        return <span className="cmp-badge cmp-tomorrow">🔵 Available Tomorrow</span>;
      default:
        return <span className="cmp-badge cmp-offline">⚫ Offline</span>;
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsCompareModalOpen(false)}>
      <div 
        className="modal-box compare-modal-box" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Compare Service Specialists</h3>
            <p className="modal-subtitle">
              Evaluating {compareProviders.length} verified trade providers side-by-side.
            </p>
          </div>
          <button 
            onClick={() => setIsCompareModalOpen(false)} 
            className="modal-close-btn"
            aria-label="Close comparison modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comparison Table Container with internal scroll only */}
        <div className="compare-table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="cmp-metric-col">Feature / Metric</th>
                {compareProviders.map((p) => (
                  <th key={p.id} className="cmp-pro-col">
                    <div className="cmp-header-pro">
                      <button 
                        onClick={() => removeFromCompare(p.id)}
                        className="cmp-col-remove"
                        title="Remove from comparison"
                      >
                        <X size={14} />
                      </button>
                      <img src={p.image} alt={p.name} className="cmp-pro-avatar" />
                      <h4 className="cmp-pro-name">{p.name}</h4>
                      <span className="cmp-pro-trade">{p.service}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Starting Price */}
              <tr>
                <td className="cmp-label">
                  <div className="cmp-label-inner">
                    <DollarSign size={15} color="#10b981" />
                    <span>Starting Price</span>
                  </div>
                </td>
                {compareProviders.map((p) => (
                  <td key={p.id} className="cmp-val cmp-price-val">
                    ${p.startingPrice} <span className="text-muted">/{p.rateType || 'hr'}</span>
                  </td>
                ))}
              </tr>

              {/* Row 2: Customer Rating */}
              <tr>
                <td className="cmp-label">
                  <div className="cmp-label-inner">
                    <Star size={15} fill="#f59e0b" color="#f59e0b" />
                    <span>Rating & Reviews</span>
                  </div>
                </td>
                {compareProviders.map((p) => (
                  <td key={p.id} className="cmp-val">
                    <strong>{p.rating} ★</strong> ({p.reviewsCount} reviews)
                  </td>
                ))}
              </tr>

              {/* Row 3: Experience */}
              <tr>
                <td className="cmp-label">
                  <div className="cmp-label-inner">
                    <Briefcase size={15} color="#10b981" />
                    <span>Experience</span>
                  </div>
                </td>
                {compareProviders.map((p) => (
                  <td key={p.id} className="cmp-val">
                    {p.experience}
                  </td>
                ))}
              </tr>

              {/* Row 4: Distance from Location */}
              <tr>
                <td className="cmp-label">
                  <div className="cmp-label-inner">
                    <MapPin size={15} color="#10b981" />
                    <span>Distance</span>
                  </div>
                </td>
                {compareProviders.map((p) => (
                  <td key={p.id} className="cmp-val">
                    {p.distance || '1.8 km away'}
                  </td>
                ))}
              </tr>

              {/* Row 5: Availability */}
              <tr>
                <td className="cmp-label">
                  <div className="cmp-label-inner">
                    <Clock size={15} color="#10b981" />
                    <span>Availability Status</span>
                  </div>
                </td>
                {compareProviders.map((p) => (
                  <td key={p.id} className="cmp-val">
                    <div>{getStatusBadge(p.availabilityStatus)}</div>
                    <span className="cmp-sub-time">{p.nextAvailableTime}</span>
                  </td>
                ))}
              </tr>

              {/* Row 6: Completed Jobs */}
              <tr>
                <td className="cmp-label">
                  <div className="cmp-label-inner">
                    <Check size={15} color="#10b981" />
                    <span>Completed Jobs</span>
                  </div>
                </td>
                {compareProviders.map((p) => (
                  <td key={p.id} className="cmp-val">
                    {p.completedJobs}+ orders
                  </td>
                ))}
              </tr>

              {/* Row 7: Response Time */}
              <tr>
                <td className="cmp-label">
                  <div className="cmp-label-inner">
                    <Clock size={15} color="#38bdf8" />
                    <span>Response Time</span>
                  </div>
                </td>
                {compareProviders.map((p) => (
                  <td key={p.id} className="cmp-val">
                    {p.responseTime || '< 15 mins'}
                  </td>
                ))}
              </tr>

              {/* Row 8: Cancellation Rate */}
              <tr>
                <td className="cmp-label">
                  <div className="cmp-label-inner">
                    <TrendingDown size={15} color="#10b981" />
                    <span>Cancellation Rate</span>
                  </div>
                </td>
                {compareProviders.map((p) => (
                  <td key={p.id} className="cmp-val">
                    {p.cancellationRate || '0.3%'} (Low)
                  </td>
                ))}
              </tr>

              {/* Row 9: Verification */}
              <tr>
                <td className="cmp-label">
                  <div className="cmp-label-inner">
                    <ShieldCheck size={15} color="#10b981" />
                    <span>ServiGo Guarantee</span>
                  </div>
                </td>
                {compareProviders.map((p) => (
                  <td key={p.id} className="cmp-val text-emerald font-semibold">
                    ✓ Verified Pro
                  </td>
                ))}
              </tr>

              {/* Action Buttons Row */}
              <tr className="cmp-action-row">
                <td className="cmp-label">Choose Specialist</td>
                {compareProviders.map((p) => (
                  <td key={p.id} className="cmp-val">
                    <button 
                      onClick={() => handleBook(p)} 
                      className="btn btn-primary btn-sm btn-block btn-glow"
                    >
                      Book Now
                    </button>
                    <button 
                      onClick={() => handleView(p.id)} 
                      className="btn btn-secondary btn-sm btn-block"
                      style={{ marginTop: '0.4rem' }}
                    >
                      View Profile
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
