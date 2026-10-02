import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  MapPin, 
  Compass, 
  Layers, 
  RotateCcw, 
  Play, 
  Pause, 
  CheckCircle, 
  Truck, 
  User, 
  Zap,
  Maximize2
} from 'lucide-react';

export const LiveTrackingMap = ({ 
  customerLocation = { lat: 37.7749, lng: -122.4194, address: "742 Evergreen Terrace, Springfield" },
  providerLocation = { lat: 37.7550, lng: -122.4400, name: "Specialist In-Transit" },
  status = "PROVIDER_ON_THE_WAY",
  isEmergency = false,
  onStatusUpdate
}) => {
  // Map visualization state
  const [mapMode, setMapMode] = useState('dark'); // 'dark', 'light', 'satellite'
  const [isSimulating, setIsSimulating] = useState(true);
  const [simProgress, setSimProgress] = useState(0.35); // 0 (start) to 1 (arrived)
  
  // Waypoint route coordinates in percentage [x, y]
  const waypoints = [
    { x: 18, y: 82, label: "Specialist Depot / Base" },
    { x: 32, y: 70, label: "Highway 101 Junction" },
    { x: 45, y: 55, label: "Market St Cross" },
    { x: 62, y: 42, label: "Residential Avenue" },
    { x: 80, y: 25, label: "Customer Destination" }
  ];

  // Calculate current vehicle coordinates along path
  const getVehiclePos = (progress) => {
    const totalSegments = waypoints.length - 1;
    const segmentFraction = 1 / totalSegments;
    const currentIndex = Math.min(Math.floor(progress / segmentFraction), totalSegments - 1);
    const segmentProgress = (progress - currentIndex * segmentFraction) / segmentFraction;

    const p1 = waypoints[currentIndex];
    const p2 = waypoints[currentIndex + 1];

    const x = p1.x + (p2.x - p1.x) * segmentProgress;
    const y = p1.y + (p2.y - p1.y) * segmentProgress;

    // Calculate heading angle
    const angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const angleDeg = (angleRad * 180) / Math.PI + 90;

    return { x, y, angle: angleDeg };
  };

  const vehiclePos = getVehiclePos(simProgress);

  // Simulation timer
  useEffect(() => {
    if (!isSimulating || simProgress >= 1) return;

    const interval = setInterval(() => {
      setSimProgress(prev => {
        const next = prev + (isEmergency ? 0.015 : 0.008);
        if (next >= 1) {
          if (onStatusUpdate && status === 'PROVIDER_ON_THE_WAY') {
            onStatusUpdate('ARRIVED');
          }
          return 1;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, simProgress, isEmergency, status, onStatusUpdate]);

  // Derived Distance and ETA
  const remainingFraction = Math.max(0, 1 - simProgress);
  const distanceKm = (remainingFraction * (isEmergency ? 2.5 : 4.8)).toFixed(1);
  const etaMinutes = Math.ceil(remainingFraction * (isEmergency ? 8 : 18));

  // Reset simulation
  const handleResetSim = () => {
    setSimProgress(0);
    setIsSimulating(true);
  };

  return (
    <div className="card overflow-hidden bg-surface border-border relative shadow-xl">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="bg-surface/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-border/80 shadow-lg pointer-events-auto flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${simProgress >= 1 ? 'bg-emerald-500' : 'bg-emerald-500 animate-ping'}`} />
          <div>
            <span className="text-xs font-bold text-foreground block">
              {simProgress >= 1 ? 'Specialist Arrived On-Site' : 'Live GPS Fleet Tracking'}
            </span>
            <span className="text-[11px] text-muted">
              {simProgress >= 1 ? 'Vehicle parked at location' : `Satellite Precision: ±3m • Real-time telemetry`}
            </span>
          </div>
        </div>

        {/* Live Metrics Floating Capsule */}
        <div className="bg-surface/90 backdrop-blur-md px-4 py-2 rounded-xl border border-border/80 shadow-lg pointer-events-auto flex items-center gap-4">
          <div>
            <span className="text-[10px] text-muted uppercase font-bold tracking-wider block">Estimated Distance</span>
            <span className="text-sm font-extrabold text-foreground">{simProgress >= 1 ? '0.0 km' : `${distanceKm} km`}</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div>
            <span className="text-[10px] text-muted uppercase font-bold tracking-wider block">Arrival ETA</span>
            <span className="text-sm font-extrabold text-emerald-400">
              {simProgress >= 1 ? 'Arrived' : `~${etaMinutes} mins`}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Vector / Mock Map Stage */}
      <div className="relative w-full h-[420px] bg-slate-950 overflow-hidden select-none">
        {/* Map Grid Pattern & City Layout */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="streetGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
            <linearGradient id="routeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="#090d16" />
          <rect width="100%" height="100%" fill="url(#streetGrid)" />

          {/* City Parks / Waterfront simulation */}
          <path d="M 0,280 Q 180,240 260,380 L 0,420 Z" fill="rgba(16, 185, 129, 0.07)" />
          <path d="M 320,0 Q 420,120 600,80 L 600,0 Z" fill="rgba(56, 189, 248, 0.06)" />

          {/* Major Road Arteries */}
          <line x1="0" y1="240" x2="800" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
          <line x1="280" y1="0" x2="360" y2="450" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
          <line x1="100" y1="420" x2="700" y2="40" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />

          {/* Dynamic Route Polyline */}
          <path
            d={`M ${waypoints.map(w => `${(w.x / 100) * 800},${(w.y / 100) * 420}`).join(' L ')}`}
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 6"
            className="animate-pulse"
          />

          {/* Completed Segment Polyline */}
          <path
            d={`M ${(waypoints[0].x / 100) * 800},${(waypoints[0].y / 100) * 420} L ${(vehiclePos.x / 100) * 800},${(vehiclePos.y / 100) * 420}`}
            fill="none"
            stroke="#10b981"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#glow)"
          />
        </svg>

        {/* Customer Destination Marker */}
        <div 
          className="absolute z-10 -translate-x-1/2 -translate-y-full transition-all"
          style={{ left: `${waypoints[waypoints.length - 1].x}%`, top: `${waypoints[waypoints.length - 1].y}%` }}
        >
          <div className="relative flex flex-col items-center">
            {/* Beacon Pulse */}
            <div className="absolute bottom-0 w-8 h-8 rounded-full bg-emerald-500/30 animate-ping -mb-2" />
            
            <div className="bg-surface border border-emerald-500 text-foreground px-2.5 py-1 rounded-md text-[10px] font-bold shadow-lg mb-1 whitespace-nowrap flex items-center gap-1">
              <User size={10} className="text-emerald-400" />
              <span>Your Service Address</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/50">
              <MapPin size={18} />
            </div>
            <div className="w-2 h-2 bg-emerald-400 rotate-45 -mt-1 shadow" />
          </div>
        </div>

        {/* Animated Provider Vehicle Marker */}
        <div 
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
          style={{ 
            left: `${vehiclePos.x}%`, 
            top: `${vehiclePos.y}%` 
          }}
        >
          <div className="relative flex flex-col items-center">
            <div className="bg-emerald-500 text-black px-2 py-0.5 rounded text-[10px] font-extrabold shadow-md mb-1 whitespace-nowrap flex items-center gap-1">
              <Truck size={11} />
              <span>Specialist Van ({distanceKm} km)</span>
            </div>

            <div 
              className="w-10 h-10 rounded-full bg-surface-elevated border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/40 transition-transform duration-300"
              style={{ transform: `rotate(${vehiclePos.angle}deg)` }}
            >
              <Navigation size={20} className="fill-emerald-400" />
            </div>
          </div>
        </div>

        {/* Bottom Map Controls Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="bg-surface/90 backdrop-blur-md p-1.5 rounded-xl border border-border shadow-lg pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              className="btn btn-outline btn-sm py-1 px-2.5 text-xs flex items-center gap-1.5"
              onClick={() => setIsSimulating(!isSimulating)}
              title={isSimulating ? "Pause GPS simulation" : "Resume GPS simulation"}
            >
              {isSimulating ? <Pause size={13} /> : <Play size={13} />}
              <span>{isSimulating ? "Pause" : "Resume Move"}</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm py-1 px-2.5 text-xs flex items-center gap-1"
              onClick={handleResetSim}
              title="Restart vehicle from base"
            >
              <RotateCcw size={13} />
              <span>Restart Route</span>
            </button>

            {isEmergency && (
              <span className="badge badge-danger text-[10px] flex items-center gap-1">
                <Zap size={10} /> 20-MIN PRIORITY
              </span>
            )}
          </div>

          <div className="bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border shadow-lg pointer-events-auto text-[11px] text-muted flex items-center gap-2 font-mono">
            <span>Lat: {customerLocation.lat.toFixed(4)}</span>
            <span>Lng: {customerLocation.lng.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
