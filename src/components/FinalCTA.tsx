import React from 'react';
import { ArrowRight, Building2 } from 'lucide-react';

interface FinalCTAProps {
  onScrollToBooking: () => void;
  onNavigate: (page: string) => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onScrollToBooking, onNavigate }) => (
  <section
    className="py-14 border-t border-white/[0.05]"
    style={{ background: 'linear-gradient(180deg, #0E2A47 0%, #071A2F 100%)' }}
  >
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span className="text-[#F5B400] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Ready to Move?</span>
      <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
        Move anything, anywhere in the UK
      </h2>
      <p className="text-[#8FA9C4] text-sm mb-8 max-w-md mx-auto leading-relaxed">
        Instant quotes. Verified drivers. Real-time tracking. Book in under 60 seconds.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onScrollToBooking}
          className="group flex items-center gap-2.5 bg-[#F5B400] hover:bg-[#FFD24A] text-[#0B2239] px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-xl hover:shadow-[#F5B400]/20 hover:-translate-y-0.5"
        >
          Get Instant Quote
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={() => onNavigate('enterprise')}
          className="flex items-center gap-2.5 border border-[#2E4F72] hover:bg-white/[0.06] text-[#C9D8E8] px-7 py-3.5 rounded-xl font-semibold text-sm transition-all"
        >
          <Building2 className="w-4 h-4 text-[#8FA9C4]" />
          Enterprise Enquiry
        </button>
      </div>
    </div>
  </section>
);

export default FinalCTA;
