import React from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCard } from '../cards/ServiceCard';
import { ProviderCard } from '../cards/ProviderCard';
import { History, ArrowRight } from 'lucide-react';

export const RecentlyViewedSection = () => {
  const { recentlyViewedServices, recentlyViewedProviders, navigateTo } = useApp();

  if ((!recentlyViewedServices || recentlyViewedServices.length === 0) &&
      (!recentlyViewedProviders || recentlyViewedProviders.length === 0)) {
    return null;
  }

  return (
    <section className="recently-viewed-section">
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-badge-pill">
            <History size={14} color="#10b981" />
            <span>Continue Browsing</span>
          </div>
          <div className="section-heading-row">
            <div>
              <h2 className="section-main-title">Recently Viewed</h2>
              <p className="section-main-desc">Pick up where you left off from your recent explorations.</p>
            </div>
          </div>
        </div>

        {recentlyViewedServices.length > 0 && (
          <div className="recent-carousel-wrap">
            <h4 className="recent-sub-heading">Recently Viewed Services</h4>
            <div className="recent-grid-row">
              {recentlyViewedServices.slice(0, 4).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}

        {recentlyViewedProviders.length > 0 && (
          <div className="recent-carousel-wrap" style={{ marginTop: '2rem' }}>
            <h4 className="recent-sub-heading">Recently Viewed Specialists</h4>
            <div className="recent-grid-row">
              {recentlyViewedProviders.slice(0, 3).map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
