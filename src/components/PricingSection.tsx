import React from 'react';
import { CheckCircle, Truck, Star, Zap, Building2 } from 'lucide-react';
import { FEATURE_IMAGES } from '@/lib/constants';

interface PricingSectionProps {
  onNavigate: (page: string) => void;
}

const plans = [
  {
    name: 'Pay As You Go',
    desc: 'Perfect for one-off moves and deliveries',
    price: '£80',
    unit: 'minimum',
    icon: Truck,
    color: 'border-gray-200',
    features: [
      'Minimum booking fee: £50',
      'Minimum 2-hour job duration',
      '£30 per additional 30 minutes',
      'All vehicle types available',
      'Real-time GPS tracking',
      'Card & cash payments',
      'Rated & verified drivers',
    ],
    cta: 'Book Now',
    ctaStyle: 'bg-[#0A2463] hover:bg-[#1B3A8C] text-white',
  },
  {
    name: 'Student Plan',
    desc: '10% off every booking with valid student ID',
    price: '£72',
    unit: 'minimum (10% off)',
    icon: Star,
    color: 'border-purple-300 ring-2 ring-purple-100',
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
    ctaStyle: 'bg-purple-600 hover:bg-purple-700 text-white',
  },
  {
    name: 'Corporate',
    desc: 'Volume pricing for business logistics',
    price: 'Custom',
    unit: 'volume pricing',
    icon: Building2,
    color: 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20',
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
    ctaStyle: 'bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A2463]',
  },
];

const PricingSection: React.FC<PricingSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">PRICING</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Transparent, Fair Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">No hidden fees. Our AI calculates the best price based on distance, time, and vehicle type. Surge pricing applies during peak demand.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative bg-white rounded-2xl p-8 border-2 ${plan.color} hover:shadow-xl transition-all duration-300`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#0A2463] text-xs font-bold px-3 py-1 rounded-full">{plan.badge}</span>
              )}
              <plan.icon className="w-10 h-10 text-[#0A2463] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#0A2463]">{plan.price}</span>
                <span className="text-gray-400 text-sm ml-1">/ {plan.unit}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate(idx === 2 ? 'corporate' : 'home')}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${plan.ctaStyle}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Surge Pricing Info */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-200">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dynamic Surge Pricing</h3>
              <p className="text-gray-600">During high demand periods, prices may increase by up to 2.5x the standard rate. Surge pricing is based on driver availability, traffic conditions, peak hours, and demand levels. You'll always see the final price before confirming your booking.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
