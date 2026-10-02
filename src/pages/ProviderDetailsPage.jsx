import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { providersData } from '../data/providersData';
import { servicesData } from '../data/servicesData';
import { ServiceCard } from '../components/cards/ServiceCard';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle, 
  MessageSquare, 
  Award, 
  Briefcase, 
  Calendar,
  ChevronRight,
  Share2,
  CheckCircle2,
  FileCheck,
  Heart,
  SlidersHorizontal,
  TrendingDown,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const ProviderDetailsPage = () => {
  const { 
    pageParams, 
    navigateTo, 
    openBookingModal, 
    openQuoteModal, 
    openChatModal, 
    providerFavorites, 
    toggleProviderFavorite,
    trackViewedProvider,
    addToCompare,
    compareProviders,
    addToast 
  } = useApp();

  const providerId = pageParams.providerId || 'prov-1';
  const provider = providersData.find(p => p.id === providerId) || providersData[0];

  useEffect(() => {
    if (provider) {
      trackViewedProvider(provider);
    }
  }, [provider?.id]);

  const isFavorited = providerFavorites?.includes(provider.id);
  const isInCompare = compareProviders?.some(p => p.id === provider.id);

  // Services offered by this provider
  const providerServices = servicesData.filter(
    s => s.providerId === provider.id || s.categoryId === provider.categoryId
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Provider profile link copied to clipboard!', 'info');
    }
  };

  const handleCall = () => {
    addToast(`Calling ${provider.name} at ${provider.phone}...`, 'info');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available_now':
        return <span className="pro-status-badge status-now">🟢 Available Now</span>;
      case 'available_today':
        return <span className="pro-status-badge status-today">🟡 Available Today</span>;
      case 'available_tomorrow':
        return <span className="pro-status-badge status-tomorrow">🔵 Available Tomorrow</span>;
      default:
        return <span className="pro-status-badge status-offline">⚫ Offline</span>;
    }
  };

  return (
    <div className="provider-details-root container">
      {/* Breadcrumb */}
      <div className="breadcrumb-nav">
        <button onClick={() => navigateTo('home')} className="crumb-link">Home</button>
        <ChevronRight size={14} />
        <button onClick={() => navigateTo('providers')} className="crumb-link">Providers</button>
        <ChevronRight size={14} />
        <span className="crumb-link active">{provider.name}</span>
      </div>

      {/* Hero Banner Header */}
      <div className="card provider-hero-card">
        <div className="provider-hero-main">
          <div className="hero-avatar-wrapper">
            <img src={provider.image} alt={provider.name} className="hero-avatar-img" />
            {provider.verified && (
              <div className="verified-floating-badge" title="Identity & Criminal Record Verified">
                <ShieldCheck size={18} color="#090c0b" />
              </div>
            )}
          </div>

          <div className="hero-details-text">
            <div className="provider-name-headline">
              <h1 className="pro-name-h1">{provider.name}</h1>
              <span className="badge badge-verified">
                <CheckCircle size={12} /> Verified ServiGo Partner
              </span>
              {getStatusBadge(provider.availabilityStatus)}
            </div>

            <p className="pro-headline-service">{provider.service}</p>

            {/* Next Available Time Prompt */}
            <div className="next-avail-row">
              <Clock size={14} color="#10b981" />
              <span>Next Available: <strong>{provider.nextAvailableTime}</strong></span>
              <span className="dot-sep">•</span>
              <MapPin size={14} color="#10b981" />
              <span>Service Area: <strong>{provider.serviceArea || provider.location}</strong></span>
            </div>

            {/* 6 Key Stats Grid */}
            <div className="hero-badges-row">
              <div className="hero-metric-pill">
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <strong>{provider.rating}</strong>
                <span>({provider.reviewsCount} reviews)</span>
              </div>
              <div className="hero-metric-pill">
                <Briefcase size={14} color="#10b981" />
                <span>{provider.experience} Experience</span>
              </div>
              <div className="hero-metric-pill">
                <CheckCircle2 size={14} color="#10b981" />
                <span>{provider.completedJobs}+ Completed Orders</span>
              </div>
              <div className="hero-metric-pill">
                <Clock size={14} color="#38bdf8" />
                <span>Response: {provider.responseTime || '< 15 mins'}</span>
              </div>
              <div className="hero-metric-pill">
                <TrendingDown size={14} color="#10b981" />
                <span>Cancel Rate: {provider.cancellationRate || '0.3%'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Actions and Hourly Rate */}
        <div className="hero-actions-column">
          <div className="hero-rate-box">
            <span className="rate-caption">Starting Rate</span>
            <div className="rate-num-row">
              <span className="rate-currency">$</span>
              <span className="rate-big-num">{provider.startingPrice}</span>
              <span className="rate-period">/{provider.rateType || 'hr'}</span>
            </div>
          </div>

          <div className="hero-btn-stack">
            <button 
              className="btn btn-primary btn-glow w-100"
              onClick={() => openBookingModal(providerServices[0] || servicesData[0], provider)}
            >
              <Calendar size={16} />
              <span>Book Appointment</span>
            </button>

            <button 
              className="btn btn-secondary w-100"
              onClick={() => openChatModal(provider)}
            >
              <MessageSquare size={16} />
              <span>Direct Message</span>
            </button>

            <button 
              className="btn btn-outline btn-sm w-100"
              onClick={handleCall}
            >
              <PhoneCall size={15} />
              <span>Call ({provider.phone})</span>
            </button>

            <div className="hero-sub-actions-row">
              <button 
                onClick={() => toggleProviderFavorite(provider.id, provider.name)}
                className={`btn btn-sm btn-icon ${isFavorited ? 'btn-danger-light' : 'btn-secondary'}`}
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={16} fill={isFavorited ? '#ef4444' : 'none'} color={isFavorited ? '#ef4444' : 'currentColor'} />
                <span>{isFavorited ? 'Saved' : 'Save'}</span>
              </button>

              <button 
                onClick={() => addToCompare(provider)}
                className={`btn btn-sm btn-icon ${isInCompare ? 'btn-primary' : 'btn-secondary'}`}
                title="Compare with other specialists"
              >
                <SlidersHorizontal size={15} />
                <span>{isInCompare ? 'In Compare' : 'Compare'}</span>
              </button>

              <button 
                onClick={handleShare}
                className="btn btn-sm btn-secondary btn-icon"
                title="Share profile"
              >
                <Share2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="provider-layout-grid">
        {/* Left Side: Bio, Verified Credentials, Portfolio */}
        <div className="provider-bio-column">
          {/* Professional Bio */}
          <div className="card-static details-block">
            <h3 className="block-title">About {provider.name}</h3>
            <p className="block-body-text">{provider.bio}</p>
            <p className="block-body-text" style={{ marginTop: '0.5rem' }}>
              Specializes in residential and commercial assignments with dedicated tooling, OEM manufacturer components, and full site cleanup after each job.
            </p>
          </div>

          {/* Trade Skills */}
          {provider.skills && provider.skills.length > 0 && (
            <div className="card-static details-block">
              <h3 className="block-title">Specialized Skills & Competencies</h3>
              <div className="skills-cloud-wrap">
                {provider.skills.map((skill, i) => (
                  <span key={i} className="skill-cloud-chip">
                    <CheckCircle2 size={14} color="#10b981" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Verification & Compliance Badges */}
          <div className="card-static details-block">
            <h3 className="block-title">Credentials & Safety Vetting</h3>
            <div className="credentials-list">
              <div className="credential-row">
                <ShieldCheck size={20} color="#10b981" />
                <div>
                  <strong>Government ID & Identity Verified</strong>
                  <p>National identity and residential address verified via biometric audit.</p>
                </div>
              </div>
              <div className="credential-row">
                <CheckCircle2 size={20} color="#10b981" />
                <div>
                  <strong>Criminal Background Check Clear</strong>
                  <p>Comprehensive 10-year criminal background check conducted annually.</p>
                </div>
              </div>
              <div className="credential-row">
                <FileCheck size={20} color="#10b981" />
                <div>
                  <strong>$1,000,000 General Liability Policy</strong>
                  <p>Every assignment executed is covered under ServiGo Umbrella Insurance.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Offered By This Specialist */}
          <div className="card-static details-block">
            <h3 className="block-title">Services Offered by {provider.name.split(' ')[0]}</h3>
            <div className="provider-services-grid">
              {providerServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Working Territory & Customer Reviews */}
        <div className="provider-sidebar-column">
          <div className="card-static side-info-block">
            <h4 className="side-block-heading">Coverage Territory</h4>
            <div className="side-map-mock">
              <MapPin size={22} color="#10b981" />
              <div>
                <strong>{provider.location}</strong>
                <p>{provider.serviceArea || 'Serving 15km metropolitan radius'}</p>
              </div>
            </div>
            <div className="radius-pill-box">
              <span>Coverage: <strong>Within 15 km</strong></span>
              <span>Avg ETA: <strong>25 Mins</strong></span>
            </div>
          </div>

          <div className="card-static side-info-block">
            <h4 className="side-block-heading">Customer Reviews</h4>
            <div className="pro-reviews-summary">
              <div className="summary-big-rating">
                <span className="big-num">{provider.rating}</span>
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span className="rev-count-sub">Based on {provider.reviewsCount} verified bookings</span>
              </div>
            </div>

            <div className="pro-reviews-feed">
              <div className="pro-rev-item">
                <div className="pro-rev-head">
                  <strong>Sarah K.</strong>
                  <span className="pro-rev-date">2 days ago</span>
                </div>
                <p>"Very knowledgeable pro! Arrived on time, diagnosed the problem in 10 minutes, and did clean work."</p>
              </div>
              <div className="pro-rev-item">
                <div className="pro-rev-head">
                  <strong>Michael P.</strong>
                  <span className="pro-rev-date">1 week ago</span>
                </div>
                <p>"Fair price, high quality parts, and polite demeanor. Will hire again without hesitation."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
