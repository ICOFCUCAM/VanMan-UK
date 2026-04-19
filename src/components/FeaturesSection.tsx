import React from 'react';
import { MapPin, Shield, Zap, Users } from 'lucide-react';
import { FEATURE_IMAGES } from '@/lib/constants';

const features = [
  {
    icon: Zap,
    title: 'AI Smart Dispatch',
    desc: 'Instantly matched to the closest top-rated driver based on proximity, vehicle type, and tier. Jobs assigned in under 15 seconds.',
    stat: '< 15 sec',
    statLabel: 'Average dispatch time',
    accent: 'bg-blue-50 text-blue-600',
    border: 'border-l-blue-500',
  },
  {
    icon: MapPin,
    title: 'Real-Time GPS Tracking',
    desc: 'Watch your driver on a live map from the moment they accept the job. Accurate ETAs powered by OSRM real road data.',
    stat: '99%',
    statLabel: 'ETA accuracy',
    accent: 'bg-[#D4AF37]/10 text-[#8B6914]',
    border: 'border-l-[#D4AF37]',
  },
  {
    icon: Shield,
    title: 'Fully Insured Deliveries',
    desc: 'Every booking covered by comprehensive goods-in-transit insurance. Gold tier drivers carry full commercial cover.',
    stat: '100%',
    statLabel: 'Insured bookings',
    accent: 'bg-green-50 text-green-700',
    border: 'border-l-green-500',
  },
  {
    icon: Users,
    title: 'Verified Drivers Only',
    desc: "Background checks, licence verification, and vehicle inspection before every driver's first job. Continuous performance monitoring.",
    stat: '10K+',
    statLabel: 'Verified drivers',
    accent: 'bg-purple-50 text-purple-700',
    border: 'border-l-purple-500',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-[#0A2463] text-xs font-bold tracking-[0.2em] uppercase mb-3">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Built for trust and reliability</h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">Enterprise-grade technology and rigorous driver standards — every delivery backed by our guarantee.</p>
        </div>

        {/* 4 key features — 2x2 clean white cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {features.map((f, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 ${f.border} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${f.accent}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#0A2463]">{f.stat}</p>
                  <p className="text-gray-400 text-xs font-medium">{f.statLabel}</p>
                </div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Route optimisation banner */}
        <div className="relative rounded-3xl overflow-hidden group">
          <img
            src={FEATURE_IMAGES.cityRoutes}
            alt="Logistics network"
            className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061539]/95 via-[#0A2463]/80 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="p-8 sm:p-10 max-w-2xl">
              <span className="inline-block text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">Intelligent Routing</span>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">Route optimised<br />for real UK roads</h3>
              <p className="text-white/60 mb-8 leading-relaxed max-w-md">OSRM-powered routing calculates real road distances across the entire UK — transparent pricing before you confirm.</p>
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
