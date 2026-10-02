import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Check, Crosshair, Sparkles } from 'lucide-react';

const PRESET_LOCATIONS = [
  { name: 'Downtown Central', area: 'Central Business District', street: '404 Market Street', city: 'Springfield Metro', state: 'CA', pincode: '94103', lat: 37.7749, lng: -122.4194, x: 50, y: 50 },
  { name: 'Tech Park Sector 4', area: 'Silicon Corridor', street: '500 Innovation Way, Suite 300', city: 'Springfield Metro', state: 'CA', pincode: '94107', lat: 37.7812, lng: -122.3980, x: 74, y: 35 },
  { name: 'Greenwood Heights', area: 'Residential West', street: '742 Evergreen Terrace', city: 'Springfield Metro', state: 'CA', pincode: '94112', lat: 37.7520, lng: -122.4350, x: 28, y: 68 },
  { name: 'Riverside Marina', area: 'Waterfront District', street: '120 Bayside Pier Ave', city: 'Springfield Metro', state: 'CA', pincode: '94105', lat: 37.7950, lng: -122.3910, x: 82, y: 22 },
  { name: 'Metro Plaza', area: 'University Quarter', street: '88 Skyline Blvd, Floor 7', city: 'Springfield Metro', state: 'CA', pincode: '94118', lat: 37.7650, lng: -122.4600, x: 38, y: 30 }
];

export const MapLocationPicker = ({ selectedLocation, onSelectLocation }) => {
  const [activePin, setActivePin] = useState(
    selectedLocation || PRESET_LOCATIONS[0]
  );
  const [isLocating, setIsLocating] = useState(false);

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(15, Math.min(85, ((e.clientY - rect.top) / rect.height) * 100));

    // Nearest preset or custom coordinate interpolation
    const customLoc = {
      name: 'Custom Pinned Location',
      area: x > 50 ? 'East Metro Sector' : 'West Valley Sector',
      street: `${Math.round(x * 12 + 100)} Metro Parkway`,
      city: 'Springfield Metro',
      state: 'CA',
      pincode: `9410${Math.min(9, Math.max(1, Math.round((x + y) / 20)))}`,
      lat: Number((37.7500 + (y / 100) * 0.05).toFixed(4)),
      lng: Number((-122.4500 + (x / 100) * 0.06).toFixed(4)),
      x,
      y
    };

    setActivePin(customLoc);
    if (onSelectLocation) {
      onSelectLocation(customLoc);
    }
  };

  const handleChoosePreset = (loc) => {
    setActivePin(loc);
    if (onSelectLocation) {
      onSelectLocation(loc);
    }
  };

  const handleSimulateGPS = () => {
    setIsLocating(true);
    setTimeout(() => {
      const detected = PRESET_LOCATIONS[2]; // Greenwood Heights
      setActivePin(detected);
      if (onSelectLocation) {
        onSelectLocation(detected);
      }
      setIsLocating(false);
    }, 600);
  };

  return (
    <div className="map-picker-root">
      {/* Top Header & Fast Presets */}
      <div className="map-picker-header">
        <div className="map-picker-title-group">
          <div className="map-badge">
            <Compass size={14} color="#10b981" />
            <span>Interactive Service Map</span>
          </div>
          <span className="map-helper-text">Click anywhere on the map or select a quick sector</span>
        </div>

        <button
          type="button"
          className="gps-btn"
          onClick={handleSimulateGPS}
          disabled={isLocating}
          title="Detect GPS Location"
        >
          <Crosshair size={14} className={isLocating ? 'spin-anim' : ''} />
          <span>{isLocating ? 'Locating GPS...' : 'Use My GPS'}</span>
        </button>
      </div>

      {/* Preset Sector Quick-Chips */}
      <div className="map-presets-row">
        {PRESET_LOCATIONS.map((loc) => {
          const isSelected = activePin.name === loc.name;
          return (
            <button
              type="button"
              key={loc.name}
              className={`map-preset-chip ${isSelected ? 'active' : ''}`}
              onClick={() => handleChoosePreset(loc)}
            >
              <MapPin size={12} />
              <span>{loc.name}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="map-viewport" onClick={handleMapClick}>
        {/* Vector Background Road Grid */}
        <div className="map-roads-layer">
          <svg className="map-svg-grid" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="road-grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <rect width="60" height="60" fill="none" />
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#road-grid-pattern)" />
            
            {/* Major Arterial Avenues */}
            <line x1="0" y1="40%" x2="100%" y2="40%" stroke="rgba(16, 185, 129, 0.22)" strokeWidth="4" />
            <line x1="0" y1="70%" x2="100%" y2="70%" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="3" />
            <line x1="45%" y1="0" x2="45%" y2="100%" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="4" />
            <line x1="75%" y1="0" x2="75%" y2="100%" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="3" />
            
            {/* Diagonal Highway */}
            <path d="M 0 100 Q 300 200 800 80" fill="none" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="3" strokeDasharray="6 4" />
          </svg>

          {/* Landmarks / City Nodes */}
          <div className="map-landmark" style={{ left: '20%', top: '25%' }}>Westside Park</div>
          <div className="map-landmark" style={{ left: '60%', top: '20%' }}>Financial Center</div>
          <div className="map-landmark" style={{ left: '78%', top: '65%' }}>Harbor Depot</div>
          <div className="map-landmark" style={{ left: '22%', top: '75%' }}>South Residences</div>
        </div>

        {/* Dynamic Draggable/Clickable Pin Marker */}
        <div
          className="map-interactive-pin"
          style={{
            left: `${activePin.x || 50}%`,
            top: `${activePin.y || 50}%`
          }}
        >
          <div className="pin-radar-ring"></div>
          <div className="pin-radar-ring-delayed"></div>
          <div className="pin-bubble-head">
            <MapPin size={20} color="#ffffff" />
          </div>
          <div className="pin-callout">
            <span className="callout-title">{activePin.name}</span>
            <span className="callout-coords">{activePin.lat}° N, {Math.abs(activePin.lng)}° W</span>
          </div>
        </div>
      </div>

      {/* Selected Location Address Strip */}
      <div className="map-selected-address-bar">
        <div className="selected-address-info">
          <div className="address-badge-row">
            <span className="badge badge-verified">
              <Check size={11} style={{ marginRight: 4 }} /> Pinned Location
            </span>
            <span className="address-coords-pill">
              Lat: {activePin.lat} • Lng: {activePin.lng}
            </span>
          </div>
          <div className="address-text-line">
            <strong>{activePin.street}</strong>, {activePin.area}, {activePin.city}, {activePin.state} — {activePin.pincode}
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm btn-glow"
          onClick={() => onSelectLocation && onSelectLocation(activePin)}
        >
          <Check size={14} />
          <span>Apply Coordinates</span>
        </button>
      </div>

      {/* Component Styles */}
      <style>{`
        .map-picker-root {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          padding: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .map-picker-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .map-picker-title-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .map-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 700;
          font-size: 0.92rem;
          color: var(--text-primary);
        }

        .map-helper-text {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .gps-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.12);
          color: var(--accent-primary);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .gps-btn:hover {
          background: var(--accent-primary);
          color: #ffffff;
        }

        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .map-presets-row {
          display: flex;
          gap: 0.4rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }

        .map-preset-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-surface);
          color: var(--text-secondary);
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--transition-fast);
        }
        .map-preset-chip:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }
        .map-preset-chip.active {
          background: rgba(16, 185, 129, 0.18);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          font-weight: 600;
        }

        .map-viewport {
          position: relative;
          width: 100%;
          height: 220px;
          border-radius: var(--radius-md);
          background: radial-gradient(circle at center, #0f1c18 0%, #090e0c 100%);
          border: 1px solid rgba(16, 185, 129, 0.2);
          cursor: crosshair;
          overflow: hidden;
          user-select: none;
        }
        [data-theme="light"] .map-viewport {
          background: radial-gradient(circle at center, #e6f4ea 0%, #d8ece0 100%);
          border-color: rgba(16, 185, 129, 0.4);
        }

        .map-roads-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .map-landmark {
          position: absolute;
          font-size: 0.68rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          pointer-events: none;
        }
        [data-theme="light"] .map-landmark {
          color: rgba(15, 23, 42, 0.5);
        }

        .map-interactive-pin {
          position: absolute;
          transform: translate(-50%, -100%);
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: left 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .pin-radar-ring {
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 2px solid var(--accent-primary);
          background: rgba(16, 185, 129, 0.25);
          bottom: -19px;
          animation: mapRadar 2s infinite ease-out;
        }
        .pin-radar-ring-delayed {
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 2px solid var(--accent-primary);
          bottom: -19px;
          animation: mapRadar 2s infinite 0.75s ease-out;
        }

        @keyframes mapRadar {
          0% { transform: scale(0.3); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .pin-bubble-head {
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          background: linear-gradient(135deg, #10b981, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.6);
          border: 2px solid #ffffff;
        }
        .pin-bubble-head svg {
          transform: rotate(45deg);
        }

        .pin-callout {
          margin-top: 6px;
          background: rgba(9, 12, 11, 0.9);
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          align-items: center;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        [data-theme="light"] .pin-callout {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(16, 185, 129, 0.5);
        }

        .callout-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .callout-coords {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .map-selected-address-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.85rem;
          padding: 0.75rem 0.9rem;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
        }

        .selected-address-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .address-badge-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .address-coords-pill {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-family: monospace;
        }

        .address-text-line {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .address-text-line strong {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};
