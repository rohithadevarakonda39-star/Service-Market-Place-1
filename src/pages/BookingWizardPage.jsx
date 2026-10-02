import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { servicesData } from '../data/servicesData';
import { providersData } from '../data/providersData';
import { categoryProblems, getProblemsForCategory } from '../data/categoryProblems';
import { MapLocationPicker } from '../components/booking/MapLocationPicker';
import { MediaUploadZone } from '../components/booking/MediaUploadZone';
import {
  Check,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Star,
  User,
  Plus,
  Trash2,
  FileText,
  Info,
  Sparkles,
  Phone,
  Crosshair,
  CreditCard,
  MessageSquare
} from 'lucide-react';

const STEPS = [
  { id: 1, key: 'service', label: 'Service & Problem' },
  { id: 2, key: 'schedule', label: 'Date & Time' },
  { id: 3, key: 'address', label: 'Service Address' },
  { id: 4, key: 'details', label: 'Problem Details' },
  { id: 5, key: 'media', label: 'Images / Video' },
  { id: 6, key: 'review', label: 'Booking Summary' }
];

export const BookingWizardPage = () => {
  const {
    pageParams,
    bookingFlowData,
    currentUser,
    savedAddresses,
    addSavedAddress,
    checkSlotAvailability,
    createBooking,
    navigateTo,
    openChatModal,
    addToast
  } = useApp();

  // Initialize service, provider, and problem from pageParams or bookingFlowData or defaults
  const initialService =
    pageParams?.service ||
    bookingFlowData?.service ||
    servicesData.find(s => s.id === pageParams?.serviceId) ||
    servicesData[0];

  const initialProvider =
    pageParams?.provider ||
    bookingFlowData?.provider ||
    providersData.find(p => p.id === initialService?.providerId) ||
    providersData[0];

  const initialProblem =
    pageParams?.problem ||
    bookingFlowData?.problem ||
    getProblemsForCategory(initialService?.categoryId)[0] || {
      id: 'gen-check',
      label: 'Standard Inspection & Diagnostic Check',
      duration: '45 mins',
      typicalCost: 'Included in visit'
    };

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState(null);

  // Step 1: Service, Provider, Problem state
  const [service, setService] = useState(initialService);
  const [provider, setProvider] = useState(initialProvider);
  const [problem, setProblem] = useState(initialProblem);
  const [isChangingService, setIsChangingService] = useState(false);
  const [isChangingProvider, setIsChangingProvider] = useState(false);
  const [isChangingProblem, setIsChangingProblem] = useState(false);

  // Step 2: Date & Time state
  const [selectedDate, setSelectedDate] = useState('Today, Oct 2');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('02:00 PM - 03:30 PM');
  const [isAsapEmergency, setIsAsapEmergency] = useState(false);

  // Step 3: Address state
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses[0]?.id || 'addr-1');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    fullName: currentUser?.name || 'Alex Morgan',
    phone: currentUser?.phone || '+1 (555) 019-2834',
    flatNumber: '',
    street: '',
    area: '',
    city: 'Springfield Metro',
    state: 'CA',
    pincode: '',
    landmark: '',
    saveForLater: true
  });
  const [pinnedLocation, setPinnedLocation] = useState({
    name: 'Home Location',
    street: '742 Evergreen Terrace',
    area: 'Residential West',
    city: 'Springfield Metro',
    state: 'CA',
    pincode: '94112',
    lat: 37.7520,
    lng: -122.4350
  });

  // Step 4: Problem Details & Severity
  const [problemDescription, setProblemDescription] = useState('');
  const [severity, setSeverity] = useState('Medium'); // 'Low', 'Medium', 'High', 'Emergency'
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Step 5: Media uploads
  const [uploadedMedia, setUploadedMedia] = useState([]);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure provider changes when service changes if category mismatches
  useEffect(() => {
    if (service && provider && provider.categoryId !== service.categoryId) {
      const match = providersData.find(p => p.categoryId === service.categoryId) || providersData[0];
      setProvider(match);
    }
  }, [service]);

  // Date list generation
  const dateOptions = [
    { label: 'Today, Oct 2', sub: 'Urgent slots open', dateKey: 'Today, Oct 2' },
    { label: 'Tomorrow, Oct 3', sub: 'Most popular', dateKey: 'Tomorrow, Oct 3' },
    { label: 'Saturday, Oct 4', sub: 'Weekend priority', dateKey: 'Saturday, Oct 4' },
    { label: 'Sunday, Oct 5', sub: 'Standard dispatch', dateKey: 'Sunday, Oct 5' },
    { label: 'Monday, Oct 6', sub: 'Weekday morning', dateKey: 'Monday, Oct 6' },
    { label: 'Tuesday, Oct 7', sub: 'Full availability', dateKey: 'Tuesday, Oct 7' }
  ];

  // Time slots
  const timeSlots = [
    '09:00 AM - 10:30 AM',
    '10:30 AM - 12:00 PM',
    '12:00 PM - 01:30 PM',
    '02:00 PM - 03:30 PM',
    '03:30 PM - 05:00 PM',
    '05:00 PM - 06:30 PM',
    '06:30 PM - 08:00 PM'
  ];

  // Pricing calculations
  const isQuoteBased = service.pricingType === 'quote' || (service.startingPrice === 0);
  const basePrice = service.startingPrice || 65;
  const emergencyCharge = isAsapEmergency || severity === 'Emergency' ? 20.00 : 0.00;
  const platformFee = 5.00;
  const tax = Number(((basePrice + emergencyCharge) * 0.08).toFixed(2));
  const totalAmount = Number((basePrice + emergencyCharge + platformFee + tax).toFixed(2));

  // Current chosen address string
  const currentAddressObj = savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0];
  const activeFormattedAddress = isAddingNewAddress && newAddressForm.street
    ? `${newAddressForm.flatNumber ? newAddressForm.flatNumber + ', ' : ''}${newAddressForm.street}, ${newAddressForm.area}, ${newAddressForm.city}, ${newAddressForm.state} - ${newAddressForm.pincode}`
    : currentAddressObj
      ? `${currentAddressObj.flatNumber ? currentAddressObj.flatNumber + ', ' : ''}${currentAddressObj.street}, ${currentAddressObj.area}, ${currentAddressObj.city} - ${currentAddressObj.pincode}`
      : '742 Evergreen Terrace, Springfield Metro, CA 94112';

  // Navigation handlers with validations
  const handleNextStep = () => {
    // Step 2 Validation: Slot availability
    if (currentStep === 2) {
      if (!isAsapEmergency) {
        const slotCheck = checkSlotAvailability(provider.id, selectedDate, selectedTimeSlot);
        if (!slotCheck.available) {
          addToast(slotCheck.reason, 'error');
          return;
        }
      }
    }

    // Step 3 Validation: Address
    if (currentStep === 3) {
      if (isAddingNewAddress) {
        if (!newAddressForm.street.trim() || !newAddressForm.city.trim() || !newAddressForm.pincode.trim()) {
          addToast('Please fill in Street, City, and Pincode for the new address.', 'error');
          return;
        }
        if (newAddressForm.phone && newAddressForm.phone.length < 7) {
          addToast('Please enter a valid phone number.', 'error');
          return;
        }
        if (newAddressForm.saveForLater) {
          const added = addSavedAddress({
            label: `${newAddressForm.street.slice(0, 18)}...`,
            fullName: newAddressForm.fullName,
            phone: newAddressForm.phone,
            flatNumber: newAddressForm.flatNumber,
            street: newAddressForm.street,
            area: newAddressForm.area,
            city: newAddressForm.city,
            state: newAddressForm.state,
            pincode: newAddressForm.pincode,
            landmark: newAddressForm.landmark,
            isDefault: false,
            locationCoords: pinnedLocation
          });
          setSelectedAddressId(added.id);
          setIsAddingNewAddress(false);
        }
      }
    }

    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Confirm and create booking
  const handleConfirmBooking = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const generatedId = createBooking({
          serviceId: service.id,
          serviceName: service.name,
          serviceImage: service.image,
          categoryName: service.categoryName,
          providerId: provider.id,
          providerName: provider.name,
          providerPhone: provider.phone,
          providerImage: provider.image,
          problem: problem.label || problem.title || 'General Service',
          problemDescription,
          severity,
          date: isAsapEmergency ? 'Today, Rapid Dispatch' : selectedDate,
          timeSlot: isAsapEmergency ? 'Within 20 Minutes (Emergency)' : selectedTimeSlot,
          address: activeFormattedAddress,
          locationCoords: pinnedLocation,
          images: uploadedMedia.map(m => m.url),
          instructions: specialInstructions,
          isEmergency: isAsapEmergency || severity === 'Emergency',
          pricing: {
            basePrice,
            serviceFee: platformFee,
            emergencyFee: emergencyCharge,
            tax,
            total: totalAmount,
            pricingType: isQuoteBased ? 'quote' : 'fixed'
          }
        });

        setIsSubmitting(false);
        setConfirmedBookingId(generatedId);
        setIsConfirmed(true);
      } catch (err) {
        setIsSubmitting(false);
        addToast(err.message || 'Failed to create booking.', 'error');
      }
    }, 600);
  };

  // Confirmation Success View (Step 7)
  if (isConfirmed) {
    return (
      <div className="booking-wizard-page container">
        <div className="card booking-success-card">
          <div className="success-icon-badge">
            <Check size={42} color="#ffffff" />
          </div>
          <span className="badge badge-verified" style={{ margin: '0 auto 0.5rem auto' }}>
            <Sparkles size={12} style={{ marginRight: 4 }} /> Status: Booking Requested
          </span>
          <h2 className="success-title">Booking Confirmed ✓</h2>
          <p className="success-subtitle">
            Your appointment has been officially requested and dispatched to <strong>{provider.name}</strong>.
          </p>

          <div className="booking-id-banner">
            <span className="id-label">UNIQUE BOOKING ID</span>
            <span className="id-value">{confirmedBookingId}</span>
          </div>

          {/* Quick Summary Grid */}
          <div className="success-summary-grid">
            <div className="summary-block">
              <span className="summary-k">SERVICE</span>
              <strong className="summary-v">{service.name}</strong>
            </div>
            <div className="summary-block">
              <span className="summary-k">DIAGNOSTIC ISSUE</span>
              <strong className="summary-v">{problem.label}</strong>
            </div>
            <div className="summary-block">
              <span className="summary-k">ASSIGNED SPECIALIST</span>
              <strong className="summary-v">{provider.name} ({provider.rating} ★)</strong>
            </div>
            <div className="summary-block">
              <span className="summary-k">SCHEDULED WINDOW</span>
              <strong className="summary-v">
                {isAsapEmergency ? 'Emergency Rapid Dispatch (20 Mins)' : `${selectedDate} • ${selectedTimeSlot}`}
              </strong>
            </div>
            <div className="summary-block full-width">
              <span className="summary-k">SERVICE ADDRESS</span>
              <strong className="summary-v">{activeFormattedAddress}</strong>
            </div>
            <div className="summary-block">
              <span className="summary-k">TOTAL ESTIMATE</span>
              <strong className="summary-v price-highlight">
                {isQuoteBased ? 'Inspection Quote Based' : `$${totalAmount.toFixed(2)}`}
              </strong>
            </div>
            <div className="summary-block">
              <span className="summary-k">PAYMENT STATUS</span>
              <strong className="summary-v">
                {isQuoteBased ? 'Quote Provided on Inspection' : 'Pending (Pay After Service)'}
              </strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="success-action-buttons">
            <button
              className="btn btn-primary btn-glow"
              onClick={() => navigateTo('booking-details', { bookingId: confirmedBookingId })}
            >
              <FileText size={16} />
              <span>Track Booking</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigateTo('bookings')}
            >
              <span>View in My Bookings</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => openChatModal(provider)}
            >
              <MessageSquare size={16} />
              <span>Contact Provider</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigateTo('consumer-home')}
            >
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        <style>{`
          .booking-wizard-page {
            max-width: 860px;
            margin: 2rem auto 4rem auto;
            padding: 0 1rem;
          }
          .booking-success-card {
            text-align: center;
            padding: 3rem 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: var(--bg-card);
            border-radius: var(--radius-xl);
            border: 1px solid rgba(16, 185, 129, 0.3);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
          }
          .success-icon-badge {
            width: 76px;
            height: 76px;
            border-radius: 50%;
            background: linear-gradient(135deg, #10b981, #059669);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.25rem;
            box-shadow: 0 0 25px rgba(16, 185, 129, 0.5);
            animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            70% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          .success-title {
            font-size: 2rem;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
          }
          .success-subtitle {
            color: var(--text-secondary);
            font-size: 0.95rem;
            max-width: 540px;
            margin-bottom: 1.5rem;
          }
          .booking-id-banner {
            display: inline-flex;
            flex-direction: column;
            gap: 0.25rem;
            background: rgba(16, 185, 129, 0.1);
            border: 1px dashed rgba(16, 185, 129, 0.4);
            padding: 0.75rem 2rem;
            border-radius: var(--radius-md);
            margin-bottom: 2rem;
          }
          .id-label {
            font-size: 0.72rem;
            font-weight: 700;
            color: var(--text-muted);
            letter-spacing: 1px;
          }
          .id-value {
            font-size: 1.35rem;
            font-weight: 800;
            color: var(--accent-primary);
            letter-spacing: 1.5px;
          }
          .success-summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            width: 100%;
            text-align: left;
            margin-bottom: 2.25rem;
            background: var(--bg-surface);
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
          }
          @media (max-width: 600px) {
            .success-summary-grid {
              grid-template-columns: 1fr;
            }
          }
          .summary-block {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .summary-block.full-width {
            grid-column: 1 / -1;
          }
          .summary-k {
            font-size: 0.72rem;
            font-weight: 700;
            color: var(--text-muted);
            letter-spacing: 0.5px;
          }
          .summary-v {
            font-size: 0.9rem;
            color: var(--text-primary);
          }
          .price-highlight {
            color: var(--accent-primary);
            font-size: 1.1rem;
            font-weight: 800;
          }
          .success-action-buttons {
            display: flex;
            gap: 0.85rem;
            flex-wrap: wrap;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="booking-wizard-page container">
      {/* Top Header & Breadcrumb Navigation */}
      <div className="wizard-top-header">
        <button
          className="btn btn-secondary btn-sm back-nav-btn"
          onClick={() => navigateTo('service-details', { serviceId: service.id })}
        >
          <ArrowLeft size={15} />
          <span>Back to Service</span>
        </button>

        <div className="wizard-heading">
          <span className="badge badge-verified">
            <Zap size={12} style={{ marginRight: 4 }} /> Multi-Step Verified Reservation
          </span>
          <h1 className="wizard-title">Book {service.name}</h1>
          <p className="wizard-subtitle">Instant verified appointment with double-booking prevention</p>
        </div>
      </div>

      {/* Progress Stepper Bar */}
      <div className="wizard-stepper-card">
        <div className="stepper-track">
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.id;
            const isActive = currentStep === s.id;
            return (
              <div
                key={s.id}
                className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => {
                  if (s.id < currentStep) setCurrentStep(s.id);
                }}
              >
                <div className="step-number-circle">
                  {isCompleted ? <Check size={14} color="#ffffff" /> : s.id}
                </div>
                <span className="step-label">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Step Content Body */}
      <div className="wizard-content-layout">
        <div className="wizard-main-stage">
          {/* STEP 1: Service & Problem */}
          {currentStep === 1 && (
            <div className="step-box">
              <div className="step-box-header">
                <h3>1. Confirm Service & Diagnostic Problem</h3>
                <p>Verify your selected service specialty, symptom, and preferred specialist</p>
              </div>

              {/* Service Card Snapshot */}
              <div className="selected-entity-card">
                <img src={service.image} alt={service.name} className="entity-image" />
                <div className="entity-details">
                  <div className="entity-badge-row">
                    <span className="badge badge-verified">{service.categoryName}</span>
                    <span className="duration-tag"><Clock size={12} /> {service.duration || '1-2 hrs'}</span>
                  </div>
                  <h4 className="entity-title">{service.name}</h4>
                  <p className="entity-desc">{service.shortDescription}</p>
                  <div className="pricing-type-pill">
                    {isQuoteBased ? (
                      <span className="quote-tag">
                        <Info size={13} /> Quote-Based Service (Final price after inspection)
                      </span>
                    ) : (
                      <span className="price-tag">
                        {service.pricingType === 'starting' ? `Starting from $${basePrice}` : `$${basePrice} Fixed Price`}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm entity-switch-btn"
                  onClick={() => setIsChangingService(!isChangingService)}
                >
                  Change
                </button>
              </div>

              {/* Service Switcher Dropdown Drawer */}
              {isChangingService && (
                <div className="entity-switcher-tray">
                  <h5 className="tray-title">Choose from available {service.categoryName} services:</h5>
                  <div className="tray-grid">
                    {servicesData
                      .filter(s => s.categoryId === service.categoryId)
                      .map(s => (
                        <div
                          key={s.id}
                          className={`tray-card ${s.id === service.id ? 'active' : ''}`}
                          onClick={() => {
                            setService(s);
                            setIsChangingService(false);
                          }}
                        >
                          <img src={s.image} alt={s.name} />
                          <div>
                            <strong>{s.name}</strong>
                            <span>${s.startingPrice}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Problem Selection Box */}
              <div className="selected-problem-card">
                <div className="problem-icon-circle">
                  <span>🔧</span>
                </div>
                <div className="problem-text-info">
                  <span className="problem-label-k">DIAGNOSTIC ISSUE SELECTED</span>
                  <h4 className="problem-title-v">{problem.label || problem.title}</h4>
                  <div className="problem-meta-row">
                    <span>Est. Diagnosis: {problem.duration || '30-45 mins'}</span>
                    <span>•</span>
                    <span>Typical Fix: {problem.typicalCost || 'Included in base price'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm entity-switch-btn"
                  onClick={() => setIsChangingProblem(!isChangingProblem)}
                >
                  Switch Issue
                </button>
              </div>

              {/* Problem Switcher Drawer */}
              {isChangingProblem && (
                <div className="entity-switcher-tray">
                  <h5 className="tray-title">Common issues for {service.categoryName}:</h5>
                  <div className="problem-pills-wrap">
                    {getProblemsForCategory(service.categoryId).map(prob => (
                      <button
                        key={prob.id}
                        type="button"
                        className={`problem-pill-option ${prob.id === problem.id ? 'active' : ''}`}
                        onClick={() => {
                          setProblem(prob);
                          setIsChangingProblem(false);
                        }}
                      >
                        <strong>{prob.label}</strong>
                        <span>{prob.typicalCost || 'Standard'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Provider Selection Card */}
              <div className="selected-provider-card">
                <img src={provider.image} alt={provider.name} className="provider-avatar-img" />
                <div className="provider-text-info">
                  <div className="pro-header-row">
                    <span className="badge badge-verified">
                      <ShieldCheck size={12} style={{ marginRight: 3 }} /> Verified Specialist
                    </span>
                    <span className="pro-rating-tag"><Star size={12} fill="#fbbf24" color="#fbbf24" /> {provider.rating} ({provider.reviewsCount || 120})</span>
                  </div>
                  <h4 className="provider-name-v">{provider.name}</h4>
                  <div className="provider-meta-row">
                    <span>{provider.experience || '8+ years'} exp</span>
                    <span>•</span>
                    <span>{provider.distanceKm ? `${provider.distanceKm} km away` : provider.location}</span>
                    <span>•</span>
                    <span style={{ color: '#10b981' }}>{provider.nextAvailableTime || 'Available Today'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm entity-switch-btn"
                  onClick={() => setIsChangingProvider(!isChangingProvider)}
                >
                  Change Pro
                </button>
              </div>

              {/* Provider Switcher Drawer */}
              {isChangingProvider && (
                <div className="entity-switcher-tray">
                  <h5 className="tray-title">Available specialists for {service.categoryName}:</h5>
                  <div className="tray-grid">
                    {providersData
                      .filter(p => p.categoryId === service.categoryId)
                      .slice(0, 4)
                      .map(p => (
                        <div
                          key={p.id}
                          className={`tray-card ${p.id === provider.id ? 'active' : ''}`}
                          onClick={() => {
                            setProvider(p);
                            setIsChangingProvider(false);
                          }}
                        >
                          <img src={p.image} alt={p.name} />
                          <div>
                            <strong>{p.name}</strong>
                            <span>{p.rating} ★ • {p.distanceKm || 2.4} km</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Date & Time with Double-Booking Prevention */}
          {currentStep === 2 && (
            <div className="step-box">
              <div className="step-box-header">
                <h3>2. Select Preferred Date & Arrival Window</h3>
                <p>Choose an available slot. Double-booking is strictly prohibited and locked.</p>
              </div>

              {/* Emergency ASAP Dispatch Option */}
              <div
                className={`emergency-asap-banner ${isAsapEmergency ? 'active' : ''}`}
                onClick={() => setIsAsapEmergency(!isAsapEmergency)}
              >
                <div className="asap-icon-box">
                  <Zap size={22} color="#ffffff" />
                </div>
                <div className="asap-text-block">
                  <div className="asap-title-line">
                    <strong>AS SOON AS POSSIBLE (Emergency 20-Min Arrival)</strong>
                    <span className="badge badge-emergency">+$20 Priority</span>
                  </div>
                  <p>
                    {provider.name} will be dispatched immediately with rapid route priority.
                    Estimated arrival in <strong>~20 minutes</strong>.
                  </p>
                </div>
                <div className="custom-check-circle">
                  {isAsapEmergency && <Check size={14} color="#ffffff" />}
                </div>
              </div>

              {/* Date Selection Carousel */}
              {!isAsapEmergency && (
                <>
                  <div className="input-group">
                    <label className="input-label">
                      <Calendar size={15} style={{ display: 'inline', marginRight: 6 }} />
                      Choose Service Date
                    </label>
                    <div className="date-pills-row">
                      {dateOptions.map(d => (
                        <button
                          key={d.dateKey}
                          type="button"
                          className={`date-pill-btn ${selectedDate === d.dateKey ? 'active' : ''}`}
                          onClick={() => setSelectedDate(d.dateKey)}
                        >
                          <strong className="date-pill-title">{d.label}</strong>
                          <span className="date-pill-sub">{d.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots with Live Collision / Double-booking detection */}
                  <div className="input-group" style={{ marginTop: '1.5rem' }}>
                    <label className="input-label">
                      <Clock size={15} style={{ display: 'inline', marginRight: 6 }} />
                      Choose Arrival Window for {provider.name}
                    </label>
                    <div className="slots-grid-view">
                      {timeSlots.map(slot => {
                        const check = checkSlotAvailability(provider.id, selectedDate, slot);
                        const isAvailable = check.available;
                        const isSelected = selectedTimeSlot === slot && isAvailable;

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={!isAvailable}
                            className={`slot-time-pill ${isSelected ? 'active' : ''} ${!isAvailable ? 'disabled-collision' : ''}`}
                            onClick={() => {
                              if (isAvailable) setSelectedTimeSlot(slot);
                            }}
                          >
                            <div className="slot-pill-top">
                              <span className="slot-time-text">{slot}</span>
                              {isAvailable ? (
                                <span className="slot-status-dot available" title="Available">Available</span>
                              ) : (
                                <span className="slot-status-dot booked" title="Booked slot">Booked</span>
                              )}
                            </div>
                            <span className="slot-helper-meta">
                              {isAvailable ? 'Specialist available' : 'Slot reserved'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 3: Service Address & Interactive Map */}
          {currentStep === 3 && (
            <div className="step-box">
              <div className="step-box-header">
                <h3>3. Service Location & Address</h3>
                <p>Select a saved address, enter a new destination, or pin coordinates on the map.</p>
              </div>

              {/* Saved Address Selection Cards */}
              {!isAddingNewAddress && (
                <div className="saved-addresses-stack">
                  <div className="address-section-top">
                    <span className="section-label">SAVED SERVICE ADDRESSES</span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsAddingNewAddress(true)}
                    >
                      <Plus size={14} /> Add New Address
                    </button>
                  </div>

                  <div className="addresses-grid">
                    {savedAddresses.map(addr => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          className={`address-card ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelectedAddressId(addr.id)}
                        >
                          <div className="address-card-header">
                            <div className="address-radio-circle">
                              {isSelected && <div className="inner-dot"></div>}
                            </div>
                            <strong>{addr.label}</strong>
                            {addr.isDefault && <span className="badge badge-verified" style={{ marginLeft: 'auto' }}>Default</span>}
                          </div>
                          <div className="address-card-body">
                            <div className="addr-recipient">
                              <User size={13} /> {addr.fullName || currentUser?.name || 'Alex Morgan'} • {addr.phone || currentUser?.phone || '+1 555 019 2834'}
                            </div>
                            <p className="addr-line">
                              {addr.flatNumber ? `${addr.flatNumber}, ` : ''}{addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                            </p>
                            {addr.landmark && (
                              <span className="addr-landmark">Landmark: {addr.landmark}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add New Address Form */}
              {isAddingNewAddress && (
                <div className="new-address-form-box">
                  <div className="address-section-top">
                    <span className="section-label">ENTER NEW SERVICE ADDRESS</span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsAddingNewAddress(false)}
                    >
                      Use Saved Address
                    </button>
                  </div>

                  <div className="form-grid-2">
                    <div className="input-group">
                      <label className="input-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="John Doe"
                        value={newAddressForm.fullName}
                        onChange={e => setNewAddressForm({ ...newAddressForm, fullName: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Contact Phone *</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+1 (555) 000-0000"
                        value={newAddressForm.phone}
                        onChange={e => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="input-group">
                      <label className="input-label">House / Flat / Suite Number</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Apt 4B, Building 3"
                        value={newAddressForm.flatNumber}
                        onChange={e => setNewAddressForm({ ...newAddressForm, flatNumber: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Street Address *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="742 Evergreen Terrace"
                        value={newAddressForm.street}
                        onChange={e => setNewAddressForm({ ...newAddressForm, street: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="input-group">
                      <label className="input-label">Area / Locality</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Residential West"
                        value={newAddressForm.area}
                        onChange={e => setNewAddressForm({ ...newAddressForm, area: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">City *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Springfield Metro"
                        value={newAddressForm.city}
                        onChange={e => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Postal / Pincode *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="94112"
                        value={newAddressForm.pincode}
                        onChange={e => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Notable Landmark (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Opposite City Park, Near Green Hospital"
                      value={newAddressForm.landmark}
                      onChange={e => setNewAddressForm({ ...newAddressForm, landmark: e.target.value })}
                    />
                  </div>

                  <label className="save-checkbox-row">
                    <input
                      type="checkbox"
                      checked={newAddressForm.saveForLater}
                      onChange={e => setNewAddressForm({ ...newAddressForm, saveForLater: e.target.checked })}
                    />
                    <span>Save this address to my profile for future bookings</span>
                  </label>
                </div>
              )}

              {/* Map Location Section Toggle */}
              <div className="map-picker-accordion">
                <button
                  type="button"
                  className="map-toggle-bar"
                  onClick={() => setShowMapPicker(!showMapPicker)}
                >
                  <div className="toggle-left-info">
                    <MapPin size={18} color="#10b981" />
                    <div>
                      <strong>Interactive Vector Map Coordinates</strong>
                      <span>Pinpoint building entrance or GPS coordinates</span>
                    </div>
                  </div>
                  <span className="btn btn-secondary btn-sm">
                    {showMapPicker ? 'Hide Map' : 'Open Map'}
                  </span>
                </button>

                {showMapPicker && (
                  <div className="map-picker-wrapper">
                    <MapLocationPicker
                      selectedLocation={pinnedLocation}
                      onSelectLocation={(loc) => {
                        setPinnedLocation(loc);
                        if (isAddingNewAddress) {
                          setNewAddressForm(prev => ({
                            ...prev,
                            street: loc.street || prev.street,
                            area: loc.area || prev.area,
                            city: loc.city || prev.city,
                            pincode: loc.pincode || prev.pincode
                          }));
                        }
                        addToast(`Location set: ${loc.name}`, 'info');
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Problem Details & Severity */}
          {currentStep === 4 && (
            <div className="step-box">
              <div className="step-box-header">
                <h3>4. Describe the Problem & Urgency</h3>
                <p>Provide helpful context so {provider.name} can carry proper parts and equipment.</p>
              </div>

              {/* Problem Description Textarea */}
              <div className="input-group">
                <label className="input-label">Tell us more about the problem</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Please describe the issue so the service provider can understand the problem before arriving. (e.g., strange humming sound, water pool under indoor unit, tripped breaker in circuit panel)."
                  value={problemDescription}
                  onChange={e => setProblemDescription(e.target.value)}
                />
              </div>

              {/* Problem Severity Selector */}
              <div className="input-group" style={{ marginTop: '1.25rem' }}>
                <label className="input-label">Problem Severity Level</label>
                <div className="severity-chips-grid">
                  {[
                    { id: 'Low', label: 'Low', desc: 'Routine checkup or minor wear', color: '#10b981' },
                    { id: 'Medium', label: 'Medium', desc: 'Functional issue, needs repair', color: '#38bdf8' },
                    { id: 'High', label: 'High', desc: 'Major malfunction, urgent fix', color: '#f59e0b' },
                    { id: 'Emergency', label: 'Emergency', desc: 'Hazardous / rapid response needed', color: '#ef4444' }
                  ].map(sev => {
                    const isSelected = severity === sev.id;
                    return (
                      <button
                        key={sev.id}
                        type="button"
                        className={`severity-chip ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setSeverity(sev.id);
                          if (sev.id === 'Emergency') {
                            setIsAsapEmergency(true);
                          }
                        }}
                      >
                        <div className="severity-indicator" style={{ background: sev.color }}></div>
                        <strong>{sev.label}</strong>
                        <span>{sev.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Instructions Input */}
              <div className="input-group" style={{ marginTop: '1.25rem' }}>
                <label className="input-label">Special Arrival Instructions (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Please call before arriving, gate code #402, beware of dog."
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                />
                <div className="instruction-quick-pills">
                  {['Please call 10 mins before', 'Ring buzzer #4B', 'Key under mat', 'Pet on premises'].map(hint => (
                    <button
                      key={hint}
                      type="button"
                      className="quick-hint-pill"
                      onClick={() => setSpecialInstructions(prev => prev ? `${prev}. ${hint}` : hint)}
                    >
                      + {hint}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Images & Video Upload */}
          {currentStep === 5 && (
            <div className="step-box">
              <div className="step-box-header">
                <h3>5. Upload Photos or Short Video of the Issue</h3>
                <p>Attaching visual proof helps the technician arrive with the exact replacement parts.</p>
              </div>

              <MediaUploadZone
                files={uploadedMedia}
                onFilesChange={setUploadedMedia}
                maxFiles={6}
              />
            </div>
          )}

          {/* STEP 6: Booking Summary & Final Review */}
          {currentStep === 6 && (
            <div className="step-box">
              <div className="step-box-header">
                <h3>6. Review Booking Summary & Confirm</h3>
                <p>Carefully review your reservation details and pricing before confirming.</p>
              </div>

              {/* Complete Itemized Summary Card */}
              <div className="summary-full-card">
                <div className="summary-card-header">
                  <span className="badge badge-verified">Step 6 of 6: Pre-Confirmation</span>
                  <h4>Itemized Booking Receipt</h4>
                </div>

                <div className="summary-rows-stack">
                  {/* Service Row */}
                  <div className="summary-row">
                    <span className="s-label">SERVICE SPECIALTY</span>
                    <div className="s-val-group">
                      <strong>{service.name}</strong>
                      <span className="sub-val">{service.categoryName} • {service.duration || '1-2 hrs'}</span>
                    </div>
                  </div>

                  {/* Problem Row */}
                  <div className="summary-row">
                    <span className="s-label">DIAGNOSTIC ISSUE</span>
                    <div className="s-val-group">
                      <strong>{problem.label || problem.title}</strong>
                      <span className="sub-val">Severity: <span className="severity-badge">{severity}</span></span>
                    </div>
                  </div>

                  {/* Specialist Row */}
                  <div className="summary-row">
                    <span className="s-label">ASSIGNED SPECIALIST</span>
                    <div className="s-val-group">
                      <strong>{provider.name}</strong>
                      <span className="sub-val">{provider.rating} ★ Rating • {provider.experience || '8 years'} exp</span>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="summary-row">
                    <span className="s-label">SCHEDULED WINDOW</span>
                    <div className="s-val-group">
                      <strong>
                        {isAsapEmergency ? '⚡ Emergency Immediate Dispatch (20 Mins)' : `${selectedDate}`}
                      </strong>
                      <span className="sub-val">{isAsapEmergency ? 'Priority Response' : selectedTimeSlot}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="summary-row">
                    <span className="s-label">SERVICE ADDRESS</span>
                    <div className="s-val-group">
                      <strong>{activeFormattedAddress}</strong>
                      {specialInstructions && (
                        <span className="sub-val">Instructions: "{specialInstructions}"</span>
                      )}
                    </div>
                  </div>

                  {/* Visual Proof */}
                  <div className="summary-row">
                    <span className="s-label">ATTACHED MEDIA</span>
                    <div className="s-val-group">
                      <span>{uploadedMedia.length > 0 ? `${uploadedMedia.length} photo/video proof files attached` : 'No photos attached'}</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown Box */}
                <div className="pricing-breakdown-box">
                  <div className="price-item">
                    <span>Base Service Charge ({isQuoteBased ? 'Diagnostic Visit' : service.pricingType === 'starting' ? 'Starting Price' : 'Fixed'})</span>
                    <strong>${basePrice.toFixed(2)}</strong>
                  </div>
                  {emergencyCharge > 0 && (
                    <div className="price-item emergency-highlight">
                      <span>Emergency 20-Min Priority Fee</span>
                      <strong>+${emergencyCharge.toFixed(2)}</strong>
                    </div>
                  )}
                  <div className="price-item">
                    <span>Platform Insurance & Booking Fee</span>
                    <strong>${platformFee.toFixed(2)}</strong>
                  </div>
                  <div className="price-item">
                    <span>Estimated Local Taxes (8%)</span>
                    <strong>${tax.toFixed(2)}</strong>
                  </div>
                  <div className="price-divider"></div>
                  <div className="price-item total-row">
                    <span>Total Amount</span>
                    <div className="total-val-box">
                      <strong className="total-amount-tag">
                        {isQuoteBased ? 'Inspection Quote' : `$${totalAmount.toFixed(2)}`}
                      </strong>
                      <span className="pay-type-hint">
                        {isQuoteBased ? 'Final price provided after diagnosis' : 'Pay After Service Verified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Guarantee Reassurance Notice */}
                <div className="guarantee-notice-box">
                  <ShieldCheck size={18} color="#10b981" />
                  <p>
                    <strong>ServiGo Satisfaction Guarantee:</strong> You will only be charged after the specialist inspects and completes the job to your 100% satisfaction. Free cancellation before provider dispatch.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Footer Actions */}
          <div className="wizard-bottom-controls">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handlePrevStep}
                disabled={isSubmitting}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                className="btn btn-primary btn-glow step-continue-btn"
                onClick={handleNextStep}
              >
                <span>Continue to {STEPS[currentStep].label}</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-glow confirm-booking-btn"
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
              >
                <Check size={18} />
                <span>{isSubmitting ? 'Confirming Reservation...' : 'Confirm Booking'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Sticky Snapshot (Desktop) */}
        <aside className="wizard-sidebar-summary">
          <div className="card sidebar-sticky-card">
            <h4 className="sidebar-summary-title">Reservation Summary</h4>

            <div className="sidebar-thumb-row">
              <img src={service.image} alt={service.name} className="sidebar-service-img" />
              <div>
                <span className="badge badge-verified" style={{ fontSize: '0.68rem' }}>{service.categoryName}</span>
                <h5 className="sidebar-service-name">{service.name}</h5>
              </div>
            </div>

            <div className="sidebar-meta-list">
              <div className="meta-line">
                <span className="m-k">Specialist:</span>
                <span className="m-v">{provider.name}</span>
              </div>
              <div className="meta-line">
                <span className="m-k">Issue:</span>
                <span className="m-v">{problem.label || 'Standard Diagnosis'}</span>
              </div>
              <div className="meta-line">
                <span className="m-k">Schedule:</span>
                <span className="m-v">{isAsapEmergency ? 'Rapid 20-Min Arrival' : selectedDate}</span>
              </div>
              <div className="meta-line">
                <span className="m-k">Time Slot:</span>
                <span className="m-v">{isAsapEmergency ? 'ASAP Emergency' : selectedTimeSlot}</span>
              </div>
            </div>

            <div className="sidebar-price-block">
              <span className="sidebar-total-label">Estimated Total</span>
              <strong className="sidebar-total-value">
                {isQuoteBased ? 'Inspection Quote' : `$${totalAmount.toFixed(2)}`}
              </strong>
              <span className="sidebar-pay-hint">Pay safely upon job completion</span>
            </div>

            <div className="sidebar-shield-row">
              <ShieldCheck size={14} color="#10b981" />
              <span>Double-Booking Protection Active</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Styles */}
      <style>{`
        .booking-wizard-page {
          max-width: 1140px;
          margin: 1.5rem auto 5rem auto;
          padding: 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .wizard-top-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .back-nav-btn {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .wizard-heading {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .wizard-title {
          font-size: clamp(1.6rem, 3.5vw, 2.3rem);
          font-weight: 800;
          color: var(--text-primary);
        }

        .wizard-subtitle {
          font-size: 0.92rem;
          color: var(--text-muted);
        }

        /* Stepper */
        .wizard-stepper-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1rem 1.25rem;
          overflow-x: auto;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .stepper-track {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 650px;
          gap: 1rem;
          position: relative;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          opacity: 0.6;
          transition: all var(--transition-fast);
        }
        .step-item.active {
          opacity: 1;
        }
        .step-item.completed {
          opacity: 0.9;
        }

        .step-number-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-surface);
          border: 1.5px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .step-item.active .step-number-circle {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: #ffffff;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
        }

        .step-item.completed .step-number-circle {
          background: #059669;
          border-color: #059669;
          color: #ffffff;
        }

        .step-label {
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--text-secondary);
          white-space: nowrap;
        }
        .step-item.active .step-label {
          color: var(--text-primary);
          font-weight: 700;
        }

        /* Layout */
        .wizard-content-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.5rem;
          align-items: flex-start;
        }
        @media (max-width: 900px) {
          .wizard-content-layout {
            grid-template-columns: 1fr;
          }
          .wizard-sidebar-summary {
            display: none;
          }
        }

        .wizard-main-stage {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .step-box {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .step-box-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .step-box-header p {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        /* Step 1 Cards */
        .selected-entity-card,
        .selected-problem-card,
        .selected-provider-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          transition: border-color var(--transition-fast);
        }
        .selected-entity-card:hover,
        .selected-problem-card:hover,
        .selected-provider-card:hover {
          border-color: rgba(16, 185, 129, 0.4);
        }

        .entity-image {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .entity-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .entity-badge-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .duration-tag {
          font-size: 0.72rem;
          color: var(--text-muted);
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .entity-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .entity-desc {
          font-size: 0.78rem;
          color: var(--text-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pricing-type-pill {
          margin-top: 0.25rem;
        }
        .price-tag {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent-primary);
        }
        .quote-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: #38bdf8;
        }

        .entity-switch-btn {
          margin-left: auto;
          white-space: nowrap;
        }

        /* Problem Card */
        .problem-icon-circle {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: rgba(16, 185, 129, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }

        .problem-text-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .problem-label-k {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }
        .problem-title-v {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .problem-meta-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Provider Card */
        .provider-avatar-img {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-primary);
        }
        .provider-text-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .pro-header-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .pro-rating-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: #fbbf24;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .provider-name-v {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .provider-meta-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Switcher Trays */
        .entity-switcher-tray {
          background: var(--bg-card);
          border: 1px dashed rgba(16, 185, 129, 0.4);
          border-radius: var(--radius-lg);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .tray-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-secondary);
        }
        .tray-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 0.65rem;
        }
        .tray-card {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .tray-card img {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          object-fit: cover;
        }
        .tray-card div {
          display: flex;
          flex-direction: column;
          font-size: 0.75rem;
        }
        .tray-card strong {
          color: var(--text-primary);
        }
        .tray-card span {
          color: var(--accent-primary);
        }
        .tray-card:hover, .tray-card.active {
          border-color: var(--accent-primary);
          background: rgba(16, 185, 129, 0.08);
        }

        .problem-pills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .problem-pill-option {
          display: flex;
          flex-direction: column;
          text-align: left;
          padding: 0.5rem 0.85rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 0.78rem;
          transition: all var(--transition-fast);
        }
        .problem-pill-option strong {
          color: var(--text-primary);
        }
        .problem-pill-option span {
          color: var(--text-muted);
          font-size: 0.7rem;
        }
        .problem-pill-option:hover, .problem-pill-option.active {
          border-color: var(--accent-primary);
          background: rgba(16, 185, 129, 0.1);
        }

        /* Step 2 ASAP Banner */
        .emergency-asap-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.15rem;
          border-radius: var(--radius-lg);
          border: 1.5px solid rgba(239, 68, 68, 0.35);
          background: rgba(239, 68, 68, 0.06);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .emergency-asap-banner:hover,
        .emergency-asap-banner.active {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.12);
        }
        .asap-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 14px rgba(239, 68, 68, 0.5);
        }
        .asap-text-block {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .asap-title-line {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-primary);
          font-size: 0.92rem;
        }
        .asap-text-block p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .custom-check-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #ef4444;
          background: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Date Pills */
        .date-pills-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.65rem;
          margin-top: 0.5rem;
        }
        .date-pill-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.75rem 0.5rem;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .date-pill-btn:hover {
          border-color: var(--accent-primary);
        }
        .date-pill-btn.active {
          border-color: var(--accent-primary);
          background: rgba(16, 185, 129, 0.12);
        }
        .date-pill-title {
          font-size: 0.84rem;
          color: var(--text-primary);
        }
        .date-pill-sub {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }
        .date-pill-btn.active .date-pill-title {
          color: var(--accent-primary);
        }

        /* Slots Grid */
        .slots-grid-view {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 0.65rem;
          margin-top: 0.5rem;
        }
        .slot-time-pill {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem 0.85rem;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .slot-time-pill:hover:not(:disabled) {
          border-color: var(--accent-primary);
        }
        .slot-time-pill.active {
          border-color: var(--accent-primary);
          background: rgba(16, 185, 129, 0.12);
        }
        .slot-time-pill.disabled-collision {
          opacity: 0.45;
          cursor: not-allowed;
          background: rgba(0,0,0,0.1);
          border-color: rgba(255,255,255,0.06);
        }
        .slot-pill-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .slot-time-text {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .slot-status-dot {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
        }
        .slot-status-dot.available {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }
        .slot-status-dot.booked {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }
        .slot-helper-meta {
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        /* Step 3 Addresses */
        .saved-addresses-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .address-section-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .section-label {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }
        .addresses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 0.85rem;
        }
        .address-card {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1rem;
          background: var(--bg-surface);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          transition: all var(--transition-fast);
        }
        .address-card:hover {
          border-color: var(--accent-primary);
        }
        .address-card.active {
          border-color: var(--accent-primary);
          background: rgba(16, 185, 129, 0.06);
          box-shadow: 0 0 14px rgba(16, 185, 129, 0.2);
        }
        .address-card-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .address-radio-circle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .address-card.active .address-radio-circle {
          border-color: var(--accent-primary);
        }
        .inner-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-primary);
        }
        .address-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .addr-recipient {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .addr-line {
          line-height: 1.4;
        }
        .addr-landmark {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-style: italic;
        }

        .new-address-form-box {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }
        .form-grid-3 {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          gap: 0.85rem;
        }
        @media (max-width: 600px) {
          .form-grid-2, .form-grid-3 {
            grid-template-columns: 1fr;
          }
        }
        .save-checkbox-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: var(--text-primary);
          cursor: pointer;
          margin-top: 0.25rem;
        }

        .map-picker-accordion {
          margin-top: 0.5rem;
        }
        .map-toggle-bar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          text-align: left;
        }
        .toggle-left-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .toggle-left-info div {
          display: flex;
          flex-direction: column;
        }
        .toggle-left-info strong {
          font-size: 0.85rem;
          color: var(--text-primary);
        }
        .toggle-left-info span {
          font-size: 0.74rem;
          color: var(--text-muted);
        }
        .map-picker-wrapper {
          margin-top: 0.75rem;
        }

        /* Step 4 Problem Details */
        .form-textarea {
          width: 100%;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-surface);
          color: var(--text-primary);
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          font-family: inherit;
          resize: vertical;
        }
        .form-textarea:focus {
          outline: none;
          border-color: var(--accent-primary);
        }
        .severity-chips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.65rem;
          margin-top: 0.4rem;
        }
        .severity-chip {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .severity-chip:hover {
          border-color: var(--accent-primary);
        }
        .severity-chip.active {
          border-color: var(--accent-primary);
          background: rgba(16, 185, 129, 0.1);
        }
        .severity-indicator {
          width: 14px;
          height: 14px;
          border-radius: 50%;
        }
        .severity-chip strong {
          font-size: 0.85rem;
          color: var(--text-primary);
        }
        .severity-chip span {
          font-size: 0.68rem;
          color: var(--text-muted);
        }
        .instruction-quick-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.5rem;
        }
        .quick-hint-pill {
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-surface);
          color: var(--text-secondary);
          font-size: 0.74rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .quick-hint-pill:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        /* Step 6 Summary */
        .summary-full-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }
        .summary-card-header {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-color);
        }
        .summary-card-header h4 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .summary-rows-stack {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .summary-row {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 1rem;
          font-size: 0.85rem;
        }
        @media (max-width: 600px) {
          .summary-row {
            grid-template-columns: 1fr;
            gap: 0.25rem;
          }
        }
        .s-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }
        .s-val-group {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .s-val-group strong {
          color: var(--text-primary);
        }
        .sub-val {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .severity-badge {
          display: inline-block;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          font-weight: 700;
          font-size: 0.72rem;
        }

        .pricing-breakdown-box {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--bg-card);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }
        .price-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .price-item.emergency-highlight {
          color: #ef4444;
          font-weight: 600;
        }
        .price-divider {
          height: 1px;
          background: var(--border-color);
          margin: 0.35rem 0;
        }
        .price-item.total-row {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .total-val-box {
          text-align: right;
          display: flex;
          flex-direction: column;
        }
        .total-amount-tag {
          font-size: 1.35rem;
          color: var(--accent-primary);
        }
        .pay-type-hint {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .guarantee-notice-box {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .guarantee-notice-box strong {
          color: var(--text-primary);
        }

        /* Bottom Controls */
        .wizard-bottom-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding-top: 0.5rem;
        }
        .step-continue-btn, .confirm-booking-btn {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          padding: 0.75rem 1.75rem;
        }

        /* Sidebar Snapshot */
        .sidebar-sticky-card {
          position: sticky;
          top: 80px;
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          padding: 1.25rem;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .sidebar-summary-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        .sidebar-thumb-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .sidebar-service-img {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }
        .sidebar-service-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 0.2rem;
        }
        .sidebar-meta-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.8rem;
        }
        .meta-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .m-k {
          color: var(--text-muted);
        }
        .m-v {
          font-weight: 600;
          color: var(--text-primary);
          text-align: right;
          max-width: 170px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-price-block {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          text-align: center;
          gap: 0.25rem;
        }
        .sidebar-total-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .sidebar-total-value {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--accent-primary);
        }
        .sidebar-pay-hint {
          font-size: 0.68rem;
          color: var(--text-muted);
        }
        .sidebar-shield-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
