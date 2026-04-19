import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HERO_IMAGES } from '@/lib/constants';

interface HeroSliderProps {
  onNavigate: (page: string) => void;
  bookingRef: React.RefObject<HTMLDivElement | null>;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate, bookingRef }) => {
  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '600px', height: '88vh', maxHeight: '780px' }}>

      {/* Full-bleed background photo */}
      <img
        src={HERO_IMAGES[0]}
        alt="Fast Man & Van — UK transport"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Gradient overlay — left-to-right dark fade */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(105deg, rgba(7,26,47,0.92) 0%, rgba(14,42,71,0.78) 40%, rgba(14,42,71,0.35) 70%, rgba(14,42,71,0.1) 100%)' }}
      />

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '160px', background: 'linear-gradient(to bottom, transparent 0%, rgba(249,250,251,0.15) 70%, #f9fafb 100%)', zIndex: 5 }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center" style={{ paddingTop: '88px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-white/80 text-xs font-medium tracking-wide">UK&apos;s #1 Man &amp; Van Network</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.06] tracking-tight mb-5">
              Moving Made<br />
              <span className="text-[#F5B400]">Simple &amp; Reliable</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              Affordable moving solutions for homes, offices, and businesses. Fast, verified drivers — book in minutes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={scrollToBooking}
                className="group inline-flex items-center justify-center gap-2 bg-[#F5B400] hover:bg-[#FFD24A] text-[#0B2239] px-8 py-4 rounded-xl font-black text-sm sm:text-base transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#F5B400]/30"
              >
                Get Price Estimate
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('van-guide')}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-sm sm:text-base transition-all backdrop-blur-sm"
              >
                Van Size Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
