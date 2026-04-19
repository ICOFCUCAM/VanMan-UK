import React from 'react';

const metrics = [
  { value: '10,000+', label: 'Active Drivers' },
  { value: '4.9 / 5',  label: 'Customer Rating' },
  { value: '< 15 min', label: 'Avg Response' },
  { value: 'UK Wide',  label: 'Coverage' },
  { value: '100%',     label: 'Insured Bookings' },
];

const TrustMetricsStrip: React.FC = () => (
  <section className="bg-white border-b border-gray-100/80 py-4">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 sm:gap-x-14">
        {metrics.map((m, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2.5">
              <p className="text-sm font-black text-[#0B2239] leading-none">{m.value}</p>
              <p className="text-xs text-gray-400 font-medium leading-none">{m.label}</p>
            </div>
            {i < metrics.length - 1 && (
              <span className="hidden sm:block w-px h-4 bg-gray-200" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
);

export default TrustMetricsStrip;
