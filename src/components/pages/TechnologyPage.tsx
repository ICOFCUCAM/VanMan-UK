import React from 'react';
import FeaturesSection from '@/components/FeaturesSection';
import FinalCTA from '@/components/FinalCTA';

interface TechnologyPageProps {
  onNavigate: (page: string) => void;
  onScrollToBooking: () => void;
}

const TechnologyPage: React.FC<TechnologyPageProps> = ({ onNavigate, onScrollToBooking }) => {
  return (
    <>
      {/* Page header */}
      <div className="pt-[88px] pb-10 border-b border-white/5" style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 60%, #0F3558 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#F5B400] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">Platform Technology</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Intelligent logistics infrastructure</h1>
          <p className="text-white/45 text-sm max-w-lg leading-relaxed">
            AI dispatch, real-time GPS, OSRM route optimisation, and full goods-in-transit insurance — built into every booking.
          </p>
        </div>
      </div>

      <FeaturesSection />
      <FinalCTA onScrollToBooking={onScrollToBooking} onNavigate={onNavigate} />
    </>
  );
};

export default TechnologyPage;
