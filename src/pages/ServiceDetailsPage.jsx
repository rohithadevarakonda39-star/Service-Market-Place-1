import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { servicesData } from '../data/servicesData';
import { providersData } from '../data/providersData';
import { ServiceCard } from '../components/cards/ServiceCard';
import { ProblemSelector } from '../components/services/ProblemSelector';
import { ProviderMatchingSection } from '../components/providers/ProviderMatchingSection';
import { 
  Star, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Share2, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  Calendar, 
  ChevronRight, 
  FileText,
  HelpCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export const ServiceDetailsPage = () => {
  const { 
    pageParams, 
    navigateTo, 
    openBookingModal, 
    openQuoteModal, 
    openChatModal,
    favorites, 
    toggleFavorite,
    trackViewedService,
    selectedProblem,
    addToast 
  } = useApp();

  const serviceId = pageParams.serviceId || 'srv-1';
  const service = servicesData.find(s => s.id === serviceId) || servicesData[0];
  const provider = providersData.find(p => p.id === service.providerId) || providersData[0];

  useEffect(() => {
    if (service) {
      trackViewedService(service);
    }
  }, [service?.id]);

  const isFavorited = favorites.includes(service.id);

  // New review state
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState(service.reviews || []);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: 'You (Alex Morgan)',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewText.trim()
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewText('');
    addToast('Thank you! Your verified review has been published.', 'success');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link copied to clipboard!', 'info');
    } else {
      addToast('Service link ready to share', 'info');
    }
  };

  // Similar services in the same category
  const similarServices = servicesData
    .filter(s => s.categoryId === service.categoryId && s.id !== service.id)
    .slice(0, 3);

  return (
    <div className="service-details-root container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-nav">
        <button onClick={() => navigateTo('home')} className="crumb-link">Home</button>
        <ChevronRight size={14} />
        <button onClick={() => navigateTo('services')} className="crumb-link">Services</button>
        <ChevronRight size={14} />
        <span className="crumb-link active">{service.categoryName}</span>
      </div>

      <div className="details-main-grid">
        {/* Left Column: Visual Media & Descriptions */}
        <div className="details-content-column">
          {/* Large Hero Service Image */}
          <div className="service-hero-media">
            <img 
              src={service.image} 
              alt={service.name} 
              className="details-hero-img"
            />
            <div className="details-hero-overlay"></div>

            {/* Quick Actions Floating in Media */}
            <div className="floating-hero-actions">
              <button 
                className={`circle-action-btn ${isFavorited ? 'favorited' : ''}`}
                onClick={() => toggleFavorite(service.id, service.name)}
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={18} fill={isFavorited ? '#ef4444' : 'none'} color={isFavorited ? '#ef4444' : '#ffffff'} />
              </button>
              <button 
                className="circle-action-btn"
                onClick={handleShare}
                title="Share Service"
              >
                <Share2 size={18} color="#ffffff" />
              </button>
            </div>

            <div className="hero-category-badge">
              <Sparkles size={14} color="#10b981" />
              <span>{service.categoryName}</span>
            </div>
          </div>

          {/* Heading & Metadata */}
          <div className="service-info-header">
            <h1 className="service-title-h1">{service.name}</h1>
            
            <div className="service-meta-strip">
              <div className="meta-badge-pill rating-pill">
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <strong>{service.rating}</strong>
                <span>({reviewsList.length} reviews)</span>
              </div>
              <div className="meta-badge-pill">
                <Clock size={14} color="#10b981" />
                <span>Est. Duration: <strong>{service.duration}</strong></span>
              </div>
              <div className="meta-badge-pill">
                <MapPin size={14} color="#10b981" />
                <span>Area: <strong>{service.location}</strong></span>
              </div>
            </div>
          </div>

          {/* Service Overview */}
          <div className="card-static details-block">
            <h3 className="block-title">Service Description</h3>
            <p className="block-body-text">{service.fullDescription || service.shortDescription}</p>
          </div>

          {/* What is Included */}
          {service.includes && (
            <div className="card-static details-block">
              <h3 className="block-title">What is Included in this Package</h3>
              <div className="inclusions-grid">
                {service.includes.map((item, idx) => (
                  <div key={idx} className="inclusion-item">
                    <CheckCircle2 size={18} color="#10b981" className="inclusion-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phase 2: Problem Selection ("What's the problem?") */}
          <ProblemSelector 
            categoryId={service.categoryId} 
            categoryName={service.categoryName} 
          />

          {/* Phase 2: Provider Matching Engine */}
          <ProviderMatchingSection 
            service={service} 
            selectedProblem={selectedProblem} 
          />

          {/* Provider Spotlight Card */}
          <div className="card-static provider-spotlight-card">
            <div className="spotlight-header">
              <h3 className="block-title">Assigned Lead Specialist</h3>
              <span className="badge badge-verified">Licensed & Insured</span>
            </div>
            
            <div className="spotlight-body">
              <img src={provider.image} alt={provider.name} className="spotlight-avatar" />
              <div className="spotlight-info">
                <div className="spotlight-name-row">
                  <h4>{provider.name}</h4>
                  <ShieldCheck size={18} color="#10b981" />
                </div>
                <p className="spotlight-service">{provider.service}</p>
                <div className="spotlight-metrics">
                  <span>★ {provider.rating} Rating</span>
                  <span>•</span>
                  <span>{provider.experience} Exp</span>
                  <span>•</span>
                  <span>{provider.completedJobs || 300}+ Completed Jobs</span>
                </div>
                <p className="spotlight-bio">{provider.bio}</p>
              </div>
            </div>

            <div className="spotlight-footer">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => openChatModal(provider)}
              >
                <MessageSquare size={15} />
                <span>Chat with {provider.name.split(' ')[0]}</span>
              </button>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => navigateTo('provider-details', { providerId: provider.id })}
              >
                <span>View Full Provider Profile</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          {service.faqs && (
            <div className="card-static details-block">
              <h3 className="block-title">Frequently Asked Questions</h3>
              <div className="faq-list">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="faq-item">
                    <h5 className="faq-question">
                      <HelpCircle size={16} color="#10b981" />
                      <span>{faq.q}</span>
                    </h5>
                    <p className="faq-answer">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews & Ratings Section */}
          <div className="card-static details-block">
            <div className="reviews-header-row">
              <div>
                <h3 className="block-title">Customer Reviews & Ratings</h3>
                <p className="section-subtitle">Real verified feedback from ServiGo clients</p>
              </div>
              <div className="big-rating-box">
                <span className="big-score">{service.rating}</span>
                <div className="stars-group">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                  <span className="stars-caption">5-Star Average</span>
                </div>
              </div>
            </div>

            {/* Post a Review Form */}
            <form onSubmit={handleAddReview} className="add-review-form">
              <label className="input-label">Share your experience with this service:</label>
              <div className="rating-select-row">
                <span>Select rating:</span>
                {[5, 4, 3, 2, 1].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNewReviewRating(num)}
                    className={`star-select-btn ${newReviewRating === num ? 'active' : ''}`}
                  >
                    ★ {num}
                  </button>
                ))}
              </div>
              <textarea
                rows="2"
                required
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Write a review about punctuality, quality, and professionalism..."
                className="input-field"
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
                Post Verified Review
              </button>
            </form>

            {/* Reviews List */}
            <div className="reviews-feed">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="review-card">
                  <div className="review-top">
                    <div>
                      <span className="reviewer-name">{rev.author}</span>
                      <span className="review-date">{rev.date}</span>
                    </div>
                    <div className="review-stars">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Box */}
        <div className="details-sidebar-column">
          <div className="card sticky-booking-card">
            <div className="booking-card-top">
              <span className="pricing-title">Standard Transparent Pricing</span>
              <div className="sticky-price-row">
                <span className="sticky-currency">$</span>
                <span className="sticky-amount">{service.startingPrice}</span>
                <span className="sticky-tag">/ base fixed rate</span>
              </div>
            </div>

            <div className="booking-card-perks">
              <div className="perk-row">
                <CheckCircle2 size={16} color="#10b981" />
                <span>Next available slot: <strong>{service.availability}</strong></span>
              </div>
              <div className="perk-row">
                <ShieldCheck size={16} color="#10b981" />
                <span>$1M insurance & escrow guarantee</span>
              </div>
              <div className="perk-row">
                <Clock size={16} color="#10b981" />
                <span>30-Day rework satisfaction guarantee</span>
              </div>
            </div>

            {selectedProblem && (
              <div className="sidebar-problem-indicator">
                <span className="spi-label">Selected Issue:</span>
                <span className="spi-val">⚡ {selectedProblem.title}</span>
              </div>
            )}

            {/* Action Buttons requested in spec */}
            <div className="sticky-actions-stack">
              <button 
                onClick={() => openBookingModal(service, provider, selectedProblem)}
                className="btn btn-primary btn-lg btn-glow w-100"
              >
                <span>Book Now</span>
              </button>

              <button 
                onClick={() => openBookingModal(service, provider, selectedProblem)}
                className="btn btn-secondary btn-lg w-100"
              >
                <Calendar size={16} />
                <span>Schedule for Later</span>
              </button>

              <button 
                onClick={() => openQuoteModal(service, provider)}
                className="btn btn-outline btn-lg w-100"
              >
                <FileText size={16} />
                <span>Request Custom Quote</span>
              </button>

              <button 
                onClick={() => openChatModal(provider)}
                className="btn btn-secondary w-100"
              >
                <MessageSquare size={16} />
                <span>Contact Provider ({provider.name})</span>
              </button>

              <button 
                onClick={() => toggleFavorite(service.id, service.name)}
                className="btn btn-secondary w-100 favorite-toggle-cta"
              >
                <Heart size={16} fill={isFavorited ? '#ef4444' : 'none'} color={isFavorited ? '#ef4444' : 'currentColor'} />
                <span>{isFavorited ? 'Saved in Favorites' : 'Add to Favorites'}</span>
              </button>
            </div>

            <div className="emergency-direct-call">
              <span>Need this right now under 20 mins?</span>
              <a href="tel:+18007378446" className="direct-call-btn">
                <Phone size={14} /> 1-800-SERVI-GO
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Services Section */}
      {similarServices.length > 0 && (
        <section className="similar-services-section">
          <div className="section-header-row" style={{ marginBottom: '1.5rem' }}>
            <div>
              <span className="section-eyebrow">Recommendations</span>
              <h3 className="section-title">Similar Services in {service.categoryName}</h3>
            </div>
          </div>
          <div className="services-grid">
            {similarServices.map((simService) => (
              <ServiceCard key={simService.id} service={simService} />
            ))}
          </div>
        </section>
      )}

      {/* Embedded Styles */}
      <style>{`
        .service-details-root {
          padding-top: 2rem;
          padding-bottom: 4rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.825rem;
          color: var(--text-muted);
        }
        .crumb-link {
          color: var(--text-muted);
          transition: color var(--transition-fast);
        }
        .crumb-link:hover {
          color: var(--accent-primary);
        }
        .crumb-link.active {
          color: var(--text-primary);
          font-weight: 600;
        }

        .details-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: flex-start;
        }
        @media (min-width: 1024px) {
          .details-main-grid {
            grid-template-columns: 1fr 380px;
          }
        }

        .details-content-column {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .service-hero-media {
          position: relative;
          width: 100%;
          height: 380px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
        }
        @media (min-width: 768px) {
          .service-hero-media {
            height: 440px;
          }
        }

        .details-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .details-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(9, 12, 11, 0.8) 100%);
        }

        .floating-hero-actions {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          display: flex;
          gap: 0.65rem;
          z-index: 2;
        }

        .circle-action-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(15, 20, 18, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-fast);
        }
        .circle-action-btn:hover {
          transform: scale(1.1);
        }

        .hero-category-badge {
          position: absolute;
          bottom: 1.25rem;
          left: 1.25rem;
          background: rgba(9, 12, 11, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-subtle);
          color: var(--accent-neon);
          font-size: 0.825rem;
          font-weight: 700;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .service-info-header {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .service-title-h1 {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          line-height: 1.2;
        }

        .service-meta-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .meta-badge-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.825rem;
          color: var(--text-secondary);
        }

        .details-block {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .block-title {
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .block-body-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--text-secondary);
        }

        .inclusions-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        @media (min-width: 600px) {
          .inclusions-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .inclusion-item {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
          background: var(--bg-input);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }
        .inclusion-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Provider Spotlight */
        .provider-spotlight-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .spotlight-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .spotlight-body {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }

        .spotlight-avatar {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-lg);
          object-fit: cover;
          border: 2px solid var(--accent-primary);
          flex-shrink: 0;
        }

        .spotlight-info {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .spotlight-name-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }
        .spotlight-name-row h4 {
          font-size: 1.15rem;
        }

        .spotlight-service {
          font-size: 0.85rem;
          color: var(--accent-primary);
          font-weight: 600;
        }

        .spotlight-metrics {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .spotlight-bio {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-top: 0.3rem;
        }

        .spotlight-footer {
          display: flex;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
          flex-wrap: wrap;
        }

        /* FAQ */
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .faq-item {
          background: var(--bg-input);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }
        .faq-question {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          color: var(--text-primary);
          margin-bottom: 0.4rem;
        }
        .faq-answer {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* Reviews */
        .reviews-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1rem;
        }

        .big-rating-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .big-score {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--accent-primary);
          line-height: 1;
        }
        .stars-caption {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .add-review-form {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .rating-select-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .star-select-btn {
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          font-size: 0.775rem;
          color: var(--text-muted);
        }
        .star-select-btn.active {
          border-color: #f59e0b;
          color: #f59e0b;
          font-weight: 700;
        }

        .reviews-feed {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .review-card {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1rem;
        }
        .review-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .reviewer-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
          display: block;
        }
        .review-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .review-comment {
          font-size: 0.85rem;
          line-height: 1.5;
          color: var(--text-secondary);
        }

        /* Sticky Booking Card */
        .sticky-booking-card {
          position: sticky;
          top: 90px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1.75rem;
        }

        .sticky-price-row {
          display: flex;
          align-items: baseline;
          margin-top: 0.25rem;
        }
        .pricing-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .sticky-currency {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--accent-primary);
        }
        .sticky-amount {
          font-family: var(--font-heading);
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }
        .sticky-tag {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-left: 0.4rem;
        }

        .booking-card-perks {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.85rem 0;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }
        .perk-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.825rem;
          color: var(--text-secondary);
        }

        .sticky-actions-stack {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .w-100 {
          width: 100%;
        }

        .emergency-direct-call {
          text-align: center;
          font-size: 0.775rem;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .direct-call-btn {
          color: #f87171;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
        }

        .similar-services-section {
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
};
