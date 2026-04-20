import React, { useState, useMemo } from 'react';
import { Check, ArrowRight, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { VEHICLE_TYPES, INVENTORY_ITEMS, PROPERTY_PRESETS, recommendVan } from '@/lib/constants';

interface VanGuidePageProps {
  onNavigate: (page: string) => void;
  onScrollToBooking?: () => void;
}

type Tab = 'guide' | 'calculator';

const COMPARISON_ROWS = [
  { label: 'Cargo volume', key: 'capacity_m3' as const, format: (v: number) => `${v} m³` },
  { label: 'Max payload', key: 'payload' as const, format: (v: string) => v },
  { label: 'From price', key: 'pricePerHour' as const, format: (v: number) => `£${v}/hr` },
];

export default function VanGuidePage({ onNavigate, onScrollToBooking }: VanGuidePageProps) {
  const [tab, setTab] = useState<Tab>('guide');

  // Calculator state
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [openCategory, setOpenCategory] = useState<string | null>('Living Room');

  function applyPreset(presetName: string) {
    setInventory({ ...PROPERTY_PRESETS[presetName] });
  }

  function adjust(itemName: string, delta: number) {
    setInventory(prev => {
      const current = prev[itemName] ?? 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) delete updated[itemName];
      else updated[itemName] = next;
      return updated;
    });
  }

  const { totalVolume, totalWeight, selectedItems } = useMemo(() => {
    let vol = 0;
    let wt = 0;
    const selected: { name: string; qty: number; volume: number }[] = [];

    for (const category of Object.values(INVENTORY_ITEMS)) {
      for (const item of category) {
        const qty = inventory[item.name] ?? 0;
        if (qty > 0) {
          vol += item.volume * qty;
          wt += item.weight * qty;
          selected.push({ name: item.name, qty, volume: item.volume * qty });
        }
      }
    }

    return { totalVolume: vol, totalWeight: wt, selectedItems: selected };
  }, [inventory]);

  const recommendedId = totalVolume > 0 ? recommendVan(totalVolume) : null;
  const recommendedVan = VEHICLE_TYPES.find(v => v.id === recommendedId);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-[88px] pb-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 60%, #0F3558 100%)' }}
      >
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#F5B400]/10 border border-[#F5B400]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#F5B400] text-xs font-bold tracking-[0.15em] uppercase">Van Size Guide</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            Choose the right van.<br />
            <span className="text-[#F5B400]">Save time and money.</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-xl mx-auto">
            Compare our fleet or use the interactive calculator to find exactly what you need.
          </p>
        </div>
      </section>

      {/* ── TAB BAR ──────────────────────────────────────────────────────── */}
      <div className="sticky top-[88px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {(['guide', 'calculator'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors capitalize ${
                  tab === t
                    ? 'border-[#F5B400] text-[#0E2A47]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'guide' ? 'Van Guide' : 'Size Calculator'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── GUIDE TAB ────────────────────────────────────────────────────── */}
        {tab === 'guide' && (
          <>
            {/* Van cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              {VEHICLE_TYPES.map(van => (
                <div key={van.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                  <div className="relative h-40 bg-gradient-to-br from-[#0E2A47]/5 to-[#0E2A47]/10 overflow-hidden">
                    <img
                      src={van.image}
                      alt={van.name}
                      className="w-full h-full object-contain p-4"
                    />
                    <div className="absolute top-3 right-3 bg-[#F5B400] text-[#071A2F] text-[10px] font-black px-2.5 py-1 rounded-full">
                      {van.capacity_m3} m³
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-black text-[#0B2239] text-base mb-1">{van.name}</h3>
                    <p className="text-gray-500 text-xs mb-3 leading-relaxed">{van.description}</p>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Payload</span>
                        <span className="font-semibold text-gray-800">{van.payload}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">From</span>
                        <span className="font-semibold text-[#0E2A47]">£{van.pricePerHour}/hr</span>
                      </div>
                    </div>

                    <div className="mb-4 flex-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Best for</p>
                      <ul className="space-y-1">
                        {van.bestFor.map(b => (
                          <li key={b} className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Check className="w-3 h-3 text-[#F5B400] flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Examples</p>
                    <p className="text-xs text-gray-500">{van.examples.join(' · ')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-black text-[#0B2239]">At a Glance Comparison</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left py-3 px-5 font-semibold text-gray-600 w-36">Feature</th>
                      {VEHICLE_TYPES.map(v => (
                        <th key={v.id} className="text-center py-3 px-4 font-black text-[#0B2239]">{v.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map(row => (
                      <tr key={row.key} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-5 text-gray-600 font-medium">{row.label}</td>
                        {VEHICLE_TYPES.map(v => (
                          <td key={v.id} className="py-3 px-4 text-center font-semibold text-[#0E2A47]">
                            {row.format(v[row.key] as any)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-5 text-gray-600 font-medium">Ideal move</td>
                      {VEHICLE_TYPES.map(v => (
                        <td key={v.id} className="py-3 px-4 text-center text-xs text-gray-500">{v.bestFor[0]}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setTab('calculator')}
                className="group inline-flex items-center gap-2 bg-[#F5B400] hover:bg-[#FFD24A] text-[#0B2239] px-8 py-3.5 rounded-xl font-black text-sm transition-all hover:-translate-y-0.5"
              >
                Try the Size Calculator
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </>
        )}

        {/* ── CALCULATOR TAB ───────────────────────────────────────────────── */}
        {tab === 'calculator' && (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left: Presets + Inventory */}
            <div className="flex-1 min-w-0">

              {/* Property presets */}
              <div className="mb-8">
                <h2 className="text-lg font-black text-[#0B2239] mb-1">Quick preset</h2>
                <p className="text-gray-500 text-sm mb-4">Select your property type to pre-fill common items.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Object.keys(PROPERTY_PRESETS).map(preset => (
                    <button
                      key={preset}
                      onClick={() => applyPreset(preset)}
                      className="bg-white border border-gray-200 hover:border-[#F5B400] hover:bg-[#F5B400]/5 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:text-[#0E2A47] transition-all text-left"
                    >
                      {preset}
                    </button>
                  ))}
                  <button
                    onClick={() => setInventory({})}
                    className="bg-white border border-dashed border-gray-300 hover:border-red-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-400 hover:text-red-500 transition-all text-left"
                  >
                    Clear all
                  </button>
                </div>
              </div>

              {/* Inventory accordion */}
              <div>
                <h2 className="text-lg font-black text-[#0B2239] mb-1">Add your items</h2>
                <p className="text-gray-500 text-sm mb-4">Adjust quantities to match what you're moving.</p>
                <div className="space-y-3">
                  {Object.entries(INVENTORY_ITEMS).map(([category, items]) => {
                    const isOpen = openCategory === category;
                    const categoryCount = items.reduce((acc, item) => acc + (inventory[item.name] ?? 0), 0);

                    return (
                      <div key={category} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <button
                          onClick={() => setOpenCategory(isOpen ? null : category)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[#0B2239] text-sm">{category}</span>
                            {categoryCount > 0 && (
                              <span className="bg-[#F5B400] text-[#071A2F] text-[10px] font-black px-2 py-0.5 rounded-full">{categoryCount}</span>
                            )}
                          </div>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-4 space-y-2">
                            {items.map(item => {
                              const qty = inventory[item.name] ?? 0;
                              return (
                                <div key={item.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                  <div className="flex-1 min-w-0 pr-4">
                                    <p className="text-sm text-gray-800 font-medium">{item.name}</p>
                                    <p className="text-xs text-gray-400">{item.volume} m³ · {item.weight} kg</p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                      onClick={() => adjust(item.name, -1)}
                                      disabled={qty === 0}
                                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 flex items-center justify-center transition-colors"
                                    >
                                      <Minus className="w-3 h-3 text-gray-600" />
                                    </button>
                                    <span className={`w-6 text-center text-sm font-black ${qty > 0 ? 'text-[#0E2A47]' : 'text-gray-300'}`}>{qty}</span>
                                    <button
                                      onClick={() => adjust(item.name, +1)}
                                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#F5B400]/20 flex items-center justify-center transition-colors"
                                    >
                                      <Plus className="w-3 h-3 text-gray-600" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Sticky recommendation sidebar */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-[156px]">

                {totalVolume === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-400">Add items to see your van recommendation</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Summary */}
                    <div className="bg-[#0E2A47] px-5 py-4">
                      <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-1">Your estimate</p>
                      <div className="flex gap-5">
                        <div>
                          <p className="text-2xl font-black text-white">{totalVolume.toFixed(1)}</p>
                          <p className="text-white/40 text-xs">m³ volume</p>
                        </div>
                        <div>
                          <p className="text-2xl font-black text-white">{totalWeight}</p>
                          <p className="text-white/40 text-xs">kg weight</p>
                        </div>
                      </div>
                    </div>

                    {recommendedVan && (
                      <div className="p-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Recommended van</p>
                        <div className="bg-[#F5B400]/10 border border-[#F5B400]/30 rounded-xl p-4 mb-4 flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-[#0B2239] text-lg">{recommendedVan.name}</p>
                            <p className="text-gray-600 text-xs mt-0.5">{recommendedVan.description}</p>
                            <div className="flex items-center gap-3 mt-3 flex-wrap">
                              <span className="text-xs font-semibold text-gray-600">{recommendedVan.capacity_m3} m³</span>
                              <span className="text-gray-300">·</span>
                              <span className="text-xs font-semibold text-gray-600">{recommendedVan.payload}</span>
                              <span className="text-gray-300">·</span>
                              <span className="text-xs font-black text-[#0E2A47]">£{recommendedVan.pricePerHour}/hr</span>
                            </div>
                          </div>
                          <div className="w-20 h-16 rounded-lg overflow-hidden bg-white border border-[#F5B400]/20 shrink-0">
                            <img
                              src={recommendedVan.image}
                              alt={recommendedVan.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* All vans mini comparison */}
                        <div className="space-y-2 mb-5">
                          {VEHICLE_TYPES.map(van => {
                            const isRec = van.id === recommendedVan.id;
                            return (
                              <div key={van.id} className={`flex items-center gap-2 py-1.5 ${isRec ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isRec ? 'bg-[#F5B400]' : 'bg-gray-300'}`} />
                                <span className={`text-xs flex-1 ${isRec ? 'font-black text-[#0B2239]' : 'text-gray-500'}`}>{van.name}</span>
                                <span className="text-xs text-gray-400">{van.capacity_m3} m³</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Items list */}
                        {selectedItems.length > 0 && (
                          <div className="border-t border-gray-100 pt-4 mb-5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Items selected</p>
                            <ul className="space-y-1">
                              {selectedItems.map(item => (
                                <li key={item.name} className="flex justify-between text-xs text-gray-600">
                                  <span>{item.name}</span>
                                  <span className="font-semibold text-gray-800">×{item.qty}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <button
                          onClick={() => onScrollToBooking?.()}
                          className="w-full bg-[#F5B400] hover:bg-[#FFD24A] text-[#0B2239] py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 group"
                        >
                          Book {recommendedVan.name}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-[#EEF2F7]" style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-1 rounded-full bg-[#F5B400] mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white mb-3">Know what you need?</h2>
          <p className="text-white/45 text-sm mb-8 leading-relaxed">
            Book your van in under 2 minutes. Verified drivers, fixed prices, live tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onScrollToBooking?.()}
              className="group inline-flex items-center justify-center gap-2 bg-[#F5B400] hover:bg-[#FFD24A] text-[#0B2239] px-8 py-3.5 rounded-xl font-black text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#F5B400]/20"
            >
              Book Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('moving-checklist')}
              className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 text-white/65 hover:text-white/90 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
            >
              Moving Checklist
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
