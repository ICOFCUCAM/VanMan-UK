import React from 'react';
import { ArrowRight } from 'lucide-react';
import { VEHICLE_TYPES, SERVICE_IMAGES } from '@/lib/constants';

interface VanTypesSectionProps {
  onNavigate: (page: string) => void;
  onScrollToBooking?: () => void;
}

const VAN_PHOTOS = [
  SERVICE_IMAGES.sameDayDelivery,
  SERVICE_IMAGES.furnitureDelivery,
  SERVICE_IMAGES.houseMoving,
  SERVICE_IMAGES.officeRelocation,
];

const VanTypesSection: React.FC<VanTypesSectionProps> = ({ onNavigate, onScrollToBooking }) => (
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-[#0B2239] mb-2">Choose the Right Van for Your Move</h2>
        <p className="text-gray-500 text-sm">Compare different van sizes and find the perfect vehicle</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {VEHICLE_TYPES.map((van, idx) => (
          <div key={van.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
            <div className="relative overflow-hidden h-44">
              <img
                src={VAN_PHOTOS[idx]}
                alt={van.name}
                className="w-full h-full object-cover"
                onError={e => {
                  const t = e.currentTarget;
                  t.style.display = 'none';
                  const p = t.parentElement;
                  if (p) p.style.background = 'linear-gradient(135deg, #0E2A47 0%, #071A2F 100%)';
                }}
              />
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-black text-[#0B2239] text-base mb-2">{van.name}</h3>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="inline-flex items-center bg-[#E8F5E9] text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {van.capacity_m3} m³
                </span>
                <span className="text-xs text-gray-500">{van.payload}</span>
              </div>

              <p className="text-gray-500 text-xs leading-relaxed mb-3">{van.description}</p>

              <ul className="space-y-1 mb-4 flex-1">
                {van.bestFor.map(b => (
                  <li key={b} className="text-xs text-gray-600">· {b}</li>
                ))}
              </ul>

              <p className="text-sm font-black text-[#0B2239] mb-3">From £{van.pricePerHour}/hr</p>

              <button
                onClick={() => onScrollToBooking?.()}
                className="w-full bg-[#0E2A47] hover:bg-[#0F3558] text-white py-2.5 rounded-xl font-bold text-sm transition-colors"
              >
                Book {van.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => onNavigate('van-guide')}
          className="inline-flex items-center gap-2 border border-[#0E2A47]/30 hover:border-[#0E2A47] text-[#0E2A47] hover:bg-[#0E2A47]/5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
        >
          Use Our Van Size Calculator
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  </section>
);

export default VanTypesSection;
