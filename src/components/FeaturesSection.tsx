import React from 'react';
import { MapPin, Shield, Zap, Users } from 'lucide-react';
import { FEATURE_IMAGES } from '@/lib/constants';

const features = [
  {
    icon: Zap,
    title: 'AI Smart Dispatch',
    desc: 'Our engine instantly matches every booking to the closest top-rated driver based on proximity, vehicle type, and tier — jobs are assigned in under 15 seconds.',
    highlight: '< 15 sec',
    highlightLabel: 'Average dispatch',
    color: 'from-[#0A2463] to-[#1B3A8C]',
  },
  {
    icon: MapPin,
    title: 'Real-Time GPS Tracking',
    desc: 'Watch your driver on the live map from the moment they accept the job. Accurate ETAs powered by OSRM road data — never wonder where your delivery is.',
    highlight: '99%',
    highlightLabel: 'ETA accuracy',
    color: 'from-[#061539] to-[#0A2463]',
  },
  {
    icon: Shield,
    title: 'Fully Insured Deliveries',
    desc: 'Every booking is covered by comprehensive goods-in-transit insurance. Gold tier drivers carry commercial cover — your items are always protected.',
    highlight: '100%',
    highlightLabel: 'Insured bookings',
    color: 'from-[#0A2463] to-[#1B3A8C]',
  },
  {
    icon: Users,
    title: 'Verified Drivers Only',
    desc: 'Every driver passes background checks, licence verification, and vehicle inspection before their first job. Continuous performance monitoring keeps standards high.',
    highlight: '10K+',
    highlightLabel: 'Verified drivers',
    color: 'from-[#061539] to-[#0A2463]',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#0A2463] text-xs font-bold tracking-[0.2em] uppercase mb-4">Why Choose Us</span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-5">Built for trust<br />and reliability</h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">Enterprise-grade technology and rigorous driver standards — every delivery backed by our end-to-end guarantee.</p>
        </div>

        {/* 4 key features — 2x2 large cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {features.map((f, idx) => (
            <div key={idx} className={`group relative rounded-3xl p-8 bg-gradient-to-br ${f.color} overflow-hidden`}>
              {/* Subtle decorative circle */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/4 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

              <div className="relative">
                {/* Icon */}
                <div className="w-12 h-12 bg-[#D4AF37]/15 border border-[#D4AF37]/20 rounded-2xl flex items-center justify-center mb-6">
                  <f.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>

                {/* Title + desc */}
                <h3 className="text-xl font-black text-white mb-3">{f.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-8">{f.desc}</p>

                {/* Stat */}
                <div className="inline-flex items-baseline gap-2 bg-white/6 border border-white/10 rounded-2xl px-5 py-3">
                  <span className="text-[#D4AF37] font-black text-2xl">{f.highlight}</span>
                  <span className="text-white/40 text-xs font-medium">{f.highlightLabel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Route optimisation banner */}
        <div className="relative rounded-3xl overflow-hidden group">
          <img
            src={FEATURE_IMAGES.cityRoutes}
            alt="Logistics network"
            className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061539]/95 via-[#0A2463]/80 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="p-8 sm:p-14 max-w-2xl">
              <span className="inline-block text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">Intelligent Routing</span>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">Route optimised<br />for real UK roads</h3>
              <p className="text-white/60 mb-8 leading-relaxed max-w-md">OSRM-powered routing calculates accurate real-road distances across the entire UK. Transparent pricing, always — before you confirm.</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: 'Faster Routes', value: '30%' },
                  { label: 'Cost Savings', value: '15%' },
                  { label: 'Price Accuracy', value: '99%' },
                ].map((m, i) => (
                  <div key={i} className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-3 text-center">
                    <p className="text-[#D4AF37] font-black text-2xl">{m.value}</p>
                    <p className="text-white/50 text-xs mt-0.5 font-medium">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
