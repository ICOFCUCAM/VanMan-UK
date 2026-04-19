import React, { useState } from 'react';
import { Truck, ArrowRight, Package, Home, Building2, Box } from 'lucide-react';

const LOADS = [
  {
    id: 'items',
    icon: Package,
    label: 'A few items',
    desc: 'Boxes, small furniture',
    van: 'Small Van',
    capacity: '1–2 items',
    range: '£60–£95',
    basePrice: 50,
    colour: 'text-blue-500',
  },
  {
    id: 'room',
    icon: Box,
    label: 'One room',
    desc: 'Studio or single room',
    van: 'Medium Van',
    capacity: '3–8 items',
    range: '£80–£130',
    basePrice: 70,
    colour: 'text-[#F5B400]',
  },
  {
    id: 'flat',
    icon: Building2,
    label: 'Full flat',
    desc: '1–2 bed flat or office',
    van: 'Large Van',
    capacity: '9–20 items',
    range: '£100–£165',
    basePrice: 100,
    colour: 'text-green-500',
  },
  {
    id: 'house',
    icon: Home,
    label: 'Full house',
    desc: '3+ bedrooms or large move',
    van: 'Luton Van',
    capacity: '20+ items',
    range: '£130–£200',
    basePrice: 130,
    colour: 'text-purple-500',
  },
] as const;

interface VanCalculatorProps {
  onNavigate: (page: string) => void;
}

const VanCalculator: React.FC<VanCalculatorProps> = ({ onNavigate }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const result = LOADS.find(l => l.id === selected);

  return (
    <section className="py-20 border-t border-[#EEF2F7]" style={{ background: '#F3F7FB' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <span className="text-[#0E2A47] text-[10px] font-bold tracking-[0.25em] uppercase mb-3 block">Van Calculator</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2239] mb-3">Find your perfect van size</h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">Select what you're moving and we'll match you to the right vehicle instantly.</p>
        </div>

        {/* Selector grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {LOADS.map(({ id, icon: Icon, label, desc, colour }) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`group relative p-5 rounded-2xl border-2 text-left transition-all hover:-translate-y-0.5 ${
                selected === id
                  ? 'border-[#0E2A47] bg-white shadow-lg shadow-[#0E2A47]/8'
                  : 'border-gray-200 bg-white hover:border-[#0E2A47]/30 hover:shadow-md'
              }`}
            >
              {selected === id && (
                <div className="absolute top-3 right-3 w-4 h-4 bg-[#0E2A47] rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
              <div className={`w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center mb-3 ${colour}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-black text-[#0B2239] text-sm">{label}</p>
              <p className="text-gray-400 text-xs mt-0.5 leading-snug">{desc}</p>
            </button>
          ))}
        </div>

        {/* Result */}
        {result ? (
          <div
            className="rounded-2xl overflow-hidden transition-all"
            style={{ animation: 'fadeSlideUp 0.25s ease-out' }}
          >
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center sm:items-stretch gap-0 overflow-hidden">
              {/* Left — recommendation */}
              <div className="flex-1 px-7 py-6">
                <p className="text-[#0E2A47] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Recommended</p>
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="w-6 h-6 text-[#0B2239]" />
                  <h3 className="text-xl font-black text-[#0B2239]">{result.van}</h3>
                </div>
                <p className="text-gray-500 text-sm mb-3">Ideal for <strong className="text-[#0B2239]">{result.desc.toLowerCase()}</strong> — capacity {result.capacity}.</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-[#0B2239]">{result.range}</span>
                  <span className="text-gray-400 text-xs">estimated (distance-based)</span>
                </div>
              </div>
              {/* Divider */}
              <div className="hidden sm:block w-px bg-gray-100 my-6" />
              {/* Right — CTA */}
              <div className="px-7 py-6 flex flex-col justify-center items-start sm:items-center gap-3 bg-gray-50/60 sm:bg-transparent sm:min-w-[200px]">
                <p className="text-gray-400 text-xs text-center">Get a precise quote with your exact route and options</p>
                <button
                  onClick={() => onNavigate('home')}
                  className="group inline-flex items-center gap-2 bg-[#F5B400] hover:bg-[#E5A000] text-[#0B2239] px-6 py-3 rounded-xl font-black text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#F5B400]/20 whitespace-nowrap"
                >
                  Get Exact Quote
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
            <Truck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Select a move size above to see your van recommendation</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default VanCalculator;
