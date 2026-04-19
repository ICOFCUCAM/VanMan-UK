import React from 'react';
import { MapPin, Shield, Zap, Clock, CreditCard, Users, BarChart3, Truck, Globe, Lock, Star, Smartphone, ArrowRight } from 'lucide-react';
import { FEATURE_IMAGES } from '@/lib/constants';

const features = [
  { icon: Zap, title: 'AI Smart Dispatch', desc: 'Intelligent matching assigns the best driver by proximity, rating, and vehicle type.' },
  { icon: MapPin, title: 'Real-Time GPS Tracking', desc: 'Live map tracking with accurate ETA and route progress on every delivery.' },
  { icon: Shield, title: 'Fully Insured', desc: 'Comprehensive goods-in-transit insurance on every booking, no exceptions.' },
  { icon: CreditCard, title: 'Flexible Payments', desc: 'Card, cash or invoice. Corporate accounts get monthly billing and detailed reports.' },
  { icon: Users, title: 'Verified Drivers', desc: 'Background checks, licence verification, and vehicle inspections for every driver.' },
  { icon: Clock, title: 'Instant Booking', desc: 'Quote in under 60 seconds. Book now or schedule for any future date.' },
  { icon: BarChart3, title: 'Corporate Portal', desc: 'Bulk bookings, recurring deliveries, team access, and full analytics.' },
  { icon: Star, title: 'Ratings System', desc: 'Transparent reviews keep quality high. Top drivers get priority dispatch.' },
  { icon: Globe, title: 'UK-Wide Coverage', desc: 'London to Edinburgh — our driver network covers the entire United Kingdom.' },
  { icon: Lock, title: 'GDPR Compliant', desc: 'Encrypted data and full compliance with UK data protection regulations.' },
  { icon: Smartphone, title: 'Mobile Apps', desc: 'Native iOS and Android apps for customers and drivers with full functionality.' },
  { icon: Truck, title: 'Route Optimisation', desc: 'OSRM-powered routing finds the fastest real roads, saving time and cost.' },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#0A2463] text-xs font-bold tracking-[0.2em] uppercase mb-4">Platform Features</span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-5">Built for the modern<br />logistics era</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">Enterprise-grade technology powering every delivery. From AI dispatch to real-time tracking — the future of goods transport.</p>
        </div>

        {/* Feature image banner — split layout */}
        <div className="relative rounded-3xl overflow-hidden mb-16 group">
          <img src={FEATURE_IMAGES.cityRoutes} alt="Logistics network" className="w-full h-72 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061539]/95 via-[#0A2463]/80 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="p-8 sm:p-14 max-w-lg">
              <span className="inline-block text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">Intelligent Routing</span>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">Route optimised<br />for real UK roads</h3>
              <p className="text-white/60 mb-8 leading-relaxed">Our dual-track routing engine uses OSRM for real road distances with automatic Haversine fallback — accurate pricing every time.</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: 'Faster Routes', value: '30%' },
                  { label: 'Cost Savings', value: '15%' },
                  { label: 'Accuracy', value: '99%' },
                ].map((m, i) => (
                  <div key={i} className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-xl px-5 py-3 text-center">
                    <p className="text-[#D4AF37] font-black text-2xl">{m.value}</p>
                    <p className="text-white/50 text-xs mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((f, idx) => (
            <div key={idx} className="group p-6 rounded-2xl border border-gray-100 hover:border-[#0A2463]/15 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 hover:-translate-y-1 bg-white cursor-default">
              <div className="w-10 h-10 bg-[#0A2463]/6 group-hover:bg-[#0A2463] rounded-xl flex items-center justify-center mb-4 transition-colors">
                <f.icon className="w-5 h-5 text-[#0A2463] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5 text-sm">{f.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
