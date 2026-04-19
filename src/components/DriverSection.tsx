import React from 'react';
import { Truck, Star, Shield, Wallet, TrendingUp, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { DRIVER_IMAGES } from '@/lib/constants';

interface DriverSectionProps {
  onNavigate: (page: string) => void;
}

const benefits = [
  { icon: Wallet, title: 'Earn on Your Terms', desc: 'Set your own hours. Accept jobs that fit your schedule. Weekly payouts or instant withdrawals.' },
  { icon: TrendingUp, title: 'Surge Pricing Bonuses', desc: 'Earn more during peak hours with dynamic surge pricing up to 2.5× standard rates.' },
  { icon: Star, title: 'Gold Tier Status', desc: 'Achieve Gold with commercial insurance for priority access to high-value jobs at lower commission.' },
  { icon: Shield, title: 'Full Support', desc: 'Dedicated driver support, insurance guidance, and dispute resolution available 24/7.' },
  { icon: Clock, title: 'Quick Onboarding', desc: 'Upload documents, get verified, and start earning within 48 hours of approval.' },
  { icon: CheckCircle, title: 'Fair Commission', desc: 'Transparent structure. Gold tier: 15% commission. Silver: 20%. No hidden fees.' },
];

const tiers = [
  {
    name: 'Gold Tier',
    subtitle: 'Premium Drivers',
    commission: '15%',
    commissionLabel: 'commission rate',
    color: 'border-[#D4AF37]/40 bg-[#D4AF37]/8',
    iconBg: 'bg-[#D4AF37]',
    iconColor: 'text-[#061539]',
    checkColor: 'text-[#D4AF37]',
    perks: ['Commercial insurance required', 'Priority job access', 'Highest earnings per delivery', 'Premium customer base'],
  },
  {
    name: 'Silver Tier',
    subtitle: 'Standard Drivers',
    commission: '20%',
    commissionLabel: 'commission rate',
    color: 'border-white/10 bg-white/4',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    checkColor: 'text-gray-400',
    perks: ['Standard driving licence', 'Access to all standard jobs', 'Competitive earnings', 'Clear path to Gold upgrade'],
  },
];

const DriverSection: React.FC<DriverSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 bg-[#061539] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0A2463] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-10">
          {/* Left: content */}
          <div>
            <span className="inline-block text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-6">For Drivers</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
              Drive with us. <span className="text-[#D4AF37]">Earn more.</span>
            </h2>
            <p className="text-white/55 text-base mb-8 leading-relaxed">
              Join thousands of independent drivers earning great money on their own schedule. Whether you have a small van or a Luton truck, there's work waiting.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-7">
              {benefits.map((b, idx) => (
                <div key={idx} className="group flex gap-3 p-3.5 rounded-xl bg-white/3 hover:bg-white/6 border border-white/6 hover:border-white/12 transition-all">
                  <b.icon className="w-5 h-5 text-[#D4AF37] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm">{b.title}</p>
                    <p className="text-white/40 text-xs mt-0.5 leading-snug">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('driver-register')}
              className="group inline-flex items-center gap-3 bg-[#D4AF37] hover:bg-[#C5A028] text-[#061539] px-8 py-4 rounded-2xl font-black text-base transition-all hover:shadow-2xl hover:shadow-[#D4AF37]/25 hover:-translate-y-0.5"
            >
              Apply to Drive
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right: driver images + earnings stat */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden">
                <img src={DRIVER_IMAGES[0]} alt="Driver" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061539]/40 to-transparent" />
              </div>
              <div className="bg-white/5 border border-[#D4AF37]/20 rounded-2xl p-5">
                <p className="text-[#D4AF37] text-3xl font-black">£1,200+</p>
                <p className="text-white/50 text-sm">Average weekly earnings</p>
              </div>
            </div>
            <div className="space-y-4 mt-10">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white text-3xl font-black">10K+</p>
                <p className="text-white/50 text-sm">Active drivers</p>
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                <img src={DRIVER_IMAGES[1]} alt="Driver" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061539]/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Driver tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tiers.map((tier, idx) => (
            <div key={idx} className={`rounded-2xl p-6 border ${tier.color}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 ${tier.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Star className={`w-6 h-6 ${tier.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{tier.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[#D4AF37] font-black text-sm">{tier.commission}</span>
                    <span className="text-white/35 text-xs">{tier.commissionLabel}</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-2.5">
                {tier.perks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-white/70 text-sm">
                    <CheckCircle className={`w-4 h-4 shrink-0 ${tier.checkColor}`} />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DriverSection;
