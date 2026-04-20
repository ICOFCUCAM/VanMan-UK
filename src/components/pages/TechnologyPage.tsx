import React from 'react';
import {
  Cpu, MapPin, Shield, Zap, BarChart3, Lock, Globe, Smartphone,
  CheckCircle2, ArrowRight, Clock, Route, Truck, CreditCard,
} from 'lucide-react';

interface TechnologyPageProps {
  onNavigate: (page: string) => void;
  onScrollToBooking: () => void;
}

const TECH_PILLARS = [
  {
    icon: Cpu,
    title: 'AI Dispatch Engine',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    description: 'Our dispatch algorithm scores every available driver against each new booking in real time — factoring location, tier, vehicle type, rating, and current workload to find the optimal match within minutes.',
    points: ['Sub-2-minute average match time', 'Tier priority weighting (Elite first)', 'Surge detection & dynamic pricing', 'Multi-stop route optimisation'],
  },
  {
    icon: Route,
    title: 'OSRM Route Optimisation',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    description: 'Powered by the Open Source Routing Machine (OSRM), every booking calculates the fastest road route across the UK — with real-time distance and duration used to generate accurate quotes instantly.',
    points: ['Accurate UK road network data', 'Distance-based pricing calculation', 'Multi-stop journey support', 'Traffic-aware duration estimates'],
  },
  {
    icon: MapPin,
    title: 'Live GPS Tracking',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
    description: 'Customers track their driver in real time from dispatch to delivery. Drivers share their location via the driver app, updating the customer-facing timeline at every status milestone.',
    points: ['Real-time driver location updates', '7-stage delivery timeline', 'SMS & push notifications at each step', 'ETA recalculation in transit'],
  },
  {
    icon: Lock,
    title: 'Escrow Payment Protection',
    color: 'text-[#0E2A47]',
    bg: 'bg-[#0E2A47]/5',
    border: 'border-[#0E2A47]/10',
    description: 'Funds are held securely in escrow from the moment of payment. The driver is only paid after both parties confirm successful delivery — eliminating fraud risk on both sides.',
    points: ['Stripe-powered secure escrow', 'Dual-confirmation release trigger', 'Auto-release after both confirmations', 'Instant admin override for disputes'],
  },
  {
    icon: Shield,
    title: 'Goods-in-Transit Insurance',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    description: 'Every booking is covered by goods-in-transit insurance up to £50,000. Driver tier determines the coverage level — Elite drivers carry premium policies for high-value moves.',
    points: ['Up to £50,000 coverage per booking', 'Included in every booking fee', 'Escalating coverage by driver tier', 'Instant claims support via support portal'],
  },
  {
    icon: BarChart3,
    title: 'Corporate Analytics',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    description: 'Enterprise accounts get a full analytics dashboard: spend tracking, booking frequency, driver performance, and monthly consolidated invoices — all exportable for finance teams.',
    points: ['Weekly & monthly spend charts', 'Per-booking cost breakdown', 'Team usage reports', 'Consolidated BACS invoicing'],
  },
];

const STACK = [
  { label: 'Frontend', value: 'React 18 + TypeScript + Vite', icon: Globe },
  { label: 'Styling', value: 'Tailwind CSS + shadcn/ui', icon: Smartphone },
  { label: 'Backend', value: 'Supabase (PostgreSQL + Edge Functions)', icon: Cpu },
  { label: 'Payments', value: 'Stripe Checkout + Webhooks', icon: CreditCard },
  { label: 'Routing', value: 'OSRM (Open Source Routing Machine)', icon: Route },
  { label: 'Geocoding', value: 'Nominatim / OpenStreetMap (UK)', icon: MapPin },
  { label: 'Auth', value: 'Supabase Auth — email + OAuth', icon: Lock },
  { label: 'Hosting', value: 'Vercel (CDN edge deployment)', icon: Zap },
];

const STATS = [
  { value: '<2 min', label: 'Average driver match time' },
  { value: '99.9%', label: 'Platform uptime SLA' },
  { value: '256-bit', label: 'SSL encryption on all traffic' },
  { value: '£50k', label: 'Max goods-in-transit cover' },
];

const TechnologyPage: React.FC<TechnologyPageProps> = ({ onNavigate, onScrollToBooking }) => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-[88px] pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 60%, #0F3558 100%)' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#F5B400]/10 border border-[#F5B400]/20 rounded-full px-4 py-1.5 mb-6">
            <Cpu className="w-3.5 h-3.5 text-[#F5B400]" />
            <span className="text-[#F5B400] text-xs font-bold tracking-[0.15em] uppercase">Platform Technology</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
            Intelligent logistics<br />
            <span className="text-[#F5B400]">built for the UK</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-2xl mx-auto mb-10">
            AI dispatch, real-time GPS, OSRM route optimisation, Stripe escrow, and £50k goods-in-transit insurance — all included in every booking. No extras. No hidden charges.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-[#F5B400] font-black text-2xl mb-1">{s.value}</p>
                <p className="text-white/40 text-xs leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech pillars ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-[#0E2A47] mb-3">Six layers of infrastructure</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">Every booking runs through all six layers simultaneously — ensuring speed, safety, and transparency from quote to delivery.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TECH_PILLARS.map(p => (
              <div key={p.title} className={`rounded-2xl border ${p.border} ${p.bg} p-6 flex flex-col`}>
                <div className={`w-11 h-11 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
                  <p.icon className={`w-5 h-5 ${p.color}`} />
                </div>
                <h3 className="font-black text-[#0E2A47] text-lg mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{p.description}</p>
                <ul className="space-y-1.5">
                  {p.points.map(pt => (
                    <li key={pt} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${p.color} shrink-0 mt-0.5`} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech stack ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-[#0E2A47] mb-2">Open-standard stack</h2>
            <p className="text-gray-400 text-sm">No vendor lock-in. Built with best-in-class open tools.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STACK.map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3">
                <div className="w-9 h-9 bg-[#0E2A47]/5 rounded-lg flex items-center justify-center shrink-0">
                  <s.icon className="w-4 h-4 text-[#0E2A47]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5 leading-snug">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How a booking flows ──────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-[#0E2A47] mb-2">What happens when you book</h2>
            <p className="text-gray-400 text-sm">Eight automated steps from click to completion.</p>
          </div>
          <div className="space-y-3">
            {[
              { n: '01', icon: MapPin,      title: 'Address geocoded', detail: 'Nominatim resolves UK postcodes to lat/lng coordinates in real time.' },
              { n: '02', icon: Route,       title: 'Route calculated', detail: 'OSRM computes the fastest road route and returns distance + duration.' },
              { n: '03', icon: Truck,       title: 'Price generated',  detail: 'Base price × vehicle type × distance + helpers + stairs = final quote.' },
              { n: '04', icon: CreditCard,  title: 'Payment secured',  detail: 'Stripe creates a checkout session; funds held in escrow on completion.' },
              { n: '05', icon: Cpu,         title: 'Driver matched',   detail: 'AI dispatch scores available drivers and assigns the best match.' },
              { n: '06', icon: Clock,       title: 'Job tracked',      detail: 'Status updates (assigned → in-progress → delivered) pushed in real time.' },
              { n: '07', icon: CheckCircle2,title: 'Dual confirmation',detail: 'Both driver and customer confirm delivery before escrow releases.' },
              { n: '08', icon: BarChart3,   title: 'Payout triggered', detail: 'Driver earning transferred via BACS; commission retained by platform.' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4 bg-gray-50 rounded-xl p-4">
                <div className="w-9 h-9 bg-[#0E2A47] rounded-lg flex items-center justify-center shrink-0">
                  <step.icon className="w-4 h-4 text-[#F5B400]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-black text-gray-300 tracking-widest">{step.n}</span>
                    <p className="font-bold text-[#0E2A47] text-sm">{step.title}</p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-[#071A2F]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Ready to experience it?</h2>
          <p className="text-white/40 text-sm mb-7">Get an instant quote and see the platform in action.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onScrollToBooking}
              className="bg-[#F5B400] hover:bg-[#FFD24A] text-[#071A2F] px-7 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#F5B400]/25"
            >
              Get an Instant Quote <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('driver-register')}
              className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white px-7 py-3 rounded-xl font-semibold text-sm transition-all"
            >
              Join as a Driver
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TechnologyPage;
