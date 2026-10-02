import React from 'react';

/**
 * 2D Animated Flat Vector Illustrations for the 3 Roles on the Welcome Auth Screen.
 * Professional, clean, SVG + CSS animated illustrations.
 */
export const RoleIllustration = ({ role }) => {
  switch (role) {
    case 'consumer':
      return (
        <div className="role-illust-wrapper consumer-illust">
          <svg viewBox="0 0 120 100" className="role-svg">
            {/* Background subtle aura */}
            <circle cx="60" cy="50" r="38" fill="rgba(16, 185, 129, 0.1)" className="svg-pulse-ring" />
            
            {/* Person avatar body */}
            <circle cx="60" cy="34" r="14" fill="#10b981" />
            <path d="M 38 68 Q 38 52 60 52 Q 82 52 82 68 Z" fill="#059669" />

            {/* Smartphone in hand */}
            <g className="illust-float-subtle">
              <rect x="70" y="42" width="22" height="38" rx="4" fill="#1e293b" stroke="#34d399" strokeWidth="2" />
              <rect x="73" y="47" width="16" height="26" rx="2" fill="#0f172a" />
              {/* Checkmark on phone screen representing instant booking */}
              <polyline points="77,60 80,63 86,57" fill="none" stroke="#00e676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Floating Sparkles & Calendar booking pin */}
            <polygon points="34,26 36,31 41,33 36,35 34,40 32,35 27,33 32,31" fill="#fbbf24" className="svg-sparkle sparkle-1" />
            <circle cx="28" cy="56" r="4" fill="rgba(56, 189, 248, 0.4)" className="svg-bubble bubble-1" />
          </svg>
        </div>
      );

    case 'provider':
      return (
        <div className="role-illust-wrapper provider-illust">
          <svg viewBox="0 0 120 100" className="role-svg">
            {/* Background aura */}
            <circle cx="60" cy="50" r="38" fill="rgba(16, 185, 129, 0.1)" className="svg-pulse-ring" />

            {/* Specialist avatar with hardhat / badge */}
            <circle cx="60" cy="36" r="14" fill="#059669" />
            <path d="M 44 26 Q 60 16 76 26 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <path d="M 38 70 Q 38 54 60 54 Q 82 54 82 70 Z" fill="#1e293b" />

            {/* Animated Rotating Gear Tool */}
            <g className="svg-gear-rotate-cw" style={{ transformOrigin: '32px 38px' }}>
              <circle cx="32" cy="38" r="12" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="6 4" />
              <circle cx="32" cy="38" r="4" fill="#34d399" />
            </g>

            {/* Floating Wrench */}
            <g className="svg-tool-wrench" style={{ transformOrigin: '88px 36px' }}>
              <rect x="80" y="24" width="6" height="24" rx="2" fill="#94a3b8" transform="rotate(35 83 36)" />
              <circle cx="83" cy="24" r="5" fill="none" stroke="#10b981" strokeWidth="3" />
            </g>
          </svg>
        </div>
      );

    case 'admin':
      return (
        <div className="role-illust-wrapper admin-illust">
          <svg viewBox="0 0 120 100" className="role-svg">
            {/* Security Shield */}
            <path d="M 60 18 Q 84 18 84 38 C 84 62 60 78 60 78 C 60 78 36 62 36 38 Q 36 18 60 18 Z" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="2.5" />

            {/* Keyhole / Lock Core */}
            <circle cx="60" cy="42" r="7" fill="#fbbf24" />
            <polygon points="57,44 63,44 65,58 55,58" fill="#fbbf24" />

            {/* Scanning radar sweep circle */}
            <circle cx="60" cy="46" r="28" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" className="svg-pulse-ring" />

            {/* Console analytics chart bar */}
            <rect x="22" y="58" width="6" height="18" rx="2" fill="#059669" />
            <rect x="30" y="50" width="6" height="26" rx="2" fill="#10b981" />
            <rect x="84" y="54" width="6" height="22" rx="2" fill="#10b981" />
            <rect x="92" y="62" width="6" height="14" rx="2" fill="#059669" />
          </svg>
        </div>
      );

    default:
      return null;
  }
};
