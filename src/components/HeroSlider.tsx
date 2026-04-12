import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Shield, Clock, MapPin } from 'lucide-react';
import { HERO_IMAGES } from '@/lib/constants';

interface HeroSliderProps {
  onNavigate: (page: string) => void;
  onScrollToBooking: () => void;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate, onScrollToBooking }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
      {/* Background Slides */}
      {HERO_IMAGES.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={img} alt={`Logistics slide ${idx + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A2463]/90 via-[#0A2463]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/50 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[#D4AF37] text-sm font-medium">Drivers Available Now</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Fast Man & Van –{' '}
              <span className="text-[#D4AF37]">Reliable Van Transport</span>{' '}
              for Your Goods
            </h1>

            <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed max-w-xl">
              Fast Man & Van is a logistics technology platform connecting customers with independent professional drivers who transport goods safely from one location to another.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <button
                onClick={onScrollToBooking}
                className="group flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A2463] px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-xl hover:shadow-[#D4AF37]/30 hover:-translate-y-0.5"
              >
                Get Instant Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onScrollToBooking}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm border border-white/20 transition-all hover:-translate-y-0.5"
              >
                Book a Van
              </button>
              <button
                onClick={() => onNavigate('driver-register')}
                className="flex items-center gap-2 bg-transparent hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/30 transition-all hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5" />
                Become a Driver
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span>Fully Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>Available 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>UK Nationwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-8 bg-[#D4AF37]' : 'w-4 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
