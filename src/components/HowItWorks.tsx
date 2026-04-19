import React from 'react';
import { MapPin, LayoutGrid, Truck, Radio } from 'lucide-react';

const steps = [
  {
    icon: MapPin,
    number: '01',
    title: 'Enter addresses',
    label: 'Pickup, drop-off, extra stops',
    color: 'text-blue-400',
  },
  {
    icon: LayoutGrid,
    number: '02',
    title: 'Choose vehicle',
    label: 'Matched to your load size',
    color: 'text-[#D4AF37]',
  },
  {
    icon: Truck,
    number: '03',
    title: 'Driver matched instantly',
    label: 'Nearest top-rated driver dispatched',
    color: 'text-green-400',
  },
  {
    icon: Radio,
    number: '04',
    title: 'Track delivery live',
    label: 'Real-time GPS to your door',
    color: 'text-purple-400',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="bg-[#061539] py-12 border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <div className="text-center mb-10">
          <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase">Dispatch Pipeline</span>
          <p className="text-white/40 text-sm mt-1">From booking to delivery in minutes</p>
        </div>

        {/* Horizontal workflow strip */}
        <div className="flex items-start justify-center flex-wrap sm:flex-nowrap gap-0">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              {/* Step */}
              <div className="flex flex-col items-center text-center w-1/2 sm:w-auto sm:flex-1 px-4 py-2">
                <div className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3 ${step.color}`}>
                  <step.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                </div>
                <span className="text-white/20 text-[10px] font-bold tracking-widest mb-1">STEP {step.number}</span>
                <p className="text-white font-semibold text-sm leading-snug mb-1">{step.title}</p>
                <p className="text-white/35 text-xs leading-snug max-w-[130px]">{step.label}</p>
              </div>

              {/* Arrow separator */}
              {idx < steps.length - 1 && (
                <div className="hidden sm:flex items-center self-center pb-6">
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="text-white/15">
                    <path d="M0 6h16M12 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
