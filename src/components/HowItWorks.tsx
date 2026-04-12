import React from 'react';
import { MapPin, Search, Truck, CheckCircle, Star, Shield, Clock, CreditCard } from 'lucide-react';

const steps = [
  { icon: MapPin, title: 'Enter Your Addresses', desc: 'Tell us where to pick up and deliver your goods. Add multiple stops if needed.', color: 'bg-blue-500' },
  { icon: Search, title: 'Get Instant Quote', desc: 'Our AI calculates distance, time, and gives you a transparent price instantly.', color: 'bg-[#D4AF37]' },
  { icon: Truck, title: 'Driver Matched', desc: 'Our smart dispatch matches you with the nearest top-rated available driver.', color: 'bg-green-500' },
  { icon: CheckCircle, title: 'Goods Delivered', desc: 'Track your driver in real-time. Rate the service when your goods arrive safely.', color: 'bg-purple-500' },
];

const stats = [
  { icon: Truck, value: '10,000+', label: 'Active Drivers' },
  { icon: Star, value: '4.9/5', label: 'Average Rating' },
  { icon: Shield, value: '100%', label: 'Insured Deliveries' },
  { icon: Clock, value: '<15min', label: 'Avg. Response Time' },
  { icon: CreditCard, value: '£50', label: 'Starting From' },
  { icon: MapPin, value: 'UK Wide', label: 'Coverage' },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* How It Works */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#0A2463]/10 text-[#0A2463] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">HOW IT WORKS</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Book Your Van in 4 Simple Steps</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our technology-driven platform makes booking a van as easy as ordering a ride.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
              )}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className={`w-14 h-14 ${step.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-xs font-bold text-gray-400 mb-2">STEP {idx + 1}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-[#0A2463] to-[#1B3A8C] rounded-2xl p-8 sm:p-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <stat.icon className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-white/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
