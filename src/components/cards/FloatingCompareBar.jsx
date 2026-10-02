import React from 'react';
import { useApp } from '../../context/AppContext';
import { SlidersHorizontal, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const FloatingCompareBar = () => {
  const { compareProviders, removeFromCompare, clearCompare, setIsCompareModalOpen } = useApp();

  if (compareProviders.length === 0) return null;

  return (
    <aside className="floating-compare-bar" aria-label="Compare Providers Bar">
      <div className="container compare-bar-inner">
        <div className="compare-bar-left">
          <div className="compare-icon-box">
            <SlidersHorizontal size={18} color="#10b981" />
          </div>
          <div className="compare-text-group">
            <h4 className="compare-bar-title">Compare Specialists</h4>
            <span className="compare-bar-count">
              <strong>{compareProviders.length}</strong> of 3 selected
            </span>
          </div>

          <div className="compare-chips-list">
            {compareProviders.map((p) => (
              <div key={p.id} className="compare-chip">
                <img src={p.image} alt={p.name} className="chip-avatar" />
                <span className="chip-name">{p.name.split(' ')[0]}</span>
                <button 
                  onClick={() => removeFromCompare(p.id)} 
                  className="chip-remove-btn"
                  title={`Remove ${p.name}`}
                  aria-label={`Remove ${p.name} from comparison`}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="compare-bar-actions">
          <button onClick={clearCompare} className="btn btn-ghost btn-sm">
            Clear
          </button>
          <button 
            onClick={() => setIsCompareModalOpen(true)} 
            className="btn btn-primary btn-sm btn-glow"
          >
            <span>Compare Now</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};
