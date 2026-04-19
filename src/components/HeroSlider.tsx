import React from 'react';
import { Shield, Star, Users, Zap } from 'lucide-react';
import BookingWidget from './BookingWidget';
import { HERO_IMAGES } from '@/lib/constants';

interface HeroSliderProps {
  onNavigate: (page: string) => void;
  bookingRef: React.RefObject<HTMLDivElement | null>;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate, bookingRef }) => {
  return (
    <section className="relative overflow-hidden pt-[88px]" style={{ minHeight: '600px' }}>

      {/* Hero photo */}
      <img
        src={HERO_IMAGES[0]}
        alt="Van logistics"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark overlays for readability */}
      <div className="absolute inset-0 bg-[#071A2F]/78" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071A2F]/95 via-[#071A2F]/65 to-[#071A2F]/30" />
      {/* Gold glow near widget */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 45%, rgba(245,180,0,0.09), transparent 45%)' }} />
      {/* Bottom boundary — closes hero cleanly into white */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 5, height: '150px', background: 'linear-gradient(to bottom, transparent 0%, rgba(7,26,47,0.80) 45%, #ffffff 100%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-center py-10 lg:py-14">

          {/* Left — platform messaging */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2.5 bg-white/[0.07] border border-white/[0.12] backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-white/75 text-xs font-medium tracking-wide">10,000+ drivers active nationwide</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.07] tracking-tight mb-4">
              Instant UK Van<br />
              <span className="text-[#F5B400]">Transport Network</span>
            </h1>

            <p className="text-white/50 text-sm leading-relaxed mb-7 max-w-sm">
              Real-time routing. Verified drivers. Fully insured nationwide delivery — from a single item to a full house move.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: Zap,    label: 'Instant Dispatch',  sub: 'Matched in 60 seconds' },
                { icon: Shield, label: 'Fully Insured',     sub: 'Goods covered to £10k' },
                { icon: Star,   label: '4.9★ Rated',        sub: '8,400+ verified reviews' },
                { icon: Users,  label: '10k+ Drivers',      sub: 'Gold & silver network' },
              ].map(({ icon: Icon, label, sub }, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl p-3 backdrop-blur-sm">
                  <div className="w-7 h-7 bg-[#F5B400]/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-[#F5B400]" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold">{label}</div>
                    <div className="text-white/40 text-[11px] mt-0.5 leading-snug">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — stepped booking widget */}
          <div className="w-full pb-10 lg:pb-14">
            <BookingWidget bookingRef={bookingRef} onNavigate={onNavigate} embedded />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
