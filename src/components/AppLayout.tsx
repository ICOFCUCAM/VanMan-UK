import React, { useState, useRef } from 'react';
import { Loader2, ShieldX } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

// Layout
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import CookieConsent from './CookieConsent';

// Homepage sections
import HeroSlider from './HeroSlider';
import BookingWidget from './BookingWidget';
import TrustMetricsStrip from './TrustMetricsStrip';
import StatsSection from './StatsSection';
import HowItWorks from './HowItWorks';
import ServicesPreview from './ServicesPreview';
import VanTypesSection from './VanTypesSection';
import EnterprisePreview from './EnterprisePreview';
import CustomerRatingSummary from './CustomerRatingSummary';
import MovingToolsSection from './MovingToolsSection';
import CitiesSection from './CitiesSection';
import SubscriptionTeaser from './SubscriptionTeaser';
import DriverCTA from './DriverCTA';

// App pages
import SignUpPage from './pages/SignUpPage';
import DriverSubscriptionPage from './pages/DriverSubscriptionPage';
import MovingChecklistPage from './pages/MovingChecklistPage';
import VanGuidePage from './pages/VanGuidePage';

// Content pages
import ServicesPage from './pages/ServicesPage';
import TechnologyPage from './pages/TechnologyPage';
import DriversPage from './pages/DriversPage';
import StudentsPage from './pages/StudentsPage';
import EnterprisePage from './pages/EnterprisePage';

// Functional pages
import DriverRegistration from './DriverRegistration';
import DriverMarketplace from './DriverMarketplace';
import TrackingView from './TrackingView';
import AdminDashboard from './AdminDashboard';
import CorporatePortal from './CorporatePortal';
import LegalPages from './LegalPages';
import LoginPage from './LoginPage';
import CustomerDashboard from './CustomerDashboard';
import PaymentPage from './PaymentPage';

const LEGAL_PAGES = ['terms', 'privacy', 'cookies', 'driver-agreement', 'cancellation', 'contact', 'about'];

const LoadingScreen = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-10 h-10 text-[#0E2A47] animate-spin mx-auto mb-3" />
      <p className="text-gray-500 text-sm">Loading…</p>
    </div>
  </div>
);

const AccessDenied = ({ onNavigate }: { onNavigate: (p: string) => void }) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center max-w-sm mx-auto px-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShieldX className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-500 text-sm mb-6">You don't have permission to view this page.</p>
      <button onClick={() => onNavigate('home')} className="bg-[#0E2A47] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0F3558] transition-colors">
        Back to Home
      </button>
    </div>
  </div>
);

const AppLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const bookingRef = useRef<HTMLDivElement>(null);
  const { isLoading, isAuthenticated, role } = useAppContext();

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBooking = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } else {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderPage = () => {
    // Legal pages
    if (LEGAL_PAGES.includes(currentPage)) {
      return <LegalPages page={currentPage as any} onNavigate={navigate} />;
    }

    // Auth pages
    if (currentPage === 'signup') return <SignUpPage onNavigate={navigate} />;
    if (currentPage === 'login' || currentPage === 'driver-login') return <LoginPage onNavigate={navigate} />;
    if (currentPage === 'driver-register') return <DriverRegistration onNavigate={navigate} />;

    // Content pages
    if (currentPage === 'services') return <ServicesPage onNavigate={navigate} onScrollToBooking={scrollToBooking} />;
    if (currentPage === 'technology') return <TechnologyPage onNavigate={navigate} onScrollToBooking={scrollToBooking} />;
    if (currentPage === 'drivers') return <DriversPage onNavigate={navigate} onScrollToBooking={scrollToBooking} />;
    if (currentPage === 'students') return <StudentsPage onNavigate={navigate} onScrollToBooking={scrollToBooking} />;
    if (currentPage === 'enterprise') return <EnterprisePage onNavigate={navigate} />;

    // Tools pages (public)
    if (currentPage === 'moving-checklist') return <MovingChecklistPage onNavigate={navigate} onScrollToBooking={scrollToBooking} />;
    if (currentPage === 'van-guide') return <VanGuidePage onNavigate={navigate} onScrollToBooking={scrollToBooking} />;

    // Driver subscription — requires authentication + driver role
    if (currentPage === 'driver-subscription') {
      if (isLoading) return <LoadingScreen />;
      if (!isAuthenticated) return <LoginPage onNavigate={navigate} />;
      if (role !== 'driver' && role !== 'admin') return <AccessDenied onNavigate={navigate} />;
      return <DriverSubscriptionPage onNavigate={navigate} />;
    }

    // Public functional pages
    if (currentPage === 'tracking') return <TrackingView onNavigate={navigate} />;
    if (currentPage === 'corporate') return <CorporatePortal onNavigate={navigate} />;

    // Protected: admin
    if (currentPage === 'admin') {
      if (isLoading) return <LoadingScreen />;
      if (role !== 'admin') return <AccessDenied onNavigate={navigate} />;
      return <AdminDashboard onNavigate={navigate} />;
    }

    // Protected: drivers
    if (currentPage === 'driver-marketplace' || currentPage === 'driver-dashboard') {
      if (isLoading) return <LoadingScreen />;
      if (!isAuthenticated) return <LoginPage onNavigate={navigate} />;
      if (role !== 'driver') return <AccessDenied onNavigate={navigate} />;
      return <DriverMarketplace onNavigate={navigate} />;
    }

    // Protected: customers
    if (currentPage === 'customer-dashboard') {
      if (isLoading) return <LoadingScreen />;
      if (!isAuthenticated) return <LoginPage onNavigate={navigate} />;
      return <CustomerDashboard onNavigate={navigate} />;
    }

    // Payment
    if (currentPage === 'payment') return <PaymentPage onNavigate={navigate} />;

    // Home
    return (
      <>
        <HeroSlider onNavigate={navigate} bookingRef={bookingRef} />
        <BookingWidget bookingRef={bookingRef} onNavigate={navigate} />
        <TrustMetricsStrip />
        <StatsSection />
        <ServicesPreview onNavigate={navigate} />
        <HowItWorks />
        <VanTypesSection onNavigate={navigate} onScrollToBooking={scrollToBooking} />
        <MovingToolsSection onNavigate={navigate} />
        <CitiesSection onNavigate={navigate} onScrollToBooking={scrollToBooking} />
        <CustomerRatingSummary />
        <SubscriptionTeaser onNavigate={navigate} />
        <EnterprisePreview onNavigate={navigate} />
        <DriverCTA onNavigate={navigate} />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={navigate} />
      <main>{renderPage()}</main>
      <Footer onNavigate={navigate} />
      <WhatsAppButton />
      <CookieConsent />
    </div>
  );
};

export default AppLayout;
