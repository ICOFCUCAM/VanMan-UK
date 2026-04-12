import React, { useState, useRef } from 'react';
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

const LEGAL_PAGES = ['terms', 'privacy', 'cookies', 'driver-agreement', 'cancellation', 'contact', 'about'];

const AppLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const bookingRef = useRef<HTMLDivElement>(null);

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBooking = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderPage = () => {
    // Legal pages
    if (LEGAL_PAGES.includes(currentPage)) {
      return <LegalPages page={currentPage} onNavigate={navigate} />;
    }

    switch (currentPage) {
      case 'driver-register':
        return <DriverRegistration onNavigate={navigate} />;
      case 'driver-marketplace':
        return <DriverMarketplace onNavigate={navigate} />;
      case 'tracking':
        return <TrackingView onNavigate={navigate} />;
      case 'admin':
        return <AdminDashboard onNavigate={navigate} />;
      case 'corporate':
        return <CorporatePortal onNavigate={navigate} />;
      case 'login':
        return <LoginPage type="customer" onNavigate={navigate} />;
      case 'driver-login':
        return <LoginPage type="driver" onNavigate={navigate} />;
      case 'home':
      default:
        return (
          <>
            <HeroSlider onNavigate={navigate} onScrollToBooking={scrollToBooking} />
            <BookingWidget bookingRef={bookingRef} />
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
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={navigate} />
      <main>
        {renderPage()}
      </main>
      <Footer onNavigate={navigate} />
      <WhatsAppButton />
      <CookieConsent />
    </div>
  );
};

export default AppLayout;
