import React from 'react';
import { MapPin, Shield, Zap, Clock, CreditCard, Users, BarChart3, Truck, Globe, Lock, Star, Smartphone } from 'lucide-react';
import { FEATURE_IMAGES } from '@/lib/constants';

const features = [
  { icon: Zap, title: 'AI Smart Dispatch', desc: 'Intelligent matching algorithm assigns the best driver based on proximity, rating, and vehicle type.' },
  { icon: MapPin, title: 'Real-Time GPS Tracking', desc: 'Track your driver live on the map with accurate ETA and route progress updates.' },
  { icon: Shield, title: 'Fully Insured', desc: 'Every delivery is covered by comprehensive goods-in-transit insurance for your peace of mind.' },
  { icon: CreditCard, title: 'Flexible Payments', desc: 'Pay by card, cash, or invoice. Corporate accounts get monthly billing with detailed reports.' },
  { icon: Users, title: 'Verified Drivers', desc: 'All drivers undergo background checks, license verification, and vehicle inspections.' },
  { icon: Clock, title: 'Instant Booking', desc: 'Get a quote in under 60 seconds. Book immediately or schedule for a future date.' },
  { icon: BarChart3, title: 'Corporate Portal', desc: 'Bulk bookings, recurring deliveries, multi-user access, and comprehensive analytics.' },
  { icon: Star, title: 'Driver Ratings', desc: 'Transparent review system ensures high-quality service. Top drivers get priority access.' },
  { icon: Globe, title: 'UK-Wide Coverage', desc: 'From London to Edinburgh, our network of drivers covers the entire United Kingdom.' },
  { icon: Lock, title: 'GDPR Compliant', desc: 'Your data is encrypted and protected. We comply with all UK data protection regulations.' },
  { icon: Smartphone, title: 'Mobile Apps', desc: 'Native iOS and Android apps for both customers and drivers with full functionality.' },
  { icon: Truck, title: 'Load Matching AI', desc: 'Share delivery routes with other customers for eco-friendly transport at reduced cost.' },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">PLATFORM FEATURES</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Built for the Modern Logistics Era</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Enterprise-grade technology powering every delivery. From AI dispatch to real-time tracking, we've built the future of goods transport.</p>
        </div>

        {/* Feature Image Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-16 group">
          <img src={FEATURE_IMAGES.cityRoutes} alt="Logistics network" className="w-full h-64 sm:h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2463]/90 to-transparent flex items-center">
            <div className="p-8 sm:p-12 max-w-lg">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Intelligent Route Optimization</h3>
              <p className="text-white/80 mb-4">Our AI engine calculates the fastest routes considering traffic, congestion zones, and toll roads to save you time and money.</p>
              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <p className="text-[#D4AF37] font-bold text-lg">30%</p>
                  <p className="text-white/70 text-xs">Faster Routes</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <p className="text-[#D4AF37] font-bold text-lg">15%</p>
                  <p className="text-white/70 text-xs">Cost Savings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((f, idx) => (
            <div key={idx} className="group p-6 rounded-2xl border border-gray-100 hover:border-[#0A2463]/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
              <div className="w-12 h-12 bg-[#0A2463]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0A2463] transition-colors">
                <f.icon className="w-6 h-6 text-[#0A2463] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
