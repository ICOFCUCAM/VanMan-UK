import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface MovingChecklistPageProps {
  onNavigate: (page: string) => void;
  onScrollToBooking?: () => void;
}

interface ChecklistItem {
  id: string;
  text: string;
  tip?: string;
}

interface Phase {
  id: string;
  label: string;
  weeks: string;
  color: string;
  accent: string;
  items: ChecklistItem[];
}

const PHASES: Phase[] = [
  {
    id: 'phase1',
    label: '4–6 Weeks Before',
    weeks: '4–6 weeks',
    color: 'bg-blue-50 border-blue-200',
    accent: 'bg-blue-600',
    items: [
      { id: 'p1-1', text: 'Confirm your moving date and book your van or removal service', tip: 'Book early — weekends and month-ends fill up fast.' },
      { id: 'p1-2', text: 'Give notice to your landlord or notify your estate agent' },
      { id: 'p1-3', text: 'Start collecting packing materials (boxes, tape, bubble wrap)' },
      { id: 'p1-4', text: 'Declutter — sell, donate, or discard items you no longer need' },
      { id: 'p1-5', text: 'Research your new area: GP, dentist, schools, supermarkets' },
      { id: 'p1-6', text: 'Notify your employer of your new address' },
      { id: 'p1-7', text: 'Contact your children\'s school to arrange transfer records' },
      { id: 'p1-8', text: 'Check parking restrictions at both addresses for moving day', tip: 'You may need to apply to your council for a parking suspension.' },
    ],
  },
  {
    id: 'phase2',
    label: '3–4 Weeks Before',
    weeks: '3–4 weeks',
    color: 'bg-purple-50 border-purple-200',
    accent: 'bg-purple-600',
    items: [
      { id: 'p2-1', text: 'Notify HMRC of your new address (update your tax records)' },
      { id: 'p2-2', text: 'Inform your bank and credit card providers' },
      { id: 'p2-3', text: 'Update your DVLA driving licence address (required by law)', tip: 'Do this at gov.uk — it\'s free and takes 5 minutes.' },
      { id: 'p2-4', text: 'Redirect Royal Mail post to your new address' },
      { id: 'p2-5', text: 'Contact utilities at old address to schedule final readings' },
      { id: 'p2-6', text: 'Set up utilities at new address (gas, electricity, water, broadband)' },
      { id: 'p2-7', text: 'Begin packing non-essential rooms and seasonal items' },
      { id: 'p2-8', text: 'Label all boxes with contents and destination room' },
    ],
  },
  {
    id: 'phase3',
    label: '2–3 Weeks Before',
    weeks: '2–3 weeks',
    color: 'bg-indigo-50 border-indigo-200',
    accent: 'bg-indigo-600',
    items: [
      { id: 'p3-1', text: 'Update your address with TV Licensing' },
      { id: 'p3-2', text: 'Inform your insurance providers (home, car, contents)' },
      { id: 'p3-3', text: 'Notify your pension or investment providers if applicable' },
      { id: 'p3-4', text: 'Update your address with online shopping accounts (Amazon, etc.)' },
      { id: 'p3-5', text: 'Return library books and any hired equipment' },
      { id: 'p3-6', text: 'Arrange care for pets and young children on moving day' },
      { id: 'p3-7', text: 'Confirm moving day logistics with your van driver' },
      { id: 'p3-8', text: 'Pack a "first night" bag: essentials you\'ll need immediately', tip: 'Include kettle, mugs, bedding, toiletries, phone charger.' },
    ],
  },
  {
    id: 'phase4',
    label: '1 Week Before',
    weeks: '1 week',
    color: 'bg-amber-50 border-amber-200',
    accent: 'bg-amber-500',
    items: [
      { id: 'p4-1', text: 'Defrost your fridge and freezer' },
      { id: 'p4-2', text: 'Use up perishable food or arrange to give it away' },
      { id: 'p4-3', text: 'Dismantle large furniture that needs to be flat-packed for transport' },
      { id: 'p4-4', text: 'Confirm parking arrangements for moving day with your driver' },
      { id: 'p4-5', text: 'Photograph the condition of your current home for deposit purposes' },
      { id: 'p4-6', text: 'Collect keys for your new property' },
      { id: 'p4-7', text: 'Charge power banks and devices the night before' },
      { id: 'p4-8', text: 'Prepare a box of cleaning supplies for leaving the old home clean' },
    ],
  },
  {
    id: 'phase5',
    label: 'Moving Day',
    weeks: 'Day of move',
    color: 'bg-orange-50 border-orange-200',
    accent: 'bg-orange-500',
    items: [
      { id: 'p5-1', text: 'Take final meter readings at your old address (gas, electric, water)', tip: 'Send readings to your suppliers the same day.' },
      { id: 'p5-2', text: 'Check every room, cupboard, loft, and shed before you leave' },
      { id: 'p5-3', text: 'Hand over keys to your landlord or agent' },
      { id: 'p5-4', text: 'Ensure the driver has the correct delivery address and contact number' },
      { id: 'p5-5', text: 'Supervise loading and keep fragile items clearly marked' },
      { id: 'p5-6', text: 'Take meter readings at your new address on arrival' },
      { id: 'p5-7', text: 'Check all items are accounted for before the driver leaves' },
      { id: 'p5-8', text: 'Test that all locks, keys, and entry codes work at the new home' },
    ],
  },
  {
    id: 'phase6',
    label: 'After You Arrive',
    weeks: 'Post-move',
    color: 'bg-green-50 border-green-200',
    accent: 'bg-green-600',
    items: [
      { id: 'p6-1', text: 'Register with a local GP and dentist' },
      { id: 'p6-2', text: 'Update the electoral roll at your new address (gov.uk/register-to-vote)' },
      { id: 'p6-3', text: 'Update your vehicle insurance with new address and storage location' },
      { id: 'p6-4', text: 'Check that your broadband and utilities are active' },
      { id: 'p6-5', text: 'Set up a recycling collection with your new council' },
      { id: 'p6-6', text: 'Introduce yourself to neighbours' },
      { id: 'p6-7', text: 'Leave a review for your driver to help other customers' },
      { id: 'p6-8', text: 'Check Royal Mail redirect is working for important post' },
    ],
  },
];

export default function MovingChecklistPage({ onNavigate, onScrollToBooking }: MovingChecklistPageProps) {
  const [checked, setChecked] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('moving_checklist');
      return saved ? new Set<string>(JSON.parse(saved)) : new Set<string>();
    } catch { return new Set<string>(); }
  });
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['phase1']));

  useEffect(() => {
    localStorage.setItem('moving_checklist', JSON.stringify([...checked]));
  }, [checked]);

  const totalItems = PHASES.reduce((acc, p) => acc + p.items.length, 0);
  const doneCount = checked.size;
  const pct = Math.round((doneCount / totalItems) * 100);

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function togglePhase(phaseId: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(phaseId) ? next.delete(phaseId) : next.add(phaseId);
      return next;
    });
  }

  function phaseProgress(phase: Phase) {
    const done = phase.items.filter(i => checked.has(i.id)).length;
    return { done, total: phase.items.length };
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-[88px] pb-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 60%, #0F3558 100%)' }}
      >
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#F5B400]/10 border border-[#F5B400]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#F5B400] text-xs font-bold tracking-[0.15em] uppercase">UK Moving Checklist</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            Everything you need<br />
            <span className="text-[#F5B400]">before moving day.</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-xl mx-auto">
            {totalItems} tasks across 6 phases — from finding your van to updating the electoral roll. Tick them off as you go.
          </p>
        </div>
      </section>

      {/* ── STICKY PROGRESS BAR ──────────────────────────────────────────── */}
      <div className="sticky top-[88px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-700">Your progress</span>
                <span className="text-xs font-black text-[#0E2A47]">{doneCount}/{totalItems} tasks</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-[#F5B400] rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <div className="text-2xl font-black text-[#0E2A47] w-12 text-right">{pct}%</div>
          </div>
        </div>
      </div>

      {/* ── PHASES ───────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        {PHASES.map((phase, idx) => {
          const { done, total } = phaseProgress(phase);
          const isOpen = expanded.has(phase.id);
          const complete = done === total;

          return (
            <div key={phase.id} className={`rounded-2xl border ${phase.color} overflow-hidden`}>
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-black/[0.02] transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 ${complete ? 'bg-green-500' : phase.accent}`}>
                  {complete ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-[#0B2239] text-sm">{phase.label}</span>
                    {complete && (
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Complete</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{done}/{total} tasks done</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-20 bg-white/60 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${complete ? 'bg-green-500' : phase.accent}`} style={{ width: `${(done / total) * 100}%` }} />
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-5 space-y-2">
                  {phase.items.map(item => {
                    const done = checked.has(item.id);
                    return (
                      <label
                        key={item.id}
                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${done ? 'bg-white/60' : 'bg-white hover:bg-white/80'}`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${done ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'}`}>
                          {done && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => toggle(item.id)}
                          className="sr-only"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{item.text}</p>
                          {item.tip && !done && (
                            <p className="text-xs text-blue-600 mt-1 font-medium">💡 {item.tip}</p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-[#EEF2F7]" style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-1 rounded-full bg-[#F5B400] mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white mb-3">Ready to book your van?</h2>
          <p className="text-white/45 text-sm mb-8 leading-relaxed">
            Not sure what size you need? Use our free Van Size Calculator — then book in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onScrollToBooking?.()}
              className="group inline-flex items-center justify-center gap-2 bg-[#F5B400] hover:bg-[#FFD24A] text-[#0B2239] px-8 py-3.5 rounded-xl font-black text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#F5B400]/20"
            >
              Book a Van Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('van-guide')}
              className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 text-white/65 hover:text-white/90 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
            >
              Van Size Calculator
            </button>
          </div>
          <p className="text-white/25 text-xs mt-6">All checklist progress is stored locally in your browser</p>
        </div>
      </section>
    </div>
  );
}
