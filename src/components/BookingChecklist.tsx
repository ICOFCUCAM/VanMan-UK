import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

const INCLUDED = [
  { title: 'Real-time GPS tracking',          sub: 'Live map updates from pickup to drop-off' },
  { title: 'Verified & background-checked driver', sub: 'All drivers pass identity and DBS checks' },
  { title: 'Cargo insured to £10,000',        sub: 'Comprehensive goods-in-transit cover' },
  { title: 'Instant booking confirmation',    sub: 'Email + SMS receipt within 60 seconds' },
  { title: 'Transparent pricing — no hidden fees', sub: 'Final price locked at quote stage' },
  { title: '24/7 customer support',           sub: 'Live chat and phone line always open' },
  { title: '4.9★ rated driver network',       sub: 'Performance-monitored across every job' },
  { title: 'Cancellation protection',         sub: 'Free cancellation up to 30 minutes before' },
];

interface BookingChecklistProps {
  onNavigate: (page: string) => void;
  onScrollToBooking: () => void;
}

const BookingChecklist: React.FC<BookingChecklistProps> = ({ onNavigate, onScrollToBooking }) => (
  <section className="py-20 bg-white border-t border-[#EEF2F7]">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-center">

        {/* Left — checklist */}
        <div>
          <span className="text-[#0E2A47] text-[10px] font-bold tracking-[0.25em] uppercase mb-3 block">Every Booking Includes</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2239] mb-8 leading-tight">
            Platform-grade service<br />on every single job
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {INCLUDED.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-50 border border-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-500" />
                </div>
                <div>
                  <p className="text-[#0B2239] text-sm font-bold leading-snug">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-snug">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — CTA card */}
        <div
          className="rounded-2xl p-7 text-center"
          style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 100%)' }}
        >
          {/* Gold accent top */}
          <div className="w-12 h-1 rounded-full bg-[#F5B400] mx-auto mb-6" />
          <h3 className="text-white font-black text-xl mb-2 leading-tight">Ready for your next move?</h3>
          <p className="text-white/45 text-sm mb-6 leading-relaxed">
            Join 50,000+ customers who've moved with Fast Man &amp; Van across the UK.
          </p>
          <div className="space-y-3">
            <button
              onClick={onScrollToBooking}
              className="group w-full inline-flex items-center justify-center gap-2 bg-[#F5B400] hover:bg-[#FFD24A] text-[#0B2239] px-6 py-3 rounded-xl font-black text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#F5B400]/20"
            >
              Get Instant Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('enterprise')}
              className="w-full inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 text-white/65 hover:text-white/90 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            >
              Business Account
            </button>
          </div>
          <p className="text-white/25 text-xs mt-5">No credit card required · Book in 60 seconds</p>
        </div>

      </div>
    </div>
  </section>
);

export default BookingChecklist;
