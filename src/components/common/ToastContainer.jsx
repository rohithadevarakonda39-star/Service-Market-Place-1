import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
            <div className="toast-icon-wrapper">
              {isSuccess && <CheckCircle2 size={18} color="#10b981" />}
              {isError && <AlertCircle size={18} color="#ef4444" />}
              {!isSuccess && !isError && <Info size={18} color="#06b6d4" />}
            </div>
            <div className="toast-text-content">
              {toast.message}
            </div>
            <button 
              className="toast-close-btn" 
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}

      <style>{`
        .toast-icon-wrapper {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .toast-text-content {
          flex: 1;
          font-weight: 500;
          line-height: 1.35;
        }
        .toast-close-btn {
          color: var(--text-muted);
          padding: 2px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color var(--transition-fast);
        }
        .toast-close-btn:hover {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};
