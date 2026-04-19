import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Clock, MapPin, ChevronDown, Star, Truck, Users } from 'lucide-react';
import { HERO_IMAGES } from '@/lib/constants';

interface HeroSliderProps {
  onNavigate: (page: string) => void;
  onScrollToBooking: () => void;
}

const stats = [
  { icon: Truck, value: '10,000+', label: 'Active Drivers' },
  { icon: Star, value: '4.9 / 5', label: 'Customer Rating' },
  { icon: Users, value: '50,000+', label: 'Jobs Completed' },
  { icon: MapPin, value: 'UK Wide', label: 'Coverage' },
];

const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate, onScrollToBooking }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Background Slides */}
      {HERO_IMAGES.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1500 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover scale-105 transition-transform duration-[8000ms]" style={{ transform: idx === currentSlide ? 'scale(1)' : 'scale(1.05)' }} />
        </div>
      ))}

      {/* Multi-layer overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#061539]/95 via-[#0A2463]/70 to-[#0A2463]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#061539] via-transparent to-transparent opacity-80" />

      {/* Decorative mesh grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Content */}
      <div className={`relative z-10 h-full flex items-center pb-32 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">

            {/* Live badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/15 backdrop-blur-sm rounded-full px-5 py-2 mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
              </span>
              <span className="text-white/80 text-sm font-medium tracking-wide">Drivers available now across the UK</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Fast, Reliable{' '}
              <span className="relative inline-block">
                <span className="text-[#D4AF37]">Van Transport</span>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#D4AF37]/40 rounded-full" />
              </span>
              <br />
              <span className="text-white/90">Across the UK</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/65 mb-10 leading-relaxed max-w-xl font-light">
              Connect with professional, insured drivers in minutes. Instant quotes, real-time tracking, and secure payments — all in one platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={onScrollToBooking}
                className="group flex items-center gap-3 bg-[#D4AF37] hover:bg-[#C5A028] text-[#061539] px-8 py-4 rounded-xl font-bold text-base transition-all hover:shadow-2xl hover:shadow-[#D4AF37]/25 hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Instant Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('driver-register')}
                className="flex items-center gap-3 bg-white/8 hover:bg-white/15 text-white px-8 py-4 rounded-xl font-semibold text-base backdrop-blur-sm border border-white/15 hover:border-white/30 transition-all hover:-translate-y-0.5"
              >
                Become a Driver
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 text-white/50 text-sm">
              {[
                { icon: Shield, text: 'Fully Insured' },
                { icon: Clock, text: '24/7 Available' },
                { icon: MapPin, text: 'Nationwide Coverage' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#D4AF37]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full ${idx === currentSlide ? 'w-8 h-1.5 bg-[#D4AF37]' : 'w-2 h-1.5 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-36 right-8 z-20 hidden lg:flex flex-col items-center gap-2">
        <span className="text-white/30 text-xs tracking-widest rotate-90 origin-center mb-4">SCROLL</span>
        <ChevronDown className="w-4 h-4 text-white/30 animate-bounce" />
      </div>

      {/* Bottom stats bar — overlaps into next section */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-t-2xl overflow-hidden">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-5 hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center shrink-0">
                  <s.icon className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">{s.value}</p>
                  <p className="text-white/45 text-xs mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
