import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { categoriesData } from '../data/categoriesData';
import { servicesData } from '../data/servicesData';
import { providersData } from '../data/providersData';
import { ServiceCard } from '../components/cards/ServiceCard';
import { ProviderCard } from '../components/cards/ProviderCard';
import { SpecialtyCardsSection } from '../components/services/SpecialtyCardsSection';
import { RecentlyViewedSection } from '../components/home/RecentlyViewedSection';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Wrench, 
  Flame, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Award,
  PhoneCall,
  Star
} from 'lucide-react';

export const HomePage = () => {
  const { 
    navigateTo, 
    searchQuery, 
    setSearchQuery, 
    searchLocation, 
    setSearchLocation, 
    setSelectedCategory,
    openBookingModal
  } = useApp();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localLoc, setLocalLoc] = useState(searchLocation);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setSearchLocation(localLoc);
    navigateTo('services');
  };

  // Filter sections
  const popularServices = servicesData.filter(s => s.popular).slice(0, 6);
  const trendingServices = servicesData.filter(s => s.trending).slice(0, 6);
  const recommendedServices = servicesData.slice(0, 4);
  const topRatedProviders = providersData.filter(p => p.rating >= 4.93).slice(0, 4);
  const nearbyProviders = providersData.slice(4, 8);

  return (
    <div className="home-page-root">
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="hero-section">
        <div className="hero-glow-blob blob-1"></div>
        <div className="hero-glow-blob blob-2"></div>

        <div className="container hero-container">
          <div className="hero-badge-pill">
            <span className="live-pulse"></span>
            <Sparkles size={14} color="#10b981" />
            <span>Over 2,400+ Verified Service Pros On-Demand</span>
          </div>

          <h1 className="hero-title">
            Find Trusted <span className="hero-highlight">Professionals</span> Near You
          </h1>

          <p className="hero-subtitle">
            Book top-rated home cleaning, electricians, plumbers, car care, and emergency services in minutes with escrow-backed protection.
          </p>

          {/* Unified Search Engine Bar */}
          <form onSubmit={handleSearchSubmit} className="hero-search-card">
            <div className="search-input-group service-input">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="What service do you need? (e.g. AC Jet Wash, Deep Clean, Plumbing)"
                className="hero-input"
              />
            </div>

            <div className="search-divider"></div>

            <div className="search-input-group location-input">
              <MapPin size={20} className="search-icon" />
              <input 
                type="text" 
                value={localLoc}
                onChange={(e) => setLocalLoc(e.target.value)}
                placeholder="Enter your location (e.g. Downtown Metro)"
                className="hero-input"
              />
            </div>

            <div className="search-actions-group">
              <button type="submit" className="btn btn-primary btn-lg hero-search-btn">
                <Search size={18} />
                <span>Search Services</span>
              </button>
              <button 
                type="button" 
                onClick={() => openBookingModal(popularServices[0])}
                className="btn btn-secondary btn-lg hero-book-btn"
              >
                <span>Book Now</span>
              </button>
            </div>
          </form>

          {/* Trending Searches Tags */}
          <div className="trending-tags-row">
            <span className="tags-label"><Flame size={14} color="#f59e0b" /> Popular Right Now:</span>
            {['Home Deep Cleaning', 'Emergency AC Repair', 'Master Electrician', 'Car Detailing', 'Plumbing Burst'].map((tag, i) => (
              <button 
                key={i} 
                onClick={() => {
                  setSearchQuery(tag);
                  navigateTo('services');
                }}
                className="trending-tag-btn"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Quick Metrics Bar */}
          <div className="hero-stats-row">
            <div className="hero-stat-card">
              <ShieldCheck size={20} color="#10b981" />
              <div>
                <strong>100% Verified</strong>
                <span>Background checked</span>
              </div>
            </div>
            <div className="hero-stat-card">
              <Zap size={20} color="#10b981" />
              <div>
                <strong>20-Min Emergency</strong>
                <span>Fastest response citywide</span>
              </div>
            </div>
            <div className="hero-stat-card">
              <Clock size={20} color="#10b981" />
              <div>
                <strong>Upfront Fixed Pricing</strong>
                <span>No hidden surprises</span>
              </div>
            </div>
            <div className="hero-stat-card">
              <Award size={20} color="#10b981" />
              <div>
                <strong>$1M Protection</strong>
                <span>Satisfaction guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EMERGENCY RAPID DISPATCH BANNER
          ========================================================================= */}
      <section className="container emergency-section">
        <div className="emergency-banner-card">
          <div className="emergency-left">
            <div className="emergency-badge">
              <span className="live-pulse danger-pulse"></span>
              <span className="badge-text">24/7 Rapid Response Unit</span>
            </div>
            <h3 className="emergency-title">Facing an Urgent Electrical Hazard or Water Pipe Burst?</h3>
            <p className="emergency-desc">
              Immediate on-call technician dispatch with an average arrival time under 20 minutes. No waiting, licensed master plumbers and electricians.
            </p>
          </div>
          <div className="emergency-cta-group">
            <button 
              onClick={() => {
                setSelectedCategory('emergency-services');
                navigateTo('services');
              }}
              className="btn btn-danger btn-lg emergency-action-btn"
            >
              <Zap size={18} />
              <span>Dispatch Emergency Pro Now</span>
            </button>
            <a href="tel:+18007378446" className="emergency-call-link">
              <PhoneCall size={16} />
              <span>Direct Emergency Helpline: 1-800-SERVI-GO</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EXPLORE OUR SERVICES - RECTANGULAR 2D ANIMATED SPECIALTY CARDS
          ========================================================================= */}
      <SpecialtyCardsSection />

      {/* =========================================================================
          POPULAR SERVICES SECTION
          ========================================================================= */}
      <section className="container section-block">
        <div className="section-header-row">
          <div>
            <div className="badge badge-verified" style={{ marginBottom: '0.4rem' }}>
              <Flame size={12} /> Most Booked This Week
            </div>
            <h2 className="section-title">Popular Services</h2>
            <p className="section-subtitle">Top rated by hundreds of happy customers across the metro area</p>
          </div>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => navigateTo('services')}
          >
            <span>Browse All Services</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="services-grid">
          {popularServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          TOP RATED PROVIDERS SECTION
          ========================================================================= */}
      <section className="container section-block">
        <div className="section-header-row">
          <div>
            <div className="badge badge-verified" style={{ marginBottom: '0.4rem' }}>
              <Award size={12} /> Top Rated Specialists
            </div>
            <h2 className="section-title">Top Rated Service Providers</h2>
            <p className="section-subtitle">Highest client satisfaction ratings, verified credentials, and flawless track records</p>
          </div>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => navigateTo('providers')}
          >
            <span>View All 30+ Providers</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="providers-grid">
          {topRatedProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          NEARBY PROVIDERS SECTION
          ========================================================================= */}
      <section className="container section-block">
        <div className="section-header-row">
          <div>
            <div className="badge badge-rating" style={{ marginBottom: '0.4rem' }}>
              <MapPin size={12} /> Proximity Based
            </div>
            <h2 className="section-title">Nearby Providers</h2>
            <p className="section-subtitle">Active specialists in your local zone ready for immediate or same-day scheduling</p>
          </div>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => navigateTo('providers')}
          >
            <span>Explore Map & Directory</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="providers-grid">
          {nearbyProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          TRENDING SERVICES SECTION
          ========================================================================= */}
      <section className="container section-block">
        <div className="section-header-row">
          <div>
            <div className="badge badge-verified" style={{ marginBottom: '0.4rem' }}>
              <TrendingUp size={12} /> High Demand
            </div>
            <h2 className="section-title">Trending Services</h2>
            <p className="section-subtitle">Seasonal and highly-requested home and lifestyle maintenance services</p>
          </div>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => navigateTo('services')}
          >
            <span>Explore All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="services-grid">
          {trendingServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          RECOMMENDED FOR YOU SECTION (PHASE 2)
          ========================================================================= */}
      <section className="container section-block">
        <div className="section-header-row">
          <div>
            <div className="badge badge-verified" style={{ marginBottom: '0.4rem' }}>
              <Sparkles size={12} color="#10b981" /> Tailored For Your Home
            </div>
            <h2 className="section-title">Recommended For You</h2>
            <p className="section-subtitle">Personalized suggestions based on popular neighborhood bookings in {searchLocation}</p>
          </div>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => navigateTo('services')}
          >
            <span>Browse Recommendations</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="services-grid">
          {servicesData.slice(10, 14).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          RECENTLY VIEWED SECTION (PHASE 2)
          ========================================================================= */}
      <RecentlyViewedSection />

      {/* =========================================================================
          HOW IT WORKS
          ========================================================================= */}
      <section className="container section-block">
        <div className="how-it-works-card">
          <div className="how-header">
            <span className="section-eyebrow">Seamless Service Execution</span>
            <h3 className="section-title">How ServiGo Works in 3 Simple Steps</h3>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h4>Discover & Compare</h4>
              <p>Search over 30+ service categories. Compare verified provider ratings, prices, and verified badges.</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h4>Instant Booking & Escrow</h4>
              <p>Select your preferred arrival slot. Payment is held safely in escrow until you approve completed work.</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h4>Live Tracking & Guarantee</h4>
              <p>Track your technician live on map. Enjoy 30-day rework satisfaction guarantee on every single booking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style>{`
        .home-page-root {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        /* Hero */
        .hero-section {
          position: relative;
          padding: 4.5rem 0 3.5rem;
          overflow: hidden;
          background: radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 60%);
        }

        .hero-glow-blob {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
        }
        .blob-1 {
          top: -100px;
          left: -100px;
          background: var(--accent-primary);
        }
        .blob-2 {
          top: 100px;
          right: -100px;
          background: #00e676;
        }

        .hero-container {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .hero-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid var(--border-subtle);
          color: var(--accent-neon);
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.4rem 1rem;
          border-radius: var(--radius-full);
          margin-bottom: 1.5rem;
        }

        .live-pulse {
          width: 8px;
          height: 8px;
          background: var(--accent-neon);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--accent-neon);
          animation: pulse 1.5s infinite;
        }
        .danger-pulse {
          background: #ef4444;
          box-shadow: 0 0 10px #ef4444;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .hero-title {
          font-size: clamp(2.35rem, 5vw, 4.25rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
          max-width: 900px;
          line-height: 1.15;
        }

        .hero-highlight {
          color: var(--accent-primary);
          text-shadow: 0 0 30px rgba(16, 185, 129, 0.35);
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: var(--text-secondary);
          max-width: 720px;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        /* Hero Search Bar */
        .hero-search-card {
          width: 100%;
          max-width: 960px;
          background: var(--bg-card);
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-xl);
          padding: 0.65rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(16, 185, 129, 0.12);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .hero-search-card:focus-within {
          border-color: var(--accent-primary);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(16, 185, 129, 0.25);
        }
        @media (min-width: 860px) {
          .hero-search-card {
            flex-direction: row;
            align-items: center;
            padding: 0.5rem 0.65rem;
          }
        }

        .search-input-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 1rem;
        }
        .service-input {
          flex: 1.6;
        }
        .location-input {
          flex: 1;
        }

        .search-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .hero-input {
          width: 100%;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
        }
        .hero-input::placeholder {
          color: var(--text-muted);
        }

        .search-divider {
          display: none;
          width: 1px;
          height: 36px;
          background: var(--border-color);
        }
        @media (min-width: 860px) {
          .search-divider {
            display: block;
          }
        }

        .search-actions-group {
          display: flex;
          gap: 0.5rem;
        }
        .hero-search-btn {
          flex: 1;
        }
        .hero-book-btn {
          white-space: nowrap;
        }

        /* Trending Tags */
        .trending-tags-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }
        .tags-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 600;
        }
        .trending-tag-btn {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 0.775rem;
          font-weight: 500;
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          transition: all var(--transition-fast);
        }
        .trending-tag-btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          background: var(--accent-light);
        }

        /* Hero Stats */
        .hero-stats-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          width: 100%;
          max-width: 960px;
          margin-top: 2.75rem;
        }
        @media (min-width: 768px) {
          .hero-stats-row {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .hero-stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-align: left;
        }
        .hero-stat-card strong {
          display: block;
          font-size: 0.85rem;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .hero-stat-card span {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        /* Emergency Section */
        .emergency-banner-card {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(15, 20, 18, 0.95));
          border: 1.5px solid rgba(239, 68, 68, 0.35);
          border-radius: var(--radius-xl);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          box-shadow: 0 10px 30px rgba(239, 68, 68, 0.15);
        }
        @media (min-width: 860px) {
          .emergency-banner-card {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .emergency-left {
          flex: 1;
        }
        .emergency-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #f87171;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          margin-bottom: 0.75rem;
        }
        .emergency-title {
          font-size: clamp(1.25rem, 2.5vw, 1.6rem);
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        .emergency-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          max-width: 650px;
          line-height: 1.5;
        }

        .emergency-cta-group {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          align-items: flex-start;
        }
        .emergency-action-btn {
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
        }
        .emergency-call-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          transition: color var(--transition-fast);
        }
        .emergency-call-link:hover {
          color: #f87171;
        }

        /* Section Layouts */
        .section-block {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .section-header-row {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: flex-start;
          justify-content: space-between;
        }
        @media (min-width: 640px) {
          .section-header-row {
            flex-direction: row;
            align-items: flex-end;
          }
        }

        .section-eyebrow {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--accent-primary);
          font-weight: 700;
          display: block;
          margin-bottom: 0.25rem;
        }

        .section-title {
          font-size: clamp(1.5rem, 3vw, 2.2rem);
        }

        .section-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        /* Categories Grid */
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .categories-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .categories-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (min-width: 1200px) {
          .categories-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }

        .category-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-normal);
          display: flex;
          flex-direction: column;
        }
        .category-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }

        .category-img-box {
          position: relative;
          height: 100px;
          overflow: hidden;
        }
        .category-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .category-card:hover .category-img {
          transform: scale(1.1);
        }
        .category-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(9, 12, 11, 0.7) 100%);
        }

        .category-content {
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .category-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.25;
        }
        .category-count {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .category-arrow {
          position: absolute;
          right: 0.85rem;
          bottom: 0.85rem;
          color: var(--accent-primary);
          opacity: 0;
          transform: translateX(-5px);
          transition: all var(--transition-fast);
        }
        .category-card:hover .category-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Services & Providers Grids */
        .services-grid, .providers-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .services-grid, .providers-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .providers-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* How it works */
        .how-it-works-card {
          background: var(--bg-card-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          padding: 3rem 2rem;
          text-align: center;
        }
        .how-header {
          margin-bottom: 2.5rem;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          text-align: left;
        }
        @media (min-width: 768px) {
          .steps-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .step-card {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: relative;
        }
        .step-number {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--accent-primary);
          opacity: 0.3;
          line-height: 1;
        }
        .step-card h4 {
          font-size: 1.15rem;
          color: var(--text-primary);
        }
        .step-card p {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};
