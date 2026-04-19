import React from 'react';
import { MapPin, Search, Truck, CheckCircle, Star, Shield, Clock, CreditCard, ArrowRight } from 'lucide-react';

const steps = [
  { icon: MapPin, number: '01', title: 'Enter Your Addresses', desc: 'Tell us where to collect and deliver. Add multiple stops or extra helpers.', color: 'text-blue-400' },
  { icon: Search, number: '02', title: 'Get Instant Quote', desc: 'Our routing engine calculates the real road distance and gives a transparent price instantly.', color: 'text-[#D4AF37]' },
  { icon: Truck, number: '03', title: 'Driver Matched', desc: 'Smart dispatch connects you with the nearest top-rated available driver.', color: 'text-green-400' },
  { icon: CheckCircle, number: '04', title: 'Goods Delivered', desc: 'Track live on the map. Rate the service when your goods arrive safely.', color: 'text-purple-400' },
];

const stats = [
  { value: '10,000+', label: 'Active Drivers', icon: Truck },
  { value: '4.9 / 5', label: 'Average Rating', icon: Star },
  { value: '100%', label: 'Insured Deliveries', icon: Shield },
  { value: '<15 min', label: 'Avg Response Time', icon: Clock },
  { value: '£50', label: 'Starting From', icon: CreditCard },
  { value: 'UK Wide', label: 'Coverage', icon: MapPin },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="bg-[#061539] pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="inline-block text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">How It Works</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              Book your van in<br />
              <span className="text-[#D4AF37]">4 simple steps</span>
            </h2>
          </div>
          <p className="text-white/50 max-w-sm text-base leading-relaxed">Our technology makes booking as easy as ordering a ride. From quote to delivery in minutes.</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(100%-12px)] w-[calc(100%-60px)] z-10">
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-white/5" />
                    <ArrowRight className="w-3 h-3 text-white/10 shrink-0" />
                  </div>
                </div>
              )}

              <div className="relative bg-white/3 hover:bg-white/6 border border-white/8 hover:border-[#D4AF37]/20 rounded-2xl p-6 transition-all duration-300 h-full overflow-hidden">
                {/* Decorative number */}
                <span className="absolute -top-4 -right-2 text-8xl font-black text-white/4 leading-none select-none group-hover:text-white/6 transition-colors">
                  {step.number}
                </span>

                <div className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center mb-5 ${step.color}`}>
                  <step.icon className="w-5 h-5" />
                </div>

                <p className="text-[#D4AF37]/60 text-xs font-bold tracking-widest mb-2">STEP {step.number}</p>
                <h3 className="text-lg font-bold text-white mb-3 leading-snug">{step.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-transparent" />
          <div className="absolute inset-0 border border-[#D4AF37]/15 rounded-2xl" />
          <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-white/8">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center py-8 px-4 text-center hover:bg-white/3 transition-colors">
                <stat.icon className="w-5 h-5 text-[#D4AF37] mb-3 opacity-70" />
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-white/40 text-xs mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
