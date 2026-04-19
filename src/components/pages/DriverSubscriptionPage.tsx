import React from 'react';
import { Check, Star, Zap, Shield, TrendingUp, ArrowRight, Award, Users } from 'lucide-react';
import { COMMISSION, DRIVER_IMAGES } from '@/lib/constants';

interface DriverSubscriptionPageProps {
  onNavigate: (page: string) => void;
}

const GOLD_FEATURES = [
  'Keep 85% of every job (15% platform fee)',
  'Priority job allocation — first access to high-value bookings',
  'Gold badge on customer-facing profile',
  'Premium insurance coverage included',
  'Dedicated driver account manager',
  'Instant payout — same-day BACS transfer',
  'Access to corporate & enterprise jobs',
  'Free vehicle safety check per quarter',
];

const SILVER_FEATURES = [
  'Keep 80% of every job (20% platform fee)',
  'Standard job marketplace access',
  'Verified driver badge on profile',
  'Standard goods-in-transit insurance',
  'Community support forum & help desk',
  'Weekly payout schedule',
  'Access to residential & business jobs',
  'Annual vehicle compliance check',
];

const COMPARISON = [
  { feature: 'Platform commission',       gold: '15%',             silver: '20%' },
  { feature: 'Driver earnings share',     gold: '85%',             silver: '80%' },
  { feature: 'Job access priority',       gold: 'First access',    silver: 'Standard queue' },
  { feature: 'Corporate job access',      gold: true,              silver: false },
  { feature: 'Payout schedule',           gold: 'Same-day BACS',  silver: 'Weekly BACS' },
  { feature: 'Insurance tier',            gold: 'Premium',         silver: 'Standard' },
  { feature: 'Account manager',           gold: true,              silver: false },
  { feature: 'Vehicle check',             gold: 'Quarterly',       silver: 'Annual' },
  { feature: 'Profile badge',             gold: '⭐ Gold',          silver: '✓ Verified' },
];

const HOW_TO_QUALIFY = [
  { icon: Star,      title: 'Maintain 4.8+ rating',       desc: 'Consistent 5-star performance across 50+ trips' },
  { icon: Shield,    title: 'Pass Gold insurance check',   desc: 'Comprehensive goods-in-transit and liability cover' },
  { icon: TrendingUp, title: 'Complete 100+ verified jobs', desc: 'Build your track record on the platform' },
  { icon: Award,     title: 'Zero policy violations',      desc: 'Clean conduct record across all bookings' },
];

const DriverSubscriptionPage: React.FC<DriverSubscriptionPageProps> = ({ onNavigate }) => (
  <>
    {/* ── HERO ─────────────────────────────────────────────────────────── */}
    <section className="relative pt-[88px] pb-20 overflow-hidden" style={{ background: '#071A2F' }}>
      <img
        src={DRIVER_IMAGES[1]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center opacity-15"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(7,26,47,0.98) 40%, rgba(7,26,47,0.7) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '80px', background: 'linear-gradient(to bottom, transparent, #f8fafc)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#F5B400]/10 border border-[#F5B400]/20 rounded-full px-4 py-1.5 mb-6">
          <Users className="w-3.5 h-3.5 text-[#F5B400]" />
          <span className="text-[#F5B400] text-xs font-bold tracking-[0.15em] uppercase">Driver Subscription Tiers</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
          Choose your tier.<br />
          <span className="text-[#F5B400]">Maximise your earnings.</span>
        </h1>
        <p className="text-white/50 text-base leading-relaxed max-w-xl mx-auto">
          Every Fast Man &amp; Van driver starts on Silver. Earn your way to Gold for better pay, priority access, and premium support.
        </p>
      </div>
    </section>

    {/* ── TIER CARDS ───────────────────────────────────────────────────── */}
    <section className="py-16 bg-[#F7FAFC] border-t border-[#EEF2F7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid md:grid-cols-2 gap-6 items-start">

          {/* Gold Tier */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#F5B400]/40 shadow-xl shadow-[#F5B400]/10 bg-white">
            <div className="px-7 py-5" style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 100%)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#F5B400] text-[10px] font-black tracking-[0.25em] uppercase">Gold Tier</span>
                <span className="bg-[#F5B400]/15 text-[#F5B400] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#F5B400]/25">Most Rewarding</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{Math.round((1 - COMMISSION.gold) * 100)}%</span>
                <span className="text-white/50 text-sm">of job value</span>
              </div>
              <p className="text-white/40 text-xs mt-1">{Math.round(COMMISSION.gold * 100)}% platform commission</p>
            </div>
            <div className="p-7">
              <ul className="space-y-3">
                {GOLD_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#F5B400]/10 border border-[#F5B400]/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#F5B400]" />
                    </div>
                    <span className="text-[#0B2239] text-sm leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate('driver-register')}
                className="group mt-7 w-full inline-flex items-center justify-center gap-2 bg-[#F5B400] hover:bg-[#FFD24A] text-[#0B2239] px-6 py-3.5 rounded-xl font-black text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#F5B400]/20"
              >
                Apply for Gold
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <p className="text-gray-400 text-xs text-center mt-3">Eligibility requirements apply</p>
            </div>
          </div>

          {/* Silver Tier */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="px-7 py-5" style={{ background: 'linear-gradient(135deg, #4B5563 0%, #374151 100%)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/60 text-[10px] font-black tracking-[0.25em] uppercase">Silver Tier</span>
                <span className="bg-white/10 text-white/60 text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10">Starting Tier</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{Math.round((1 - COMMISSION.silver) * 100)}%</span>
                <span className="text-white/50 text-sm">of job value</span>
              </div>
              <p className="text-white/40 text-xs mt-1">{Math.round(COMMISSION.silver * 100)}% platform commission</p>
            </div>
            <div className="p-7">
              <ul className="space-y-3">
                {SILVER_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-gray-400" />
                    </div>
                    <span className="text-[#0B2239] text-sm leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate('driver-register')}
                className="mt-7 w-full inline-flex items-center justify-center gap-2 border-2 border-[#0E2A47] text-[#0E2A47] hover:bg-[#0E2A47] hover:text-white px-6 py-3.5 rounded-xl font-black text-sm transition-all"
              >
                Start as Silver Driver
              </button>
              <p className="text-gray-400 text-xs text-center mt-3">All new drivers begin here</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── COMPARISON TABLE ─────────────────────────────────────────────── */}
    <section className="py-16 bg-white border-t border-[#EEF2F7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[#0E2A47] text-[10px] font-bold tracking-[0.25em] uppercase mb-3 block">Side-by-Side</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2239]">Full tier comparison</h2>
        </div>

        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100">
            <div className="px-5 py-3" />
            <div className="px-5 py-3 text-center border-l border-gray-100">
              <span className="text-[#F5B400] text-xs font-black tracking-wide uppercase">Gold</span>
            </div>
            <div className="px-5 py-3 text-center border-l border-gray-100">
              <span className="text-gray-400 text-xs font-black tracking-wide uppercase">Silver</span>
            </div>
          </div>

          {/* Rows */}
          {COMPARISON.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
              <div className="px-5 py-3.5">
                <span className="text-[#0B2239] text-sm font-medium">{row.feature}</span>
              </div>
              <div className="px-5 py-3.5 text-center border-l border-gray-100">
                {typeof row.gold === 'boolean' ? (
                  row.gold
                    ? <Check className="w-4 h-4 text-[#F5B400] mx-auto" />
                    : <span className="text-gray-300 text-base">—</span>
                ) : (
                  <span className="text-[#0B2239] text-sm font-bold">{row.gold}</span>
                )}
              </div>
              <div className="px-5 py-3.5 text-center border-l border-gray-100">
                {typeof row.silver === 'boolean' ? (
                  row.silver
                    ? <Check className="w-4 h-4 text-green-500 mx-auto" />
                    : <span className="text-gray-300 text-base">—</span>
                ) : (
                  <span className="text-gray-500 text-sm">{row.silver}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── HOW TO QUALIFY FOR GOLD ──────────────────────────────────────── */}
    <section className="py-16 border-t border-[#EEF2F7]" style={{ background: '#F3F7FB' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[#0E2A47] text-[10px] font-bold tracking-[0.25em] uppercase mb-3 block">Upgrade Path</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2239] mb-3">How to earn Gold status</h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">Meet all four criteria and your account is automatically upgraded.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW_TO_QUALIFY.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-[#F5B400]/10 border border-[#F5B400]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-5 h-5 text-[#F5B400]" />
              </div>
              <p className="text-[#0B2239] font-black text-sm mb-2 leading-snug">{title}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── EARNINGS EXAMPLE ─────────────────────────────────────────────── */}
    <section className="py-16 bg-white border-t border-[#EEF2F7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[#0E2A47] text-[10px] font-bold tracking-[0.25em] uppercase mb-3 block">Earnings Example</span>
          <h2 className="text-2xl font-black text-[#0B2239]">See the difference in your pocket</h2>
        </div>

        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="grid grid-cols-3 bg-[#071A2F] text-white">
            <div className="px-6 py-4 text-sm font-semibold text-white/50">Monthly (20 jobs @ £150 avg)</div>
            <div className="px-6 py-4 text-center text-sm font-black text-[#F5B400] border-l border-white/10">Gold</div>
            <div className="px-6 py-4 text-center text-sm font-black text-white/60 border-l border-white/10">Silver</div>
          </div>
          {[
            { label: 'Gross job value',   gold: '£3,000', silver: '£3,000' },
            { label: 'Platform fee',      gold: `£${Math.round(3000 * COMMISSION.gold)} (15%)`, silver: `£${Math.round(3000 * COMMISSION.silver)} (20%)` },
            { label: 'Your take-home',    gold: `£${Math.round(3000 * (1 - COMMISSION.gold))}`, silver: `£${Math.round(3000 * (1 - COMMISSION.silver))}`, highlight: true },
            { label: 'Monthly difference', gold: `+£${Math.round(3000 * (COMMISSION.silver - COMMISSION.gold))} vs Silver`, silver: 'Baseline', dim: true },
          ].map((row, i) => (
            <div key={i} className={`grid grid-cols-3 border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
              <div className="px-6 py-4">
                <span className={`text-sm ${row.highlight ? 'font-black text-[#0B2239]' : 'text-gray-500'}`}>{row.label}</span>
              </div>
              <div className="px-6 py-4 text-center border-l border-gray-100">
                <span className={`text-sm font-bold ${row.highlight ? 'text-[#F5B400] text-base' : row.dim ? 'text-green-600' : 'text-[#0B2239]'}`}>{row.gold}</span>
              </div>
              <div className="px-6 py-4 text-center border-l border-gray-100">
                <span className={`text-sm ${row.highlight ? 'font-bold text-[#0B2239] text-base' : 'text-gray-500'}`}>{row.silver}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
    <section className="py-16 border-t border-[#EEF2F7]" style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 100%)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-1 rounded-full bg-[#F5B400] mx-auto mb-6" />
        <h2 className="text-3xl font-black text-white mb-3 leading-tight">Ready to start driving?</h2>
        <p className="text-white/45 text-sm mb-8 leading-relaxed">
          Join thousands of professional drivers already earning on the Fast Man &amp; Van network. All new drivers begin on Silver — Gold is earned.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => onNavigate('driver-register')}
            className="group inline-flex items-center justify-center gap-2 bg-[#F5B400] hover:bg-[#FFD24A] text-[#0B2239] px-8 py-3.5 rounded-xl font-black text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#F5B400]/20"
          >
            Apply to Drive Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('drivers')}
            className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white/65 hover:text-white/90 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
          >
            Learn More About Driving
          </button>
        </div>
        <p className="text-white/25 text-xs mt-6">No upfront fees · Free to register · Paid weekly</p>
      </div>
    </section>
  </>
);

export default DriverSubscriptionPage;
