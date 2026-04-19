import React from 'react';
import { Shield, Star, Users, Zap } from 'lucide-react';
import BookingWidget from './BookingWidget';

interface HeroSliderProps {
  onNavigate: (page: string) => void;
  bookingRef: React.RefObject<HTMLDivElement | null>;
}

const CITY_NODES = [
  { id: 'london',     x: 252, y: 390, r: 5 },
  { id: 'manchester', x: 144, y: 278, r: 4 },
  { id: 'birmingham', x: 160, y: 334, r: 4 },
  { id: 'edinburgh',  x: 93,  y: 143, r: 4 },
  { id: 'glasgow',    x: 36,  y: 143, r: 4 },
  { id: 'leeds',      x: 181, y: 261, r: 3 },
  { id: 'liverpool',  x: 104, y: 284, r: 3 },
  { id: 'bristol',    x: 124, y: 390, r: 3 },
  { id: 'newcastle',  x: 175, y: 199, r: 3 },
  { id: 'sheffield',  x: 181, y: 302, r: 2.5 },
  { id: 'norwich',    x: 324, y: 329, r: 2.5 },
  { id: 'cambridge',  x: 263, y: 351, r: 2.5 },
  { id: 'brighton',   x: 252, y: 430, r: 2.5 },
  { id: 'cardiff',    x: 93,  y: 390, r: 2.5 },
  { id: 'aberdeen',   x: 149, y: 75,  r: 3 },
  { id: 'york',       x: 200, y: 256, r: 2.5 },
];

const ROUTES = [
  ['london', 'birmingham'], ['london', 'cambridge'], ['london', 'brighton'],
  ['london', 'norwich'], ['birmingham', 'manchester'], ['birmingham', 'bristol'],
  ['birmingham', 'sheffield'], ['manchester', 'leeds'], ['manchester', 'liverpool'],
  ['leeds', 'newcastle'], ['leeds', 'york'], ['newcastle', 'edinburgh'],
  ['edinburgh', 'glasgow'], ['glasgow', 'aberdeen'], ['bristol', 'cardiff'],
  ['sheffield', 'york'],
];

const NetworkMap: React.FC = () => {
  const nodeMap = Object.fromEntries(CITY_NODES.map(n => [n.id, n]));
  return (
    <svg viewBox="0 0 400 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      {ROUTES.map(([a, b], i) => {
        const from = nodeMap[a];
        const to = nodeMap[b];
        if (!from || !to) return null;
        return (
          <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
            stroke="#F5B400" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.3" />
        );
      })}
      {CITY_NODES.map(node => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y} r={node.r + 4} fill="#F5B400" opacity="0.06" />
          <circle cx={node.x} cy={node.y} r={node.r} fill="#F5B400" opacity="0.55" />
        </g>
      ))}
    </svg>
  );
};

const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate, bookingRef }) => {
  return (
    <section className="relative bg-[#071A2F] overflow-hidden pt-[88px]">
      {/* SVG network map background */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.18 }}>
        <NetworkMap />
      </div>
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#071A2F]/90 via-[#071A2F]/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#071A2F] pointer-events-none opacity-70" />
      {/* Radial glow behind quote widget */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 72% 40%, rgba(245,180,0,0.11), transparent 42%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start py-10 lg:py-14">

          {/* Left column — platform messaging */}
          <div className="flex flex-col justify-center lg:py-8">
            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/12 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-white/75 text-xs font-medium tracking-wide">10,000+ drivers active nationwide</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.1rem] font-black text-white leading-[1.07] tracking-tight mb-5">
              Instant UK Van<br />
              <span className="text-[#F5B400]">Transport Network</span>
            </h1>

            <p className="text-white/50 text-[15px] leading-relaxed mb-8 max-w-md">
              Real-time routing. Verified drivers. Fully insured nationwide delivery — from a single item to a full house move.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: Zap,    label: 'Instant Dispatch',  sub: 'Driver matched in 60 seconds' },
                { icon: Shield, label: 'Fully Insured',     sub: 'Goods covered up to £10,000' },
                { icon: Star,   label: '4.9★ Rated',        sub: 'From 8,400+ verified reviews' },
                { icon: Users,  label: '10k+ Drivers',      sub: 'Gold & silver tier network' },
              ].map(({ icon: Icon, label, sub }, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/[0.04] border border-white/[0.07] rounded-xl p-3.5">
                  <div className="w-8 h-8 bg-[#F5B400]/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[#F5B400]" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold">{label}</div>
                    <div className="text-white/40 text-[11px] mt-0.5 leading-snug">{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-white/25 text-[11px] font-semibold tracking-widest uppercase">
              London · Manchester · Birmingham · Edinburgh + 46 more cities
            </p>
          </div>

          {/* Right column — booking widget */}
          <div className="w-full pb-10 lg:pb-14">
            <BookingWidget bookingRef={bookingRef} onNavigate={onNavigate} embedded />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
