import React from 'react';

const metrics = [
  { value: '10,000+', label: 'Active Drivers' },
  { value: '4.9 / 5',  label: 'Customer Rating' },
  { value: '< 15 min', label: 'Avg Response' },
  { value: 'UK Wide',  label: 'Coverage' },
  { value: '100%',     label: 'Insured Bookings' },
];

const TrustMetricsStrip: React.FC = () => (
  <section
    className="border-y border-white/[0.07] py-5"
    style={{ background: 'rgba(11,34,57,0.97)' }}
  >
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 sm:gap-x-14">
        {metrics.map((m, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2.5">
              <p className="text-base font-black text-[#F5B400] leading-none">{m.value}</p>
              <p className="text-xs text-[#8FA9C4] font-medium leading-none">{m.label}</p>
            </div>
            {i < metrics.length - 1 && (
              <span className="hidden sm:block w-px h-4 bg-white/[0.08]" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
);

export default TrustMetricsStrip;
