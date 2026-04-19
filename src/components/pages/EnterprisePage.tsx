import React from 'react';
import CorporateSection from '@/components/CorporateSection';
import PricingSection from '@/components/PricingSection';

interface EnterprisePageProps {
  onNavigate: (page: string) => void;
}

const EnterprisePage: React.FC<EnterprisePageProps> = ({ onNavigate }) => {
  return (
    <>
      {/* Page header */}
      <div className="pt-[88px] pb-10 border-b border-white/5" style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 60%, #0F3558 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#F5B400] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">Enterprise</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Logistics infrastructure for business</h1>
          <p className="text-white/45 text-sm max-w-lg leading-relaxed">
            Bulk bookings, recurring schedules, consolidated invoicing, and a dedicated analytics dashboard — built for operations at scale.
          </p>
        </div>
      </div>

      <CorporateSection onNavigate={onNavigate} />
      <PricingSection onNavigate={onNavigate} />

      {/* Portal CTA */}
      <section className="py-12 bg-[#071A2F] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Already have a corporate account?</h2>
          <p className="text-white/40 text-sm mb-6">Access your analytics, manage bookings, and download invoices from the portal.</p>
          <button
            onClick={() => onNavigate('corporate')}
            className="bg-[#F5B400] hover:bg-[#E5A000] text-[#071A2F] px-7 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-[#F5B400]/25"
          >
            Open Corporate Portal
          </button>
        </div>
      </section>
    </>
  );
};

export default EnterprisePage;
