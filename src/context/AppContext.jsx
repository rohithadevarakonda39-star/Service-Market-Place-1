import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialBookings } from '../data/initialBookings';
import { servicesData } from '../data/servicesData';
import { providersData } from '../data/providersData';
import { categoriesData } from '../data/categoriesData';
import { initialPayments, availableCoupons } from '../data/paymentsData';

const AppContext = createContext();

// Helper to translate route page IDs to URL path
export const getPathForPage = (page, params = {}) => {
  switch (page) {
    case 'auth': return '/auth';
    case 'consumer-login': return '/consumer/login';
    case 'consumer-register': return '/consumer/register';
    case 'provider-login': return '/provider/login';
    case 'provider-register': return '/provider/register';
    case 'admin-login': return '/admin/login';
    case 'consumer-home':
    case 'home': return '/consumer/home';
    case 'provider-dashboard': return '/provider/dashboard';
    case 'provider-earnings': return '/provider/earnings';
    case 'admin-dashboard': return '/admin/dashboard';
    case 'services': return '/services';
    case 'service-details':
      return params.serviceId ? `/services/${params.serviceId}` : '/services';
    case 'providers': return '/providers';
    case 'provider-details':
      return params.providerId ? `/providers/${params.providerId}` : '/providers';
    case 'bookings': return '/bookings';
    case 'booking-details':
      return params.bookingId ? `/bookings/${params.bookingId}` : '/bookings';
    case 'book-service':
    case 'book': return '/book';
    case 'payment':
      return params.bookingId ? `/payment/${params.bookingId}` : '/payments';
    case 'payments': return '/payments';
    case 'tracking':
      return params.bookingId ? `/tracking/${params.bookingId}` : '/bookings';
    case 'messages': return '/messages';
    case 'emergency': return '/emergency';
    case 'favorites': return '/favorites';
    case 'profile': return '/profile';
    case 'settings': return '/settings';
    default: return '/auth';
  }
};

// Helper to determine page & params from URL pathname
export const getPageFromPath = (pathname, user) => {
  const clean = (pathname || '/').toLowerCase().replace(/\/$/, '') || '/';

  // Public Auth Routes
  if (clean === '' || clean === '/' || clean === '/auth') {
    if (user) {
      if (user.role === 'admin') return { page: 'admin-dashboard', params: {} };
      if (user.role === 'provider') return { page: 'provider-dashboard', params: {} };
      return { page: 'consumer-home', params: {} };
    }
    return { page: 'auth', params: {} };
  }

  if (clean === '/consumer/login' || clean === '/consumer-login') return { page: 'consumer-login', params: {} };
  if (clean === '/consumer/register' || clean === '/consumer-register') return { page: 'consumer-register', params: {} };
  if (clean === '/provider/login' || clean === '/provider-login') return { page: 'provider-login', params: {} };
  if (clean === '/provider/register' || clean === '/provider-register') return { page: 'provider-register', params: {} };
  if (clean === '/admin/login' || clean === '/admin-login') return { page: 'admin-login', params: {} };

  // If user is NOT authenticated, all other routes are protected -> redirect to /auth
  if (!user) {
    return { page: 'auth', params: {} };
  }

  // Role Protection & Routing
  if (clean === '/admin/dashboard' || clean === '/admin-dashboard') {
    return {
      page: user.role === 'admin' ? 'admin-dashboard' : (user.role === 'provider' ? 'provider-dashboard' : 'consumer-home'),
      params: {}
    };
  }

  if (clean === '/provider/dashboard' || clean === '/provider-dashboard') {
    return {
      page: user.role === 'provider' ? 'provider-dashboard' : (user.role === 'admin' ? 'admin-dashboard' : 'consumer-home'),
      params: {}
    };
  }

  if (clean === '/consumer/home' || clean === '/home') {
    return {
      page: user.role === 'provider' ? 'provider-dashboard' : (user.role === 'admin' ? 'admin-dashboard' : 'consumer-home'),
      params: {}
    };
  }

  // Parameterized service detail route: /services/:serviceId
  if (clean.startsWith('/services/')) {
    const sId = clean.replace('/services/', '');
    return { page: 'service-details', params: { serviceId: sId } };
  }

  // Parameterized provider detail route: /providers/:providerId
  if (clean.startsWith('/providers/')) {
    const pId = clean.replace('/providers/', '');
    return { page: 'provider-details', params: { providerId: pId } };
  }

  // Parameterized booking detail route: /bookings/:bookingId
  if (clean.startsWith('/bookings/')) {
    const bId = clean.replace('/bookings/', '');
    return { page: 'booking-details', params: { bookingId: bId } };
  }

  // Parameterized payment route: /payment/:bookingId
  if (clean.startsWith('/payment/')) {
    const bId = clean.replace('/payment/', '');
    return { page: 'payment', params: { bookingId: bId } };
  }

  // Parameterized tracking route: /tracking/:bookingId
  if (clean.startsWith('/tracking/')) {
    const bId = clean.replace('/tracking/', '');
    return { page: 'tracking', params: { bookingId: bId } };
  }

  if (clean === '/payment' || clean === '/payments') return { page: 'payments', params: {} };
  if (clean === '/messages' || clean === '/chat') return { page: 'messages', params: {} };
  if (clean === '/emergency') return { page: 'emergency', params: {} };
  if (clean === '/provider/earnings') return { page: 'provider-earnings', params: {} };

  if (clean === '/book' || clean === '/book-service') return { page: 'book-service', params: {} };
  if (clean === '/services') return { page: 'services', params: {} };
  if (clean === '/providers') return { page: 'providers', params: {} };
  if (clean === '/bookings') return { page: 'bookings', params: {} };
  if (clean === '/favorites') return { page: 'favorites', params: {} };
  if (clean === '/profile') return { page: 'profile', params: {} };
  if (clean === '/settings') return { page: 'settings', params: {} };

  // Fallback for authenticated user based on role
  if (user.role === 'admin') return { page: 'admin-dashboard', params: {} };
  if (user.role === 'provider') return { page: 'provider-dashboard', params: {} };
  return { page: 'consumer-home', params: {} };
};

export const AppProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('servigo_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('servigo_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // User & Auth State - default null unless existing valid session found
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedSession = localStorage.getItem('servigo_session');
      return savedSession ? JSON.parse(savedSession) : null;
    } catch (e) {
      console.error('Failed reading session', e);
      return null;
    }
  });

  // Initial routing resolution
  const initialRoute = getPageFromPath(window.location.pathname, currentUser);
  const [currentPage, setCurrentPage] = useState(initialRoute.page);
  const [pageParams, setPageParams] = useState(initialRoute.params || {});

  // Sync URL on popstate (browser back / forward button)
  useEffect(() => {
    const handlePopState = () => {
      const resolved = getPageFromPath(window.location.pathname, currentUser);
      setCurrentPage(resolved.page);
      setPageParams(resolved.params || {});
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

  // Navigate function with URL pushState, params, and role security guards
  const navigateTo = (page, params = {}) => {
    // 1. Role-based Route Protection Guards
    if (page === 'admin-dashboard' && (!currentUser || currentUser.role !== 'admin')) {
      addToast('Access Denied: Administrator clearance required.', 'error');
      if (currentUser?.role === 'provider') {
        setCurrentPage('provider-dashboard');
        window.history.pushState({}, '', '/provider/dashboard');
      } else if (currentUser?.role === 'client') {
        setCurrentPage('consumer-home');
        window.history.pushState({}, '', '/consumer/home');
      } else {
        setCurrentPage('auth');
        window.history.pushState({}, '', '/auth');
      }
      return;
    }

    if (page === 'provider-dashboard' && (!currentUser || currentUser.role !== 'provider')) {
      addToast('Access Denied: Service Provider credentials required.', 'error');
      if (currentUser?.role === 'admin') {
        setCurrentPage('admin-dashboard');
        window.history.pushState({}, '', '/admin/dashboard');
      } else if (currentUser?.role === 'client') {
        setCurrentPage('consumer-home');
        window.history.pushState({}, '', '/consumer/home');
      } else {
        setCurrentPage('auth');
        window.history.pushState({}, '', '/auth');
      }
      return;
    }

    if (page === 'consumer-home' && currentUser?.role === 'provider') {
      addToast('Providers are restricted to the Provider Operations Center.', 'info');
      setCurrentPage('provider-dashboard');
      window.history.pushState({}, '', '/provider/dashboard');
      return;
    }

    if (page === 'consumer-home' && currentUser?.role === 'admin') {
      setCurrentPage('admin-dashboard');
      window.history.pushState({}, '', '/admin/dashboard');
      return;
    }

    // Unauthenticated attempts on protected pages
    const protectedPages = [
      'consumer-home', 'services', 'service-details', 'providers',
      'provider-details', 'bookings', 'booking-details', 'book-service', 'book',
      'payment', 'payments', 'tracking', 'messages', 'emergency',
      'favorites', 'profile', 'settings'
    ];
    if (protectedPages.includes(page) && !currentUser) {
      addToast('Authentication required. Please choose your role to sign in.', 'info');
      setCurrentPage('auth');
      window.history.pushState({}, '', '/auth');
      return;
    }

    // Set page state
    setCurrentPage(page);
    setPageParams(params);

    // Update browser URL
    const targetPath = getPathForPage(page, params);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login handler
  const login = (userData, role) => {
    const sessionUser = {
      ...userData,
      role: role || userData.role || 'client'
    };
    setCurrentUser(sessionUser);
    localStorage.setItem('servigo_session', JSON.stringify(sessionUser));

    if (sessionUser.role === 'admin') {
      setCurrentPage('admin-dashboard');
      window.history.replaceState({}, '', '/admin/dashboard');
    } else if (sessionUser.role === 'provider') {
      setCurrentPage('provider-dashboard');
      window.history.replaceState({}, '', '/provider/dashboard');
    } else {
      setCurrentPage('consumer-home');
      window.history.replaceState({}, '', '/consumer/home');
    }
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('servigo_session');
    addToast('You have been logged out. Safe session ended.', 'info');

    // Replace history so clicking browser "Back" does not restore protected page
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '/auth');
    }
    setCurrentPage('auth');
    setPageParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Demo Login helper for review
  const loginAsQuickDemo = (role) => {
    if (role === 'admin') {
      login({
        id: 'adm-001',
        name: 'Master Platform Admin',
        email: 'admin@servigo.io',
        role: 'admin',
        title: 'Super Administrator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        permissions: ['all', 'provider_vetting', 'financial_disputes', 'system_config']
      }, 'admin');
      addToast('Quick demo access: Logged in as Administrator', 'success');
    } else if (role === 'provider') {
      const activePro = providersData[0];
      login({
        id: activePro.id,
        name: activePro.name,
        email: 'marcus.vance@servigo.pro',
        phone: activePro.phone,
        address: activePro.location,
        avatar: activePro.image,
        service: activePro.service,
        rating: activePro.rating,
        experience: activePro.experience,
        startingPrice: activePro.startingPrice,
        verified: true,
        memberSince: 'Jan 2024',
        role: 'provider'
      }, 'provider');
      addToast('Quick demo access: Logged in as Service Provider', 'success');
    } else {
      login({
        id: 'usr-101',
        name: 'Alex Morgan',
        email: 'alex.morgan@servigo.io',
        phone: '+1 (555) 019-2834',
        address: '742 Evergreen Terrace, Apt 4B, Springfield Metro',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        memberSince: 'March 2025',
        savedCardsCount: 2,
        role: 'client'
      }, 'client');
      addToast('Quick demo access: Logged in as Service Consumer', 'success');
    }
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('Downtown Metro');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 200,
    minRating: 0,
    distanceRadius: 'all', // 'all', 2, 5, 10
    availability: 'all', // 'all', 'available_now', 'available_today', 'available_tomorrow'
    verifiedOnly: false,
    emergencyOnly: false,
    sortBy: 'recommended' // 'recommended', 'rating', 'price-low', 'price-high', 'distance', 'most-booked'
  });

  // Problem Selection State (Phase 2 & 3: "What's the problem?")
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Phase 3: Saved Addresses System
  const DEFAULT_SAVED_ADDRESSES = [
    {
      id: 'addr-1',
      label: 'Primary Residence (Home)',
      fullName: 'Alex Morgan',
      phone: '+1 (555) 019-2834',
      flatNumber: 'Apt 4B',
      street: '742 Evergreen Terrace',
      area: 'Residential West',
      city: 'Springfield Metro',
      state: 'CA',
      pincode: '94112',
      landmark: 'Opposite Oakwood Community Library',
      isDefault: true,
      locationCoords: { lat: 37.7520, lng: -122.4350, name: 'Home' }
    },
    {
      id: 'addr-2',
      label: 'Corporate Office',
      fullName: 'Alex Morgan',
      phone: '+1 (555) 019-2834',
      flatNumber: 'Suite 300',
      street: '500 Innovation Way',
      area: 'Tech Park Sector 4',
      city: 'Springfield Metro',
      state: 'CA',
      pincode: '94107',
      landmark: 'Next to Tower B Atrium',
      isDefault: false,
      locationCoords: { lat: 37.7812, lng: -122.3980, name: 'Tech Park' }
    }
  ];

  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('servigo_saved_addresses');
      return saved ? JSON.parse(saved) : DEFAULT_SAVED_ADDRESSES;
    } catch {
      return DEFAULT_SAVED_ADDRESSES;
    }
  });

  useEffect(() => {
    localStorage.setItem('servigo_saved_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  const addSavedAddress = (newAddr) => {
    const item = {
      ...newAddr,
      id: `addr-${Date.now()}`
    };
    setSavedAddresses(prev => [item, ...prev]);
    addToast('Address added to your address book', 'success');
    return item;
  };

  const deleteSavedAddress = (id) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
    addToast('Address removed from address book', 'info');
  };

  const setDefaultAddress = (id) => {
    setSavedAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    addToast('Default address updated', 'info');
  };

  // Phase 3: Notifications System
  const DEFAULT_NOTIFICATIONS = [
    {
      id: 'notif-1',
      bookingId: 'SVG-9042',
      title: 'Service In Progress',
      message: 'Marcus Vance started diagnostic work on your Electrical Panel.',
      time: '15 mins ago',
      type: 'status',
      read: false
    },
    {
      id: 'notif-2',
      bookingId: 'SVG-9042',
      title: 'Provider Arrived',
      message: 'Marcus Vance arrived at 742 Evergreen Terrace.',
      time: '45 mins ago',
      type: 'status',
      read: true
    },
    {
      id: 'notif-3',
      bookingId: 'srv-8819',
      title: 'Booking Accepted',
      message: 'Elena Rostova accepted your Deep Cleaning appointment.',
      time: '2 hours ago',
      type: 'success',
      read: true
    }
  ];

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('servigo_notifications');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem('servigo_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = ({ bookingId, title, message, type = 'info' }) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId,
      title,
      message,
      time: 'Just now',
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Phase 3: Double Booking Protection Checker
  const checkSlotAvailability = (providerId, date, timeSlot, excludeBookingId = null) => {
    if (!providerId || !date || !timeSlot) return { available: true };
    const stored = bookings;
    const collision = stored.find(b =>
      b.providerId === providerId &&
      b.date === date &&
      b.timeSlot === timeSlot &&
      b.status !== 'Cancelled' &&
      b.status !== 'CANCELLED' &&
      b.status !== 'REJECTED' &&
      b.id !== excludeBookingId
    );
    if (collision) {
      return {
        available: false,
        reason: 'This time slot is no longer available. Please choose another time.'
      };
    }
    return { available: true };
  };

  // Bookings State
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('servigo_bookings');
    return saved ? JSON.parse(saved) : initialBookings;
  });

  useEffect(() => {
    localStorage.setItem('servigo_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Phase 4: Payments Ledger State
  const [payments, setPayments] = useState(() => {
    try {
      const saved = localStorage.getItem('servigo_payments');
      return saved ? JSON.parse(saved) : initialPayments;
    } catch {
      return initialPayments;
    }
  });

  useEffect(() => {
    localStorage.setItem('servigo_payments', JSON.stringify(payments));
  }, [payments]);

  // Phase 4: Process Payment & Update Booking Record
  const processPayment = ({
    bookingId,
    paymentMethod,
    amount,
    subtotal,
    discount = 0,
    tax = 0,
    couponCode = null,
    isCash = false
  }) => {
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const transactionId = `TXN-${todayStr}-${randSuffix}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${randSuffix}`;

    const matchedBooking = bookings.find(b => b.id === bookingId || b.bookingId === bookingId);
    const status = isCash ? 'CASH_PENDING' : 'SUCCESS';

    const newPayment = {
      transactionId,
      bookingId,
      serviceName: matchedBooking?.serviceName || matchedBooking?.serviceTitle || 'Service Job',
      providerName: matchedBooking?.providerName || 'Certified Specialist',
      amount: subtotal || amount,
      discount,
      tax,
      finalAmount: amount,
      paymentMethod,
      methodDetails: isCash ? 'Cash on Delivery' : paymentMethod,
      status,
      date: new Date().toISOString(),
      invoiceNumber,
      couponCode,
      gateway: isCash ? 'Cash on Delivery' : 'Razorpay (Test Mode)'
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update the booking payment status and pricing breakdown
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId || b.bookingId === bookingId) {
        return {
          ...b,
          paymentStatus: isCash ? 'CASH_PENDING' : 'PAID',
          paymentMethod,
          invoiceNumber,
          pricing: {
            ...(b.pricing || {}),
            basePrice: subtotal || amount,
            discount,
            tax,
            total: amount
          },
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    }));

    addNotification({
      bookingId,
      title: isCash ? 'Cash on Service Order Placed' : 'Payment Received',
      message: isCash
        ? `Order #${bookingId} confirmed! Total ₹${amount} due in cash upon completion.`
        : `Payment of ₹${amount} for #${bookingId} confirmed via ${paymentMethod}.`,
      type: 'success'
    });

    return newPayment;
  };

  // Phase 3: Create Booking with Unique ID and Standard Status Lifecycle
  const createBooking = (newBookingData) => {
    // 1. Double booking validation check
    const check = checkSlotAvailability(newBookingData.providerId, newBookingData.date, newBookingData.timeSlot);
    if (!check.available) {
      addToast(check.reason, 'error');
      throw new Error(check.reason);
    }

    // 2. Generate standard Unique Booking ID: SV-YYYYMMDD-XXXX
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `SV-${todayStr}-${randSuffix}`;

    const newBooking = {
      id: bookingId,
      bookingId,
      ...newBookingData,
      problem: newBookingData.problem || (selectedProblem ? selectedProblem.title : 'General Inspection'),
      problemSelected: newBookingData.problem || (selectedProblem ? selectedProblem.title : null),
      status: 'REQUESTED',
      bookingStatus: 'REQUESTED',
      paymentStatus: newBookingData.pricing?.pricingType === 'quote' ? 'Pending Inspection Quote' : 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      liveTracking: {
        statusText: newBookingData.isEmergency 
          ? 'Priority emergency dispatch: Awaiting specialist confirmation' 
          : 'Booking requested. Awaiting specialist acceptance.',
        step: 1,
        etaMinutes: newBookingData.isEmergency ? 20 : 45
      },
      timeline: [
        {
          title: 'Booking Requested',
          statusKey: 'REQUESTED',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: `Booking request submitted to ${newBookingData.providerName}.`
        }
      ],
      invoiceNumber: `INV-${new Date().getFullYear()}-${randSuffix}`,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setBookings(prev => [newBooking, ...prev]);

    // Dispatch notification
    addNotification({
      bookingId,
      title: 'Booking Requested',
      message: `Your booking #${bookingId} has been submitted to ${newBookingData.providerName}.`,
      type: 'info'
    });

    addToast(`Booking requested successfully! ID: ${bookingId}`, 'success');
    return bookingId;
  };

  // Provider Lifecycle Actions: Accept
  const acceptBooking = (bookingId) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        addNotification({
          bookingId,
          title: 'Booking Accepted',
          message: `${b.providerName} accepted your booking for ${b.serviceName}!`,
          type: 'success'
        });
        return {
          ...b,
          status: 'ACCEPTED',
          bookingStatus: 'ACCEPTED',
          updatedAt: new Date().toISOString(),
          liveTracking: {
            ...b.liveTracking,
            statusText: `${b.providerName} confirmed your appointment`
          },
          timeline: [
            ...(b.timeline || []),
            {
              title: 'Provider Accepted',
              statusKey: 'ACCEPTED',
              time: timestamp,
              description: `${b.providerName} accepted the booking request and confirmed your arrival slot.`
            }
          ]
        };
      }
      return b;
    }));
    addToast('Booking accepted! Customer has been notified.', 'success');
  };

  // Provider Lifecycle Actions: Reject
  const rejectBooking = (bookingId, reason = 'Specialist unavailable for selected window') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        addNotification({
          bookingId,
          title: 'Booking Declined',
          message: `${b.providerName} was unable to accept booking #${bookingId}. (${reason})`,
          type: 'error'
        });
        return {
          ...b,
          status: 'REJECTED',
          bookingStatus: 'REJECTED',
          cancellationReason: reason,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...(b.timeline || []),
            {
              title: 'Booking Declined',
              statusKey: 'REJECTED',
              time: timestamp,
              description: `Declined: ${reason}`
            }
          ]
        };
      }
      return b;
    }));
    addToast('Booking request declined.', 'info');
  };

  // Provider & Customer Job Status Updater
  const updateBookingStatus = (bookingId, newStatus, meta = {}) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        let step = b.liveTracking?.step || 1;
        let statusText = b.liveTracking?.statusText || '';
        let timelineTitle = newStatus;
        let timelineDesc = meta.description || `Status updated to ${newStatus}`;

        if (newStatus === 'ACCEPTED') {
          step = 1;
          statusText = `${b.providerName} accepted your appointment`;
          timelineTitle = 'Provider Accepted';
          timelineDesc = `${b.providerName} confirmed your arrival window.`;
        } else if (newStatus === 'PROVIDER_ON_THE_WAY') {
          step = 2;
          statusText = `${b.providerName} is driving to your location`;
          timelineTitle = 'Provider On The Way';
          timelineDesc = `${b.providerName} has departed and is en route.`;
        } else if (newStatus === 'ARRIVED') {
          step = 3;
          statusText = `${b.providerName} has arrived on-site`;
          timelineTitle = 'Provider Arrived';
          timelineDesc = `${b.providerName} arrived at your service address.`;
        } else if (newStatus === 'SERVICE_STARTED') {
          step = 3;
          statusText = 'Diagnostic inspection and repairs started';
          timelineTitle = 'Service Started';
          timelineDesc = `Work has begun on ${b.serviceName}. Initial diagnostic underway.`;
        } else if (newStatus === 'SERVICE_IN_PROGRESS') {
          step = 3;
          statusText = 'Service execution actively underway';
          timelineTitle = 'Service In Progress';
          timelineDesc = `Active servicing and repairs are in progress.`;
        } else if (newStatus === 'COMPLETED') {
          step = 4;
          statusText = 'Service completed successfully';
          timelineTitle = 'Service Completed';
          timelineDesc = `Work completed successfully. Final quality verification performed.`;
        } else if (newStatus === 'CANCELLED') {
          timelineTitle = 'Booking Cancelled';
          timelineDesc = meta.reason ? `Cancelled: ${meta.reason}` : 'Booking was cancelled.';
        }

        addNotification({
          bookingId,
          title: timelineTitle,
          message: `${b.providerName}: ${timelineDesc}`,
          type: newStatus === 'COMPLETED' ? 'success' : newStatus === 'CANCELLED' ? 'error' : 'status'
        });

        return {
          ...b,
          status: newStatus,
          bookingStatus: newStatus,
          cancellationReason: meta.reason || b.cancellationReason,
          updatedAt: new Date().toISOString(),
          liveTracking: {
            ...b.liveTracking,
            step,
            statusText
          },
          timeline: [
            ...(b.timeline || []),
            {
              title: timelineTitle,
              statusKey: newStatus,
              time: timestamp,
              description: timelineDesc
            }
          ]
        };
      }
      return b;
    }));
  };

  // Customer Rescheduling with Double Booking check
  const rescheduleBooking = (bookingId, newDate, newTimeSlot) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return false;

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED' || booking.status === 'REJECTED') {
      addToast(`Cannot reschedule a ${booking.status.toLowerCase()} booking.`, 'error');
      return false;
    }

    const check = checkSlotAvailability(booking.providerId, newDate, newTimeSlot, bookingId);
    if (!check.available) {
      addToast(check.reason, 'error');
      return false;
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        addNotification({
          bookingId,
          title: 'Booking Rescheduled',
          message: `Appointment #${bookingId} rescheduled to ${newDate} at ${newTimeSlot}.`,
          type: 'info'
        });
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
    }));

    addToast(`Rescheduled booking to ${newDate} at ${newTimeSlot}`, 'success');
    return true;
  };

  // Customer Cancellation with Reason
  const cancelBooking = (bookingId, reason = 'Changed my mind') => {
    updateBookingStatus(bookingId, 'CANCELLED', { reason });
    addToast(`Booking ${bookingId} cancelled. Refund/credit initiated.`, 'info');
  };

  // Phase 3: Multi-step Booking Wizard State & Launcher
  const [bookingFlowData, setBookingFlowData] = useState(null);

  const startBookingFlow = (service, provider = null, problem = null) => {
    const matchedProvider = provider || providersData.find(p => p.id === service?.providerId) || providersData[0];
    const activeProblem = problem || selectedProblem || null;
    const payload = {
      service: service || servicesData[0],
      provider: matchedProvider,
      problem: activeProblem
    };
    setBookingFlowData(payload);
    navigateTo('book-service', payload);
  };

  // Favorites (Services & Providers)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('servigo_favorites');
    return saved ? JSON.parse(saved) : ['srv-1', 'srv-3'];
  });

  const [providerFavorites, setProviderFavorites] = useState(() => {
    const saved = localStorage.getItem('servigo_provider_favorites');
    return saved ? JSON.parse(saved) : ['prov-1', 'prov-2'];
  });

  useEffect(() => {
    localStorage.setItem('servigo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('servigo_provider_favorites', JSON.stringify(providerFavorites));
  }, [providerFavorites]);

  const toggleFavorite = (id, title = 'Item') => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      if (exists) {
        addToast(`Removed "${title}" from favorites`, 'info');
        return prev.filter(item => item !== id);
      } else {
        addToast(`Added "${title}" to your favorites!`, 'success');
        return [...prev, id];
      }
    });
  };

  const toggleProviderFavorite = (id, name = 'Provider') => {
    setProviderFavorites(prev => {
      const exists = prev.includes(id);
      if (exists) {
        addToast(`Removed pro "${name}" from saved providers`, 'info');
        return prev.filter(item => item !== id);
      } else {
        addToast(`Added "${name}" to saved specialists!`, 'success');
        return [...prev, id];
      }
    });
  };

  // Recently Viewed Items Tracker (Phase 2)
  const [recentlyViewedServices, setRecentlyViewedServices] = useState(() => {
    try {
      const saved = localStorage.getItem('servigo_recently_viewed_services');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewedProviders, setRecentlyViewedProviders] = useState(() => {
    try {
      const saved = localStorage.getItem('servigo_recently_viewed_providers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const trackViewedService = (service) => {
    if (!service || !service.id) return;
    setRecentlyViewedServices(prev => {
      const filtered = prev.filter(s => s.id !== service.id);
      const updated = [service, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('servigo_recently_viewed_services', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const trackViewedProvider = (provider) => {
    if (!provider || !provider.id) return;
    setRecentlyViewedProviders(prev => {
      const filtered = prev.filter(p => p.id !== provider.id);
      const updated = [provider, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('servigo_recently_viewed_providers', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Provider Comparison Tool (Up to 3 providers)
  const [compareProviders, setCompareProviders] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const addToCompare = (provider) => {
    if (compareProviders.some(p => p.id === provider.id)) {
      addToast(`${provider.name} is already in comparison`, 'info');
      return;
    }
    if (compareProviders.length >= 3) {
      addToast('You can compare a maximum of 3 providers at once.', 'error');
      return;
    }
    setCompareProviders(prev => [...prev, provider]);
    addToast(`Added ${provider.name} to comparison (${compareProviders.length + 1}/3)`, 'success');
  };

  const removeFromCompare = (providerId) => {
    setCompareProviders(prev => prev.filter(p => p.id !== providerId));
  };

  const clearCompare = () => {
    setCompareProviders([]);
  };

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Modals
  const [bookingModal, setBookingModal] = useState({ isOpen: false, service: null, provider: null, problem: null });
  const [quoteModal, setQuoteModal] = useState({ isOpen: false, service: null, provider: null });
  const [chatModal, setChatModal] = useState({ isOpen: false, provider: null });
  const [invoiceModal, setInvoiceModal] = useState({ isOpen: false, booking: null });

  const openBookingModal = (service, provider = null, problem = null) => {
    const matchedProvider = provider || providersData.find(p => p.id === service?.providerId) || providersData[0];
    const activeProblem = problem || selectedProblem || null;
    startBookingFlow(service, matchedProvider, activeProblem);
  };

  const closeBookingModal = () => {
    setBookingModal({ isOpen: false, service: null, provider: null, problem: null });
  };

  const openQuoteModal = (service, provider = null) => {
    const matchedProvider = provider || providersData.find(p => p.id === service?.providerId) || providersData[0];
    setQuoteModal({ isOpen: true, service, provider: matchedProvider });
  };

  const closeQuoteModal = () => {
    setQuoteModal({ isOpen: false, service: null, provider: null });
  };

  const openChatModal = (provider) => {
    setChatModal({ isOpen: true, provider });
  };

  const closeChatModal = () => {
    setChatModal({ isOpen: false, provider: null });
  };

  const openInvoiceModal = (booking) => {
    setInvoiceModal({ isOpen: true, booking });
  };

  const closeInvoiceModal = () => {
    setInvoiceModal({ isOpen: false, booking: null });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentPage,
        pageParams,
        navigateTo,
        currentUser,
        setCurrentUser,
        login,
        logout,
        loginAsQuickDemo,
        searchQuery,
        setSearchQuery,
        searchLocation,
        setSearchLocation,
        selectedCategory,
        setSelectedCategory,
        filters,
        setFilters,
        selectedProblem,
        setSelectedProblem,
        savedAddresses,
        addSavedAddress,
        deleteSavedAddress,
        setDefaultAddress,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        checkSlotAvailability,
        bookings,
        createBooking,
        acceptBooking,
        rejectBooking,
        updateBookingStatus,
        rescheduleBooking,
        cancelBooking,
        bookingFlowData,
        startBookingFlow,
        favorites,
        providerFavorites,
        toggleFavorite,
        toggleProviderFavorite,
        recentlyViewedServices,
        recentlyViewedProviders,
        trackViewedService,
        trackViewedProvider,
        compareProviders,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
        toasts,
        addToast,
        removeToast,
        bookingModal,
        openBookingModal,
        closeBookingModal,
        quoteModal,
        openQuoteModal,
        closeQuoteModal,
        chatModal,
        openChatModal,
        closeChatModal,
        invoiceModal,
        openInvoiceModal,
        closeInvoiceModal,
        payments,
        processPayment,
        availableCoupons
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
