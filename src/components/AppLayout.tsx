import React, { useState, useRef } from 'react';
import { Loader2, ShieldX } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import Header from './Header';
import HeroSlider from './HeroSlider';
import BookingWidget from './BookingWidget';
import HowItWorks from './HowItWorks';
import ServicesSection from './ServicesSection';
import FeaturesSection from './FeaturesSection';
import PricingSection from './PricingSection';
import DriverSection from './DriverSection';
import StudentDiscount from './StudentDiscount';
import CorporateSection from './CorporateSection';
import ReviewsSection from './ReviewsSection';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import CookieConsent from './CookieConsent';
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
      <Loader2 className="w-10 h-10 text-[#0A2463] animate-spin mx-auto mb-3" />
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
      <button onClick={() => onNavigate('home')} className="bg-[#0A2463] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1B3A8C] transition-colors">
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
    // Public: legal pages
    if (LEGAL_PAGES.includes(currentPage)) {
      return <LegalPages page={currentPage as any} onNavigate={navigate} />;
    }

    // Public: auth pages
    if (currentPage === 'login' || currentPage === 'driver-login') return <LoginPage onNavigate={navigate} />;
    if (currentPage === 'driver-register') return <DriverRegistration onNavigate={navigate} />;

    // Public: tracking & corporate (anyone can view)
    if (currentPage === 'tracking') return <TrackingView onNavigate={navigate} />;
    if (currentPage === 'corporate') return <CorporatePortal onNavigate={navigate} />;

    // Protected: admin only
    if (currentPage === 'admin') {
      if (isLoading) return <LoadingScreen />;
      if (role !== 'admin') return <AccessDenied onNavigate={navigate} />;
      return <AdminDashboard onNavigate={navigate} />;
    }

    // Protected: drivers only
    if (currentPage === 'driver-marketplace' || currentPage === 'driver-dashboard') {
      if (isLoading) return <LoadingScreen />;
      if (!isAuthenticated) return <LoginPage onNavigate={navigate} />;
      if (role !== 'driver') return <AccessDenied onNavigate={navigate} />;
      return <DriverMarketplace onNavigate={navigate} />;
    }

    // Protected: authenticated customers
    if (currentPage === 'customer-dashboard') {
      if (isLoading) return <LoadingScreen />;
      if (!isAuthenticated) return <LoginPage onNavigate={navigate} />;
      return <CustomerDashboard onNavigate={navigate} />;
    }

    // Payment page (public — auth optional)
    if (currentPage === 'payment') return <PaymentPage onNavigate={navigate} />;

    // Home
    return (
      <>
        <HeroSlider onNavigate={navigate} onScrollToBooking={scrollToBooking} />
        <BookingWidget bookingRef={bookingRef} onNavigate={navigate} />
        <HowItWorks />
        <ServicesSection />
        <FeaturesSection />
        <PricingSection onNavigate={navigate} />
        <DriverSection onNavigate={navigate} />
        <StudentDiscount />
        <CorporateSection onNavigate={navigate} />
        <ReviewsSection />
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
