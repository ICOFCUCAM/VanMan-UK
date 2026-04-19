import React from 'react';
import { MapPin, LayoutGrid, Truck, Radio } from 'lucide-react';

const steps = [
  { icon: MapPin,     number: '01', title: 'Enter addresses',         label: 'Pickup, drop-off, extra stops',       iconColor: 'text-blue-500' },
  { icon: LayoutGrid, number: '02', title: 'Choose vehicle',          label: 'Matched to your load size',           iconColor: 'text-[#F5B400]' },
  { icon: Truck,      number: '03', title: 'Driver matched instantly', label: 'Nearest top-rated driver dispatched', iconColor: 'text-green-500' },
  { icon: Radio,      number: '04', title: 'Track delivery live',      label: 'Real-time GPS to your door',          iconColor: 'text-purple-500' },
];

const HowItWorks: React.FC = () => (
  <section className="bg-white border-t border-[#EEF2F7] py-20">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="text-center mb-14">
        <span className="text-[#0E2A47] text-[10px] font-bold tracking-[0.25em] uppercase mb-3 block">Dispatch Pipeline</span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0B2239] mb-3">From booking to delivery in minutes</h2>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">Every job follows the same 4-step dispatch sequence — no waiting, no uncertainty.</p>
      </div>

      {/* Horizontal timeline */}
      <div className="relative">
        {/* Connecting line (desktop) */}
        <div className="hidden sm:block absolute top-[22px] left-[12.5%] right-[12.5%] h-px bg-[#EEF2F7]" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative">
              {/* Icon node */}
              <div className={`relative z-10 w-11 h-11 rounded-full bg-white border-2 border-[#EEF2F7] flex items-center justify-center mb-4 shadow-sm ${step.iconColor}`}>
                <step.icon className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#0E2A47] rounded-full text-white text-[9px] font-black flex items-center justify-center">{idx + 1}</span>
              </div>
              <p className="text-[#0B2239] font-bold text-sm leading-snug mb-1.5">{step.title}</p>
              <p className="text-gray-400 text-xs leading-relaxed max-w-[120px]">{step.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  </section>
);

export default HowItWorks;
