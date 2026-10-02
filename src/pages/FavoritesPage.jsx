import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { servicesData } from '../data/servicesData';
import { providersData } from '../data/providersData';
import { ServiceCard } from '../components/cards/ServiceCard';
import { ProviderCard } from '../components/cards/ProviderCard';
import { Heart, Briefcase, Users, ArrowRight, Sparkles } from 'lucide-react';

export const FavoritesPage = () => {
  const { favorites, providerFavorites, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'providers'

  const favoritedServices = servicesData.filter(s => favorites.includes(s.id));
  const favoritedProviders = providersData.filter(p => providerFavorites?.includes(p.id));

  return (
    <div className="favorites-page-root container">
      {/* Top Banner */}
      <div className="favorites-header-banner">
        <div className="fav-title-group">
          <div className="badge badge-verified">
            <Heart size={14} color="#ef4444" fill="#ef4444" />
            <span>Personal Bookmarks</span>
          </div>
          <h1 className="fav-page-title">My Saved Favorites</h1>
          <p className="fav-page-subtitle">
            Quickly re-book your preferred services and certified local specialists.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="favorites-tabs-row">
          <button
            onClick={() => setActiveTab('services')}
            className={`fav-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          >
            <Briefcase size={16} />
            <span>Saved Services</span>
            <span className="tab-pill-count">{favoritedServices.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`fav-tab-btn ${activeTab === 'providers' ? 'active' : ''}`}
          >
            <Users size={16} />
            <span>Saved Specialists</span>
            <span className="tab-pill-count">{favoritedProviders.length}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="favorites-main-content">
        {/* TAB 1: SAVED SERVICES */}
        {activeTab === 'services' && (
          <div>
            {favoritedServices.length === 0 ? (
              <div className="empty-fav-state">
                <Heart size={44} color="#64748b" />
                <h3>No Saved Services Yet</h3>
                <p>Click the heart icon on any service card to bookmark it for quick booking.</p>
                <button onClick={() => navigateTo('services')} className="btn btn-primary btn-glow">
                  <span>Explore Marketplace Services</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="services-cards-grid">
                {favoritedServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED PROVIDERS */}
        {activeTab === 'providers' && (
          <div>
            {favoritedProviders.length === 0 ? (
              <div className="empty-fav-state">
                <Users size={44} color="#64748b" />
                <h3>No Saved Specialists Yet</h3>
                <p>Bookmark high-rated local technicians so you can hire them again with one click.</p>
                <button onClick={() => navigateTo('providers')} className="btn btn-primary btn-glow">
                  <span>Browse Nearby Providers</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="providers-grid-layout">
                {favoritedProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
