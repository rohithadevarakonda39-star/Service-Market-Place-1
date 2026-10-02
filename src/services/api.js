import { servicesData } from '../data/servicesData';
import { providersData } from '../data/providersData';
import { categoriesData } from '../data/categoriesData';
import { getProblemsForCategory } from '../data/categoryProblems';

/**
 * ServiGo REST Client & Service Layer (Phase 2)
 * Simulates async REST API calls with fast response times and error handling.
 */

// Simulated network latency helper
const delay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // ==========================================
  // CATEGORIES API
  // ==========================================
  async getCategories() {
    await delay(80);
    return { success: true, count: categoriesData.length, data: categoriesData };
  },

  async getCategoryById(categoryId) {
    await delay(60);
    const category = categoriesData.find(c => c.id === categoryId);
    if (!category) {
      throw new Error(`Category ${categoryId} not found.`);
    }
    return { success: true, data: category };
  },

  async getCategoryProblems(categoryId) {
    await delay(50);
    const problems = getProblemsForCategory(categoryId);
    return { success: true, data: problems };
  },

  // ==========================================
  // SERVICES API
  // ==========================================
  async getServices(params = {}) {
    await delay(120);
    let list = [...servicesData];

    // Search query
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.categoryName.toLowerCase().includes(q) ||
        s.providerName.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (params.category && params.category !== 'all') {
      list = list.filter(s => s.categoryId === params.category);
    }

    // Price range
    if (params.maxPrice) {
      list = list.filter(s => s.startingPrice <= Number(params.maxPrice));
    }
    if (params.minPrice) {
      list = list.filter(s => s.startingPrice >= Number(params.minPrice));
    }

    // Rating
    if (params.minRating) {
      list = list.filter(s => s.rating >= Number(params.minRating));
    }

    // Sort
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        case 'price-low':
          list.sort((a, b) => a.startingPrice - b.startingPrice);
          break;
        case 'price-high':
          list.sort((a, b) => b.startingPrice - a.startingPrice);
          break;
        case 'most-booked':
          list.sort((a, b) => (b.bookingsCount || 0) - (a.bookingsCount || 0));
          break;
        default:
          break;
      }
    }

    return { success: true, count: list.length, data: list };
  },

  async getServiceById(serviceId) {
    await delay(80);
    const service = servicesData.find(s => s.id === serviceId);
    if (!service) {
      throw new Error(`Service with ID ${serviceId} not found.`);
    }
    const matchingProviders = providersData.filter(p => p.categoryId === service.categoryId);
    return { success: true, data: { ...service, matchingProviders } };
  },

  // ==========================================
  // PROVIDERS API
  // ==========================================
  async getProviders(params = {}) {
    await delay(100);
    let list = [...providersData];

    if (params.category && params.category !== 'all') {
      list = list.filter(p => p.categoryId === params.category);
    }

    if (params.maxDistance) {
      list = list.filter(p => (p.distanceKm || 0) <= Number(params.maxDistance));
    }

    if (params.minRating) {
      list = list.filter(p => p.rating >= Number(params.minRating));
    }

    if (params.availability && params.availability !== 'all') {
      list = list.filter(p => p.availabilityStatus === params.availability);
    }

    if (params.verifiedOnly) {
      list = list.filter(p => p.verified);
    }

    if (params.emergencyOnly) {
      list = list.filter(p => p.emergencyAvailable);
    }

    return { success: true, count: list.length, data: list };
  },

  async getProviderById(providerId) {
    await delay(80);
    const provider = providersData.find(p => p.id === providerId);
    if (!provider) {
      throw new Error(`Provider with ID ${providerId} not found.`);
    }
    return { success: true, data: provider };
  },

  async getNearbyProviders(location = 'Downtown Metro', maxKm = 10) {
    await delay(100);
    const nearby = providersData
      .filter(p => (p.distanceKm || 2.5) <= maxKm)
      .sort((a, b) => (a.distanceKm || 2.5) - (b.distanceKm || 2.5));
    return { success: true, count: nearby.length, data: nearby };
  },

  // ==========================================
  // INTELLIGENT PROVIDER MATCHING ALGORITHM
  // ==========================================
  async getMatchedProviders({ categoryId, problemId, location, maxDistance = 15 }) {
    await delay(140);
    let candidates = providersData.filter(p => p.categoryId === categoryId);

    if (candidates.length === 0) {
      candidates = providersData.slice(0, 6);
    }

    // Calculate match score (0 to 100)
    const scored = candidates.map(p => {
      let score = 70; // baseline

      // Distance score: closer is better
      const dist = p.distanceKm || 3.0;
      if (dist <= 2) score += 15;
      else if (dist <= 5) score += 10;
      else if (dist <= 10) score += 5;

      // Rating score: 4.95+ gets max
      if (p.rating >= 4.95) score += 10;
      else if (p.rating >= 4.9) score += 6;

      // Availability score
      if (p.availabilityStatus === 'available_now') score += 10;
      else if (p.availabilityStatus === 'available_today') score += 6;

      // Experience score
      const years = parseInt(p.experience) || 5;
      if (years >= 10) score += 5;

      // Clamp between 80 and 99
      const matchScore = Math.min(99, Math.max(82, score));

      return {
        ...p,
        matchScore,
        matchReasons: [
          `Top rated in ${p.location}`,
          p.availabilityStatus === 'available_now' ? 'Instant Dispatch Available' : 'Available Today',
          `${p.completedJobs}+ successfully completed jobs`,
          `Response time: ${p.responseTime || '< 15 mins'}`
        ]
      };
    });

    // Sort by match score descending
    scored.sort((a, b) => b.matchScore - a.matchScore);

    return {
      success: true,
      bestMatch: scored[0] || null,
      candidates: scored
    };
  },

  // ==========================================
  // FAVORITES API
  // ==========================================
  async getFavorites(userId) {
    await delay(60);
    const favServices = JSON.parse(localStorage.getItem('servigo_favorites') || '[]');
    const favProviders = JSON.parse(localStorage.getItem('servigo_provider_favorites') || '[]');

    const services = servicesData.filter(s => favServices.includes(s.id));
    const providers = providersData.filter(p => favProviders.includes(p.id));

    return {
      success: true,
      data: {
        services,
        providers
      }
    };
  },

  // ==========================================
  // BOOKINGS REST API (Phase 3)
  // ==========================================
  async getBookings(filter = {}) {
    await delay(90);
    const stored = JSON.parse(localStorage.getItem('servigo_bookings') || '[]');
    let list = [...stored];

    if (filter.status && filter.status !== 'all') {
      list = list.filter(b => b.status === filter.status);
    }
    if (filter.consumerId) {
      list = list.filter(b => b.consumerId === filter.consumerId);
    }
    if (filter.providerId) {
      list = list.filter(b => b.providerId === filter.providerId);
    }

    return { success: true, count: list.length, data: list };
  },

  async getBookingById(bookingId) {
    await delay(60);
    const stored = JSON.parse(localStorage.getItem('servigo_bookings') || '[]');
    const booking = stored.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error(`Booking with ID ${bookingId} not found.`);
    }
    return { success: true, data: booking };
  },

  // Double Booking Protection Validator
  async checkSlotAvailability(providerId, date, timeSlot, excludeBookingId = null) {
    await delay(40);
    if (!providerId || !date || !timeSlot) {
      return { available: true };
    }
    const stored = JSON.parse(localStorage.getItem('servigo_bookings') || '[]');
    const collision = stored.find(b => 
      b.providerId === providerId &&
      b.date === date &&
      b.timeSlot === timeSlot &&
      b.status !== 'Cancelled' &&
      b.status !== 'REJECTED' &&
      b.status !== 'CANCELLED' &&
      b.id !== excludeBookingId
    );

    if (collision) {
      return {
        available: false,
        reason: 'This time slot is no longer available. Please choose another time.'
      };
    }
    return { available: true };
  },

  async createBooking(bookingPayload) {
    await delay(150);
    const {
      serviceId,
      serviceName,
      serviceImage,
      categoryName,
      providerId,
      providerName,
      providerPhone,
      providerImage,
      problem,
      problemDescription,
      severity = 'Medium',
      date,
      timeSlot,
      address,
      locationCoords,
      images = [],
      video = null,
      instructions = '',
      pricing = {},
      isEmergency = false
    } = bookingPayload;

    if (!serviceName) throw new Error('Service is required for booking.');
    if (!providerName) throw new Error('Service provider is required for booking.');
    if (!date) throw new Error('Service date is required.');
    if (!timeSlot) throw new Error('Arrival window time slot is required.');
    if (!address) throw new Error('Service location address is required.');

    // Availability validation check
    const availabilityCheck = await this.checkSlotAvailability(providerId, date, timeSlot);
    if (!availabilityCheck.available) {
      throw new Error(availabilityCheck.reason);
    }

    // Format Booking ID e.g. SV-20261002-4821
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `SV-${todayStr}-${randSuffix}`;

    const newBooking = {
      id: bookingId,
      bookingId,
      serviceId,
      serviceName,
      serviceImage,
      categoryName,
      providerId,
      providerName,
      providerPhone: providerPhone || '+1 (555) 234-8901',
      providerImage: providerImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      problem: problem || 'General Service Checkup',
      problemDescription: problemDescription || '',
      severity,
      date,
      timeSlot,
      address,
      locationCoords: locationCoords || { lat: 37.7749, lng: -122.4194, name: 'Service Location' },
      images,
      video,
      instructions,
      pricing: {
        basePrice: pricing.basePrice || 60,
        serviceFee: pricing.serviceFee || 5.00,
        emergencyFee: isEmergency ? (pricing.emergencyFee || 20.00) : 0,
        tax: pricing.tax || 5.20,
        total: pricing.total || (pricing.basePrice || 60) + (isEmergency ? 20 : 0) + 10.20,
        pricingType: pricing.pricingType || 'fixed' // fixed, starting, quote
      },
      isEmergency: !!isEmergency,
      status: 'REQUESTED',
      bookingStatus: 'REQUESTED',
      paymentStatus: pricing.pricingType === 'quote' ? 'Pending Inspection Quote' : 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          title: 'Booking Requested',
          statusKey: 'REQUESTED',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: `Booking request sent to ${providerName}. Awaiting specialist acceptance.`
        }
      ],
      liveTracking: {
        statusText: isEmergency ? 'Priority emergency dispatch: Awaiting specialist confirmation' : 'Booking requested with specialist',
        step: 1,
        etaMinutes: isEmergency ? 20 : 45
      },
      invoiceNumber: `INV-${new Date().getFullYear()}-${randSuffix}`,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const stored = JSON.parse(localStorage.getItem('servigo_bookings') || '[]');
    const updated = [newBooking, ...stored];
    localStorage.setItem('servigo_bookings', JSON.stringify(updated));

    return {
      success: true,
      bookingId,
      data: newBooking
    };
  },

  async updateBookingStatus(bookingId, newStatus, meta = {}) {
    await delay(100);
    const stored = JSON.parse(localStorage.getItem('servigo_bookings') || '[]');
    const idx = stored.findIndex(b => b.id === bookingId);
    if (idx === -1) {
      throw new Error(`Booking ${bookingId} not found.`);
    }

    const current = stored[idx];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let timelineTitle = newStatus;
    let timelineDesc = meta.description || `Status transitioned to ${newStatus}`;

    switch (newStatus) {
      case 'ACCEPTED':
        timelineTitle = 'Provider Accepted';
        timelineDesc = `${current.providerName} accepted the booking request and scheduled your slot.`;
        break;
      case 'PROVIDER_ASSIGNED':
        timelineTitle = 'Provider Assigned';
        timelineDesc = `${current.providerName} is preparing toolset and dispatch schedule.`;
        break;
      case 'PROVIDER_ON_THE_WAY':
        timelineTitle = 'Provider On The Way';
        timelineDesc = `${current.providerName} has departed and is en route to your address.`;
        break;
      case 'ARRIVED':
        timelineTitle = 'Provider Arrived';
        timelineDesc = `${current.providerName} has arrived at your address location.`;
        break;
      case 'SERVICE_STARTED':
        timelineTitle = 'Service Started';
        timelineDesc = `Work has begun on ${current.serviceName}. Initial diagnostic inspection underway.`;
        break;
      case 'SERVICE_IN_PROGRESS':
        timelineTitle = 'Service In Progress';
        timelineDesc = `Active servicing and repairs are currently in progress.`;
        break;
      case 'COMPLETED':
        timelineTitle = 'Service Completed';
        timelineDesc = `Work completed successfully. Final quality verification performed.`;
        break;
      case 'PAYMENT_PENDING':
        timelineTitle = 'Payment Pending';
        timelineDesc = `Service finished. Invoice generated and awaiting consumer payment.`;
        break;
      case 'PAID':
        timelineTitle = 'Payment Completed';
        timelineDesc = `Payment settled securely. Digital invoice receipt issued.`;
        break;
      case 'CANCELLED':
        timelineTitle = 'Booking Cancelled';
        timelineDesc = meta.reason ? `Cancelled: ${meta.reason}` : 'Booking was cancelled by customer.';
        break;
      case 'REJECTED':
        timelineTitle = 'Booking Declined';
        timelineDesc = meta.reason ? `Declined: ${meta.reason}` : `${current.providerName} was unable to accept this request.`;
        break;
      default:
        break;
    }

    const updatedBooking = {
      ...current,
      status: newStatus,
      bookingStatus: newStatus,
      cancellationReason: meta.reason || current.cancellationReason,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...(current.timeline || []),
        {
          title: timelineTitle,
          statusKey: newStatus,
          time: timestamp,
          description: timelineDesc
        }
      ]
    };

    // Update live tracking step
    if (newStatus === 'PROVIDER_ON_THE_WAY') {
      updatedBooking.liveTracking = { ...updatedBooking.liveTracking, step: 2, statusText: `${current.providerName} is driving to your location` };
    } else if (newStatus === 'ARRIVED') {
      updatedBooking.liveTracking = { ...updatedBooking.liveTracking, step: 3, statusText: `${current.providerName} has arrived on-site` };
    } else if (newStatus === 'SERVICE_STARTED' || newStatus === 'SERVICE_IN_PROGRESS') {
      updatedBooking.liveTracking = { ...updatedBooking.liveTracking, step: 3, statusText: 'Service execution currently in progress' };
    } else if (newStatus === 'COMPLETED' || newStatus === 'PAID') {
      updatedBooking.liveTracking = { ...updatedBooking.liveTracking, step: 4, statusText: 'Service successfully completed & verified' };
    }

    stored[idx] = updatedBooking;
    localStorage.setItem('servigo_bookings', JSON.stringify(stored));
    return { success: true, data: updatedBooking };
  },

  async rescheduleBooking(bookingId, newDate, newTimeSlot) {
    await delay(120);
    const stored = JSON.parse(localStorage.getItem('servigo_bookings') || '[]');
    const booking = stored.find(b => b.id === bookingId);
    if (!booking) throw new Error(`Booking ${bookingId} not found.`);

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      throw new Error(`Cannot reschedule a ${booking.status.toLowerCase()} booking.`);
    }

    // Availability validation check
    const check = await this.checkSlotAvailability(booking.providerId, newDate, newTimeSlot, bookingId);
    if (!check.available) {
      throw new Error(check.reason);
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = stored.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          date: newDate,
          timeSlot: newTimeSlot,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...(b.timeline || []),
            {
              title: 'Booking Rescheduled',
              time: timestamp,
              description: `Appointment rescheduled to ${newDate} at ${newTimeSlot}.`
            }
          ]
        };
      }
      return b;
    });

    localStorage.setItem('servigo_bookings', JSON.stringify(updated));
    return { success: true, data: updated.find(b => b.id === bookingId) };
  },

  async cancelBooking(bookingId, reason = 'Changed my mind') {
    return this.updateBookingStatus(bookingId, 'CANCELLED', { reason });
  },

  async getProviderBookings(providerId) {
    await delay(80);
    const stored = JSON.parse(localStorage.getItem('servigo_bookings') || '[]');
    const list = stored.filter(b => b.providerId === providerId);
    return { success: true, data: list };
  },

  async acceptBooking(bookingId) {
    return this.updateBookingStatus(bookingId, 'ACCEPTED');
  },

  async rejectBooking(bookingId, reason = 'Specialist unavailable for selected window') {
    return this.updateBookingStatus(bookingId, 'REJECTED', { reason });
  }
};
