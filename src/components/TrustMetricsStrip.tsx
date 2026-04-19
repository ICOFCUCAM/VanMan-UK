import React from 'react';

const TRUST_ITEMS = [
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Verified & DBS-checked drivers',
    desc: 'Every driver passes identity and background checks before joining'
  },
  {
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    title: 'Secure escrow payment',
    desc: 'Funds held safely until delivery is confirmed — you\'re always protected'
  },
  {
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    title: 'Cargo insured to £10,000',
    desc: 'Comprehensive goods-in-transit cover on every single booking'
  },
  {
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    title: 'Registered UK business',
    desc: 'Fast Man & Van is a trading name of Golden Recruit LMD, registered in England & Wales'
  },
];

const TrustMetricsStrip: React.FC = () => (
  <section className="py-8 bg-[#F7FAFC]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {TRUST_ITEMS.map(item => (
          <div key={item.title} className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
            <div className="w-9 h-9 bg-[#0E2A47]/8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-[#0E2A47]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 leading-tight">{item.title}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustMetricsStrip;
