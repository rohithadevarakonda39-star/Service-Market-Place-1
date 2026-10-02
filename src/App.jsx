import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { BookingModal } from './components/common/BookingModal';
import { QuoteModal } from './components/common/QuoteModal';
import { ChatModal } from './components/common/ChatModal';
import { InvoiceModal } from './components/common/InvoiceModal';

// Phase 2 Comparison Components
import { FloatingCompareBar } from './components/cards/FloatingCompareBar';
import { ProviderComparisonModal } from './components/providers/ProviderComparisonModal';

// Auth & Role Selection Pages
import { RoleSelectPage } from './pages/auth/RoleSelectPage';
import { ConsumerLoginPage } from './pages/auth/ConsumerLoginPage';
import { ConsumerRegisterPage } from './pages/auth/ConsumerRegisterPage';
import { ProviderLoginPage } from './pages/auth/ProviderLoginPage';
import { ProviderRegisterPage } from './pages/auth/ProviderRegisterPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';

// Role Dashboards
import { ProviderDashboardPage } from './pages/dashboard/ProviderDashboardPage';
import { ProviderEarningsPage } from './pages/dashboard/ProviderEarningsPage';
import { AdminDashboardPage } from './pages/dashboard/AdminDashboardPage';

// Consumer Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { ProvidersPage } from './pages/ProvidersPage';
import { ProviderDetailsPage } from './pages/ProviderDetailsPage';
import { BookingsPage } from './pages/BookingsPage';
import { BookingDetailsPage } from './pages/BookingDetailsPage';
import { BookingWizardPage } from './pages/BookingWizardPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { PaymentPage } from './pages/PaymentPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { TrackingPage } from './pages/TrackingPage';
import { MessagesPage } from './pages/MessagesPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { AiServiceAssistant } from './components/ai/AiServiceAssistant';

const AppContent = () => {
  const { currentPage, currentUser } = useApp();

  const isAuthPage = [
    'auth',
    'consumer-login',
    'consumer-register',
    'provider-login',
    'provider-register',
    'admin-login'
  ].includes(currentPage);

  const isStandaloneDashboard = [
    'provider-dashboard',
    'provider-earnings',
    'admin-dashboard'
  ].includes(currentPage);

  const renderCurrentPage = () => {
    switch (currentPage) {
      // 1. Initial Screen: Welcome & Role Selection
      case 'auth':
        return <RoleSelectPage />;

      // 2. Consumer Auth
      case 'consumer-login':
        return <ConsumerLoginPage />;
      case 'consumer-register':
        return <ConsumerRegisterPage />;

      // 3. Provider Auth
      case 'provider-login':
        return <ProviderLoginPage />;
      case 'provider-register':
        return <ProviderRegisterPage />;

      // 4. Admin Auth
      case 'admin-login':
        return <AdminLoginPage />;

      // 5. Role Dedicated Destinations
      case 'provider-dashboard':
        return <ProviderDashboardPage />;
      case 'provider-earnings':
        return <ProviderEarningsPage />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;

      // 6. Consumer Marketplace & Core Features
      case 'consumer-home':
      case 'home':
        return <HomePage />;
      case 'services':
        return <ServicesPage />;
      case 'service-details':
        return <ServiceDetailsPage />;
      case 'providers':
        return <ProvidersPage />;
      case 'provider-details':
        return <ProviderDetailsPage />;
      case 'bookings':
        return <BookingsPage />;
      case 'booking-details':
        return <BookingDetailsPage />;
      case 'book':
      case 'book-service':
        return <BookingWizardPage />;
      case 'payment':
        return <PaymentPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'tracking':
        return <TrackingPage />;
      case 'messages':
        return <MessagesPage />;
      case 'emergency':
        return <EmergencyPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;

      default:
        return currentUser ? <HomePage /> : <RoleSelectPage />;
    }
  };

  // If in auth portal or specialized dashboard, render clean standalone view
  if (isAuthPage || isStandaloneDashboard) {
    return (
      <div className="app-container auth-mode-app">
        <main className="main-content-standalone" id="main-content">
          {renderCurrentPage()}
        </main>
        <ToastContainer />
      </div>
    );
  }

  // Otherwise, render full Consumer Marketplace Shell
  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Dynamic Content Area */}
      <main className="main-content" id="main-content">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Floating Comparison Tray */}
      <FloatingCompareBar />

      {/* Provider Comparison Modal */}
      <ProviderComparisonModal />

      {/* Intelligent AI Service Assistant Widget */}
      <AiServiceAssistant />

      {/* Global Modals */}
      <BookingModal />
      <QuoteModal />
      <ChatModal />
      <InvoiceModal />

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
