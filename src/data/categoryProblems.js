/**
 * Common Customer Problems per Service Category.
 * Used for "What's the problem?" diagnostic selector and provider matching algorithm.
 */
export const categoryProblemsData = {
  'ac-repair': [
    { id: 'prob-ac-1', title: 'AC Not Cooling Properly', icon: 'Wind', severity: 'High', estTime: '45 mins', desc: 'Unit blowing room temp air or cooling very slowly.' },
    { id: 'prob-ac-2', title: 'Water Leaking From Indoor Unit', icon: 'Droplets', severity: 'Urgent', estTime: '30 mins', desc: 'Water dripping down walls or overflowing drain tray.' },
    { id: 'prob-ac-3', title: 'Strange Rattling or Humming Noise', icon: 'Volume2', severity: 'Medium', estTime: '40 mins', desc: 'Fan blower unbalanced or compressor motor vibrating.' },
    { id: 'prob-ac-4', title: 'Foul or Musty Mildew Smell', icon: 'AlertCircle', severity: 'Medium', estTime: '35 mins', desc: 'Mold buildup on cooling coils and blocked drainage pipe.' },
    { id: 'prob-ac-5', title: 'AC Tripping Circuit Breaker', icon: 'Zap', severity: 'Urgent', estTime: '50 mins', desc: 'Power cuts immediately when compressor attempts to turn on.' },
    { id: 'prob-ac-6', title: 'Low Gas / Ice On Copper Pipe', icon: 'Snowflake', severity: 'High', estTime: '60 mins', desc: 'Frost forming on refrigerant lines; needs gas top-up.' }
  ],
  'plumbing': [
    { id: 'prob-pl-1', title: 'Severe Pipe Leakage or Burst', icon: 'Droplet', severity: 'Urgent', estTime: '30 mins', desc: 'Gushing water or concealed pipe seepage causing damage.' },
    { id: 'prob-pl-2', title: 'Dripping Faucet or Mixer Tap', icon: 'Wrench', severity: 'Low', estTime: '20 mins', desc: 'Worn washer, cartridge leak or continuous tap drip.' },
    { id: 'prob-pl-3', title: 'Clogged Sink or Shower Drain', icon: 'AlertTriangle', severity: 'High', estTime: '40 mins', desc: 'Water standing still or backing up with bad odor.' },
    { id: 'prob-pl-4', title: 'Low Water Pressure Across House', icon: 'Gauge', severity: 'Medium', estTime: '45 mins', desc: 'Pipes choked with sediment or pressure valve issue.' },
    { id: 'prob-pl-5', title: 'Toilet Flush Cistern Running Non-Stop', icon: 'RefreshCw', severity: 'Medium', estTime: '30 mins', desc: 'Syphon diaphragm damaged or inlet valve faulty.' },
    { id: 'prob-pl-6', title: 'Geyser / Water Heater Connection Issue', icon: 'Flame', severity: 'High', estTime: '35 mins', desc: 'Flexible braided pipe leaking or relief valve dripping.' }
  ],
  'electrician': [
    { id: 'prob-el-1', title: 'Total or Partial Power Blackout', icon: 'ZapOff', severity: 'Urgent', estTime: '30 mins', desc: 'Main fuse blown or phase issue while neighbours have power.' },
    { id: 'prob-el-2', title: 'Short Circuit / Breaker Tripping', icon: 'AlertOctagon', severity: 'Urgent', estTime: '40 mins', desc: 'MCB switches off automatically when appliance is plugged.' },
    { id: 'prob-el-3', title: 'Sparking or Burnt Switchboard', icon: 'Flame', severity: 'Urgent', estTime: '25 mins', desc: 'Loose contacts creating burning plastic odor and sparks.' },
    { id: 'prob-el-4', title: 'Ceiling Fan Slow or Squeaking', icon: 'Disc', severity: 'Low', estTime: '30 mins', desc: 'Capacitor weak or bearing worn out needing grease.' },
    { id: 'prob-el-5', title: 'Chandelier or Decorative Light Setup', icon: 'Sun', severity: 'Normal', estTime: '60 mins', desc: 'Professional ceiling anchoring and wire concealed routing.' },
    { id: 'prob-el-6', title: 'EV Charger / Heavy Load Point', icon: 'BatteryCharging', severity: 'High', estTime: '90 mins', desc: 'Industrial 16A/32A dedicated line with surge protection.' }
  ],
  'laptop-repair': [
    { id: 'prob-lt-1', title: 'Laptop Not Turning On At All', icon: 'Power', severity: 'High', estTime: '45 mins', desc: 'No LED indicators, dead motherboard or power rail fault.' },
    { id: 'prob-lt-2', title: 'Extremely Slow / Freezing & Crashing', icon: 'Activity', severity: 'Medium', estTime: '60 mins', desc: 'Thermal throttling, infected OS or dying SSD/HDD.' },
    { id: 'prob-lt-3', title: 'Cracked Screen / Display Flickering', icon: 'Monitor', severity: 'High', estTime: '45 mins', desc: 'Damaged IPS/OLED panel or loose display ribbon flex cable.' },
    { id: 'prob-lt-4', title: 'Keyboard Keys Not Responding', icon: 'Grid', severity: 'Medium', estTime: '35 mins', desc: 'Stuck mechanism, liquid oxidation or membrane failure.' },
    { id: 'prob-lt-5', title: 'Battery Draining Fast / Not Charging', icon: 'BatteryLow', severity: 'Medium', estTime: '30 mins', desc: 'Swollen cells, worn out cycle count or DC-in jack loose.' },
    { id: 'prob-lt-6', title: 'Liquid Spill / Water Ingress Emergency', icon: 'Droplets', severity: 'Urgent', estTime: '60 mins', desc: 'Immediate ultrasonic motherboard cleaning & drying.' }
  ],
  'home-cleaning': [
    { id: 'prob-hc-1', title: 'Post-Renovation Heavy Cement Dust', icon: 'Layers', severity: 'Normal', estTime: '180 mins', desc: 'Paint spots, plaster residues & deep floor buffing.' },
    { id: 'prob-hc-2', title: 'Greasy Kitchen Chimney & Tile Grout', icon: 'Sparkles', severity: 'Normal', estTime: '90 mins', desc: 'Heavy oil film, yellowed tiles and sticky cabinets.' },
    { id: 'prob-hc-3', title: 'Bathroom Hard Water Limescale', icon: 'ShieldAlert', severity: 'Normal', estTime: '60 mins', desc: 'White calcium deposits on glass shower and faucets.' },
    { id: 'prob-hc-4', title: 'Fabric Sofa & Mattress Stains', icon: 'Square', severity: 'Normal', estTime: '90 mins', desc: 'Deep wet extraction vacuuming and sanitizing.' },
    { id: 'prob-hc-5', title: 'Balcony Dust & Window Slider Tracks', icon: 'Maximize', severity: 'Low', estTime: '45 mins', desc: 'Sliding window channel vacuuming and pigeon mess cleanup.' }
  ],
  'appliance-repair': [
    { id: 'prob-ap-1', title: 'Microwave Turntable Running But No Heat', icon: 'Radio', severity: 'High', estTime: '40 mins', desc: 'Blown high-voltage diode, fuse or failed magnetron.' },
    { id: 'prob-ap-2', title: 'Kitchen Chimney Suction Not Working', icon: 'Wind', severity: 'Medium', estTime: '45 mins', desc: 'Baffle filters choked with carbon or blower capacitor dead.' },
    { id: 'prob-ap-3', title: 'Built-in Oven Overheating / Error Code', icon: 'Flame', severity: 'High', estTime: '50 mins', desc: 'Faulty thermostat, temperature sensor or relay board.' }
  ],
  'washing-machine-repair': [
    { id: 'prob-wm-1', title: 'Drum Not Spinning During Cycle', icon: 'RotateCw', severity: 'High', estTime: '45 mins', desc: 'Motor drive belt snapped or carbon brushes worn down.' },
    { id: 'prob-wm-2', title: 'Water Not Draining / Error Code E24', icon: 'Droplets', severity: 'High', estTime: '30 mins', desc: 'Drain pump clogged with coins, hair, or impellor jammed.' },
    { id: 'prob-wm-3', title: 'Violent Shaking & Loud Banging', icon: 'Volume2', severity: 'Medium', estTime: '45 mins', desc: 'Shock absorbers ruptured or suspension spring disconnected.' },
    { id: 'prob-wm-4', title: 'Front Door Locked & Stuck', icon: 'Lock', severity: 'Urgent', estTime: '20 mins', desc: 'Thermal door interlock solenoid burned out.' }
  ],
  'refrigerator-repair': [
    { id: 'prob-rf-1', title: 'Freezer Cold But Fridge Compartment Warm', icon: 'Thermometer', severity: 'High', estTime: '45 mins', desc: 'Defrost heater failed, ice choking airflow duct.' },
    { id: 'prob-rf-2', title: 'Compressor Making Loud Buzzing Sound', icon: 'Cpu', severity: 'High', estTime: '50 mins', desc: 'Inverter starter relay stuck or internal motor valves worn.' },
    { id: 'prob-rf-3', title: 'Water Puddle Under Vegetable Crisper', icon: 'Droplets', severity: 'Medium', estTime: '30 mins', desc: 'Defrost drain hole clogged with debris.' }
  ],
  'ro-service': [
    { id: 'prob-ro-1', title: 'Purified Water Tastes Foul / Salty', icon: 'Droplet', severity: 'High', estTime: '30 mins', desc: 'RO membrane exhausted or TDS levels spike above 300.' },
    { id: 'prob-ro-2', title: 'Continuous Beeping / UV Lamp Alarm', icon: 'Bell', severity: 'Medium', estTime: '25 mins', desc: 'Choke adapter or UV chamber bulb reached end-of-life.' },
    { id: 'prob-ro-3', title: 'Extremely Slow Flow / Tank Not Filling', icon: 'Clock', severity: 'Medium', estTime: '40 mins', desc: 'Sediment and carbon pre-filters choked with mud.' }
  ],
  'pest-control': [
    { id: 'prob-pc-1', title: 'Cockroaches in Kitchen Drawers', icon: 'Bug', severity: 'High', estTime: '45 mins', desc: 'Odorless herbal gel baiting & targeted crack dusting.' },
    { id: 'prob-pc-2', title: 'Bed Bug Bites in Mattresses', icon: 'AlertOctagon', severity: 'Urgent', estTime: '90 mins', desc: 'Two-stage chemical spray & heat treatment for eggs.' },
    { id: 'prob-pc-3', title: 'Termite Wood Powder on Door Frames', icon: 'ShieldAlert', severity: 'Urgent', estTime: '120 mins', desc: 'Pressure injection drilling with termiticide barrier.' }
  ],
  'car-service': [
    { id: 'prob-cs-1', title: 'Engine Check Light / Rough Idling', icon: 'Activity', severity: 'High', estTime: '45 mins', desc: 'OBD2 computer scan, spark plug & sensor inspection.' },
    { id: 'prob-cs-2', title: 'Brakes Squealing or Vibrating', icon: 'Disc', severity: 'Urgent', estTime: '60 mins', desc: 'Brake pad thickness check, rotor skim & bleed.' },
    { id: 'prob-cs-3', title: 'Dead Battery Doorstep Jumpstart', icon: 'Zap', severity: 'Urgent', estTime: '20 mins', desc: 'Portable booster jump & alternator load test.' }
  ],
  'bike-service': [
    { id: 'prob-bs-1', title: 'Engine Stalling / Fuel Starvation', icon: 'Activity', severity: 'Medium', estTime: '40 mins', desc: 'Carburetor / injector cleanup & air filter replacement.' },
    { id: 'prob-bs-2', title: 'Drive Chain Dry & Making Harsh Noise', icon: 'Link', severity: 'Low', estTime: '25 mins', desc: 'Chain slack adjustment, degrease and Motul lube spray.' },
    { id: 'prob-bs-3', title: 'Tubeless Tyre Puncture / Low Pressure', icon: 'Circle', severity: 'Urgent', estTime: '20 mins', desc: 'On-spot mushroom plug seal and portable air filling.' }
  ],
  'painting': [
    { id: 'prob-pt-1', title: 'Wall Dampness & Peeling Paint', icon: 'Droplets', severity: 'High', estTime: '90 mins', desc: 'Moisture meter check, primer sealing & waterproof putty.' },
    { id: 'prob-pt-2', title: 'Quick 1-Room Rental Repaint', icon: 'Paintbrush', severity: 'Normal', estTime: '240 mins', desc: 'Smooth roller coat with low-VOC durable emulsion.' },
    { id: 'prob-pt-3', title: 'Geometric Designer Accent Wall', icon: 'Layers', severity: 'Normal', estTime: '180 mins', desc: 'Custom masking tape pattern and metallic sheen finish.' }
  ],
  'carpenter': [
    { id: 'prob-cp-1', title: 'Wardrobe Hydraulic Hinge Broken', icon: 'Wrench', severity: 'Medium', estTime: '30 mins', desc: 'Soft-close Euro hinge replacement & door alignment.' },
    { id: 'prob-cp-2', title: 'Bed Frame Creaking / Loose Screws', icon: 'Hammer', severity: 'Medium', estTime: '40 mins', desc: 'Support brace reinforcement and wood glue bonding.' },
    { id: 'prob-cp-3', title: 'Flatpack Furniture Assembly (IKEA)', icon: 'Package', severity: 'Normal', estTime: '90 mins', desc: 'Precision assembly with drill and wall safety anchor.' }
  ],
  'emergency-services': [
    { id: 'prob-em-1', title: 'Catastrophic Pipe Rupture / Flood', icon: 'AlertTriangle', severity: 'Critical', estTime: '15 mins', desc: 'Immediate shutoff isolation and heavy-duty pipe crimp.' },
    { id: 'prob-em-2', title: 'Nighttime Total Blackout / Sparking', icon: 'ZapOff', severity: 'Critical', estTime: '15 mins', desc: 'Emergency dispatch electrician with testing gear.' },
    { id: 'prob-em-3', title: 'Accidental Lockout / Broken Key In Lock', icon: 'Lock', severity: 'Critical', estTime: '20 mins', desc: 'Non-destructive rapid bypass lock picking.' }
  ]
};

// Generic problem fallback for any category without explicit custom problems
export const getProblemsForCategory = (categoryId) => {
  if (categoryProblemsData[categoryId]) {
    return categoryProblemsData[categoryId];
  }

  // Generative default problems based on category name
  return [
    { id: `prob-${categoryId}-1`, title: 'General Inspection & Diagnosis', icon: 'Search', severity: 'Medium', estTime: '30 mins', desc: 'Comprehensive technician inspection and fixed price estimate.' },
    { id: `prob-${categoryId}-2`, title: 'Emergency Repair / Malfunction', icon: 'AlertTriangle', severity: 'High', estTime: '45 mins', desc: 'Immediate breakdown troubleshooting and component fixing.' },
    { id: `prob-${categoryId}-3`, title: 'Routine Maintenance & Servicing', icon: 'CheckCircle2', severity: 'Low', estTime: '60 mins', desc: 'Preventative care, cleaning, tightening and lubrication.' },
    { id: `prob-${categoryId}-4`, title: 'New Installation or Replacement', icon: 'PlusCircle', severity: 'Normal', estTime: '90 mins', desc: 'Complete setup of new equipment with manufacturer warranty.' }
  ];
};

export const categoryProblems = categoryProblemsData;

