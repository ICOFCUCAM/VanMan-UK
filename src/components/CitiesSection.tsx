import React from 'react';
import { UK_CITIES } from '@/lib/constants';

interface CitiesSectionProps {
  onNavigate: (page: string) => void;
  onScrollToBooking: () => void;
}

const CitiesSection: React.FC<CitiesSectionProps> = ({ onScrollToBooking }) => (
  <section className="py-20 bg-white border-t border-[#EEF2F7]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="text-[#0E2A47] text-[10px] font-bold tracking-[0.25em] uppercase mb-3 block">Nationwide Coverage</span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#0B2239] mb-4">Available across the UK</h2>
        <p className="text-gray-500 text-base max-w-lg mx-auto">From London to Edinburgh — our driver network covers every major UK city and beyond.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {UK_CITIES.map(city => (
          <button
            key={city.slug}
            onClick={onScrollToBooking}
            className="relative rounded-2xl overflow-hidden group aspect-[4/3] text-left"
          >
            <img
              src={city.image}
              alt={city.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-xl font-black text-white mb-1">Move to {city.name}</h3>
              <p className="text-xs text-gray-300">Drivers available now</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  </section>
);

export default CitiesSection;
