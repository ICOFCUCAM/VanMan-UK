import React from 'react';

const metrics = [
  { value: '10,000+', label: 'Active Drivers' },
  { value: '4.9 / 5',  label: 'Customer Rating' },
  { value: '< 15 min', label: 'Avg Response' },
  { value: 'UK Wide',  label: 'Coverage' },
  { value: '100%',     label: 'Insured Bookings' },
];

const TrustMetricsStrip: React.FC = () => (
  <section className="relative px-4 sm:px-6 lg:px-8" style={{ marginTop: '-48px', zIndex: 20 }}>
    <div className="max-w-4xl mx-auto">
      <div
        className="rounded-2xl border border-gray-100 py-4 px-6 sm:px-10"
        style={{ background: 'rgba(255,255,255,0.97)', boxShadow: '0 8px 32px rgba(7,26,47,0.10), 0 1px 4px rgba(7,26,47,0.06)' }}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
          {metrics.map((m, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <p className="text-sm font-black text-[#0B2239] leading-none">{m.value}</p>
                <p className="text-xs text-gray-400 font-medium leading-none">{m.label}</p>
              </div>
              {i < metrics.length - 1 && (
                <span className="hidden sm:block w-px h-3.5 bg-gray-200" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default TrustMetricsStrip;
