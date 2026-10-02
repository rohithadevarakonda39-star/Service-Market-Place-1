import React from 'react';

/**
 * 2D Animated Flat Vector Illustrations for all 30 Service Categories.
 * Styled with subtle, professional micro-animations (floating, pulsing, gentle rotation, glowing, breeze, droplets).
 */
export const CategoryIllustration = ({ categoryId }) => {
  switch (categoryId) {
    case 'plumbing':
      return (
        <div className="illustration-wrapper plumbing-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Pipe structure */}
            <path d="M 20 25 L 50 25 Q 60 25 60 35 L 60 55 Q 60 65 70 65 L 85 65" fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <path d="M 20 25 L 50 25 Q 60 25 60 35 L 60 55 Q 60 65 70 65 L 85 65" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            {/* Pipe Joints */}
            <rect x="18" y="20" width="6" height="10" rx="2" fill="#059669" />
            <rect x="80" y="60" width="6" height="10" rx="2" fill="#059669" />
            {/* Water Drops */}
            <ellipse cx="60" cy="50" rx="3" ry="5" fill="#38bdf8" className="svg-drop drop-1" />
            <ellipse cx="60" cy="56" rx="2.5" ry="4" fill="#0ea5e9" className="svg-drop drop-2" />
            {/* Wrench Tool */}
            <g className="svg-tool-wrench">
              <rect x="25" y="45" width="28" height="6" rx="3" fill="#64748b" transform="rotate(-35 30 50)" />
              <circle cx="28" cy="52" r="7" fill="none" stroke="#10b981" strokeWidth="4" />
            </g>
          </svg>
        </div>
      );

    case 'electrician':
      return (
        <div className="illustration-wrapper electrician-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Power Outlet / Socket Background */}
            <rect x="25" y="15" width="50" height="50" rx="14" fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" strokeWidth="2.5" />
            <circle cx="38" cy="38" r="4" fill="#64748b" />
            <circle cx="62" cy="38" r="4" fill="#64748b" />
            <rect x="47" y="48" width="6" height="10" rx="3" fill="#64748b" />
            {/* Energy Lightning Bolt */}
            <polygon 
              points="52,10 40,36 50,36 44,58 64,30 53,30" 
              fill="#fbbf24" 
              className="svg-lightning"
            />
            {/* Electric Spark Arcs */}
            <circle cx="50" cy="36" r="22" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" className="svg-pulse-ring" />
          </svg>
        </div>
      );

    case 'ac-repair':
      return (
        <div className="illustration-wrapper ac-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* AC Unit Body */}
            <rect x="18" y="16" width="64" height="28" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <rect x="22" y="34" width="56" height="4" rx="2" fill="#059669" />
            {/* Power LED */}
            <circle cx="74" cy="24" r="2.5" fill="#00e676" className="svg-beacon-dot" />
            {/* Blowing Cool Air Breeze Waves */}
            <path d="M 30 46 Q 40 54 50 48 T 70 54" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" className="svg-wind-wave wave-1" />
            <path d="M 26 55 Q 38 65 52 58 T 74 66" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" className="svg-wind-wave wave-2" />
            {/* Snowflake Icon */}
            <g transform="translate(45, 62)" className="svg-spin-slow">
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="0" y1="-5" x2="0" y2="5" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="1.5" fill="#38bdf8" />
            </g>
          </svg>
        </div>
      );

    case 'home-cleaning':
      return (
        <div className="illustration-wrapper cleaning-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Spray Bottle */}
            <path d="M 32 30 L 46 30 L 48 65 Q 48 68 44 68 L 34 68 Q 30 68 30 65 Z" fill="#10b981" opacity="0.85" />
            <path d="M 34 30 L 34 22 L 44 22 L 44 30 Z" fill="#059669" />
            <path d="M 30 22 L 48 20 L 52 24 L 38 24 Z" fill="#334155" />
            {/* Spray Trigger */}
            <path d="M 44 24 Q 52 28 46 34" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
            {/* Sparkles & Bubbles */}
            <polygon points="68,18 70,24 76,26 70,28 68,34 66,28 60,26 66,24" fill="#fbbf24" className="svg-sparkle sparkle-1" />
            <polygon points="56,36 57,40 61,41 57,42 56,46 55,42 51,41 55,40" fill="#34d399" className="svg-sparkle sparkle-2" />
            <circle cx="70" cy="48" r="5" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="svg-bubble bubble-1" />
            <circle cx="60" cy="58" r="3.5" fill="none" stroke="#7dd3fc" strokeWidth="1.5" className="svg-bubble bubble-2" />
          </svg>
        </div>
      );

    case 'car-service':
      return (
        <div className="illustration-wrapper car-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Car Silhouette */}
            <path d="M 18 45 L 30 28 Q 33 24 40 24 L 62 24 Q 68 24 72 30 L 82 45 L 86 48 Q 88 52 86 56 L 16 56 Q 14 52 16 48 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <path d="M 34 28 L 60 28 L 68 42 L 28 42 Z" fill="rgba(16, 185, 129, 0.25)" />
            {/* Wheels with Spin Animation */}
            <g className="svg-wheel-spin" style={{ transformOrigin: '32px 56px' }}>
              <circle cx="32" cy="56" r="10" fill="#090c0b" stroke="#10b981" strokeWidth="2.5" />
              <circle cx="32" cy="56" r="4" fill="#64748b" />
            </g>
            <g className="svg-wheel-spin" style={{ transformOrigin: '70px 56px' }}>
              <circle cx="70" cy="56" r="10" fill="#090c0b" stroke="#10b981" strokeWidth="2.5" />
              <circle cx="70" cy="56" r="4" fill="#64748b" />
            </g>
            {/* Headlight beam */}
            <polygon points="84,48 98,42 98,54" fill="rgba(251, 191, 36, 0.3)" />
          </svg>
        </div>
      );

    case 'bike-service':
      return (
        <div className="illustration-wrapper bike-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Wheels */}
            <circle cx="28" cy="52" r="12" fill="none" stroke="#10b981" strokeWidth="3" className="svg-wheel-spin" style={{ transformOrigin: '28px 52px' }} />
            <circle cx="72" cy="52" r="12" fill="none" stroke="#10b981" strokeWidth="3" className="svg-wheel-spin" style={{ transformOrigin: '72px 52px' }} />
            <circle cx="28" cy="52" r="3" fill="#64748b" />
            <circle cx="72" cy="52" r="3" fill="#64748b" />
            {/* Bike Frame */}
            <path d="M 28 52 L 46 52 L 56 34 L 38 34 Z" fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 46 52 L 66 26" stroke="#e2e8f0" strokeWidth="2.5" />
            <path d="M 72 52 L 66 26 L 62 24" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
            {/* Seat */}
            <path d="M 34 32 L 44 32" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
            {/* Animated Cog */}
            <circle cx="50" cy="52" r="5" fill="#f59e0b" className="svg-spin-fast" style={{ transformOrigin: '50px 52px' }} />
          </svg>
        </div>
      );

    case 'beauty-salon':
      return (
        <div className="illustration-wrapper beauty-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Snapping Scissors */}
            <g className="svg-scissor-1" style={{ transformOrigin: '48px 40px' }}>
              <path d="M 30 22 L 68 56" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="26" cy="18" r="6" fill="none" stroke="#10b981" strokeWidth="2.5" />
            </g>
            <g className="svg-scissor-2" style={{ transformOrigin: '48px 40px' }}>
              <path d="M 30 58 L 68 24" stroke="#cbd5e1" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="26" cy="62" r="6" fill="none" stroke="#10b981" strokeWidth="2.5" />
            </g>
            <circle cx="48" cy="40" r="3" fill="#059669" />
            {/* Floating Glamour Sparkles */}
            <polygon points="76,16 78,21 83,23 78,25 76,30 74,25 69,23 74,21" fill="#ec4899" className="svg-sparkle sparkle-1" />
            <polygon points="72,50 73,53 76,54 73,55 72,58 71,55 68,54 71,53" fill="#f43f5e" className="svg-sparkle sparkle-2" />
          </svg>
        </div>
      );

    case 'painting':
      return (
        <div className="illustration-wrapper painting-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Paint Stripe Trail */}
            <path d="M 22 28 Q 50 24 78 28" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" className="svg-paint-trail" />
            {/* Paint Roller Tool */}
            <g className="svg-roller-glide">
              <rect x="45" y="16" width="30" height="12" rx="4" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
              {/* Wire frame */}
              <path d="M 60 28 L 60 40 L 46 48 L 46 66" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="43" y="58" width="6" height="14" rx="2" fill="#334155" />
            </g>
            {/* Fresh Dripping Paint Drops */}
            <circle cx="36" cy="38" r="3" fill="#10b981" className="svg-drop drop-1" />
            <circle cx="68" cy="36" r="2.5" fill="#34d399" className="svg-drop drop-2" />
          </svg>
        </div>
      );

    case 'carpenter':
      return (
        <div className="illustration-wrapper carpenter-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Wood Block Base */}
            <rect x="18" y="52" width="64" height="14" rx="3" fill="#78350f" stroke="#b45309" strokeWidth="2" />
            <line x1="24" y1="58" x2="76" y2="58" stroke="#92400e" strokeWidth="1.5" strokeDasharray="6 3" />
            {/* Nail */}
            <rect x="48" y="44" width="4" height="10" fill="#94a3b8" />
            <rect x="46" y="42" width="8" height="3" fill="#cbd5e1" />
            {/* Hammer Striking */}
            <g className="svg-hammer-strike" style={{ transformOrigin: '65px 42px' }}>
              <rect x="36" y="24" width="22" height="10" rx="3" fill="#475569" />
              <rect x="52" y="18" width="6" height="38" rx="2" fill="#d97706" transform="rotate(35 52 18)" />
            </g>
            {/* Sawdust particles */}
            <circle cx="45" cy="46" r="1.5" fill="#fbbf24" className="svg-sparkle sparkle-1" />
            <circle cx="55" cy="45" r="1.5" fill="#f59e0b" className="svg-sparkle sparkle-2" />
          </svg>
        </div>
      );

    case 'pest-control':
      return (
        <div className="illustration-wrapper pest-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Shield Outline */}
            <path d="M 50 14 Q 72 14 72 32 C 72 52 50 66 50 66 C 50 66 28 52 28 32 Q 28 14 50 14 Z" fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" strokeWidth="2.5" />
            {/* Chemical Spray Canister */}
            <rect x="42" y="28" width="16" height="24" rx="4" fill="#059669" />
            <rect x="46" y="24" width="8" height="4" fill="#334155" />
            {/* Bio Puff Waves */}
            <circle cx="50" cy="40" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" className="svg-pulse-ring" />
            <circle cx="68" cy="24" r="3" fill="#34d399" className="svg-bubble bubble-1" />
            <circle cx="34" cy="24" r="2.5" fill="#10b981" className="svg-bubble bubble-2" />
          </svg>
        </div>
      );

    case 'laptop-repair':
    case 'computer-repair':
      return (
        <div className="illustration-wrapper laptop-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Laptop Display */}
            <rect x="24" y="16" width="52" height="34" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            {/* Screen Content - Code / Pulse */}
            <path d="M 32 33 L 42 33 L 48 24 L 54 42 L 60 33 L 68 33" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" className="svg-ecg-line" />
            {/* Laptop Keyboard Base */}
            <path d="M 14 52 L 86 52 L 80 58 Q 78 60 74 60 L 26 60 Q 22 60 20 58 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            {/* Screwdriver / Repair Icon */}
            <g className="svg-floating-tool">
              <rect x="68" y="14" width="5" height="18" rx="2" fill="#059669" transform="rotate(30 70 20)" />
              <polygon points="76,14 74,18 78,16" fill="#94a3b8" />
            </g>
          </svg>
        </div>
      );

    case 'mobile-repair':
      return (
        <div className="illustration-wrapper mobile-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Smartphone Body */}
            <rect x="34" y="12" width="32" height="56" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
            {/* Screen Area */}
            <rect x="38" y="18" width="24" height="42" rx="3" fill="#1e293b" />
            {/* Speaker & Home indicator */}
            <circle cx="50" cy="15" r="1.5" fill="#64748b" />
            <line x1="46" y1="56" x2="54" y2="56" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Glowing Screen Diagnostics */}
            <polygon points="46,26 50,34 54,34 50,44" fill="#00e676" className="svg-lightning" />
            <circle cx="50" cy="38" r="8" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" className="svg-pulse-ring" />
          </svg>
        </div>
      );

    case 'cctv-installation':
      return (
        <div className="illustration-wrapper cctv-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Wall Mount Bracket */}
            <rect x="18" y="20" width="8" height="24" rx="2" fill="#334155" />
            <path d="M 26 30 L 42 30" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            {/* Camera Body with Sweeping Radar Angle */}
            <g className="svg-cctv-scan" style={{ transformOrigin: '42px 30px' }}>
              <rect x="40" y="22" width="34" height="18" rx="4" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
              <circle cx="74" cy="31" r="5" fill="#090c0b" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="74" cy="31" r="2" fill="#ef4444" className="svg-beacon-dot" />
              {/* Infrared Scan Cones */}
              <polygon points="76,28 96,16 96,46 76,34" fill="rgba(16, 185, 129, 0.15)" />
            </g>
          </svg>
        </div>
      );

    case 'ro-service':
      return (
        <div className="illustration-wrapper ro-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Purifier Container */}
            <rect x="30" y="16" width="40" height="48" rx="8" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" strokeWidth="2" />
            {/* Water Wave Inside Tank */}
            <path d="M 31 46 Q 40 42 50 46 T 69 46 L 69 60 Q 69 63 65 63 L 35 63 Q 31 63 31 60 Z" fill="rgba(56, 189, 248, 0.4)" className="svg-water-level" />
            {/* Falling Droplets */}
            <ellipse cx="50" cy="24" rx="3" ry="5" fill="#38bdf8" className="svg-drop drop-1" />
            <ellipse cx="50" cy="34" rx="2.5" ry="4" fill="#0ea5e9" className="svg-drop drop-2" />
            {/* Sparkle Mineral badge */}
            <circle cx="62" cy="22" r="3" fill="#10b981" className="svg-sparkle sparkle-1" />
          </svg>
        </div>
      );

    case 'washing-machine-repair':
      return (
        <div className="illustration-wrapper washer-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Machine Body */}
            <rect x="25" y="14" width="50" height="56" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            {/* Top Control Panel */}
            <rect x="29" y="18" width="42" height="8" rx="2" fill="#0f172a" />
            <circle cx="34" cy="22" r="2" fill="#10b981" />
            <circle cx="42" cy="22" r="1.5" fill="#fbbf24" />
            {/* Circular Drum Door with Water Spin */}
            <circle cx="50" cy="44" r="16" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
            <g className="svg-drum-spin" style={{ transformOrigin: '50px 44px' }}>
              <circle cx="50" cy="44" r="11" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" />
              <circle cx="50" cy="44" r="4" fill="#0ea5e9" />
            </g>
          </svg>
        </div>
      );

    case 'refrigerator-repair':
      return (
        <div className="illustration-wrapper fridge-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Refrigerator Double Door Body */}
            <rect x="30" y="12" width="40" height="58" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <line x1="30" y1="34" x2="70" y2="34" stroke="#475569" strokeWidth="2" />
            {/* Handles */}
            <rect x="34" y="24" width="2" height="6" rx="1" fill="#10b981" />
            <rect x="34" y="38" width="2" height="12" rx="1" fill="#10b981" />
            {/* Frost Waves & Snowflakes */}
            <g className="svg-frost-pulse">
              <path d="M 52 22 Q 58 20 62 24" fill="none" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 50 48 Q 58 45 64 50" fill="none" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" />
              <polygon points="56,26 58,29 61,30 58,31 56,34 54,31 51,30 54,29" fill="#38bdf8" className="svg-sparkle sparkle-1" />
            </g>
          </svg>
        </div>
      );

    case 'gardening':
      return (
        <div className="illustration-wrapper gardening-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Plant Pot */}
            <polygon points="36,46 64,46 58,68 42,68" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <rect x="33" y="43" width="34" height="5" rx="2" fill="#92400e" />
            {/* Growing Leaves with Gentle Sway */}
            <g className="svg-sprout-sway" style={{ transformOrigin: '50px 45px' }}>
              <path d="M 50 45 Q 50 28 50 20" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
              <path d="M 50 32 Q 62 26 64 36 Q 52 38 50 32 Z" fill="#10b981" />
              <path d="M 50 26 Q 38 20 36 30 Q 48 32 50 26 Z" fill="#34d399" />
              <path d="M 50 20 Q 56 12 50 8 Q 44 12 50 20 Z" fill="#10b981" />
            </g>
          </svg>
        </div>
      );

    case 'moving-shifting':
      return (
        <div className="illustration-wrapper moving-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Cardboard Box Top */}
            <g className="svg-box-float">
              <rect x="22" y="28" width="32" height="28" rx="3" fill="#b45309" stroke="#92400e" strokeWidth="2" />
              <line x1="38" y1="28" x2="38" y2="40" stroke="#78350f" strokeWidth="2" />
              <rect x="30" y="38" width="16" height="5" rx="1" fill="#fde047" opacity="0.8" />
            </g>
            {/* Small Stacked Box */}
            <rect x="48" y="36" width="26" height="20" rx="2" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
            {/* Moving Wheels */}
            <circle cx="34" cy="62" r="4" fill="#334155" stroke="#10b981" strokeWidth="2" />
            <circle cx="64" cy="62" r="4" fill="#334155" stroke="#10b981" strokeWidth="2" />
            {/* Motion Lines */}
            <line x1="12" y1="36" x2="18" y2="36" stroke="#10b981" strokeWidth="2" strokeLinecap="round" className="svg-speed-line" />
            <line x1="8" y1="44" x2="16" y2="44" stroke="#34d399" strokeWidth="2" strokeLinecap="round" className="svg-speed-line" />
          </svg>
        </div>
      );

    case 'photography':
      return (
        <div className="illustration-wrapper photo-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Camera Body */}
            <rect x="22" y="24" width="56" height="40" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <rect x="36" y="18" width="16" height="6" rx="2" fill="#475569" />
            {/* Red recording/flash led */}
            <circle cx="70" cy="30" r="2.5" fill="#ef4444" className="svg-beacon-dot" />
            {/* Shutter Lens with Aperture Rotation */}
            <circle cx="50" cy="44" r="14" fill="#090c0b" stroke="#10b981" strokeWidth="3" />
            <g className="svg-lens-spin" style={{ transformOrigin: '50px 44px' }}>
              <circle cx="50" cy="44" r="8" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 3" />
              <circle cx="50" cy="44" r="3" fill="#ffffff" />
            </g>
            {/* Flash Light Beams */}
            <polygon points="50,18 42,4 58,4" fill="rgba(251, 191, 36, 0.4)" className="svg-flash-burst" />
          </svg>
        </div>
      );

    case 'fitness-trainer':
      return (
        <div className="illustration-wrapper fitness-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Dumbbell with Weight Lift Animation */}
            <g className="svg-dumbbell-lift">
              {/* Bar */}
              <rect x="26" y="37" width="48" height="6" rx="3" fill="#cbd5e1" />
              {/* Left Plates */}
              <rect x="20" y="26" width="7" height="28" rx="3" fill="#10b981" />
              <rect x="14" y="31" width="6" height="18" rx="2" fill="#059669" />
              {/* Right Plates */}
              <rect x="73" y="26" width="7" height="28" rx="3" fill="#10b981" />
              <rect x="80" y="31" width="6" height="18" rx="2" fill="#059669" />
            </g>
            {/* Heartbeat pulse wave */}
            <path d="M 22 62 L 38 62 L 44 54 L 50 68 L 56 58 L 62 62 L 78 62" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" className="svg-ecg-line" />
          </svg>
        </div>
      );

    case 'yoga':
      return (
        <div className="illustration-wrapper yoga-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Concentric Aura Rings */}
            <circle cx="50" cy="38" r="26" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" className="svg-pulse-ring" />
            <circle cx="50" cy="38" r="18" fill="none" stroke="#34d399" strokeWidth="1.5" className="svg-pulse-ring" />
            {/* Meditating Lotus Figure */}
            <circle cx="50" cy="20" r="5" fill="#10b981" />
            <path d="M 50 26 Q 44 38 34 46 Q 50 48 50 44 Q 50 48 66 46 Q 56 38 50 26 Z" fill="#059669" />
            {/* Base Lotus Petals */}
            <path d="M 30 50 Q 50 60 70 50 Q 50 56 30 50 Z" fill="#34d399" />
          </svg>
        </div>
      );

    case 'makeup-artist':
      return (
        <div className="illustration-wrapper makeup-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Fluffy Makeup Brush */}
            <g className="svg-brush-sweep" style={{ transformOrigin: '50px 50px' }}>
              <path d="M 44 34 Q 40 18 50 14 Q 60 18 56 34 Z" fill="#ec4899" />
              <rect x="46" y="34" width="8" height="6" fill="#fbbf24" />
              <rect x="48" y="40" width="4" height="26" rx="2" fill="#334155" />
            </g>
            {/* Shimmer Dust Cloud */}
            <circle cx="36" cy="18" r="2" fill="#f43f5e" className="svg-sparkle sparkle-1" />
            <circle cx="64" cy="16" r="2.5" fill="#fbbf24" className="svg-sparkle sparkle-2" />
            <circle cx="58" cy="24" r="1.5" fill="#f472b6" className="svg-sparkle sparkle-1" />
          </svg>
        </div>
      );

    case 'interior-design':
      return (
        <div className="illustration-wrapper interior-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Modern Armchair */}
            <path d="M 32 38 Q 30 46 34 54 L 66 54 Q 70 46 68 38 Q 50 34 32 38 Z" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
            <rect x="36" y="44" width="28" height="10" rx="3" fill="#059669" />
            {/* Chair legs */}
            <line x1="36" y1="54" x2="32" y2="66" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="64" y1="54" x2="68" y2="66" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
            {/* Floor Lamp with Ambient Cone */}
            <line x1="78" y1="26" x2="78" y2="66" stroke="#475569" strokeWidth="2" />
            <polygon points="72,26 84,26 80,18 76,18" fill="#fbbf24" />
            <polygon points="74,26 82,26 90,50 66,50" fill="rgba(251, 191, 36, 0.15)" />
          </svg>
        </div>
      );

    case 'event-services':
      return (
        <div className="illustration-wrapper event-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Stage Platform */}
            <polygon points="20,54 80,54 86,64 14,64" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            {/* Sweeping Stage Spotlights */}
            <g className="svg-spotlight-left" style={{ transformOrigin: '24px 18px' }}>
              <polygon points="22,16 26,16 54,54 34,54" fill="rgba(16, 185, 129, 0.25)" />
              <circle cx="24" cy="18" r="4" fill="#10b981" />
            </g>
            <g className="svg-spotlight-right" style={{ transformOrigin: '76px 18px' }}>
              <polygon points="74,16 78,16 66,54 46,54" fill="rgba(251, 191, 36, 0.25)" />
              <circle cx="76" cy="18" r="4" fill="#fbbf24" />
            </g>
            {/* Star Glints */}
            <polygon points="50,22 52,26 56,27 52,28 50,32 48,28 44,27 48,26" fill="#38bdf8" className="svg-sparkle sparkle-1" />
          </svg>
        </div>
      );

    case 'mechanic':
      return (
        <div className="illustration-wrapper mechanic-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Main Drive Gear */}
            <g className="svg-gear-rotate-cw" style={{ transformOrigin: '40px 42px' }}>
              <circle cx="40" cy="42" r="18" fill="none" stroke="#10b981" strokeWidth="5" strokeDasharray="8 6" />
              <circle cx="40" cy="42" r="9" fill="#1e293b" stroke="#34d399" strokeWidth="2" />
              <circle cx="40" cy="42" r="3" fill="#090c0b" />
            </g>
            {/* Secondary Interlocking Gear */}
            <g className="svg-gear-rotate-ccw" style={{ transformOrigin: '66px 30px' }}>
              <circle cx="66" cy="30" r="12" fill="none" stroke="#64748b" strokeWidth="4" strokeDasharray="6 4" />
              <circle cx="66" cy="30" r="5" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      );

    case 'tutors':
      return (
        <div className="illustration-wrapper tutor-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Open Book */}
            <path d="M 22 48 Q 50 44 50 34 Q 50 44 78 48 L 76 60 Q 50 56 50 46 Q 50 56 24 60 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <path d="M 26 46 Q 50 42 50 36 L 50 46 Q 50 54 26 58 Z" fill="rgba(16, 185, 129, 0.15)" />
            {/* Floating Graduation Cap */}
            <g className="svg-cap-float">
              <polygon points="50,14 74,24 50,32 26,24" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <rect x="44" y="28" width="12" height="6" rx="2" fill="#059669" />
              <path d="M 70 24 L 72 36" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      );

    case 'laundry':
      return (
        <div className="illustration-wrapper laundry-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Modern Steam Iron */}
            <g className="svg-iron-slide">
              <path d="M 30 52 L 68 52 Q 74 52 74 46 Q 74 38 60 38 L 40 38 Q 30 38 30 46 Z" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
              <path d="M 38 38 L 38 28 L 58 28" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            {/* Rising Steam Clouds */}
            <path d="M 44 32 Q 42 22 48 18" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" className="svg-steam steam-1" />
            <path d="M 54 30 Q 58 20 52 14" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" className="svg-steam steam-2" />
            <path d="M 64 34 Q 68 24 64 20" fill="none" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" className="svg-steam steam-3" />
          </svg>
        </div>
      );

    case 'emergency-services':
    default:
      return (
        <div className="illustration-wrapper emergency-anim">
          <svg viewBox="0 0 100 80" className="cat-svg">
            {/* Flashing Emergency Beacon Base */}
            <rect x="34" y="44" width="32" height="14" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            {/* Beacon Dome with Warning Glow */}
            <path d="M 38 44 Q 38 22 50 20 Q 62 22 62 44 Z" fill="#ef4444" className="svg-beacon-glow" />
            {/* Priority Cross Symbol */}
            <rect x="48" y="28" width="4" height="10" rx="1" fill="#ffffff" />
            <rect x="45" y="31" width="10" height="4" rx="1" fill="#ffffff" />
            {/* Emergency Siren Pulse Waves */}
            <circle cx="50" cy="32" r="22" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" className="svg-pulse-ring" />
            <circle cx="50" cy="32" r="30" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" className="svg-pulse-ring" style={{ animationDelay: '0.6s' }} />
          </svg>
        </div>
      );
  }
};
