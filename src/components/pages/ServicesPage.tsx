import React, { useState } from 'react';
import { Check, Minus, ArrowRight, Shield, Radio, CheckCircle, Truck, Users, Clock, Zap, Calendar, Repeat } from 'lucide-react';
import { SERVICE_IMAGES } from '@/lib/constants';
import FinalCTA from '@/components/FinalCTA';

interface ServicesPageProps {
  onNavigate: (page: string) => void;
  onScrollToBooking: () => void;
}

// ── Capability Matrix ─────────────────────────────────────────────────────────

const SERVICES = ['House Moving', 'Office Relocation', 'Furniture Delivery', 'Student Moves', 'Same-Day Delivery', 'Scheduled Transport'];
const COL_HEADERS = ['Small Van', 'Medium Van', 'Large Van', 'Luton Van', 'Helpers', 'Same-Day', 'Scheduled', 'Business'];

type Cell = 'yes' | 'no' | 'opt';
const MATRIX: Cell[][] = [
  ['no',  'yes', 'yes', 'yes', 'yes', 'opt', 'yes', 'opt'],
  ['no',  'opt', 'yes', 'yes', 'yes', 'no',  'yes', 'yes'],
  ['yes', 'yes', 'yes', 'opt', 'opt', 'yes', 'yes', 'no' ],
  ['yes', 'yes', 'opt', 'no',  'opt', 'yes', 'yes', 'no' ],
  ['yes', 'yes', 'opt', 'no',  'no',  'yes', 'no',  'no' ],
  ['yes', 'yes', 'yes', 'yes', 'opt', 'no',  'yes', 'yes'],
];

const MatrixCell: React.FC<{ v: Cell }> = ({ v }) => {
  if (v === 'yes') return <Check className="w-4 h-4 text-green-500 mx-auto" />;
  if (v === 'no')  return <Minus className="w-3.5 h-3.5 text-gray-300 mx-auto" />;
  return <Check className="w-4 h-4 text-[#F5B400]/55 mx-auto" />;
};

// ── Scenario Cards ────────────────────────────────────────────────────────────

const SCENARIOS = [
  { title: 'Home Relocation',    desc: 'Full house moves from studio to 5-bed homes with professional drivers and optional helpers.',         tag: 'Most Popular', tagStyle: 'bg-[#F5B400] text-[#0B2239]', image: SERVICE_IMAGES.houseMoving },
  { title: 'Business Logistics', desc: 'Office relocations, bulk deliveries, and recurring enterprise transport with consolidated invoicing.', tag: 'Enterprise',   tagStyle: 'bg-[#0F3558] text-[#C9D8E8]',  image: SERVICE_IMAGES.officeRelocation },
  { title: 'Express Delivery',   desc: 'Same-day dispatch within hours. AI routing finds the nearest available driver instantly.',            tag: 'Express',      tagStyle: 'bg-orange-500 text-white',       image: SERVICE_IMAGES.sameDayDelivery },
];

// ── Vehicle Guide ─────────────────────────────────────────────────────────────

const VEHICLES = [
  { name: 'Small Van',  capacity: '1–2 items',  price: 'From £50',  fit: 'Parcels and small flats',      emoji: '🚐' },
  { name: 'Medium Van', capacity: '3–8 items',  price: 'From £70',  fit: 'Furniture and apartment moves', emoji: '🚛' },
  { name: 'Large Van',  capacity: '9–20 items', price: 'From £100', fit: 'House relocations',             emoji: '🚚' },
  { name: 'Luton Van',  capacity: '20+ items',  price: 'From £130', fit: 'Office and commercial moves',   emoji: '📦' },
];

// ── Dispatch Speed ────────────────────────────────────────────────────────────

const DISPATCH = [
  { label: 'Immediate',      sub: 'Driver dispatched now', icon: Zap },
  { label: 'Within 2 hours', sub: 'Flexible same-day',     icon: Clock },
  { label: 'Same day',       sub: 'Scheduled for today',   icon: Truck },
  { label: 'Future date',    sub: 'Plan ahead',            icon: Calendar },
  { label: 'Recurring',      sub: 'Weekly or monthly',     icon: Repeat },
];

// ── Helper Levels ─────────────────────────────────────────────────────────────

const HELPERS = [
  { title: 'Driver only',        sub: 'You manage the load',         extra: 'Included', icon: Truck },
  { title: 'Driver + 1 helper',  sub: 'One extra pair of hands',     extra: '+£25',     icon: Users },
  { title: 'Driver + 2 helpers', sub: 'Full team for big moves',     extra: '+£45',     icon: Users },
  { title: 'Special handling',   sub: 'Fragile and specialist items',extra: 'Custom',   icon: Shield },
];

// ── Assurance ─────────────────────────────────────────────────────────────────

const ASSURANCE = [
  { label: 'Fully insured goods-in-transit', icon: Shield },
  { label: 'Verified drivers nationwide',    icon: CheckCircle },
  { label: 'Live delivery tracking',         icon: Radio },
  { label: 'Commercial move support',        icon: Truck },
];

// ── Page ──────────────────────────────────────────────────────────────────────

const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, onScrollToBooking }) => {
  const [activeDispatch, setActiveDispatch] = useState(0);

  return (
    <>
      {/* Header */}
      <div className="pt-[88px] border-b border-white/[0.06]" style={{ background: 'linear-gradient(180deg, #071A2F 0%, #0E2A47 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-[#F5B400] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">Transport Services</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Transport capability matrix</h1>
          <p className="text-[#8FA9C4] text-sm max-w-lg leading-relaxed">
            Every vehicle, every dispatch mode, every service type — mapped to operational reality.
          </p>
        </div>
      </div>

      {/* Section 1 — Capability Matrix */}
      <section className="py-14 bg-[#F7FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="text-[#0E2A47] text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Capability Matrix</span>
            <h2 className="text-2xl font-black text-[#0B2239] mb-2">Service × vehicle compatibility</h2>
            <p className="text-gray-400 text-xs flex flex-wrap gap-x-5 gap-y-1">
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500" /> Supported</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#F5B400]/60" /> Optional</span>
              <span className="flex items-center gap-1.5"><Minus className="w-3.5 h-3.5 text-gray-300" /> Not available</span>
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr style={{ background: 'linear-gradient(90deg, #0E2A47, #0F3558)' }}>
                  <th className="text-left px-5 py-3.5 text-[#8FA9C4] text-[11px] font-bold tracking-widest uppercase w-44">Service</th>
                  {COL_HEADERS.map(h => (
                    <th key={h} className="px-3 py-3.5 text-center text-[#8FA9C4] text-[10.5px] font-bold tracking-wide uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((svc, ri) => (
                  <tr key={svc} className={`border-t border-gray-100 hover:bg-blue-50/30 transition-colors ${ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-5 py-3.5 text-[#0B2239] text-sm font-semibold">{svc}</td>
                    {MATRIX[ri].map((cell, ci) => (
                      <td key={ci} className="px-3 py-3.5 text-center"><MatrixCell v={cell} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 2 — Service Scenarios */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-[#0E2A47] text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Service Scenarios</span>
            <h2 className="text-2xl font-black text-[#0B2239]">Choose your use case</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {SCENARIOS.map((s, i) => (
              <button key={i} onClick={onScrollToBooking}
                className="group relative rounded-2xl overflow-hidden text-left h-72 focus:outline-none"
                style={{ boxShadow: '0px 10px 30px rgba(0,0,0,0.12)' }}
              >
                <img src={s.image} alt={s.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F]/90 via-[#071A2F]/35 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${s.tagStyle}`}>{s.tag}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-black text-[17px] mb-1.5">{s.title}</h3>
                  <p className="text-[#C9D8E8]/65 text-xs leading-relaxed mb-3">{s.desc}</p>
                  <div className="flex items-center gap-1.5 text-[#F5B400] text-xs font-bold group-hover:gap-2.5 transition-all">
                    Get a quote <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Vehicle Matching */}
      <section className="py-14 bg-[#F7FAFC] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-[#0E2A47] text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Vehicle Guide</span>
            <h2 className="text-2xl font-black text-[#0B2239]">Match load to vehicle</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {VEHICLES.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100/80 hover:border-[#0E2A47]/20 hover:shadow-md transition-all"
                style={{ boxShadow: '0px 4px 16px rgba(0,0,0,0.05)' }}
              >
                <div className="text-3xl mb-3">{v.emoji}</div>
                <h3 className="text-[#0B2239] font-black text-sm mb-1">{v.name}</h3>
                <p className="text-gray-500 text-xs mb-3 leading-snug">{v.fit}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-[#8FA9C4] text-[11px] font-medium">{v.capacity}</span>
                  <span className="text-[#F5B400] font-black text-sm">{v.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Dispatch Speed */}
      <section className="py-14 border-t border-white/[0.05]"
        style={{ background: 'linear-gradient(180deg, #071A2F 0%, #0E2A47 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-[#F5B400] text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Dispatch Speed</span>
            <h2 className="text-2xl font-black text-white">Select your timeline</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-7">
            {DISPATCH.map((d, i) => {
              const Icon = d.icon;
              const active = activeDispatch === i;
              return (
                <button key={i} onClick={() => setActiveDispatch(i)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border transition-all text-sm font-medium ${
                    active ? 'bg-[#F5B400] border-[#F5B400] text-[#0B2239]' : 'border-[#2E4F72] text-[#8FA9C4] hover:border-[#F5B400]/40 hover:text-[#C9D8E8]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#0B2239]' : 'text-[#8FA9C4]'}`} />
                  <div className="text-left">
                    <div className="font-bold leading-none">{d.label}</div>
                    <div className={`text-[10px] mt-0.5 ${active ? 'text-[#0B2239]/60' : 'opacity-60'}`}>{d.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-center">
            <button onClick={onScrollToBooking}
              className="inline-flex items-center gap-2 bg-[#F5B400] hover:bg-[#FFD24A] text-[#0B2239] px-6 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-[#F5B400]/20"
            >
              Book with {DISPATCH[activeDispatch].label.toLowerCase()} dispatch
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 5 — Helper Support */}
      <section className="py-14 bg-[#F7FAFC] border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-[#0E2A47] text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Helper Support</span>
            <h2 className="text-2xl font-black text-[#0B2239]">Choose your crew level</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {HELPERS.map((h, i) => {
              const Icon = h.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100/80 hover:shadow-md transition-all text-center"
                  style={{ boxShadow: '0px 4px 16px rgba(0,0,0,0.05)' }}
                >
                  <div className="w-10 h-10 bg-[#0E2A47]/8 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-[18px] h-[18px] text-[#0E2A47]" />
                  </div>
                  <h3 className="text-[#0B2239] font-black text-sm mb-1">{h.title}</h3>
                  <p className="text-gray-500 text-xs mb-3 leading-snug">{h.sub}</p>
                  <span className={`text-sm font-black ${h.extra === 'Included' ? 'text-green-600' : h.extra === 'Custom' ? 'text-[#8FA9C4]' : 'text-[#F5B400]'}`}>
                    {h.extra}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 6 — Insurance Assurance */}
      <section className="py-10 border-t border-white/[0.05]"
        style={{ background: 'linear-gradient(180deg, #0E2A47 0%, #071A2F 100%)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {ASSURANCE.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F5B400]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#F5B400]" />
                  </div>
                  <span className="text-[#C9D8E8] text-sm font-medium leading-snug">{a.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTA onScrollToBooking={onScrollToBooking} onNavigate={onNavigate} />
    </>
  );
};

export default ServicesPage;
