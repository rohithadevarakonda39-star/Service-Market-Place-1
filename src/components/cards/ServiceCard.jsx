import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star, MapPin, Clock, Heart, Zap, ShieldCheck } from 'lucide-react';

export const ServiceCard = ({ service }) => {
  const { navigateTo, openBookingModal, favorites, toggleFavorite } = useApp();

  const isFavorited = favorites.includes(service.id);

  const handleCardClick = () => {
    navigateTo('service-details', { serviceId: service.id });
  };

  const handleBookNow = (e) => {
    e.stopPropagation();
    openBookingModal(service);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(service.id, service.name);
  };

  return (
    <div className="card service-card-root" onClick={handleCardClick}>
      {/* Thumbnail Banner */}
      <div className="service-card-media">
        <img 
          src={service.image} 
          alt={service.name} 
          className="service-card-img"
          loading="lazy"
        />
        <div className="service-card-overlay"></div>

        {/* Favorite Button */}
        <button 
          className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={isFavorited ? '#ef4444' : 'none'} color={isFavorited ? '#ef4444' : '#ffffff'} />
        </button>

        {/* Category Pill */}
        <span className="service-category-tag">
          {service.categoryName}
        </span>

        {/* Availability Badge */}
        <div className="service-avail-badge">
          <Clock size={12} />
          <span>{service.availability}</span>
        </div>
      </div>

      {/* Content */}
      <div className="service-card-body">
        {/* Rating and Bookings Count */}
        <div className="service-meta-top">
          <div className="rating-pill">
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span className="rating-num">{service.rating}</span>
            <span className="reviews-count">({service.reviewsCount})</span>
          </div>
          <span className="bookings-pill">
            {service.bookingsCount ? `${service.bookingsCount}+ booked` : 'Top Rated'}
          </span>
        </div>

        {/* Title */}
        <h4 className="service-title" title={service.name}>
          {service.name}
        </h4>

        {/* Description */}
        <p className="service-desc">
          {service.shortDescription}
        </p>

        {/* Location & Provider Info */}
        <div className="service-meta-footer">
          <div className="service-location-row">
            <MapPin size={13} color="#10b981" />
            <span>{service.location}</span>
          </div>
          <div className="service-provider-row">
            <ShieldCheck size={13} color="#10b981" />
            <span>By <strong>{service.providerName}</strong></span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="service-card-action-row">
          <div className="service-pricing">
            <span className="price-prefix">From</span>
            <div className="price-value-box">
              <span className="currency">$</span>
              <span className="amount">{service.startingPrice}</span>
            </div>
          </div>
          <button 
            className="btn btn-primary btn-sm btn-glow book-btn"
            onClick={handleBookNow}
          >
            <span>Book Now</span>
          </button>
        </div>
      </div>

      <style>{`
        .service-card-root {
          padding: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          cursor: pointer;
          height: 100%;
        }

        .service-card-media {
          position: relative;
          width: 100%;
          height: 195px;
          overflow: hidden;
          background: var(--bg-card-hover);
        }

        .service-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .service-card-root:hover .service-card-img {
          transform: scale(1.05);
        }

        .service-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.6) 100%);
        }

        .favorite-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(15, 20, 18, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: transform var(--transition-fast), background var(--transition-fast);
          z-index: 2;
        }
        .favorite-btn:hover {
          transform: scale(1.1);
          background: rgba(15, 20, 18, 0.9);
        }

        .service-category-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(9, 12, 11, 0.75);
          backdrop-filter: blur(8px);
          color: var(--badge-text);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          z-index: 2;
        }

        .service-avail-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(9, 12, 11, 0.85);
          backdrop-filter: blur(6px);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-sm);
          z-index: 2;
        }

        .service-card-body {
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .service-meta-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .rating-pill {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .reviews-count {
          color: var(--text-muted);
          font-weight: 400;
        }

        .bookings-pill {
          font-size: 0.7rem;
          color: var(--accent-primary);
          background: var(--accent-light);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .service-title {
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.35;
          margin-bottom: 0.45rem;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .service-desc {
          font-size: 0.825rem;
          line-height: 1.45;
          color: var(--text-muted);
          margin-bottom: 0.85rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .service-meta-footer {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding-top: 0.65rem;
          border-top: 1px solid var(--border-color);
          margin-bottom: 0.85rem;
        }

        .service-location-row, .service-provider-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.775rem;
          color: var(--text-secondary);
        }

        .service-card-action-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.4rem;
        }

        .service-pricing {
          display: flex;
          flex-direction: column;
        }
        .price-prefix {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .price-value-box {
          display: flex;
          align-items: baseline;
        }
        .currency {
          font-size: 0.85rem;
          color: var(--accent-primary);
          font-weight: 700;
        }
        .amount {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }

        .book-btn {
          padding: 0.5rem 1.15rem;
        }
      `}</style>
    </div>
  );
};
