import React from 'react';
import { MapPin } from 'lucide-react';

const cities = [
  'London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow',
  'Leeds', 'Bristol', 'Liverpool', 'Cardiff', 'Sheffield',
  'Nottingham', 'Leicester', 'Newcastle', 'Oxford', 'Cambridge',
];

const NationwideCoverageStrip: React.FC = () => {
  return (
    <section className="bg-[#0A2463] py-10 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase">Nationwide Network</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white mb-5">
          Operating in 50+ cities across the UK
        </h2>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-2xl mx-auto">
          {cities.map((city) => (
            <span key={city} className="text-white/35 text-xs font-medium">{city}</span>
          ))}
          <span className="text-[#D4AF37] text-xs font-bold">+ many more</span>
        </div>
      </div>
    </section>
  );
};

export default NationwideCoverageStrip;
