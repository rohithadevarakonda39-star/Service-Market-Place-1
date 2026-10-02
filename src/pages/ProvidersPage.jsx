import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { providersData } from '../data/providersData';
import { categoriesData } from '../data/categoriesData';
import { ProviderCard } from '../components/cards/ProviderCard';
import { 
  Search, 
  ShieldCheck, 
  MapPin, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Star, 
  Users, 
  Clock, 
  Sparkles,
  X,
  Filter
} from 'lucide-react';

export const ProvidersPage = () => {
  const { searchLocation, setSearchLocation } = useApp();

  const [searchPro, setSearchPro] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [distanceRadius, setDistanceRadius] = useState('all'); // 'all', 2, 5, 10
  const [availabilityStatus, setAvailabilityStatus] = useState('all'); // 'all', 'available_now', 'available_today', 'available_tomorrow'
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'jobs', 'price-low', 'distance'

  const handleResetFilters = () => {
    setSearchPro('');
    setSelectedCat('all');
    setDistanceRadius('all');
    setAvailabilityStatus('all');
    setVerifiedOnly(false);
    setSortBy('rating');
  };

  const filteredProviders = useMemo(() => {
    return providersData.filter(provider => {
      // 1. Name or trade search
      if (searchPro.trim()) {
        const q = searchPro.toLowerCase();
        const matchesName = provider.name.toLowerCase().includes(q);
        const matchesService = provider.service.toLowerCase().includes(q);
        const matchesBio = provider.bio.toLowerCase().includes(q);
        const matchesLoc = provider.location.toLowerCase().includes(q);
        const matchesSkill = provider.skills?.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesService && !matchesBio && !matchesLoc && !matchesSkill) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCat !== 'all' && provider.categoryId !== selectedCat) {
        return false;
      }

      // 3. Distance Radius filter
      if (distanceRadius !== 'all') {
        const dist = provider.distanceKm || 2.5;
        if (dist > Number(distanceRadius)) {
          return false;
        }
      }

      // 4. Availability Status filter
      if (availabilityStatus !== 'all' && provider.availabilityStatus !== availabilityStatus) {
        return false;
      }

      // 5. Verified filter
      if (verifiedOnly && !provider.verified) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.startingPrice - b.startingPrice;
      if (sortBy === 'jobs') return (b.completedJobs || 0) - (a.completedJobs || 0);
      if (sortBy === 'distance') return (a.distanceKm || 2.5) - (b.distanceKm || 2.5);
      return 0;
    });
  }, [searchPro, selectedCat, distanceRadius, availabilityStatus, verifiedOnly, sortBy]);

  return (
    <div className="providers-page-root container">
      {/* Header */}
      <div className="providers-header-row">
        <div>
          <div className="badge badge-verified" style={{ marginBottom: '0.4rem' }}>
            <ShieldCheck size={13} color="#10b981" /> {providersData.length} Verified Specialists On-Call
          </div>
          <h1 className="providers-title">Find Nearby Service Specialists</h1>
          <p className="providers-sub">
            Contractors holding state licenses, verified background clearance, and active $1M liability protection.
          </p>
        </div>

        {/* Pro Search Toolbar */}
        <div className="pro-search-bar">
          <div className="pro-input-wrap">
            <Search size={18} color="#10b981" />
            <input 
              type="text" 
              value={searchPro}
              onChange={(e) => setSearchPro(e.target.value)}
              placeholder="Search provider by name, skill, or area..."
              className="pro-search-input"
            />
            {searchPro && (
              <button className="clear-btn" onClick={() => setSearchPro('')} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="pro-sort-wrap">
            <ArrowUpDown size={15} color="#94a3b8" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="pro-sort-select"
            >
              <option value="rating">Top Rated (4.9+ ★)</option>
              <option value="distance">Nearest Distance</option>
              <option value="jobs">Most Orders Completed</option>
              <option value="price-low">Lowest Starting Rate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Near You & Distance Radius Filter Bar */}
      <div className="nearby-controls-bar">
        <div className="nearby-label-box">
          <MapPin size={16} color="#10b981" />
          <span>Providers Near <strong>{searchLocation}</strong>:</span>
        </div>
        <div className="distance-chips-group">
          {[
            { id: 'all', label: 'All Distances' },
            { id: '2', label: 'Within 2 km' },
            { id: '5', label: 'Within 5 km' },
            { id: '10', label: 'Within 10 km' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => setDistanceRadius(d.id)}
              className={`dist-chip ${distanceRadius === d.id ? 'active' : ''}`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Availability Status Filter Group */}
        <div className="pro-avail-chips-group">
          <button
            onClick={() => setAvailabilityStatus('all')}
            className={`dist-chip ${availabilityStatus === 'all' ? 'active' : ''}`}
          >
            All Status
          </button>
          <button
            onClick={() => setAvailabilityStatus('available_now')}
            className={`dist-chip ${availabilityStatus === 'available_now' ? 'active' : ''}`}
          >
            🟢 Available Now
          </button>
          <button
            onClick={() => setAvailabilityStatus('available_today')}
            className={`dist-chip ${availabilityStatus === 'available_today' ? 'active' : ''}`}
          >
            🟡 Available Today
          </button>
          <button
            onClick={() => setAvailabilityStatus('available_tomorrow')}
            className={`dist-chip ${availabilityStatus === 'available_tomorrow' ? 'active' : ''}`}
          >
            🔵 Tomorrow
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="pro-category-scroll">
        <button 
          onClick={() => setSelectedCat('all')}
          className={`category-pill ${selectedCat === 'all' ? 'active' : ''}`}
        >
          All Specialties ({providersData.length})
        </button>
        {categoriesData.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`category-pill ${selectedCat === cat.id ? 'active' : ''}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <main className="providers-main-layout">
        {filteredProviders.length > 0 ? (
          <div className="providers-grid-layout">
            {filteredProviders.map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="card empty-results-card">
            <Users size={48} color="#94a3b8" />
            <h3>No specialists found matching your search</h3>
            <p>Try widening your distance radius, clearing availability filters, or exploring another trade specialty.</p>
            <div className="empty-actions-row">
              <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                Reset All Filters
              </button>
              <button onClick={() => setSelectedCat('all')} className="btn btn-secondary btn-sm">
                Browse All Providers
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
