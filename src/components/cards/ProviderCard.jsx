import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  Clock, 
  MessageSquare, 
  ChevronRight,
  Heart,
  SlidersHorizontal,
  Check
} from 'lucide-react';

export const ProviderCard = ({ provider }) => {
  const { 
    navigateTo, 
    openChatModal, 
    providerFavorites, 
    toggleProviderFavorite, 
    compareProviders, 
    addToCompare, 
    removeFromCompare 
  } = useApp();

  const isFavorited = providerFavorites?.includes(provider.id);
  const isInCompare = compareProviders?.some(p => p.id === provider.id);

  const handleCardClick = () => {
    navigateTo('provider-details', { providerId: provider.id });
  };

  const handleChat = (e) => {
    e.stopPropagation();
    openChatModal(provider);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleProviderFavorite(provider.id, provider.name);
  };

  const handleCompareToggle = (e) => {
    e.stopPropagation();
    if (isInCompare) {
      removeFromCompare(provider.id);
    } else {
      addToCompare(provider);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available_now':
        return <span className="pro-card-status now">🟢 Available Now</span>;
      case 'available_today':
        return <span className="pro-card-status today">🟡 Available Today</span>;
      case 'available_tomorrow':
        return <span className="pro-card-status tomorrow">🔵 Available Tomorrow</span>;
      default:
        return <span className="pro-card-status offline">⚫ Offline</span>;
    }
  };

  return (
    <div className={`card provider-card-root ${isInCompare ? 'in-compare-active' : ''}`} onClick={handleCardClick}>
      {/* Top Profile Summary */}
      <div className="provider-top-row">
        <div className="provider-avatar-box">
          <img src={provider.image} alt={provider.name} className="provider-avatar-img" loading="lazy" />
          {provider.verified && (
            <div className="provider-verified-check" title="Verified Background & License Checked">
              <ShieldCheck size={14} color="#090c0b" />
            </div>
          )}
        </div>

        <div className="provider-heading-info">
          <div className="provider-name-line">
            <h4 className="provider-name">{provider.name}</h4>
          </div>
          <p className="provider-service-title">{provider.service}</p>
          <div className="provider-rating-row">
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span className="rating-score">{provider.rating}</span>
            <span className="rating-reviews">({provider.reviewsCount} reviews)</span>
          </div>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={handleFavorite}
          className={`pro-fav-btn ${isFavorited ? 'favorited' : ''}`}
          title={isFavorited ? 'Remove from saved' : 'Save pro'}
        >
          <Heart size={16} fill={isFavorited ? '#ef4444' : 'none'} color={isFavorited ? '#ef4444' : '#94a3b8'} />
        </button>
      </div>

      {/* Availability Status & Next Slot */}
      <div className="pro-availability-strip">
        {getStatusBadge(provider.availabilityStatus)}
        <span className="pro-slot-text">
          <Clock size={11} color="#10b981" />
          <span>{provider.nextAvailableTime || provider.availability}</span>
        </span>
      </div>

      {/* Badges */}
      <div className="provider-badges-list">
        {provider.badges?.slice(0, 2).map((badge, idx) => (
          <span key={idx} className="badge badge-verified">
            {badge}
          </span>
        ))}
      </div>

      {/* Bio excerpt */}
      <p className="provider-bio-snippet">
        {provider.bio}
      </p>

      {/* Stats Grid */}
      <div className="provider-metrics-grid">
        <div className="metric-box">
          <Briefcase size={13} color="#10b981" />
          <span className="metric-label">Experience</span>
          <strong className="metric-value">{provider.experience}</strong>
        </div>
        <div className="metric-box">
          <MapPin size={13} color="#10b981" />
          <span className="metric-label">Distance</span>
          <strong className="metric-value">{provider.distance || '1.5 km'}</strong>
        </div>
        <div className="metric-box">
          <Clock size={13} color="#10b981" />
          <span className="metric-label">Response</span>
          <strong className="metric-value">{provider.responseTime || '< 15m'}</strong>
        </div>
      </div>

      {/* Action Row */}
      <div className="provider-footer-row">
        <div className="provider-rate-box">
          <span className="rate-prefix">Starting</span>
          <div className="rate-amount-row">
            <span className="rate-num">${provider.startingPrice}</span>
            <span className="rate-unit">/{provider.rateType || 'hr'}</span>
          </div>
        </div>

        <div className="provider-buttons-group">
          <button 
            className={`btn btn-sm ${isInCompare ? 'btn-primary' : 'btn-secondary'}`}
            title="Compare pro"
            onClick={handleCompareToggle}
          >
            <SlidersHorizontal size={13} />
            <span>{isInCompare ? 'Comparing' : 'Compare'}</span>
          </button>
          <button 
            className="btn btn-secondary btn-icon btn-sm" 
            title={`Message ${provider.name}`}
            onClick={handleChat}
          >
            <MessageSquare size={15} />
          </button>
          <button 
            className="btn btn-primary btn-sm btn-glow"
            onClick={handleCardClick}
          >
            <span>View</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
