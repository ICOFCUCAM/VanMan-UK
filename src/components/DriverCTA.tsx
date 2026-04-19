import React from 'react';
import { DRIVER_IMAGES } from '@/lib/constants';
import { ArrowRight, Check } from 'lucide-react';

interface DriverCTAProps {
  onNavigate: (page: string) => void;
}

const FEATURES = [
  'Keep up to 90% of every job — Gold tier earns the most',
  'Choose your own hours and working area',
  'Get paid every week via BACS direct transfer',
  'Access to corporate and enterprise accounts',
  'Dedicated UK-based driver support team',
];

const DriverCTA: React.FC<DriverCTAProps> = ({ onNavigate }) => (
  <section
    className="py-20 border-t border-[#EEF2F7]"
    style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 60%, #0F3558 100%)' }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#F5B400]/10 border border-[#F5B400]/20 rounded-full px-4 py-1.5 mb-5">
            <span className="text-[#F5B400] text-xs font-bold tracking-[0.15em] uppercase">For Drivers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Drive for Fast Man &amp; Van</h2>
          <p className="text-white/55 text-base mb-6 leading-relaxed">
            Join 10,000+ professional drivers earning on the UK&apos;s fastest-growing van logistics platform.
          </p>
          <ul className="space-y-3 mb-8">
            {FEATURES.map(f => (
              <li key={f} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#F5B400] flex-shrink-0" />
                <span className="text-white/80 text-sm">{f}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('driver-register')}
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#F5B400] hover:bg-[#FFD24A] text-[#071A2F] rounded-xl font-black text-sm transition-all hover:shadow-lg hover:shadow-[#F5B400]/25 hover:-translate-y-0.5"
            >
              Apply to Drive Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('driver-subscription')}
              className="px-8 py-3.5 border border-white/25 hover:border-white/50 text-white/70 hover:text-white rounded-xl font-semibold text-sm transition-all"
            >
              View Earnings Plans
            </button>
          </div>
        </div>
        <div className="relative">
          <img
            src={DRIVER_IMAGES[2]}
            alt="Fast Man & Van driver"
            className="rounded-2xl shadow-2xl w-full object-cover"
            style={{ maxHeight: '420px' }}
          />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" />
        </div>
      </div>
    </div>
  </section>
);

export default DriverCTA;
