import React from 'react';
import { Check } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';

interface SubscriptionTeaserProps {
  onNavigate: (page: string) => void;
}

const PRIORITY_STYLE: Record<number, string> = {
  5: 'bg-amber-50 text-amber-600 border border-amber-200',
  4: 'bg-purple-50 text-purple-600 border border-purple-200',
  3: 'bg-[#0E2A47]/8 text-[#0E2A47] border border-[#0E2A47]/15',
  2: 'bg-blue-50 text-blue-600 border border-blue-200',
  1: 'bg-gray-100 text-gray-600',
};

const SubscriptionTeaser: React.FC<SubscriptionTeaserProps> = ({ onNavigate }) => (
  <section className="py-20 bg-[#F7FAFC] border-t border-[#EEF2F7]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#F5B400]/10 text-[#0B2239] text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-[#F5B400]/20">
          For Drivers
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#0B2239] mb-4">Earn more with the right plan</h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-base">All drivers start on Silver. Upgrade anytime to reduce your commission rate, unlock priority dispatch, and grow your earnings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        {SUBSCRIPTION_PLANS.map(plan => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl p-5 flex flex-col transition-all ${
              plan.popular
                ? 'border-2 border-[#F5B400] shadow-xl scale-[1.03] z-10'
                : 'border border-gray-200 shadow-sm hover:shadow-md'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F5B400] text-[#071A2F] text-[10px] font-black px-3 py-1.5 rounded-full tracking-wide whitespace-nowrap">
                MOST POPULAR
              </div>
            )}
            <h3 className="text-lg font-black text-[#0B2239] mt-1 mb-1">{plan.name}</h3>
            <div className="mb-3">
              <span className="text-3xl font-black text-[#0B2239]">{plan.price === 0 ? 'Free' : `£${plan.price}`}</span>
              {plan.price > 0 && <span className="text-gray-500 text-sm ml-1">{plan.period}</span>}
            </div>
            <div className={`inline-flex self-start px-2.5 py-1 rounded-full text-xs font-semibold mb-4 ${PRIORITY_STYLE[plan.priorityLevel] ?? 'bg-gray-100 text-gray-600'}`}>
              {plan.dispatchPriority} Priority
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((f, fi) => (
                <li key={fi} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-[#F5B400] mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate('driver-subscription')}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                plan.popular
                  ? 'bg-[#F5B400] text-[#0B2239] hover:bg-[#FFD24A] shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {plan.price === 0 ? 'Get Started Free' : 'View Plan'}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-400 mt-8">
        All plans include £10k cargo insurance &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; BACS payouts
      </p>
    </div>
  </section>
);

export default SubscriptionTeaser;
