import React from 'react';
import { ArrowRight, Building2 } from 'lucide-react';

interface FinalCTAProps {
  onScrollToBooking: () => void;
  onNavigate: (page: string) => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onScrollToBooking, onNavigate }) => (
  <section className="py-12 bg-white border-t border-gray-100">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="relative overflow-hidden rounded-2xl px-8 py-10 flex flex-col sm:flex-row sm:items-center gap-7"
        style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 60%, #0F3558 100%)' }}
      >
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, #F5B400 30%, #FFD24A 50%, #F5B400 70%, transparent)' }} />
        {/* Radial glow */}
        <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(245,180,0,0.10), transparent 65%)' }} />

        {/* Left — copy */}
        <div className="flex-1 relative">
          <span className="text-[#F5B400] text-[10px] font-bold tracking-[0.22em] uppercase mb-2 block">Ready to Move?</span>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
            Move anything, anywhere in the UK
          </h2>
          <p className="text-white/45 text-sm leading-relaxed max-w-sm">
            Instant quotes. Verified drivers. Real-time tracking.
          </p>
        </div>

        {/* Right — CTAs */}
        <div className="flex flex-col xs:flex-row sm:flex-col lg:flex-row gap-3 shrink-0 relative">
          <button
            onClick={onScrollToBooking}
            className="group inline-flex items-center justify-center gap-2.5 bg-[#F5B400] hover:bg-[#FFD24A] text-[#0B2239] px-6 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-xl hover:shadow-[#F5B400]/25 hover:-translate-y-0.5 whitespace-nowrap"
          >
            Get Instant Quote
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('enterprise')}
            className="inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 hover:bg-white/[0.06] text-white/70 hover:text-white/90 px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap"
          >
            <Building2 className="w-3.5 h-3.5" />
            Enterprise Enquiry
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default FinalCTA;
