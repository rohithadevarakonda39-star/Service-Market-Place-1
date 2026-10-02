import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { servicesData } from '../data/servicesData';
import { categoriesData } from '../data/categoriesData';
import { ServiceCard } from '../components/cards/ServiceCard';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  MapPin, 
  Star, 
  X, 
  ArrowUpDown, 
  Check, 
  ShieldCheck, 
  Zap, 
  RotateCcw,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const ServicesPage = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    searchLocation, 
    setSearchLocation, 
    selectedCategory, 
    setSelectedCategory,
    filters,
    setFilters,
    navigateTo
  } = useApp();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Local filter states
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || 200);
  const [minRating, setMinRating] = useState(filters.minRating || 0);
  const [distanceRadius, setDistanceRadius] = useState(filters.distanceRadius || 'all');
  const [availabilityFilter, setAvailabilityFilter] = useState(filters.availability || 'all');
  const [verifiedOnly, setVerifiedOnly] = useState(filters.verifiedOnly || false);
  const [emergencyOnly, setEmergencyOnly] = useState(filters.emergencyOnly || false);
  const [sortBy, setSortBy] = useState(filters.sortBy || 'recommended');

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(200);
    setMinRating(0);
    setDistanceRadius('all');
    setAvailabilityFilter('all');
    setVerifiedOnly(false);
    setEmergencyOnly(false);
    setSortBy('recommended');
  };

  // Search Suggestions (dynamic matching)
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase().trim();
    const suggestions = [];

    // Check categories
    categoriesData.forEach(cat => {
      if (cat.name.toLowerCase().includes(q)) {
        suggestions.push({ type: 'Category', label: cat.name, categoryId: cat.id });
      }
    });

    // Check services
    servicesData.forEach(srv => {
      if (srv.name.toLowerCase().includes(q)) {
        suggestions.push({ type: 'Service', label: srv.name, serviceId: srv.id, price: srv.startingPrice });
      }
    });

    return suggestions.slice(0, 6);
  }, [searchQuery]);

  // Filter & Sort Logic
  const filteredServices = useMemo(() => {
    return servicesData.filter((service) => {
      // 1. Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = service.name.toLowerCase().includes(q);
        const matchesDesc = service.shortDescription.toLowerCase().includes(q);
        const matchesCategory = service.categoryName.toLowerCase().includes(q);
        const matchesProvider = service.providerName.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesProvider) {
          return false;
        }
      }

      // 2. Category check
      if (selectedCategory !== 'all') {
        if (service.categoryId !== selectedCategory) {
          return false;
        }
      }

      // 3. Price check
      if (service.startingPrice > maxPrice) {
        return false;
      }

      // 4. Rating check
      if (minRating > 0 && service.rating < minRating) {
        return false;
      }

      // 5. Emergency filter
      if (emergencyOnly && !service.availability?.toLowerCase().includes('instant') && !service.availability?.toLowerCase().includes('20') && service.categoryId !== 'emergency-services') {
        return false;
      }

      // 6. Availability filter
      if (availabilityFilter !== 'all') {
        const av = service.availability?.toLowerCase() || '';
        if (availabilityFilter === 'available_now' && !av.includes('20') && !av.includes('now') && !av.includes('instant') && !av.includes('15')) {
          return false;
        }
        if (availabilityFilter === 'available_today' && !av.includes('today') && !av.includes('now') && !av.includes('mins')) {
          return false;
        }
        if (availabilityFilter === 'available_tomorrow' && !av.includes('tomorrow')) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.startingPrice - b.startingPrice;
      if (sortBy === 'price-high') return b.startingPrice - a.startingPrice;
      if (sortBy === 'most-booked' || sortBy === 'bookings') return (b.bookingsCount || 0) - (a.bookingsCount || 0);
      return 0; // Default recommended
    });
  }, [searchQuery, selectedCategory, maxPrice, minRating, emergencyOnly, availabilityFilter, sortBy]);

  const handleSelectSuggestion = (sug) => {
    if (sug.categoryId) {
      setSelectedCategory(sug.categoryId);
      setSearchQuery('');
    } else if (sug.serviceId) {
      navigateTo('service-details', { serviceId: sug.serviceId });
    }
    setShowSuggestions(false);
  };

  return (
    <div className="services-page-root container">
      {/* Top Banner & Search Control */}
      <div className="services-header-box">
        <div className="services-title-col">
          <div className="badge badge-verified" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={13} color="#10b981" />
            <span>Curated Marketplace</span>
          </div>
          <h1 className="services-page-title">Discover Services & Specialties</h1>
          <p className="services-page-sub">
            {filteredServices.length} verified services available in {searchLocation}. Fixed transparent rates with escrow protection.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="services-search-toolbar">
          <div className="toolbar-search-input relative-container">
            <Search size={18} color="#10b981" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search services, categories, or symptoms (e.g. AC, leak)..."
              className="toolbar-input"
            />
            {searchQuery && (
              <button 
                className="clear-btn" 
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                }}
                aria-label="Clear search query"
              >
                <X size={15} />
              </button>
            )}

            {/* Dynamic Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="search-suggestions-dropdown">
                <div className="sug-header">Suggested Matches:</div>
                {searchSuggestions.map((sug, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectSuggestion(sug)}
                    className="sug-item"
                  >
                    <span className="sug-type-pill">{sug.type}</span>
                    <span className="sug-label">{sug.label}</span>
                    {sug.price && <span className="sug-price">from ${sug.price}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="toolbar-sort-group">
            <ArrowUpDown size={16} color="#94a3b8" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Top Rated (4.9+ ★)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="most-booked">Most Booked</option>
            </select>
          </div>

          <button 
            className="btn btn-secondary mobile-filter-btn"
            onClick={() => setMobileFilterOpen(true)}
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Horizontal Category Badges */}
      <div className="category-scroll-bar">
        <button 
          onClick={() => setSelectedCategory('all')}
          className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
        >
          All Categories ({servicesData.length})
        </button>
        {categoriesData.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Layout: Filters Sidebar + Results */}
      <div className="services-layout-grid">
        {/* Desktop Sidebar Filters */}
        <aside className="services-filters-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-header-title">
              <Filter size={18} color="#10b981" />
              <span>Filter Results</span>
            </div>
            <button className="reset-filter-btn" onClick={handleResetFilters} title="Reset all filters">
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>

          {/* Price Range Slider */}
          <div className="filter-section">
            <label className="filter-label">
              <span>Max Starting Price</span>
              <strong>${maxPrice}</strong>
            </label>
            <input 
              type="range" 
              min="20" 
              max="200" 
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="range-slider"
            />
            <div className="slider-labels">
              <span>$20</span>
              <span>$100</span>
              <span>$200+</span>
            </div>
          </div>

          {/* Minimum Rating Filter */}
          <div className="filter-section">
            <label className="filter-label">Customer Rating</label>
            <div className="rating-filter-options">
              {[0, 4.5, 4.8, 4.9].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setMinRating(rating)}
                  className={`rating-btn ${minRating === rating ? 'active' : ''}`}
                >
                  <Star size={13} fill={rating > 0 ? '#f59e0b' : 'none'} color={rating > 0 ? '#f59e0b' : '#94a3b8'} />
                  <span>{rating === 0 ? 'Any Rating' : `${rating} & above`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="filter-section">
            <label className="filter-label">Availability Schedule</label>
            <div className="avail-filter-stack">
              <button
                type="button"
                onClick={() => setAvailabilityFilter('all')}
                className={`avail-btn ${availabilityFilter === 'all' ? 'active' : ''}`}
              >
                <span>Any Time</span>
              </button>
              <button
                type="button"
                onClick={() => setAvailabilityFilter('available_now')}
                className={`avail-btn ${availabilityFilter === 'available_now' ? 'active' : ''}`}
              >
                <span>🟢 Available Now (Instant)</span>
              </button>
              <button
                type="button"
                onClick={() => setAvailabilityFilter('available_today')}
                className={`avail-btn ${availabilityFilter === 'available_today' ? 'active' : ''}`}
              >
                <span>🟡 Available Today</span>
              </button>
              <button
                type="button"
                onClick={() => setAvailabilityFilter('available_tomorrow')}
                className={`avail-btn ${availabilityFilter === 'available_tomorrow' ? 'active' : ''}`}
              >
                <span>🔵 Available Tomorrow</span>
              </button>
            </div>
          </div>

          {/* Verified Provider Only */}
          <div className="filter-section">
            <label className="filter-toggle-row" onClick={() => setVerifiedOnly(!verifiedOnly)}>
              <div className="toggle-left">
                <ShieldCheck size={16} color="#10b981" />
                <span className="toggle-label">Verified Pros Only</span>
              </div>
              <div className={`switch ${verifiedOnly ? 'on' : ''}`}>
                <div className="switch-handle"></div>
              </div>
            </label>
          </div>

          {/* Emergency 20-min Fast Dispatch */}
          <div className="filter-section">
            <label className="filter-toggle-row" onClick={() => setEmergencyOnly(!emergencyOnly)}>
              <div className="toggle-left">
                <Zap size={16} color="#ef4444" />
                <span className="toggle-label">Instant Emergency Dispatch</span>
              </div>
              <div className={`switch danger-switch ${emergencyOnly ? 'on' : ''}`}>
                <div className="switch-handle"></div>
              </div>
            </label>
          </div>
        </aside>

        {/* Services Results Grid */}
        <div className="services-results-col">
          {filteredServices.length > 0 ? (
            <div className="services-grid-page">
              {filteredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="card empty-results-card">
              <Search size={48} color="#94a3b8" />
              <h3>No services match your filters</h3>
              <p>No providers are currently available for this query in {searchLocation}. Try adjusting your price limit or clearing filters.</p>
              <div className="empty-actions-row">
                <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                  Reset All Filters
                </button>
                <button onClick={() => setSelectedCategory('all')} className="btn btn-secondary btn-sm">
                  Browse All Categories
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="modal-overlay" onClick={() => setMobileFilterOpen(false)}>
          <div className="modal-content mobile-filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header" style={{ marginBottom: '1.5rem' }}>
              <div className="sidebar-header-title">
                <SlidersHorizontal size={18} color="#10b981" />
                <span>Filter Marketplace Services</span>
              </div>
              <button className="reset-filter-btn" onClick={() => setMobileFilterOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Mobile Price Slider */}
            <div className="filter-section">
              <label className="filter-label">
                <span>Max Starting Price</span>
                <strong>${maxPrice}</strong>
              </label>
              <input 
                type="range" 
                min="20" 
                max="200" 
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="range-slider"
              />
            </div>

            {/* Mobile Rating */}
            <div className="filter-section">
              <label className="filter-label">Minimum Rating</label>
              <div className="rating-filter-options">
                {[0, 4.5, 4.8, 4.9].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setMinRating(rating)}
                    className={`rating-btn ${minRating === rating ? 'active' : ''}`}
                  >
                    <Star size={13} fill={rating > 0 ? '#f59e0b' : 'none'} color={rating > 0 ? '#f59e0b' : '#94a3b8'} />
                    <span>{rating === 0 ? 'Any' : `${rating}+`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Emergency & Verified Toggles */}
            <div className="filter-section">
              <label className="filter-toggle-row" onClick={() => setVerifiedOnly(!verifiedOnly)}>
                <div className="toggle-left">
                  <ShieldCheck size={16} color="#10b981" />
                  <span className="toggle-label">Verified Pros Only</span>
                </div>
                <div className={`switch ${verifiedOnly ? 'on' : ''}`}>
                  <div className="switch-handle"></div>
                </div>
              </label>
            </div>

            <div className="filter-section">
              <label className="filter-toggle-row" onClick={() => setEmergencyOnly(!emergencyOnly)}>
                <div className="toggle-left">
                  <Zap size={16} color="#ef4444" />
                  <span className="toggle-label">Emergency Instant Dispatch</span>
                </div>
                <div className={`switch danger-switch ${emergencyOnly ? 'on' : ''}`}>
                  <div className="switch-handle"></div>
                </div>
              </label>
            </div>

            <div className="mobile-filter-footer" style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleResetFilters} className="btn btn-secondary btn-block">
                Reset
              </button>
              <button onClick={() => setMobileFilterOpen(false)} className="btn btn-primary btn-block">
                Apply ({filteredServices.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
