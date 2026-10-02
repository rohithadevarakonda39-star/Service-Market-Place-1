import React from 'react';
import { useApp } from '../../context/AppContext';
import { getProblemsForCategory } from '../../data/categoryProblems';
import { 
  Check, 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  Zap,
  Droplets,
  Wind,
  Wrench,
  Thermometer,
  ShieldCheck,
  Bug,
  Hammer
} from 'lucide-react';

export const ProblemSelector = ({ categoryId, categoryName, onProblemSelect }) => {
  const { selectedProblem, setSelectedProblem, addToast } = useApp();

  const problems = getProblemsForCategory(categoryId);

  const handleSelect = (prob) => {
    if (selectedProblem?.id === prob.id) {
      setSelectedProblem(null);
      addToast('Cleared problem selection', 'info');
      if (onProblemSelect) onProblemSelect(null);
    } else {
      setSelectedProblem(prob);
      addToast(`Selected: "${prob.title}". Filtering matched specialists.`, 'success');
      if (onProblemSelect) onProblemSelect(prob);
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Urgent':
      case 'Critical':
        return <span className="prob-badge prob-urgent">⚡ Urgent (20m Dispatch)</span>;
      case 'High':
        return <span className="prob-badge prob-high">High Priority</span>;
      default:
        return <span className="prob-badge prob-normal">Standard Diagnosis</span>;
    }
  };

  return (
    <div className="problem-selector-card">
      <div className="prob-selector-header">
        <div className="prob-title-row">
          <HelpCircle size={20} color="#10b981" />
          <h3 className="prob-heading">What's the Problem with your {categoryName}?</h3>
        </div>
        <span className="prob-subtitle">
          Select your exact symptom to match certified {categoryName.toLowerCase()} technicians equipped with the right tools.
        </span>
      </div>

      <div className="problem-chips-grid">
        {problems.map((prob) => {
          const isSelected = selectedProblem?.id === prob.id;
          return (
            <div
              key={prob.id}
              onClick={() => handleSelect(prob)}
              className={`problem-chip-item ${isSelected ? 'selected' : ''}`}
            >
              <div className="chip-top">
                <div className="chip-check-circle">
                  {isSelected ? <Check size={14} color="#000" strokeWidth={3} /> : <span className="chip-dot" />}
                </div>
                {getSeverityBadge(prob.severity)}
              </div>

              <h4 className="chip-title">{prob.title}</h4>
              <p className="chip-desc">{prob.desc}</p>

              <div className="chip-footer">
                <span className="est-time">
                  <Clock size={12} color="#10b981" /> Est: {prob.estTime}
                </span>
                <span className="match-prompt">
                  {isSelected ? 'Issue Selected' : 'Select Issue'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProblem && (
        <div className="selected-problem-banner">
          <div className="spb-left">
            <Sparkles size={16} color="#10b981" />
            <div>
              <strong>Diagnosing: {selectedProblem.title}</strong>
              <p>Specialists experienced with this exact symptom are prioritized below.</p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedProblem(null)} 
            className="btn btn-secondary btn-sm"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};
