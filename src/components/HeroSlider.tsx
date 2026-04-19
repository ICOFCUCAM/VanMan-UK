import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Clock, MapPin, ChevronDown } from 'lucide-react';
import { HERO_IMAGES } from '@/lib/constants';

interface HeroSliderProps {
  onNavigate: (page: string) => void;
  onScrollToBooking: () => void;
}

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
    <section className="relative min-h-[540px] max-h-[700px] h-[90vh] overflow-hidden">
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
      <div className={`relative z-10 h-full flex items-center transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">

            {/* Live badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-white/80 text-sm font-medium tracking-wide">Drivers available now across the UK</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight mb-4">
              Fast, Reliable{' '}
              <span className="relative inline-block">
                <span className="text-[#D4AF37]">Van Transport</span>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#D4AF37]/40 rounded-full" />
              </span>
              <br />
              <span className="text-white/90">Across the UK</span>
            </h1>

            <p className="text-base sm:text-lg text-white/60 mb-7 leading-relaxed max-w-lg font-light">
              Connect with professional, insured drivers in minutes. Instant quotes, real-time tracking, and secure payments.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
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
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full ${idx === currentSlide ? 'w-6 h-1.5 bg-[#D4AF37]' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-5 right-8 z-20 hidden lg:flex flex-col items-center gap-2">
        <ChevronDown className="w-4 h-4 text-white/30 animate-bounce" />
      </div>

    </section>
  );
};

export default HeroSlider;
