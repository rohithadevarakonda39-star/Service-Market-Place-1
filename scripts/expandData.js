import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import existing providers and categories
import { providersData as existingProviders } from '../src/data/providersData.js';
import { servicesData as existingServices } from '../src/data/servicesData.js';
import { rawCategoriesData } from '../src/data/categoriesData.js';
import { categoryProblemsData } from '../src/data/categoryProblems.js';

// Status options
const statuses = ['available_now', 'available_today', 'available_tomorrow', 'available_today', 'available_now'];
const timeSlots = [
  'Available in 20 mins',
  'Available today at 2:00 PM',
  'Available today at 4:30 PM',
  'Available today at 6:00 PM',
  'Available tomorrow at 9:30 AM',
  'Available tomorrow at 11:00 AM'
];

// Enrich existing 32 providers
const enrichedExisting = existingProviders.map((p, idx) => {
  const distNum = parseFloat((p.distance || '2.5').replace(/[^\d.]/g, '')) || (idx % 8 + 1.2);
  const status = statuses[idx % statuses.length];
  const nextTime = timeSlots[idx % timeSlots.length];
  
  return {
    ...p,
    distanceKm: distNum,
    availabilityStatus: status,
    nextAvailableTime: nextTime,
    cancellationRate: `${(0.2 + (idx % 5) * 0.3).toFixed(1)}%`,
    skills: p.skills || [
      p.service.split(' ')[0],
      'Diagnostic Inspection',
      'OEM Part Replacement',
      'Emergency Dispatch',
      'Preventive Maintenance'
    ],
    serviceArea: p.serviceArea || `${p.location} & Greater Metro (15km radius)`,
    emergencyAvailable: idx % 3 === 0
  };
});

// Additional 20 providers to reach 52 total
const additionalProviders = [
  {
    id: 'prov-33',
    name: 'Vikram Sethi',
    service: 'Master Inverter AC & HVAC Specialist',
    categoryId: 'ac-repair',
    rating: 4.97,
    reviewsCount: 312,
    experience: '13 Years',
    location: 'Metro Central',
    distance: '1.4 km away',
    distanceKm: 1.4,
    startingPrice: 55,
    rateType: 'visit',
    availability: 'Available in 20m',
    availabilityStatus: 'available_now',
    nextAvailableTime: 'Available in 20 mins',
    verified: true,
    badges: ['Daikin & Voltas Pro', 'Gas Leak Specialist'],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 789-0124',
    bio: 'Precision electronic leak detection, dual-inverter PCB diagnosis, vacuum evacuation, and high-pressure jet cleaning.',
    completedJobs: 680,
    responseTime: '< 10 mins',
    cancellationRate: '0.3%',
    skills: ['Inverter PCB Repair', 'R32 Gas Topup', 'Compressor Rebuilding', 'Jet Wash Cleaning'],
    serviceArea: 'Metro Central, Westside, Financial District (12km radius)',
    emergencyAvailable: true
  },
  {
    id: 'prov-34',
    name: 'Ananya Sharma',
    service: 'Senior Bridal & Editorial Makeup Artist',
    categoryId: 'makeup-artist',
    rating: 4.98,
    reviewsCount: 285,
    experience: '8 Years',
    location: 'Park Avenue Enclave',
    distance: '2.1 km away',
    distanceKm: 2.1,
    startingPrice: 120,
    rateType: 'session',
    availability: 'Available Today',
    availabilityStatus: 'available_today',
    nextAvailableTime: 'Available today at 3:00 PM',
    verified: true,
    badges: ['MAC & Huda Certified', 'Celebrity Stylist'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 890-1235',
    bio: 'Luxury HD airbrush makeup, saree & lehenga draping, waterproof finish, and custom skin prep.',
    completedJobs: 390,
    responseTime: '< 20 mins',
    cancellationRate: '0.5%',
    skills: ['HD Airbrush Makeup', 'Bridal Draping', 'Party Glam', 'Skin Tone Color Matching'],
    serviceArea: 'Park Avenue, Uptown, Fashion Enclave (15km radius)',
    emergencyAvailable: false
  },
  {
    id: 'prov-35',
    name: 'Rohan Mehta',
    service: 'Automotive Electrician & Battery Pro',
    categoryId: 'car-service',
    rating: 4.91,
    reviewsCount: 198,
    experience: '10 Years',
    location: 'Motorway Junction',
    distance: '3.5 km away',
    distanceKm: 3.5,
    startingPrice: 45,
    rateType: 'callout',
    availability: 'Available in 30m',
    availabilityStatus: 'available_now',
    nextAvailableTime: 'Available in 30 mins',
    verified: true,
    badges: ['Bosch Auto Certified', 'OBD2 Scanner Master'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 901-2346',
    bio: 'Computerized scanner fault clearing, alternator testing, starter motor rebuilding, and wiring repairs at your doorstep.',
    completedJobs: 440,
    responseTime: '< 15 mins',
    cancellationRate: '0.8%',
    skills: ['OBD2 Diagnostics', 'Alternator Rebuild', 'Battery Jumpstart', 'Car Audio Setup'],
    serviceArea: 'Highway Belt, Industrial West, Suburban Ring (20km radius)',
    emergencyAvailable: true
  },
  {
    id: 'prov-36',
    name: 'Meera Iyer',
    service: 'Certified Yoga & Posture Therapist',
    categoryId: 'yoga',
    rating: 4.96,
    reviewsCount: 165,
    experience: '7 Years',
    location: 'Serene Gardens',
    distance: '2.8 km away',
    distanceKm: 2.8,
    startingPrice: 40,
    rateType: 'session',
    availability: 'Available Today',
    availabilityStatus: 'available_today',
    nextAvailableTime: 'Available today at 5:00 PM',
    verified: true,
    badges: ['Yoga Alliance 500H', 'Back Pain Specialist'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 012-3457',
    bio: 'Therapeutic yoga for lower back pain, posture correction, stress release pranayama, and prenatal wellness at home.',
    completedJobs: 280,
    responseTime: '< 25 mins',
    cancellationRate: '0.4%',
    skills: ['Hatha Yoga', 'Pranayama', 'Posture Correction', 'Meditation Coaching'],
    serviceArea: 'Serene Gardens, South Hills, Riverside (10km radius)',
    emergencyAvailable: false
  },
  {
    id: 'prov-37',
    name: 'Tariq Al-Mansoor',
    service: 'Structural Painting & Texture Artist',
    categoryId: 'painting',
    rating: 4.92,
    reviewsCount: 220,
    experience: '12 Years',
    location: 'Heritage Quarter',
    distance: '4.2 km away',
    distanceKm: 4.2,
    startingPrice: 65,
    rateType: 'room',
    availability: 'Available Tomorrow',
    availabilityStatus: 'available_tomorrow',
    nextAvailableTime: 'Available tomorrow at 9:00 AM',
    verified: true,
    badges: ['Dulux Velvet Master', 'Zero Drip Guaranteed'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 123-4568',
    bio: 'Airless spray gun technology, metallic stucco finishes, anti-fungal waterproofing, and dust-free floor masking.',
    completedJobs: 510,
    responseTime: '< 30 mins',
    cancellationRate: '0.6%',
    skills: ['Airless Spray Painting', 'Metallic Texture', 'Waterproof Putty', 'Color Palette Consultation'],
    serviceArea: 'Heritage Quarter, Downtown, North Suburbs (15km radius)',
    emergencyAvailable: false
  },
  {
    id: 'prov-38',
    name: 'Suresh Patel',
    service: 'Bicycle & E-Bike Mechanics Specialist',
    categoryId: 'bike-service',
    rating: 4.88,
    reviewsCount: 140,
    experience: '9 Years',
    location: 'Old Town Circle',
    distance: '1.9 km away',
    distanceKm: 1.9,
    startingPrice: 30,
    rateType: 'tuneup',
    availability: 'Available Today',
    availabilityStatus: 'available_today',
    nextAvailableTime: 'Available today at 4:00 PM',
    verified: true,
    badges: ['Shimano Certified', 'E-Bike Battery Diagnostics'],
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 234-5679',
    bio: 'Hydraulic disc brake bleeding, gear derailleur indexing, hub servicing, tubeless conversion, and doorstep tune-ups.',
    completedJobs: 330,
    responseTime: '< 20 mins',
    cancellationRate: '0.5%',
    skills: ['Disc Brake Bleeding', 'Derailleur Tuning', 'Hub Overhaul', 'Chain Waxing'],
    serviceArea: 'Old Town, University Campus, Riverwalk (10km radius)',
    emergencyAvailable: true
  },
  {
    id: 'prov-39',
    name: 'Kavita Nair',
    service: 'Urban Balcony & Hydroponic Landscape Pro',
    categoryId: 'gardening',
    rating: 4.95,
    reviewsCount: 180,
    experience: '6 Years',
    location: 'Greenfield Valley',
    distance: '3.1 km away',
    distanceKm: 3.1,
    startingPrice: 45,
    rateType: 'visit',
    availability: 'Available Tomorrow',
    availabilityStatus: 'available_tomorrow',
    nextAvailableTime: 'Available tomorrow at 10:30 AM',
    verified: true,
    badges: ['Certified Horticulturist', 'Organic Pest Solutions'],
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 345-6780',
    bio: 'Balcony vertical gardens, automatic smart drip systems, soil aeration, root rot treatments, and seasonal flower curation.',
    completedJobs: 260,
    responseTime: '< 30 mins',
    cancellationRate: '0.3%',
    skills: ['Vertical Gardens', 'Smart Drip Irrigation', 'Organic Soil Mix', 'Bonsai Pruning'],
    serviceArea: 'Greenfield, Eco Vista, Lake District (15km radius)',
    emergencyAvailable: false
  },
  {
    id: 'prov-40',
    name: 'Deepak Verma',
    service: 'Washing Machine Drum & Motor Specialist',
    categoryId: 'washing-machine-repair',
    rating: 4.93,
    reviewsCount: 230,
    experience: '11 Years',
    location: 'Metro West District',
    distance: '2.4 km away',
    distanceKm: 2.4,
    startingPrice: 49,
    rateType: 'visit',
    availability: 'Available Today',
    availabilityStatus: 'available_today',
    nextAvailableTime: 'Available today at 2:30 PM',
    verified: true,
    badges: ['IFB / LG / Samsung Pro', 'Spider Arm Specialist'],
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 456-7891',
    bio: 'Front load bearing replacement, shock absorber dampers, inlet solenoid valves, and noisy drum spider renewals.',
    completedJobs: 490,
    responseTime: '< 20 mins',
    cancellationRate: '0.4%',
    skills: ['Drum Bearing Replacement', 'PCB Soldering', 'Drain Pump Clearing', 'Shock Absorber Renewal'],
    serviceArea: 'Metro West, City Center, Lakeside (12km radius)',
    emergencyAvailable: true
  },
  {
    id: 'prov-41',
    name: 'Fatima Zahra',
    service: 'Organic Pest Defense & Termite Controller',
    categoryId: 'pest-control',
    rating: 4.94,
    reviewsCount: 195,
    experience: '8 Years',
    location: 'Eastwood Estates',
    distance: '3.7 km away',
    distanceKm: 3.7,
    startingPrice: 59,
    rateType: 'flat',
    availability: 'Available Today',
    availabilityStatus: 'available_today',
    nextAvailableTime: 'Available today at 4:30 PM',
    verified: true,
    badges: ['Eco Friendly Gel', '1-Year Warranty Guarantee'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 567-8902',
    bio: 'Bayer-certified odorless gel baiting, sub-soil termite barrier injection, and pet-safe botanical bedbug eradications.',
    completedJobs: 370,
    responseTime: '< 25 mins',
    cancellationRate: '0.2%',
    skills: ['Odorless Gel Baiting', 'Sub-Soil Termite Barrier', 'Fogging Disinfection', 'Rodent Proofing'],
    serviceArea: 'Eastwood, Harbor View, South Hills (16km radius)',
    emergencyAvailable: false
  },
  {
    id: 'prov-42',
    name: 'Rajesh Gokhale',
    service: 'Modular Carpenter & Custom Woodcraft Pro',
    categoryId: 'carpenter',
    rating: 4.91,
    reviewsCount: 215,
    experience: '14 Years',
    location: 'Craftsman Alley',
    distance: '2.0 km away',
    distanceKm: 2.0,
    startingPrice: 45,
    rateType: 'hr',
    availability: 'Available Today',
    availabilityStatus: 'available_today',
    nextAvailableTime: 'Available today at 3:30 PM',
    verified: true,
    badges: ['Hettich / Hafele Specialist', 'Zero-Play Fitting'],
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 678-9014',
    bio: 'Hydraulic lift-up beds, soft-close drawer slide alignment, modular kitchen shutter adjustments, and custom wood shelving.',
    completedJobs: 560,
    responseTime: '< 20 mins',
    cancellationRate: '0.4%',
    skills: ['Modular Kitchen Alignment', 'Hydraulic Bed Lifts', 'Wood Polishing', 'Deadbolt Mortise Fitting'],
    serviceArea: 'Craftsman Alley, Midtown, West Suburbs (14km radius)',
    emergencyAvailable: false
  },
  {
    id: 'prov-43',
    name: 'Pooja Bhatt',
    service: 'STEM & Mathematics Home Educator',
    categoryId: 'tutors',
    rating: 4.97,
    reviewsCount: 160,
    experience: '9 Years',
    location: 'University District',
    distance: '1.8 km away',
    distanceKm: 1.8,
    startingPrice: 35,
    rateType: 'hr',
    availability: 'Available Tomorrow',
    availabilityStatus: 'available_tomorrow',
    nextAvailableTime: 'Available tomorrow at 4:00 PM',
    verified: true,
    badges: ['M.Sc. Mathematics', 'Concept Clarity First'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 789-0125',
    bio: 'Personalized 1-on-1 calculus, algebra, and high school physics coaching with interactive problem-solving techniques.',
    completedJobs: 310,
    responseTime: '< 30 mins',
    cancellationRate: '0.1%',
    skills: ['Calculus & Algebra', 'Exam Prep Coaching', 'Physics Mechanics', 'Interactive Problem Solving'],
    serviceArea: 'University District, College Park, North Suburbs (10km radius)',
    emergencyAvailable: false
  },
  {
    id: 'prov-44',
    name: 'Arjun Das',
    service: 'Portrait, Wedding & Drone Cinematographer',
    categoryId: 'photography',
    rating: 4.96,
    reviewsCount: 175,
    experience: '7 Years',
    location: 'Studio Loft District',
    distance: '2.5 km away',
    distanceKm: 2.5,
    startingPrice: 90,
    rateType: 'hr',
    availability: 'Available Tomorrow',
    availabilityStatus: 'available_tomorrow',
    nextAvailableTime: 'Available tomorrow at 11:00 AM',
    verified: true,
    badges: ['Sony Alpha Pro', 'FAA Drone Pilot License'],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 890-1236',
    bio: 'Cinematic 4K color-graded video, high-resolution portrait lighting, candid event documentary, and licensed drone aerial coverage.',
    completedJobs: 240,
    responseTime: '< 30 mins',
    cancellationRate: '0.3%',
    skills: ['4K Video Production', 'Aerial Drone Piloting', 'Flash Portrait Lighting', 'Lightroom Color Grading'],
    serviceArea: 'Studio Loft, Downtown, Metro Area (25km radius)',
    emergencyAvailable: false
  },
  {
    id: 'prov-45',
    name: 'Zoe Kravitz',
    service: 'Interior Space Planner & 3D Visualizer',
    categoryId: 'interior-design',
    rating: 4.94,
    reviewsCount: 130,
    experience: '8 Years',
    location: 'Design Quarter',
    distance: '3.3 km away',
    distanceKm: 3.3,
    startingPrice: 110,
    rateType: 'room',
    availability: 'Available Tomorrow',
    availabilityStatus: 'available_tomorrow',
    nextAvailableTime: 'Available tomorrow at 2:00 PM',
    verified: true,
    badges: ['Architectural 3D Render', 'Material Sourcing Pro'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 901-2347',
    bio: 'Photorealistic SketchUp & V-Ray renders, false ceiling lighting layouts, color schemes, and budget-optimized modular plans.',
    completedJobs: 190,
    responseTime: '< 45 mins',
    cancellationRate: '0.4%',
    skills: ['3D Photorealistic Rendering', 'Modular Kitchen Layouts', 'False Ceiling Concepts', 'Budget Sourcing'],
    serviceArea: 'Design Quarter, Uptown, Lakefront (15km radius)',
    emergencyAvailable: false
  },
  {
    id: 'prov-46',
    name: 'Amitabh Sen',
    service: 'Emergency Plumber & Hydro-Jet Drain Master',
    categoryId: 'emergency-services',
    rating: 4.99,
    reviewsCount: 350,
    experience: '16 Years',
    location: 'Central Dispatch Hub',
    distance: '1.1 km away',
    distanceKm: 1.1,
    startingPrice: 75,
    rateType: 'callout',
    availability: 'Available in 15m',
    availabilityStatus: 'available_now',
    nextAvailableTime: 'Available in 15 mins',
    verified: true,
    badges: ['Rapid 20-Min Arrival', 'Heavy Water Extraction'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 012-3458',
    bio: 'Equipped with industrial 4000 PSI hydro-jetting rig, trenchless pipe crimping, and rapid sub-pump flood evacuations.',
    completedJobs: 820,
    responseTime: '< 8 mins',
    cancellationRate: '0.1%',
    skills: ['Hydro-Jetting 4000 PSI', 'High Volume Submersible Pumps', 'PEX Pipe Crimping', 'Emergency Lockouts'],
    serviceArea: 'All Metro Sectors 24/7 (20km radius)',
    emergencyAvailable: true
  },
  {
    id: 'prov-47',
    name: 'Neha Kapoor',
    service: 'Holistic Skin Aesthetics & Salon Specialist',
    categoryId: 'beauty-salon',
    rating: 4.95,
    reviewsCount: 270,
    experience: '9 Years',
    location: 'Wellness Boulevard',
    distance: '2.2 km away',
    distanceKm: 2.2,
    startingPrice: 49,
    rateType: 'package',
    availability: 'Available Today',
    availabilityStatus: 'available_today',
    nextAvailableTime: 'Available today at 1:30 PM',
    verified: true,
    badges: ['RICA Waxing Certified', 'Sanitized Kit Sealed'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 123-4569',
    bio: 'Doorstep luxury salon service with disposable sterile kits, ozone steamer treatments, chocolate wax, and hydra-boost facials.',
    completedJobs: 480,
    responseTime: '< 15 mins',
    cancellationRate: '0.2%',
    skills: ['Hydra Facial', 'RICA Waxing', 'O3+ Brightening', 'Aroma Hair Spa'],
    serviceArea: 'Wellness Boulevard, Midtown, Green Park (12km radius)',
    emergencyAvailable: false
  },
  {
    id: 'prov-48',
    name: 'Hassan Raza',
    service: 'Doorstep Waterless Car Spa & Detailing Pro',
    categoryId: 'car-service',
    rating: 4.90,
    reviewsCount: 185,
    experience: '6 Years',
    location: 'Bayview Circle',
    distance: '2.9 km away',
    distanceKm: 2.9,
    startingPrice: 39,
    rateType: 'car',
    availability: 'Available Today',
    availabilityStatus: 'available_today',
    nextAvailableTime: 'Available today at 3:00 PM',
    verified: true,
    badges: ['3M Ceramic Wax', 'Interior Steam Sterilization'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 234-5670',
    bio: 'Scratch-free carnauba wash, high-temp steam AC vent sanitization, tire dressing, and dashboard UV restoration.',
    completedJobs: 340,
    responseTime: '< 20 mins',
    cancellationRate: '0.6%',
    skills: ['Carnauba Wax Polishing', 'Steam Vent Sanitization', 'Leather Seat Shampoo', 'Clay Bar Treatment'],
    serviceArea: 'Bayview, Harbor, Marina Gate (14km radius)',
    emergencyAvailable: false
  },
  {
    id: 'prov-49',
    name: 'Kunal Singhania',
    service: 'Commercial & Residential Relocation Expert',
    categoryId: 'moving-shifting',
    rating: 4.93,
    reviewsCount: 290,
    experience: '12 Years',
    location: 'Logistics Park',
    distance: '4.5 km away',
    distanceKm: 4.5,
    startingPrice: 95,
    rateType: 'move',
    availability: 'Available Tomorrow',
    availabilityStatus: 'available_tomorrow',
    nextAvailableTime: 'Available tomorrow at 8:30 AM',
    verified: true,
    badges: ['Heavy Item Specialists', 'Insurance Transit Bond'],
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 345-6781',
    bio: 'Heavy furniture dollies, multi-layer corrugated bubble wrap, LCD TV wooden crate boxes, and seamless assembly at destination.',
    completedJobs: 620,
    responseTime: '< 30 mins',
    cancellationRate: '0.3%',
    skills: ['Multi-Layer Bubble Wrap', 'Appliance Dollies', 'Piano & Fragile Moving', 'Disassembly & Reassembly'],
    serviceArea: 'Inter-City & All Metro Zones (40km radius)',
    emergencyAvailable: false
  },
  {
    id: 'prov-50',
    name: 'Lucas Dupont',
    service: 'Home Fitness Coach & Body Transformation',
    categoryId: 'fitness-trainer',
    rating: 4.96,
    reviewsCount: 165,
    experience: '8 Years',
    location: 'Olympic Boulevard',
    distance: '2.7 km away',
    distanceKm: 2.7,
    startingPrice: 45,
    rateType: 'session',
    availability: 'Available Today',
    availabilityStatus: 'available_today',
    nextAvailableTime: 'Available today at 6:30 PM',
    verified: true,
    badges: ['ACE Certified Trainer', 'Custom Nutrition Plan'],
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 456-7892',
    bio: 'Kettlebell conditioning, resistance band functional strength, fat loss HIIT circuits, and posture biomechanics.',
    completedJobs: 290,
    responseTime: '< 20 mins',
    cancellationRate: '0.3%',
    skills: ['Kettlebell Conditioning', 'HIIT Circuit Training', 'Keto / Macro Nutrition', 'Functional Movement'],
    serviceArea: 'Olympic Boulevard, Midtown, Sports Complex (12km radius)',
    emergencyAvailable: false
  },
  {
    id: 'prov-51',
    name: 'Irfan Sheikh',
    service: 'Refrigerator Inverter Compressor Technician',
    categoryId: 'refrigerator-repair',
    rating: 4.91,
    reviewsCount: 205,
    experience: '10 Years',
    location: 'Metro Central North',
    distance: '3.0 km away',
    distanceKm: 3.0,
    startingPrice: 52,
    rateType: 'visit',
    availability: 'Available Today',
    availabilityStatus: 'available_today',
    nextAvailableTime: 'Available today at 1:00 PM',
    verified: true,
    badges: ['Inverter Linear Compressor Pro', 'R600a Gas Certified'],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 567-8903',
    bio: 'Frost-free defrost thermostat testing, capillary tube descaling, condenser fan replacement, and vacuum nitrogen brazing.',
    completedJobs: 410,
    responseTime: '< 25 mins',
    cancellationRate: '0.4%',
    skills: ['R600a Refrigerant Brazing', 'Defrost Timer Testing', 'Capillary Flushing', 'Door Magnetic Gasket'],
    serviceArea: 'Metro North, Industrial Park, Lake Suburbs (15km radius)',
    emergencyAvailable: true
  },
  {
    id: 'prov-52',
    name: 'Arthur Pendelton',
    service: 'Emergency Locksmith & Safe Technician',
    categoryId: 'emergency-services',
    rating: 4.98,
    reviewsCount: 310,
    experience: '18 Years',
    location: 'Downtown Center',
    distance: '0.9 km away',
    distanceKm: 0.9,
    startingPrice: 65,
    rateType: 'callout',
    availability: 'Available in 15m',
    availabilityStatus: 'available_now',
    nextAvailableTime: 'Available in 15 mins',
    verified: true,
    badges: ['Licensed Master Locksmith', 'Zero Damage Guarantee'],
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
    phone: '+1 (555) 678-9015',
    bio: 'Residential deadbolt bypass picking, digital smart lock installation, broken key extraction, and master re-keying.',
    completedJobs: 780,
    responseTime: '< 10 mins',
    cancellationRate: '0.1%',
    skills: ['Non-Destructive Lock Bypass', 'Smart Lock Programming', 'Broken Key Extraction', 'High-Security Deadbolts'],
    serviceArea: 'All Metro Districts 24/7 (18km radius)',
    emergencyAvailable: true
  }
];

const allProviders = [...enrichedExisting, ...additionalProviders];

// Write updated providersData.js
const providersFileContent = `// 52 Verified ServiGo Providers across all categories with rich real-time metadata
export const providersData = ${JSON.stringify(allProviders, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, '../src/data/providersData.js'), providersFileContent);
console.log(`Saved ${allProviders.length} providers to src/data/providersData.js`);

// Now expand servicesData to 105+ services!
// Map category to services
const servicesPerCategory = {
  'ac-repair': [
    { title: 'Split AC Deep Foam Jet Wash', price: 49, dur: '1 Hour', feat: true, pop: true },
    { title: 'AC Gas Charging & Refrigerant Top-Up', price: 59, dur: '1.5 Hours', feat: false, pop: true },
    { title: 'AC Indoor Water Leakage & Drain Clearing', price: 39, dur: '45 Mins', feat: false, pop: false },
    { title: 'Full AC Uninstallation & Re-Installation', price: 79, dur: '2 - 3 Hours', feat: true, pop: false }
  ],
  'plumbing': [
    { title: 'Emergency Pipe Burst & Leak Seal', price: 65, dur: '1 - 2 Hours', feat: true, pop: true },
    { title: 'Kitchen & Bathroom Drain Hydro-Unclog', price: 49, dur: '1 Hour', feat: false, pop: true },
    { title: 'Designer Faucet & Shower Mixer Installation', price: 35, dur: '45 Mins', feat: false, pop: false },
    { title: 'Water Tank Deep Cleaning & Disinfection', price: 85, dur: '2 Hours', feat: true, pop: false }
  ],
  'electrician': [
    { title: 'Complete Switchboard & Circuit Breaker Overhaul', price: 45, dur: '1 - 2 Hours', feat: true, pop: true },
    { title: 'Smart Home Lighting & Dimmer Automation', price: 69, dur: '2 Hours', feat: false, pop: true },
    { title: 'Ceiling Fan Installation & Balance Repair', price: 29, dur: '45 Mins', feat: false, pop: false },
    { title: 'Dedicated EV Charger Line & 32A Socket Setup', price: 110, dur: '3 Hours', feat: true, pop: false }
  ],
  'home-cleaning': [
    { title: 'Full Home Deep Cleaning & Sanitization', price: 89, dur: '3 - 4 Hours', feat: true, pop: true },
    { title: 'Intensive Kitchen Chimney & Degreasing', price: 49, dur: '2 Hours', feat: false, pop: true },
    { title: 'Bathroom Tile Descaling & Grout Sanitization', price: 39, dur: '1.5 Hours', feat: false, pop: false },
    { title: 'Sofa & Fabric Upholstery Deep Extraction Wash', price: 55, dur: '2 Hours', feat: true, pop: false }
  ],
  'laptop-repair': [
    { title: 'Laptop Broken Screen & Bezel Replacement', price: 75, dur: '1 Hour', feat: true, pop: true },
    { title: 'Thermal Paste Re-application & Fan Cleanup', price: 35, dur: '45 Mins', feat: false, pop: true },
    { title: 'Laptop Battery Swap & Calibration', price: 45, dur: '30 Mins', feat: false, pop: false },
    { title: 'Motherboard Liquid Damage Ultrasonic Rehab', price: 95, dur: '2 - 3 Hours', feat: true, pop: false }
  ],
  'mobile-repair': [
    { title: 'Doorstep OLED Screen & Digitizer Replacement', price: 59, dur: '30 Mins', feat: true, pop: true },
    { title: 'Smartphone Fast-Drain Battery Replacement', price: 35, dur: '25 Mins', feat: false, pop: true },
    { title: 'USB-C / Lightning Port Cleaning & Replacement', price: 29, dur: '30 Mins', feat: false, pop: false },
    { title: 'Rear Camera Glass & Sensor Swap', price: 45, dur: '45 Mins', feat: false, pop: false }
  ],
  'appliance-repair': [
    { title: 'Microwave Magnetron & Heating Diagnostic', price: 45, dur: '1 Hour', feat: true, pop: true },
    { title: 'Kitchen Chimney Baffle Filter Steam Clean', price: 39, dur: '1 Hour', feat: false, pop: false },
    { title: 'Electric Induction Cooktop Circuit Repair', price: 35, dur: '45 Mins', feat: false, pop: false },
    { title: 'Built-in Oven Thermostat & Heating Element Fix', price: 65, dur: '1.5 Hours', feat: false, pop: false }
  ],
  'washing-machine-repair': [
    { title: 'Front Load Washing Machine Drum Bearing Repair', price: 69, dur: '2 Hours', feat: true, pop: true },
    { title: 'Drain Pump Jam Clearance & Filter Clean', price: 35, dur: '45 Mins', feat: false, pop: true },
    { title: 'Motor Carbon Brushes & Drive Belt Replacement', price: 49, dur: '1 Hour', feat: false, pop: false },
    { title: 'Inverter PCB Motherboard Repair & Recalibration', price: 85, dur: '2 Hours', feat: true, pop: false }
  ],
  'refrigerator-repair': [
    { title: 'Double Door Refrigerator Gas Leak Detection & Topup', price: 65, dur: '1.5 Hours', feat: true, pop: true },
    { title: 'Frost-Free Defrost Sensor & Timer Replacement', price: 45, dur: '1 Hour', feat: false, pop: true },
    { title: 'Linear Inverter Compressor Replacement with Vacuum', price: 120, dur: '3 Hours', feat: true, pop: false },
    { title: 'Door Magnetic Rubber Gasket Replacement', price: 35, dur: '45 Mins', feat: false, pop: false }
  ],
  'car-service': [
    { title: 'Doorstep Waterless Eco Foam Car Wash & Vacuum', price: 35, dur: '1 Hour', feat: true, pop: true },
    { title: 'Comprehensive 40-Point Car Health Inspection', price: 55, dur: '1.5 Hours', feat: false, pop: true },
    { title: 'Brake Disc Pad Replacement & Rotor Bleed', price: 65, dur: '1.5 Hours', feat: false, pop: false },
    { title: 'Engine Oil & Synthetic Filter Flush Doorstep', price: 75, dur: '1 Hour', feat: true, pop: false }
  ],
  'bike-service': [
    { title: 'Two-Wheeler Doorstep General Service & Tuning', price: 39, dur: '1.5 Hours', feat: true, pop: true },
    { title: 'Chain Degrease, Slack Adjust & Motul Lube', price: 19, dur: '30 Mins', feat: false, pop: true },
    { title: 'Carburetor / EFI Fuel Injector Ultrasonic Clean', price: 35, dur: '1 Hour', feat: false, pop: false },
    { title: 'Emergency Tubeless Tyre Puncture Assistance', price: 25, dur: '25 Mins', feat: true, pop: false }
  ],
  'beauty-salon': [
    { title: 'Luxury Hydra-Glow Facial & Organic Bleach', price: 49, dur: '1 Hour', feat: true, pop: true },
    { title: 'Full Body Honey Waxing & Painless Threading', price: 45, dur: '1.5 Hours', feat: false, pop: true },
    { title: 'Keratin Hair Spa & Deep Conditioning Mask', price: 55, dur: '1.5 Hours', feat: false, pop: false },
    { title: 'Pedicure & Manicure Deluxe Reflexology Spa', price: 39, dur: '1 Hour', feat: true, pop: false }
  ],
  'painting': [
    { title: '1-BHK Express Rental Wall Repaint', price: 140, dur: '1 Day', feat: true, pop: true },
    { title: 'Waterproof Dampproof Wall Primer Coating', price: 65, dur: '3 Hours', feat: false, pop: true },
    { title: 'Geometric Designer Accent Wall with Metallic Emulsion', price: 79, dur: '4 Hours', feat: false, pop: false },
    { title: 'Full Exterior Weatherproof Emulsion Painting', price: 280, dur: '3 Days', feat: true, pop: false }
  ],
  'carpenter': [
    { title: 'IKEA / Flatpack Furniture Precision Assembly', price: 39, dur: '1.5 Hours', feat: true, pop: true },
    { title: 'Wardrobe Hydraulic Hinge & Slider Repair', price: 29, dur: '45 Mins', feat: false, pop: true },
    { title: 'Wooden Door Deadbolt & Smart Lock Mortising', price: 45, dur: '1 Hour', feat: false, pop: false },
    { title: 'Custom Plywood Wall Shelving & Floating Racks', price: 55, dur: '2 Hours', feat: true, pop: false }
  ],
  'pest-control': [
    { title: 'Odorless Herbal Cockroach Gel Treatment (1-Yr Guarantee)', price: 49, dur: '45 Mins', feat: true, pop: true },
    { title: 'Bed Bug Two-Visit Eradication Protocol', price: 79, dur: '1.5 Hours', feat: true, pop: true },
    { title: 'Sub-Terranean Termite Drill & Inject Barrier', price: 110, dur: '2.5 Hours', feat: false, pop: false },
    { title: 'Mosquito & Fly Fogging for Balconies & Garden', price: 39, dur: '30 Mins', feat: false, pop: false }
  ],
  'moving-shifting': [
    { title: 'Complete Apartment Packing & Local Shifting', price: 149, dur: '4 - 6 Hours', feat: true, pop: true },
    { title: 'Bulky Furniture / Fridge / Washing Machine Move', price: 59, dur: '2 Hours', feat: false, pop: true },
    { title: 'Fragile Glassware & Electronics Crate Packing', price: 45, dur: '1.5 Hours', feat: false, pop: false }
  ],
  'computer-repair': [
    { title: 'Desktop PC Deep Hardware Cleaning & Re-cabling', price: 35, dur: '1 Hour', feat: true, pop: true },
    { title: 'Windows 11 Clean Install & Driver Configuration', price: 29, dur: '45 Mins', feat: false, pop: true },
    { title: 'High-Speed NVMe SSD Upgrade with Data Clone', price: 49, dur: '1 Hour', feat: false, pop: false },
    { title: 'Custom Gaming Rig Assembly & Cable Management', price: 79, dur: '2.5 Hours', feat: true, pop: false }
  ],
  'cctv-installation': [
    { title: '4-Camera HD Night-Vision Setup with 1TB NVR', price: 120, dur: '3 Hours', feat: true, pop: true },
    { title: 'Smart Wi-Fi Security Doorbell & Chime Setup', price: 39, dur: '45 Mins', feat: false, pop: true },
    { title: 'CCTV Camera Offline Diagnostic & Wire Fix', price: 29, dur: '45 Mins', feat: false, pop: false }
  ],
  'ro-service': [
    { title: 'RO Complete Filter Replacement & Sanitization Kit', price: 45, dur: '1 Hour', feat: true, pop: true },
    { title: 'TDS Adjustment, Mineral Cartridge & Taste Fix', price: 25, dur: '30 Mins', feat: false, pop: true },
    { title: 'RO Booster Pump & SV Valve Replacement', price: 55, dur: '1 Hour', feat: false, pop: false }
  ],
  'gardening': [
    { title: 'Lawn Mowing, De-Weeding & Shrub Pruning', price: 45, dur: '2 Hours', feat: true, pop: true },
    { title: 'Balcony Vertical Garden Setup with Drip Kit', price: 85, dur: '3 Hours', feat: false, pop: true },
    { title: 'Indoor Plant Repotting with Organic Vermicompost', price: 35, dur: '1 Hour', feat: false, pop: false }
  ],
  'laundry': [
    { title: 'Doorstep Wash, Steam Iron & Fold (5 kg Basket)', price: 22, dur: '24 Hours', feat: true, pop: true },
    { title: 'Suit & Blazer Deluxe Eco Dry Cleaning', price: 29, dur: '48 Hours', feat: false, pop: true },
    { title: 'Heavy Winter Blanket & Duvet Sanitizing', price: 25, dur: '48 Hours', feat: false, pop: false }
  ],
  'tutors': [
    { title: 'Mathematics & Calculus Home Tutoring (Grade 8-12)', price: 35, dur: '1 Hour', feat: true, pop: true },
    { title: 'Physics & Chemistry Concept Clarity Coaching', price: 35, dur: '1 Hour', feat: false, pop: true },
    { title: 'Python & Web Development 1-on-1 Coaching', price: 40, dur: '1 Hour', feat: true, pop: false }
  ],
  'photography': [
    { title: 'Outdoor Family Portrait & Kids Photoshoot', price: 95, dur: '1.5 Hours', feat: true, pop: true },
    { title: 'Product & E-Commerce Studio Catalogue Shoot', price: 120, dur: '2 Hours', feat: false, pop: true },
    { title: 'Licensed 4K Drone Aerial Videography', price: 140, dur: '2 Hours', feat: true, pop: false }
  ],
  'event-services': [
    { title: 'Birthday Balloon Arch & Themed Backdrop Setup', price: 85, dur: '2 Hours', feat: true, pop: true },
    { title: 'Professional Sound System & DJ Lighting Rig', price: 160, dur: '4 Hours', feat: false, pop: true },
    { title: 'Catering Buffet Server & Clean-up Assistants', price: 75, dur: '3 Hours', feat: false, pop: false }
  ],
  'fitness-trainer': [
    { title: '1-on-1 Personal Home Fitness & HIIT Coaching', price: 45, dur: '1 Hour', feat: true, pop: true },
    { title: 'Posture Correction & Functional Mobility Therapy', price: 50, dur: '1 Hour', feat: false, pop: true },
    { title: 'Weight Loss Metabolic Conditioning Program', price: 45, dur: '1 Hour', feat: true, pop: false }
  ],
  'yoga': [
    { title: 'Holistic Hatha Yoga & Pranayama Morning Session', price: 35, dur: '1 Hour', feat: true, pop: true },
    { title: 'Therapeutic Yoga for Lower Back & Neck Relief', price: 40, dur: '1 Hour', feat: false, pop: true },
    { title: 'Sound Bath & Guided Mindfulness Meditation', price: 45, dur: '1 Hour', feat: true, pop: false }
  ],
  'makeup-artist': [
    { title: 'Bridal HD Makeover with Premium Lashes & Draping', price: 150, dur: '2.5 Hours', feat: true, pop: true },
    { title: 'Party Glam Makeup & Romantic Curls Hairstyling', price: 65, dur: '1.5 Hours', feat: false, pop: true },
    { title: 'Engagement Airbrush Makeup with Jewelry Placement', price: 110, dur: '2 Hours', feat: true, pop: false }
  ],
  'interior-design': [
    { title: 'Complete Room 3D Photorealistic Design & Render', price: 120, dur: '3 Days', feat: true, pop: true },
    { title: 'Modular Kitchen Layout Consultation & Material List', price: 85, dur: '2 Days', feat: false, pop: true },
    { title: 'False Ceiling & Architectural Lighting Plan', price: 75, dur: '2 Days', feat: false, pop: false }
  ],
  'mechanic': [
    { title: 'Roadside Emergency Breakdown & Jumpstart Assist', price: 49, dur: '30 Mins', feat: true, pop: true },
    { title: 'Car Radiator Coolant Flush & Overheating Remedy', price: 55, dur: '1 Hour', feat: false, pop: true },
    { title: 'Brake Fluid Bleed & Master Cylinder Inspection', price: 45, dur: '1 Hour', feat: false, pop: false }
  ],
  'emergency-services': [
    { title: '24/7 Rapid Leak Isolation & High-Pressure Pipe Seal', price: 79, dur: '20 Mins Dispatch', feat: true, pop: true },
    { title: 'Midnight Electrical Blackout Troubleshooting', price: 69, dur: '20 Mins Dispatch', feat: true, pop: true },
    { title: 'Emergency Home Lockout & Rapid Lock Bypass', price: 65, dur: '15 Mins Dispatch', feat: false, pop: true }
  ]
};

// Build all services
let allServices = [];
let serviceCounter = 1;

// Use categories list to generate
rawCategoriesData.forEach(cat => {
  const catItems = servicesPerCategory[cat.id] || [
    { title: `${cat.name} Standard Diagnostic Service`, price: 49, dur: '1 Hour', feat: true, pop: true },
    { title: `${cat.name} Comprehensive Overhaul`, price: 89, dur: '2 Hours', feat: false, pop: true },
    { title: `${cat.name} Routine Maintenance & Care`, price: 39, dur: '45 Mins', feat: false, pop: false }
  ];

  // Match provider in same category
  const matchingPro = allProviders.find(p => p.categoryId === cat.id) || allProviders[serviceCounter % allProviders.length];

  catItems.forEach((item, itemIdx) => {
    const sId = `srv-${serviceCounter}`;
    serviceCounter++;

    allServices.push({
      id: sId,
      name: item.title,
      categoryId: cat.id,
      categoryName: cat.name,
      providerId: matchingPro.id,
      providerName: matchingPro.name,
      startingPrice: item.price,
      rating: parseFloat((4.85 + (itemIdx * 0.04) % 0.14).toFixed(2)),
      reviewsCount: 80 + (serviceCounter * 7) % 250,
      bookingsCount: 200 + (serviceCounter * 19) % 800,
      duration: item.dur,
      location: 'Metro & Suburbs (15km radius)',
      availability: matchingPro.nextAvailableTime,
      featured: item.feat,
      popular: item.pop,
      trending: itemIdx === 0,
      image: cat.image,
      shortDescription: `Certified ${cat.name.toLowerCase()} service by vetted top pros. Includes upfront pricing and guarantee.`,
      fullDescription: `Professional ${item.title} delivered by certified trade technicians. All tools, diagnostic instruments, and consumables are included. Backed by ServiGo 30-day rework protection guarantee.`,
      includes: [
        'Complete diagnostic inspection',
        'Certified technician with branded gear',
        'Consumables and safety sanitation',
        'Upfront transparent billing',
        '30-Day ServiGo guarantee cover'
      ],
      faqs: [
        { q: 'Is there any diagnostic fee if I proceed with the service?', a: 'No, diagnostic fee is 100% waived when you proceed with the recommended repair.' },
        { q: 'What safety precautions are observed?', a: 'Technicians carry verified background checks, ID cards, and wear protective booties inside your home.' }
      ],
      reviews: [
        { id: `rev-${sId}-1`, author: 'Mark T.', rating: 5, date: '3 days ago', comment: 'Outstanding service! Punctual, efficient, and left the work area spotless.' },
        { id: `rev-${sId}-2`, author: 'Rachel V.', rating: 5, date: '1 week ago', comment: 'Fixed the issue in half the time quoted. Highly recommend ServiGo!' }
      ]
    });
  });
});

const servicesFileContent = `// 105+ Comprehensive Services across all 30 Categories with verified details
export const servicesData = ${JSON.stringify(allServices, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/servicesData.js'), servicesFileContent);
console.log(`Saved ${allServices.length} services to src/data/servicesData.js`);
