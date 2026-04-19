import React from 'react';
import ServicesSection from '@/components/ServicesSection';
import FinalCTA from '@/components/FinalCTA';

interface ServicesPageProps {
  onNavigate: (page: string) => void;
  onScrollToBooking: () => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, onScrollToBooking }) => {
  return (
    <>
      {/* Page header */}
      <div className="bg-[#061539] pt-24 pb-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">Transport Services</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Every service, every vehicle type</h1>
          <p className="text-white/45 text-sm max-w-lg leading-relaxed">
            From single-item same-day delivery to full house moves — matched to the right driver, instantly.
          </p>
        </div>
      </div>

      <ServicesSection />
      <FinalCTA onScrollToBooking={onScrollToBooking} onNavigate={onNavigate} />
    </>
  );
};

export default ServicesPage;
