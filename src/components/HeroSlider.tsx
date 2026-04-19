import React from 'react';
import { Shield, Star, Users, Zap, ArrowRight } from 'lucide-react';
import { HERO_IMAGES } from '@/lib/constants';

interface HeroSliderProps {
  onNavigate: (page: string) => void;
  bookingRef: React.RefObject<HTMLDivElement | null>;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden pt-[88px]" style={{ background: '#071A2F', minHeight: '580px' }}>

      {/* Subtle radial glow behind image side */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 75% 50%, rgba(245,180,0,0.07), transparent 55%)' }} />

      {/* Bottom boundary — fades into white for next section */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 5, height: '120px', background: 'linear-gradient(to bottom, transparent 0%, #071A2F 60%, #ffffff 100%)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_480px] gap-10 lg:gap-16 items-center py-12 lg:py-16">

          {/* Left — platform messaging */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <div className="inline-flex items-center gap-2.5 bg-white/[0.07] border border-white/[0.12] backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-white/75 text-xs font-medium tracking-wide">10,000+ drivers active nationwide</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-white leading-[1.06] tracking-tight mb-5">
              Instant UK Van<br />
              <span className="text-[#F5B400]">Transport Network</span>
            </h1>

            <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
              Real-time routing. Verified drivers. Fully insured nationwide delivery — from a single item to a full house move.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => onNavigate('home')}
                className="group inline-flex items-center justify-center gap-2 bg-[#F5B400] hover:bg-[#FFD24A] text-[#0B2239] px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#F5B400]/25"
              >
                Get Instant Quote
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('driver-register')}
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white/75 hover:text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all"
              >
                Become a Driver
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: Zap,    label: 'Instant Dispatch',  sub: 'Matched in 60 seconds' },
                { icon: Shield, label: 'Fully Insured',     sub: 'Goods covered to £10k' },
                { icon: Star,   label: '4.9★ Rated',        sub: '8,400+ verified reviews' },
                { icon: Users,  label: '10k+ Drivers',      sub: 'Gold & silver network' },
              ].map(({ icon: Icon, label, sub }, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl p-3">
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

          {/* Right — logistics photo */}
          <div className="relative order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40" style={{ height: '420px' }}>
              <img
                src={HERO_IMAGES[1]}
                alt="Fast Man & Van logistics"
                className="w-full h-full object-cover object-center"
              />
              {/* Subtle gradient on left edge to blend into dark bg */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#071A2F]/50 via-transparent to-transparent" />
              {/* Bottom fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F]/60 via-transparent to-transparent" />

              {/* Floating stat badge */}
              <div className="absolute top-4 right-4 bg-[#071A2F]/85 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3">
                <p className="text-[#F5B400] text-lg font-black leading-none">4.9★</p>
                <p className="text-white/50 text-[10px] font-medium mt-0.5">Driver Rating</p>
              </div>

              {/* Floating dispatch badge */}
              <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                <div>
                  <p className="text-[#0B2239] text-xs font-black">Driver dispatched</p>
                  <p className="text-gray-400 text-[10px]">Arrives in ~12 min</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
