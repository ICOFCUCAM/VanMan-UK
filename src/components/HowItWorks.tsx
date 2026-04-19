import React from 'react';
import { MapPin, LayoutGrid, Truck, Radio } from 'lucide-react';

const steps = [
  { icon: MapPin,     number: '01', title: 'Enter addresses',         label: 'Pickup, drop-off, extra stops',       iconColor: 'text-blue-500' },
  { icon: LayoutGrid, number: '02', title: 'Choose vehicle',          label: 'Matched to your load size',           iconColor: 'text-[#F5B400]' },
  { icon: Truck,      number: '03', title: 'Driver matched instantly', label: 'Nearest top-rated driver dispatched', iconColor: 'text-green-500' },
  { icon: Radio,      number: '04', title: 'Track delivery live',      label: 'Real-time GPS to your door',          iconColor: 'text-purple-500' },
];

const HowItWorks: React.FC = () => (
  <section className="bg-white py-14 border-b border-gray-100">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <span className="text-[#0E2A47] text-xs font-bold tracking-[0.2em] uppercase">Dispatch Pipeline</span>
        <p className="text-gray-400 text-sm mt-1">From booking to delivery in minutes</p>
      </div>

      <div className="flex items-start justify-center flex-wrap sm:flex-nowrap gap-0">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center text-center w-1/2 sm:w-auto sm:flex-1 px-4 py-2">
              <div className={`w-11 h-11 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-3 ${step.iconColor}`}>
                <step.icon className="w-[18px] h-[18px]" />
              </div>
              <span className="text-gray-300 text-[10px] font-bold tracking-widest mb-1">STEP {step.number}</span>
              <p className="text-[#0B2239] font-semibold text-sm leading-snug mb-1">{step.title}</p>
              <p className="text-gray-400 text-xs leading-snug max-w-[130px]">{step.label}</p>
            </div>
            {idx < steps.length - 1 && (
              <div className="hidden sm:flex items-center self-center pb-6">
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="text-gray-200">
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

export default HowItWorks;
