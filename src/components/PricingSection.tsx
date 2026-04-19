import React from 'react';
import { CheckCircle, Truck, Star, Zap, Building2, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onNavigate: (page: string) => void;
}

const plans = [
  {
    name: 'Pay As You Go',
    desc: 'One-off moves and deliveries',
    price: '£80',
    unit: 'minimum',
    icon: Truck,
    dark: false,
    features: [
      'Minimum booking fee: £50',
      'Minimum 2-hour job',
      '£30 per extra 30 minutes',
      'All vehicle types',
      'Real-time GPS tracking',
      'Card & cash payments',
      'Rated & verified drivers',
    ],
    cta: 'Book Now',
    ctaAction: 'home',
  },
  {
    name: 'Student Plan',
    desc: '10% off with valid student ID',
    price: '£72',
    unit: 'minimum (10% off)',
    icon: Star,
    dark: true,
    badge: 'POPULAR',
    features: [
      'Everything in Pay As You Go',
      '10% discount on all bookings',
      'Student ID verification',
      'Priority student support',
      'Flexible scheduling',
      'Term-time specials',
      'Group booking discounts',
    ],
    cta: 'Student Sign Up',
    ctaAction: 'home',
  },
  {
    name: 'Corporate',
    desc: 'Volume pricing for business logistics',
    price: 'Custom',
    unit: 'volume pricing',
    icon: Building2,
    dark: false,
    badge: 'BEST VALUE',
    features: [
      'Everything in Pay As You Go',
      'Up to 25% volume discount',
      'Monthly consolidated invoicing',
      'Dedicated account manager',
      'Multi-user team access',
      'Analytics dashboard',
      'Priority driver dispatch',
      'API integration available',
    ],
    cta: 'Contact Sales',
    ctaAction: 'corporate',
  },
];

const PricingSection: React.FC<PricingSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-[#0A2463] text-xs font-bold tracking-[0.2em] uppercase mb-3">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Transparent, fair pricing</h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">No hidden fees. Our AI calculates the best price based on distance, time, and vehicle type.</p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-0.5 ${
                plan.dark
                  ? 'bg-[#0A2463] shadow-2xl shadow-[#0A2463]/30'
                  : 'bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-200/60'
              }`}
            >
              {plan.badge && (
                <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1 rounded-full ${
                  plan.dark ? 'bg-[#D4AF37] text-[#061539]' : 'bg-[#0A2463] text-white'
                }`}>{plan.badge}</span>
              )}

              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-6 ${
                plan.dark ? 'bg-white/10' : 'bg-[#0A2463]/8'
              }`}>
                <plan.icon className={`w-5 h-5 ${plan.dark ? 'text-[#D4AF37]' : 'text-[#0A2463]'}`} />
              </div>

              <h3 className={`text-xl font-black mb-1 ${plan.dark ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.dark ? 'text-white/50' : 'text-gray-400'}`}>{plan.desc}</p>

              <div className="mb-5">
                <span className={`text-4xl font-black ${plan.dark ? 'text-white' : 'text-[#0A2463]'}`}>{plan.price}</span>
                <span className={`text-sm ml-2 ${plan.dark ? 'text-white/40' : 'text-gray-400'}`}>/ {plan.unit}</span>
              </div>

              <ul className="space-y-2.5 mb-5 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className={`flex items-start gap-2.5 text-sm ${plan.dark ? 'text-white/70' : 'text-gray-600'}`}>
                    <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${plan.dark ? 'text-[#D4AF37]' : 'text-green-500'}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onNavigate(plan.ctaAction)}
                className={`group w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                  plan.dark
                    ? 'bg-[#D4AF37] hover:bg-[#C5A028] text-[#061539]'
                    : 'bg-[#0A2463] hover:bg-[#1B3A8C] text-white'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Surge pricing note */}
        <div className="bg-white border border-orange-100 rounded-2xl p-7 flex flex-col sm:flex-row items-start gap-5">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1.5">Dynamic Surge Pricing</h3>
            <p className="text-gray-500 text-sm leading-relaxed">During high demand periods, prices may increase up to 2.5× the standard rate based on driver availability, traffic, and peak hours. You'll always see the final price <strong className="text-gray-700">before</strong> confirming your booking.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
