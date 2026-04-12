import React from 'react';
import { Truck, Star, Shield, Wallet, TrendingUp, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { DRIVER_IMAGES } from '@/lib/constants';

interface DriverSectionProps {
  onNavigate: (page: string) => void;
}

const benefits = [
  { icon: Wallet, title: 'Earn on Your Terms', desc: 'Set your own hours. Accept jobs that suit your schedule. Weekly payouts or instant withdrawals.' },
  { icon: TrendingUp, title: 'Surge Pricing Bonuses', desc: 'Earn more during peak hours with dynamic surge pricing. Top drivers earn up to 2.5x standard rates.' },
  { icon: Star, title: 'Golden Star Status', desc: 'Achieve Gold tier with commercial insurance for priority access to high-value premium jobs.' },
  { icon: Shield, title: 'Full Support', desc: 'Dedicated driver support team, insurance guidance, and dispute resolution available 24/7.' },
  { icon: Clock, title: 'Quick Onboarding', desc: 'Upload your documents, get verified, and start earning within 48 hours of approval.' },
  { icon: CheckCircle, title: 'Fair Commission', desc: 'Transparent commission structure. No hidden fees. See exactly what you earn on every job.' },
];

const DriverSection: React.FC<DriverSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#061539] via-[#0A2463] to-[#1B3A8C] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 border border-white rounded-full" />
        <div className="absolute bottom-20 right-20 w-64 h-64 border border-white rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <span className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">FOR DRIVERS</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Drive With Us. <span className="text-[#D4AF37]">Earn More.</span>
            </h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Join thousands of independent drivers earning great money on their own schedule. Whether you have a small van or a Luton truck, there's work waiting for you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <b.icon className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm">{b.title}</p>
                    <p className="text-white/50 text-xs mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('driver-register')}
              className="group flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A2463] px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-xl hover:shadow-[#D4AF37]/30"
            >
              Apply to Drive
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Driver Images */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img src={DRIVER_IMAGES[0]} alt="Driver" className="rounded-2xl shadow-2xl w-full h-48 object-cover" />
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <p className="text-[#D4AF37] text-3xl font-bold">£1,200+</p>
                <p className="text-white/60 text-sm">Average weekly earnings</p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <p className="text-[#D4AF37] text-3xl font-bold">10K+</p>
                <p className="text-white/60 text-sm">Active drivers</p>
              </div>
              <img src={DRIVER_IMAGES[1]} alt="Driver" className="rounded-2xl shadow-2xl w-full h-48 object-cover" />
            </div>
          </div>
        </div>

        {/* Driver Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 rounded-2xl p-8 border border-[#D4AF37]/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-[#0A2463]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Golden Star Drivers</h3>
                <p className="text-[#D4AF37] text-sm font-medium">Premium Tier</p>
              </div>
            </div>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#D4AF37]" /> Commercial insurance license required</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#D4AF37]" /> Priority access to high-value jobs</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#D4AF37]" /> Higher earnings per delivery</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#D4AF37]" /> Premium customer base</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-400 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Silver Star Drivers</h3>
                <p className="text-gray-400 text-sm font-medium">Standard Tier</p>
              </div>
            </div>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gray-400" /> Standard driving license</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gray-400" /> Access to all standard jobs</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gray-400" /> Competitive earnings</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gray-400" /> Path to Gold tier upgrade</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DriverSection;
