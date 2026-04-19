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
  <section className="py-20 border-t border-[#EEF2F7]" style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Drive for Fast Man &amp; Van</h2>
          <p className="text-lg text-green-100 mb-6 leading-relaxed">
            Join 10,000+ professional drivers earning on the UK&apos;s fastest-growing van logistics platform.
          </p>
          <ul className="space-y-3 mb-8">
            {FEATURES.map(f => (
              <li key={f} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0" />
                <span className="text-white/90 text-sm">{f}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('driver-register')}
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white text-green-700 rounded-xl font-black hover:bg-green-50 transition shadow-lg text-sm"
            >
              Apply to Drive Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('driver-subscription')}
              className="px-8 py-3.5 border-2 border-white/30 hover:border-white/60 text-white/80 hover:text-white rounded-xl font-semibold text-sm transition"
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
        </div>
      </div>
    </div>
  </section>
);

export default DriverCTA;
