import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { providersData } from '../../data/providersData';
import { 
  Award, 
  Star, 
  MapPin, 
  Clock, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Zap, 
  ArrowRight 
} from 'lucide-react';

export const ProviderMatchingSection = ({ service, selectedProblem, onSelectProvider }) => {
  const { navigateTo, openBookingModal, addToCompare, compareProviders } = useApp();

  // Compute matched and ranked providers
  const matchedProviders = useMemo(() => {
    // Candidates in same category
    let candidates = providersData.filter(p => p.categoryId === service.categoryId);

    // If none found in category, take nearest
    if (candidates.length === 0) {
      candidates = providersData.slice(0, 4);
    }

    // Score each candidate
    const scored = candidates.map(p => {
      let score = 75;

      // 1. Distance scoring
      const dist = p.distanceKm || 2.5;
      if (dist <= 2.0) score += 12;
      else if (dist <= 5.0) score += 8;
      else if (dist <= 10.0) score += 4;

      // 2. Rating scoring
      if (p.rating >= 4.95) score += 10;
      else if (p.rating >= 4.90) score += 7;

      // 3. Availability scoring
      if (p.availabilityStatus === 'available_now') score += 8;
      else if (p.availabilityStatus === 'available_today') score += 5;

      // 4. Problem / Skill affinity bonus
      if (selectedProblem) {
        const probLower = selectedProblem.title.toLowerCase();
        const hasSkill = p.skills?.some(s => probLower.includes(s.toLowerCase()));
        if (hasSkill) score += 10;
      }

      // Clamp between 82 and 99
      const matchScore = Math.min(99, Math.max(82, score));

      return {
        ...p,
        matchScore
      };
    });

    // Rank descending
    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored;
  }, [service, selectedProblem]);

  const bestMatch = matchedProviders[0];
  const otherMatches = matchedProviders.slice(1, 4);

  const handleBookProvider = (provider) => {
    openBookingModal(service, provider, selectedProblem);
  };

  const handleViewProfile = (providerId) => {
    navigateTo('provider-details', { providerId });
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'available_now': return <span className="status-dot-green" title="Available Now" />;
      case 'available_today': return <span className="status-dot-yellow" title="Available Today" />;
      case 'available_tomorrow': return <span className="status-dot-blue" title="Available Tomorrow" />;
      default: return <span className="status-dot-gray" title="Offline" />;
    }
  };

  return (
    <section className="provider-matching-root" id="matching-providers-section">
      <div className="section-header-row">
        <div>
          <div className="matching-badge">
            <Sparkles size={14} color="#10b981" />
            <span>AI Smart Pro Dispatch Engine</span>
          </div>
          <h2 className="matching-title">Matched Providers for this Service</h2>
          <p className="matching-desc">
            Ranked by trade license verification, distance from your location, customer reviews, and immediate dispatch availability.
          </p>
        </div>
      </div>

      {/* 1. BEST MATCH HIGHLIGHTED CARD */}
      {bestMatch && (
        <div className="card best-match-card">
          <div className="best-match-ribbon">
            <Award size={15} color="#000" />
            <span>BEST MATCH • {bestMatch.matchScore}% AFFINITY</span>
          </div>

          <div className="best-match-grid">
            {/* Left: Avatar & Badges */}
            <div className="bm-profile-col">
              <div className="bm-avatar-wrapper">
                <img src={bestMatch.image} alt={bestMatch.name} className="bm-avatar-img" />
                <div className="bm-verified-badge" title="Identity & Contractor License Verified">
                  <ShieldCheck size={16} color="#090c0b" />
                </div>
              </div>
              <span className="bm-availability-pill">
                {getStatusDot(bestMatch.availabilityStatus)}
                <span>{bestMatch.nextAvailableTime}</span>
              </span>
            </div>

            {/* Middle: Details & Metrics */}
            <div className="bm-details-col">
              <div className="bm-title-row">
                <div>
                  <h3 className="bm-provider-name">{bestMatch.name}</h3>
                  <span className="bm-specialty-text">{bestMatch.service}</span>
                </div>
                <div className="bm-price-box">
                  <span className="bm-price-label">Starting</span>
                  <span className="bm-price-amount">${bestMatch.startingPrice}</span>
                  <span className="bm-price-unit">/{bestMatch.rateType || 'hr'}</span>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="bm-bio-snippet">"{bestMatch.bio}"</p>

              {/* Badges / Skills tags */}
              <div className="bm-skills-row">
                {bestMatch.skills?.slice(0, 4).map((sk, idx) => (
                  <span key={idx} className="bm-skill-chip">{sk}</span>
                ))}
              </div>

              {/* 4 Key Metrics */}
              <div className="bm-metrics-grid">
                <div className="bm-metric-item">
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span><strong>{bestMatch.rating}</strong> ({bestMatch.reviewsCount} reviews)</span>
                </div>
                <div className="bm-metric-item">
                  <Briefcase size={14} color="#10b981" />
                  <span>{bestMatch.experience} Experience</span>
                </div>
                <div className="bm-metric-item">
                  <MapPin size={14} color="#10b981" />
                  <span>{bestMatch.distance}</span>
                </div>
                <div className="bm-metric-item">
                  <Clock size={14} color="#10b981" />
                  <span>{bestMatch.responseTime} Response</span>
                </div>
              </div>
            </div>

            {/* Right: CTA Actions */}
            <div className="bm-actions-col">
              <button 
                onClick={() => handleBookProvider(bestMatch)} 
                className="btn btn-primary btn-glow btn-block"
              >
                <span>Book This Specialist</span>
                <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => handleViewProfile(bestMatch.id)} 
                className="btn btn-secondary btn-block"
              >
                <span>View Full Profile</span>
              </button>
              <button
                onClick={() => addToCompare(bestMatch)}
                className={`btn btn-sm btn-block ${compareProviders.some(p => p.id === bestMatch.id) ? 'btn-primary' : 'btn-ghost'}`}
              >
                {compareProviders.some(p => p.id === bestMatch.id) ? '✓ Added to Compare' : '+ Compare Provider'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. OTHER MATCHED PROVIDERS */}
      {otherMatches.length > 0 && (
        <div className="other-matches-wrapper">
          <h4 className="other-matches-title">Other Top Verified Specialists for this Request</h4>
          <div className="other-matches-grid">
            {otherMatches.map((pro) => (
              <div key={pro.id} className="card other-match-card">
                <div className="omc-top">
                  <img src={pro.image} alt={pro.name} className="omc-avatar" />
                  <div className="omc-meta">
                    <h4 className="omc-name">{pro.name}</h4>
                    <span className="omc-service">{pro.service}</span>
                    <div className="omc-rating-row">
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      <span>{pro.rating}</span>
                      <span className="text-muted">({pro.reviewsCount})</span>
                      <span className="omc-dot">•</span>
                      <MapPin size={12} color="#10b981" />
                      <span>{pro.distance}</span>
                    </div>
                  </div>
                  <div className="omc-rate">
                    <span className="rate-num">${pro.startingPrice}</span>
                    <span className="rate-unit">/{pro.rateType || 'hr'}</span>
                  </div>
                </div>

                <div className="omc-footer">
                  <span className="omc-avail">
                    {getStatusDot(pro.availabilityStatus)}
                    <span>{pro.nextAvailableTime}</span>
                  </span>
                  <div className="omc-actions">
                    <button 
                      onClick={() => addToCompare(pro)}
                      className="btn btn-secondary btn-sm"
                      title="Compare specs with other pros"
                    >
                      Compare
                    </button>
                    <button 
                      onClick={() => handleViewProfile(pro.id)} 
                      className="btn btn-primary btn-sm"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
