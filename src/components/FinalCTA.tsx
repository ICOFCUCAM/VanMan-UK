import React from 'react';
import { ArrowRight, Building2 } from 'lucide-react';

interface FinalCTAProps {
  onScrollToBooking: () => void;
  onNavigate: (page: string) => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onScrollToBooking, onNavigate }) => {
  return (
    <section className="bg-[#061539] py-14 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Ready to Move?</span>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
          Move anything, anywhere in the UK
        </h2>
        <p className="text-white/45 text-sm mb-8 max-w-md mx-auto leading-relaxed">
          Instant quotes. Verified drivers. Real-time tracking. Book in under 60 seconds.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={onScrollToBooking}
            className="group flex items-center gap-2.5 bg-[#D4AF37] hover:bg-[#C5A028] text-[#061539] px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-xl hover:shadow-[#D4AF37]/25 hover:-translate-y-0.5"
          >
            Get Instant Quote
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('enterprise')}
            className="flex items-center gap-2.5 bg-white/6 hover:bg-white/12 border border-white/15 hover:border-white/25 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all"
          >
            <Building2 className="w-4 h-4 text-white/50" />
            Enterprise Enquiry
          </button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
