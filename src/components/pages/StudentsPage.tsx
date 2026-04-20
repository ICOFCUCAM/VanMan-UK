import React, { useState } from 'react';
import {
  GraduationCap, CheckCircle2, ArrowRight, Star, MapPin,
  Package, Clock, Shield, CreditCard, ChevronDown, ChevronUp,
} from 'lucide-react';

interface StudentsPageProps {
  onNavigate: (page: string) => void;
  onScrollToBooking: () => void;
}

const BENEFITS = [
  { icon: GraduationCap, title: '10% off every booking', desc: 'Verify once — save on every future booking, automatically.' },
  { icon: Shield,         title: 'Fully insured moves',  desc: 'Goods-in-transit cover included. Your belongings are protected.' },
  { icon: Clock,          title: 'Book in under 3 mins', desc: 'Instant online quote. No calls, no waiting, no hidden fees.' },
  { icon: CreditCard,     title: 'Pay by card or cash',  desc: 'Flexible payment. Escrow protection on every card booking.' },
];

const HOW_IT_WORKS = [
  { n: '01', title: 'Get a quote',         detail: 'Enter your pickup and drop-off address. Instant price — no signup needed.' },
  { n: '02', title: 'Create your account', detail: 'Sign up and tick "I\'m a student" during registration to unlock your discount.' },
  { n: '03', title: 'Verify your status',  detail: 'Upload a valid student ID or UNIDAYS / Student Beans proof. One-time only.' },
  { n: '04', title: 'Save every time',     detail: '10% is automatically deducted on every confirmed booking while your student status is active.' },
];

const FAQS = [
  { q: 'Which universities are eligible?', a: 'Any UK university or higher-education institution. Further education colleges are also eligible with valid student ID.' },
  { q: 'How do I verify my student status?', a: 'During registration, tick "I\'m a student" and upload a photo of your student ID card or a UNIDAYS / Student Beans screenshot. Verification takes under 24 hours.' },
  { q: 'Does the 10% apply to all van sizes?', a: 'Yes — Small, Medium, Large, and Luton vans are all eligible. The discount applies to the total booking price including helpers.' },
  { q: 'Can I use cash or invoice?', a: 'Yes. The 10% discount applies regardless of payment method. For cash bookings, your 30% platform deposit is also reduced by 10%.' },
  { q: 'How long does student status last?', a: 'Your student discount is valid until your stated graduation year. You\'ll receive a reminder to re-verify each academic year.' },
  { q: 'Can I book for a friend?', a: 'The discount is tied to the account holder\'s verified student status. Friends can book through your account if you\'re the one moving.' },
];

const TESTIMONIALS = [
  { name: 'David W.', uni: 'University of Oxford', rating: 5, text: 'The 10% discount was a lifesaver! Moved my entire flat in under 3 hours. Incredible value.' },
  { name: 'Priya K.', uni: 'UCL London',           rating: 5, text: 'Booked the night before my move-out deadline. Driver arrived on time, packed everything carefully.' },
  { name: 'Tom H.',   uni: 'University of Leeds',   rating: 4, text: 'Used it twice now — once moving in, once moving out. Both times seamless. Student discount made it affordable.' },
];

const StudentsPage: React.FC<StudentsPageProps> = ({ onNavigate, onScrollToBooking }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-[88px] pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 60%, #0F3558 100%)' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#F5B400]/10 border border-[#F5B400]/20 rounded-full px-4 py-1.5 mb-6">
            <GraduationCap className="w-3.5 h-3.5 text-[#F5B400]" />
            <span className="text-[#F5B400] text-xs font-bold tracking-[0.15em] uppercase">Student Offer</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
            10% off every move.<br />
            <span className="text-[#F5B400]">Because students deserve a break.</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-xl mx-auto mb-10">
            Moving to uni, between terms, or finally getting your own place? Verify your student ID once and save on every booking — forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onScrollToBooking}
              className="bg-[#F5B400] hover:bg-[#FFD24A] text-[#071A2F] px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#F5B400]/30"
            >
              Get My Student Quote <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
            >
              Create Free Account
            </button>
          </div>
          <p className="text-white/25 text-xs mt-5">No credit card required to get a quote · Verified in under 24 hours</p>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-[#0E2A47] mb-2">Everything included</h2>
            <p className="text-gray-400 text-sm">The 10% discount is on top of an already transparent, all-in price.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map(b => (
              <div key={b.title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
                <div className="w-11 h-11 bg-[#F5B400]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <b.icon className="w-5 h-5 text-[#F5B400]" />
                </div>
                <h3 className="font-black text-[#0E2A47] text-sm mb-1.5">{b.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-[#0E2A47] mb-2">How to claim your discount</h2>
            <p className="text-gray-400 text-sm">Four steps. One-time setup. Permanent savings.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-[#0E2A47] rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-[#F5B400] font-black text-xs">{step.n}</span>
                </div>
                <div>
                  <h3 className="font-black text-[#0E2A47] text-sm mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular student routes ────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-[#0E2A47] mb-2">Popular student moves</h2>
            <p className="text-gray-400 text-sm">Some of the most common routes our student customers book.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { from: 'London',     to: 'Manchester',  price: 149, type: 'Medium Van' },
              { from: 'Birmingham', to: 'Leeds',        price: 109, type: 'Small Van'  },
              { from: 'Bristol',    to: 'London',       price: 119, type: 'Medium Van' },
              { from: 'Edinburgh',  to: 'Glasgow',      price:  79, type: 'Small Van'  },
              { from: 'Oxford',     to: 'London',       price:  89, type: 'Small Van'  },
              { from: 'Manchester', to: 'Liverpool',    price:  69, type: 'Small Van'  },
            ].map((route, i) => (
              <button
                key={i}
                onClick={onScrollToBooking}
                className="group bg-gray-50 hover:bg-[#0E2A47] border border-gray-100 hover:border-[#0E2A47] rounded-xl p-4 text-left transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-white/70">{route.from}</span>
                  <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-white/30" />
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-white/70">{route.to}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-white/40">
                    <Package className="w-3 h-3" />
                    <span className="text-xs">{route.type}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 group-hover:text-white/40 line-through mr-1.5">£{Math.round(route.price / 0.9)}</span>
                    <span className="text-sm font-black text-[#F5B400]">£{route.price}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">* Prices shown with 10% student discount applied. Actual quote depends on exact route and van size.</p>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-[#0E2A47] mb-2">Students love it</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-[#F5B400] fill-[#F5B400]" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-bold text-[#0E2A47] text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {t.uni}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-[#0E2A47] mb-2">Frequently asked questions</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-semibold text-[#0E2A47] text-sm">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-[#071A2F]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="w-10 h-10 text-[#F5B400] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-3">Ready to book your student move?</h2>
          <p className="text-white/40 text-sm mb-7">Get a free instant quote — no account needed to see your price.</p>
          <button
            onClick={onScrollToBooking}
            className="bg-[#F5B400] hover:bg-[#FFD24A] text-[#071A2F] px-8 py-3.5 rounded-xl font-bold text-sm transition-all inline-flex items-center gap-2 hover:shadow-lg hover:shadow-[#F5B400]/25"
          >
            Get My Student Quote <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};

export default StudentsPage;
