import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, 
  Clock, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Phone, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Truck,
  Wrench,
  Flame,
  Droplet,
  Key,
  Shield,
  Car
} from 'lucide-react';
import { providersData } from '../data/providersData';
import { servicesData } from '../data/servicesData';

export const EmergencyPage = () => {
  const { startBookingFlow, navigateTo } = useApp();

  const [selectedEmergencyCategory, setSelectedEmergencyCategory] = useState('all');

  // Emergency Categories & Services
  const emergencyServices = [
    {
      id: 'em-plumb',
      categoryId: 'plumbing',
      title: 'Emergency Plumber',
      subtitle: 'Pipe Bursts, Severe Leaks, Sewer Backup',
      icon: Droplet,
      eta: '15-20 mins',
      distance: '1.4 km',
      priorityFee: '₹20',
      basePrice: '₹599',
      pro: providersData.find(p => p.service?.toLowerCase().includes('plumb')) || providersData[1],
      serviceMatch: servicesData.find(s => s.category === 'plumbing') || servicesData[0],
      problemPreset: 'Kitchen Pipe Burst Emergency Repair'
    },
    {
      id: 'em-elec',
      categoryId: 'electrical',
      title: 'Emergency Electrician',
      subtitle: 'Sparking Breakers, Power Outages, Short Circuits',
      icon: Zap,
      eta: '18-22 mins',
      distance: '2.1 km',
      priorityFee: '₹20',
      basePrice: '₹649',
      pro: providersData.find(p => p.service?.toLowerCase().includes('electric')) || providersData[2],
      serviceMatch: servicesData.find(s => s.category === 'electrical') || servicesData[1],
      problemPreset: 'Master Electrical Panel Diagnostics'
    },
    {
      id: 'em-ac',
      categoryId: 'appliance-repair',
      title: 'Emergency AC Repair',
      subtitle: 'Sudden Heat Wave Compressor Failure',
      icon: Flame,
      eta: '20-25 mins',
      distance: '2.4 km',
      priorityFee: '₹20',
      basePrice: '₹499',
      pro: providersData[0], // Rahul Kumar
      serviceMatch: servicesData[0],
      problemPreset: 'AC not cooling / warm airflow'
    },
    {
      id: 'em-lock',
      categoryId: 'locksmith',
      title: 'Emergency Locksmith',
      subtitle: 'Home & Car Lockouts, Jammed Digital Locks',
      icon: Key,
      eta: '12-18 mins',
      distance: '0.9 km',
      priorityFee: '₹20',
      basePrice: '₹399',
      pro: providersData[3] || providersData[0],
      serviceMatch: servicesData[3] || servicesData[0],
      problemPreset: 'Digital Deadbolt Lockout & Cylinder Jam'
    },
    {
      id: 'em-auto',
      categoryId: 'mechanic',
      title: 'Emergency Mechanic',
      subtitle: 'Flat Tire, Dead Battery, Roadside Breakdown',
      icon: Car,
      eta: '20-25 mins',
      distance: '3.1 km',
      priorityFee: '₹20',
      basePrice: '₹549',
      pro: providersData[4] || providersData[0],
      serviceMatch: servicesData[4] || servicesData[0],
      problemPreset: 'Roadside Battery Jumpstart & Diagnostic'
    },
    {
      id: 'em-security',
      categoryId: 'security',
      title: 'Emergency Home Security',
      subtitle: 'Broken Window Sensors, Alarm Faults, Gate Jam',
      icon: Shield,
      eta: '15-20 mins',
      distance: '1.8 km',
      priorityFee: '₹20',
      basePrice: '₹699',
      pro: providersData[5] || providersData[0],
      serviceMatch: servicesData[5] || servicesData[0],
      problemPreset: 'Security Hub Siren Fault & Sensor Bypass'
    }
  ];

  const handleInstantDispatch = (item) => {
    // Launch booking wizard configured with Emergency priority
    startBookingFlow(
      item.serviceMatch,
      item.pro,
      { title: item.problemPreset, isEmergency: true }
    );
  };

  const filteredEmergency = selectedEmergencyCategory === 'all'
    ? emergencyServices
    : emergencyServices.filter(s => s.categoryId === selectedEmergencyCategory);

  return (
    <div className="container max-w-6xl py-8 animate-fade-in">
      {/* Top Urgent Emergency Banner */}
      <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-rose-950/80 via-surface to-surface border border-rose-500/40 shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Zap size={14} className="animate-bounce" />
              <span>24/7 Rapid Response Dispatch</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Emergency Service Dispatch
            </h1>
            <p className="text-sm text-muted max-w-xl">
              Critical home and commercial emergencies dispatched within 20 minutes. All emergency providers are background-verified and carry rapid response field gear.
            </p>
          </div>

          <div className="bg-surface/80 backdrop-blur-md p-4 rounded-xl border border-rose-500/20 text-center shrink-0">
            <span className="text-[11px] text-muted uppercase font-bold block mb-1">Average Response Radius</span>
            <span className="text-2xl font-black text-rose-400 font-mono">18.4 Mins</span>
            <span className="text-[10px] text-muted block mt-0.5">Live GPS Fleet Telemetry</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {[
          { id: 'all', label: 'All Emergencies' },
          { id: 'plumbing', label: 'Plumbing Bursts' },
          { id: 'electrical', label: 'Electrical Hazards' },
          { id: 'appliance-repair', label: 'AC Failure' },
          { id: 'locksmith', label: 'Lockouts' },
          { id: 'mechanic', label: 'Auto & Roadside' },
          { id: 'security', label: 'Security Alarms' }
        ].map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedEmergencyCategory === cat.id
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-surface text-muted hover:text-foreground border border-border'
            }`}
            onClick={() => setSelectedEmergencyCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Emergency Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmergency.map(item => {
          const Icon = item.icon;

          return (
            <div 
              key={item.id}
              className="card p-6 bg-surface border-border hover:border-rose-500/40 transition-all shadow-md flex flex-col justify-between group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20 group-hover:scale-105 transition-transform">
                    <Icon size={24} />
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Available Now
                    </span>
                    <span className="text-[11px] text-muted block font-mono">ETA: {item.eta}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted mb-4">{item.subtitle}</p>

                {/* Assigned Specialist mini card */}
                <div className="p-3 rounded-xl bg-surface-elevated border border-border mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={item.pro?.image || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=120&q=80"} 
                      alt={item.pro?.name} 
                      className="w-9 h-9 rounded-full object-cover border border-emerald-500" 
                    />
                    <div>
                      <span className="text-xs font-bold text-foreground block">{item.pro?.name}</span>
                      <span className="text-[11px] text-muted">{item.distance} away</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                    <Star size={12} fill="#fbbf24" />
                    <span>{item.pro?.rating || '4.9'}</span>
                  </div>
                </div>

                {/* Pricing info */}
                <div className="flex items-center justify-between text-xs py-2 border-t border-border">
                  <span className="text-muted">Starting Callout</span>
                  <span className="font-bold text-foreground">{item.basePrice}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-3 border-b border-border text-rose-400">
                  <span>Priority Surcharge</span>
                  <span className="font-bold font-mono">+{item.priorityFee}</span>
                </div>
              </div>

              {/* Instant Help CTA */}
              <button
                type="button"
                className="btn btn-primary w-full mt-4 py-3 text-sm font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 border-none shadow-lg shadow-rose-600/30 text-white"
                onClick={() => handleInstantDispatch(item)}
              >
                <Zap size={16} />
                <span>GET HELP NOW</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Safety & Protocol Footer */}
      <div className="mt-10 p-5 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} className="text-emerald-400 shrink-0" />
          <span>
            <strong>Emergency Protocol:</strong> If there is immediate danger to life or fire, please dial 911 / 112 before booking marketplace emergency repair.
          </span>
        </div>
        <a href="tel:911" className="btn btn-outline btn-sm text-rose-400 border-rose-500/30 whitespace-nowrap">
          Call Emergency Hotline
        </a>
      </div>
    </div>
  );
};
