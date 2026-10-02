import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { categoriesData } from '../../data/categoriesData';
import { CategoryIllustration } from './CategoryIllustration';
import { Search, ArrowRight, ChevronRight, X, Sparkles, Filter } from 'lucide-react';

export const SpecialtyCardsSection = () => {
  const { setSelectedCategory, navigateTo } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');

  // Defined filter clusters
  const groupFilters = [
    { id: 'all', label: 'All Services (30)' },
    { id: 'home', label: 'Home Care' },
    { id: 'appliances', label: 'Tech & Appliances' },
    { id: 'automotive', label: 'Auto & Transport' },
    { id: 'wellness', label: 'Lifestyle & Wellness' },
    { id: 'emergency', label: 'Emergency' }
  ];

  // Group classifier for the 30 categories
  const getCategoryGroup = (catId) => {
    switch (catId) {
      case 'home-cleaning':
      case 'plumbing':
      case 'electrician':
      case 'painting':
      case 'carpenter':
      case 'pest-control':
      case 'gardening':
      case 'interior-design':
        return 'home';
      case 'ac-repair':
      case 'appliance-repair':
      case 'computer-repair':
      case 'laptop-repair':
      case 'mobile-repair':
      case 'cctv-installation':
      case 'ro-service':
      case 'washing-machine-repair':
      case 'refrigerator-repair':
        return 'appliances';
      case 'car-service':
      case 'bike-service':
      case 'moving-shifting':
      case 'mechanic':
        return 'automotive';
      case 'beauty-salon':
      case 'tutors':
      case 'photography':
      case 'event-services':
      case 'fitness-trainer':
      case 'yoga':
      case 'makeup-artist':
      case 'laundry':
        return 'wellness';
      case 'emergency-services':
        return 'emergency';
      default:
        return 'home';
    }
  };

  const filteredCategories = useMemo(() => {
    return categoriesData.filter(cat => {
      // Group filter
      if (selectedGroup !== 'all' && getCategoryGroup(cat.id) !== selectedGroup) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = cat.name.toLowerCase().includes(query);
        const matchesDesc = cat.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [searchTerm, selectedGroup]);

  const handleCardClick = (catId) => {
    setSelectedCategory(catId);
    navigateTo('services');
  };

  return (
    <section className="specialty-section-root container">
      {/* Section Header */}
      <div className="specialty-header-box">
        <div className="specialty-title-col">
          <div className="badge badge-verified specialty-pill">
            <Sparkles size={13} color="#10b981" />
            <span>30 Specialized Service Domains</span>
          </div>
          <h2 className="specialty-main-title">Explore Our Services</h2>
          <p className="specialty-subtitle">
            Find trusted professionals for every service you need. Every domain is backed by vetted specialists and escrow guarantees.
          </p>
        </div>

        <button 
          className="btn btn-primary btn-glow view-all-btn"
          onClick={() => {
            setSelectedCategory('all');
            navigateTo('services');
          }}
        >
          <span>View All Services</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="specialty-controls-bar">
        {/* Category Group Chips */}
        <div className="group-chips-list">
          {groupFilters.map(group => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`group-chip-btn ${selectedGroup === group.id ? 'active' : ''}`}
            >
              {group.label}
            </button>
          ))}
        </div>

        {/* Live Filter Search Input */}
        <div className="category-search-wrap">
          <Search size={16} color="#10b981" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search service cards..."
            className="category-search-input"
          />
          {searchTerm && (
            <button className="clear-cat-search" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Rectangular Service Cards */}
      {filteredCategories.length > 0 ? (
        <div className="specialty-cards-grid">
          {filteredCategories.map(cat => (
            <div
              key={cat.id}
              className="specialty-card"
              onClick={() => handleCardClick(cat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(cat.id); }}
            >
              {/* Top 2D Animated Illustration Container */}
              <div className="illustration-container">
                <CategoryIllustration categoryId={cat.id} />
              </div>

              {/* Card Content */}
              <div className="specialty-card-body">
                <h3 className="specialty-card-name">{cat.name}</h3>
                <p className="specialty-card-desc">{cat.description}</p>
                
                {/* Providers Count & CTA Row */}
                <div className="specialty-card-footer">
                  <span className="specialty-pro-count">{cat.count}</span>
                  <div className="specialty-view-link">
                    <span>View Services</span>
                    <ChevronRight size={14} className="arrow-icon" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty-specialty-card">
          <Search size={36} color="#94a3b8" />
          <h4>No matching service categories found</h4>
          <p>Try searching for a different term like "Plumbing", "Cleaning", or "AC".</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedGroup('all'); }} 
            className="btn btn-secondary btn-sm"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Scoped CSS Styles for Specialty Section & 2D Animations */}
      <style>{`
        .specialty-section-root {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          margin-top: 1rem;
        }

        .specialty-header-box {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: space-between;
          align-items: flex-start;
        }
        @media (min-width: 768px) {
          .specialty-header-box {
            flex-direction: row;
            align-items: flex-end;
          }
        }

        .specialty-pill {
          margin-bottom: 0.5rem;
        }

        .specialty-main-title {
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          line-height: 1.2;
          color: var(--text-primary);
        }

        .specialty-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 0.35rem;
          max-width: 680px;
          line-height: 1.5;
        }

        .view-all-btn {
          white-space: nowrap;
        }

        /* Controls Bar */
        .specialty-controls-bar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: space-between;
          align-items: stretch;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 0.75rem 1rem;
        }
        @media (min-width: 860px) {
          .specialty-controls-bar {
            flex-direction: row;
            align-items: center;
          }
        }

        .group-chips-list {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          scrollbar-width: thin;
          padding-bottom: 2px;
        }

        .group-chip-btn {
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-input);
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          transition: all var(--transition-fast);
        }
        .group-chip-btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }
        .group-chip-btn.active {
          background: var(--accent-primary);
          color: #ffffff;
          border-color: var(--accent-primary);
        }

        .category-search-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.45rem 0.85rem;
          min-width: 220px;
          transition: border-color var(--transition-fast);
        }
        .category-search-wrap:focus-within {
          border-color: var(--accent-primary);
        }
        .category-search-input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.85rem;
          outline: none;
          width: 100%;
        }
        .clear-cat-search {
          color: var(--text-muted);
        }

        /* Rectangular Service Cards Grid */
        .specialty-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 480px) {
          .specialty-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 768px) {
          .specialty-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1100px) {
          .specialty-cards-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (min-width: 1400px) {
          .specialty-cards-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        /* Rectangular Card Base */
        .specialty-card {
          background: #151A17; /* Dark Charcoal default in dark mode */
          border: 1px solid rgba(16, 185, 129, 0.18);
          border-radius: 18px; /* 16-20px rounded corners */
          padding: 1.25rem 1.15rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1), 
                      border-color 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
          position: relative;
          min-height: 255px;
        }

        [data-theme="light"] .specialty-card {
          background: #ffffff; /* White card in Light Mode */
          border: 1px solid rgba(15, 23, 42, 0.1);
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
        }

        /* Hover Effect: Moves upward, green border & glow, title turns emerald */
        .specialty-card:hover {
          transform: translateY(-7px);
          border-color: #10b981;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.5), 0 0 22px rgba(16, 185, 129, 0.32);
        }

        [data-theme="light"] .specialty-card:hover {
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12), 0 0 18px rgba(5, 150, 105, 0.22);
        }

        .specialty-card:hover .specialty-card-name {
          color: #10b981;
        }

        .specialty-card:hover .specialty-view-link {
          color: #10b981;
        }

        .specialty-card:hover .arrow-icon {
          transform: translateX(4px);
        }

        /* 2D Illustration Box */
        .illustration-container {
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          background: rgba(16, 185, 129, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(16, 185, 129, 0.1);
          transition: background var(--transition-fast);
        }
        .specialty-card:hover .illustration-container {
          background: rgba(16, 185, 129, 0.12);
        }

        .illustration-wrapper {
          width: 90px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cat-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        /* Card Text Content */
        .specialty-card-body {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .specialty-card-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
          margin-bottom: 0.35rem;
          transition: color var(--transition-fast);
        }

        .specialty-card-desc {
          font-size: 0.8rem;
          line-height: 1.45;
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 0.85rem;
          flex: 1;
        }

        .specialty-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.65rem;
          border-top: 1px solid var(--border-color);
        }

        .specialty-pro-count {
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--accent-primary);
          background: var(--accent-light);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          letter-spacing: 0.02em;
        }

        .specialty-view-link {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }
        .arrow-icon {
          transition: transform var(--transition-fast);
        }

        .empty-specialty-card {
          padding: 3rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        /* =========================================================================
           2D CSS/SVG ANIMATIONS (Subtle, professional, flat vector motion)
           ========================================================================= */

        /* Floating tool / wrench */
        .svg-tool-wrench {
          animation: floatWrench 2.8s ease-in-out infinite;
        }
        @keyframes floatWrench {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(4deg); }
        }

        /* Dripping water drops */
        .svg-drop {
          animation: waterDrop 2.2s infinite ease-in;
        }
        .drop-1 { animation-delay: 0.2s; }
        .drop-2 { animation-delay: 1.1s; }
        @keyframes waterDrop {
          0% { transform: translateY(0); opacity: 0; }
          30% { opacity: 1; }
          80% { transform: translateY(12px); opacity: 1; }
          100% { transform: translateY(18px); opacity: 0; }
        }

        /* Lightning bolt spark */
        .svg-lightning {
          animation: lightningPulse 2s infinite ease-in-out;
        }
        @keyframes lightningPulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          45% { opacity: 1; filter: drop-shadow(0 0 6px #fbbf24); transform: scale(1.08); }
          50% { opacity: 0.7; transform: scale(0.96); }
        }

        /* Concentric pulse rings */
        .svg-pulse-ring {
          animation: ringPulse 2.4s infinite linear;
          transform-origin: 50% 50%;
        }
        @keyframes ringPulse {
          0% { transform: scale(0.9); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(0.9); opacity: 0.3; }
        }

        /* AC Wind breeze waves */
        .svg-wind-wave {
          animation: breezeFlow 2s ease-in-out infinite;
        }
        .wave-1 { animation-delay: 0s; }
        .wave-2 { animation-delay: 0.5s; }
        @keyframes breezeFlow {
          0% { transform: translateX(-4px); opacity: 0.3; }
          50% { transform: translateX(4px); opacity: 1; }
          100% { transform: translateX(-4px); opacity: 0.3; }
        }

        /* Beacon pulsing dot */
        .svg-beacon-dot {
          animation: beaconBlink 1.4s infinite;
        }
        @keyframes beaconBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.7); }
        }

        /* Sparkles */
        .svg-sparkle {
          animation: sparkleGlint 2.2s infinite ease-in-out;
        }
        .sparkle-1 { animation-delay: 0.1s; }
        .sparkle-2 { animation-delay: 1.1s; }
        @keyframes sparkleGlint {
          0%, 100% { transform: scale(0.6) rotate(0deg); opacity: 0.3; }
          50% { transform: scale(1.2) rotate(45deg); opacity: 1; }
        }

        /* Floating bubbles */
        .svg-bubble {
          animation: bubbleFloat 3s infinite ease-in-out;
        }
        .bubble-1 { animation-delay: 0.3s; }
        .bubble-2 { animation-delay: 1.5s; }
        @keyframes bubbleFloat {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-5px); opacity: 0.9; }
        }

        /* Wheels rotation */
        .svg-wheel-spin {
          animation: wheelSpin 4s linear infinite;
        }
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Scissors snapping */
        .svg-scissor-1 {
          animation: scissorLeft 2s ease-in-out infinite;
        }
        .svg-scissor-2 {
          animation: scissorRight 2s ease-in-out infinite;
        }
        @keyframes scissorLeft {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-10deg); }
        }
        @keyframes scissorRight {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }

        /* Paint roller glide */
        .svg-roller-glide {
          animation: rollerSlide 2.6s ease-in-out infinite;
        }
        @keyframes rollerSlide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }

        /* Hammer strike */
        .svg-hammer-strike {
          animation: hammerTap 1.8s ease-in-out infinite;
        }
        @keyframes hammerTap {
          0%, 100% { transform: rotate(0deg); }
          40% { transform: rotate(-18deg); }
          60% { transform: rotate(4deg); }
        }

        /* CCTV scan sweep */
        .svg-cctv-scan {
          animation: cctvScan 3.5s ease-in-out infinite;
        }
        @keyframes cctvScan {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(14deg); }
        }

        /* Washing machine drum spin */
        .svg-drum-spin {
          animation: drumSpin 3s linear infinite;
        }
        @keyframes drumSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Plant sprout sway */
        .svg-sprout-sway {
          animation: sproutSway 3s ease-in-out infinite;
        }
        @keyframes sproutSway {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(5deg); }
        }

        /* Box floating */
        .svg-box-float {
          animation: boxFloat 2.6s ease-in-out infinite;
        }
        @keyframes boxFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        /* Lens aperture spin */
        .svg-lens-spin {
          animation: lensSpin 6s linear infinite;
        }
        @keyframes lensSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Dumbbell weight lift */
        .svg-dumbbell-lift {
          animation: liftDumbbell 2.4s ease-in-out infinite;
        }
        @keyframes liftDumbbell {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        /* Interlocking gears */
        .svg-gear-rotate-cw {
          animation: gearCW 5s linear infinite;
        }
        .svg-gear-rotate-ccw {
          animation: gearCCW 5s linear infinite;
        }
        @keyframes gearCW {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gearCCW {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        /* Cap float */
        .svg-cap-float {
          animation: capHover 2.5s ease-in-out infinite;
        }
        @keyframes capHover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        /* Rising steam */
        .svg-steam {
          animation: steamRise 2s infinite ease-out;
        }
        .steam-1 { animation-delay: 0s; }
        .steam-2 { animation-delay: 0.6s; }
        .steam-3 { animation-delay: 1.2s; }
        @keyframes steamRise {
          0% { transform: translateY(4px); opacity: 0; }
          40% { opacity: 0.8; }
          100% { transform: translateY(-10px); opacity: 0; }
        }

        /* Emergency beacon glow */
        .svg-beacon-glow {
          animation: sirenFlash 1.2s infinite;
        }
        @keyframes sirenFlash {
          0%, 100% { fill: #ef4444; filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6)); }
          50% { fill: #b91c1c; filter: drop-shadow(0 0 2px rgba(239, 68, 68, 0.2)); }
        }

        /* Hover enhancement for illustration */
        .specialty-card:hover .illustration-wrapper {
          transform: scale(1.08);
          transition: transform 0.25s ease;
        }
      `}</style>
    </section>
  );
};
