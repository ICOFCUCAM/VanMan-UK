import React from 'react';
import DriverSection from '@/components/DriverSection';
import FinalCTA from '@/components/FinalCTA';

interface DriversPageProps {
  onNavigate: (page: string) => void;
  onScrollToBooking: () => void;
}

const DriversPage: React.FC<DriversPageProps> = ({ onNavigate, onScrollToBooking }) => {
  return (
    <>
      {/* Page header */}
      <div className="bg-[#071A2F] pt-24 pb-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#F5B400] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">For Drivers</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Earn more. Drive on your terms.</h1>
          <p className="text-white/45 text-sm max-w-lg leading-relaxed">
            Join 10,000+ independent drivers. Choose your jobs, set your schedule, and get paid weekly — or instantly.
          </p>
        </div>
      </div>

      <DriverSection onNavigate={onNavigate} />
      <FinalCTA onScrollToBooking={onScrollToBooking} onNavigate={onNavigate} />
    </>
  );
};

export default DriversPage;
