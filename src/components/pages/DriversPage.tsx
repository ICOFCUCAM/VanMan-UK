import React from 'react';
import {
  Check,
  ArrowRight,
  Clock,
  Star,
  Zap,
  Shield,
  Users,
  Headphones,
  Truck,
  FileText,
  Upload,
  ChevronRight,
} from 'lucide-react';
import { DRIVER_IMAGES, COMMISSION } from '@/lib/constants';

interface DriversPageProps {
  onNavigate: (page: string) => void;
  onScrollToBooking: () => void;
}

const DriversPage: React.FC<DriversPageProps> = ({ onNavigate, onScrollToBooking }) => {
  const goldKeep = Math.round((1 - COMMISSION.gold) * 100);
  const silverKeep = Math.round((1 - COMMISSION.silver) * 100);
  const goldPlatform = Math.round(COMMISSION.gold * 100);
  const silverPlatform = Math.round(COMMISSION.silver * 100);

  return (
    <>
      {/* ── SECTION 1 — HERO ─────────────────────────────────────────────── */}
      <section
        className="min-h-[580px] pt-[88px]"
        style={{ background: '#071A2F' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 items-center">

            {/* Left column */}
            <div>
              <span className="text-[#F5B400] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                For Drivers
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
                Earn more. Drive on your schedule.
              </h1>
              <p className="text-white/50 text-base leading-relaxed mb-8 max-w-lg">
                Access nationwide delivery jobs in minutes. Weekly payouts. Flexible hours. Fast approval.
              </p>

              {/* Badge pills */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  'Weekly payouts',
                  'Flexible hours',
                  'Priority job access',
                  'Comprehensive insurance available',
                ].map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 bg-white/8 border border-white/10 text-white/70 text-xs font-semibold px-4 py-2 rounded-full"
                  >
                    <Check className="w-3.5 h-3.5 text-[#F5B400]" />
                    {label}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => onNavigate('driver-register')}
                className="inline-flex items-center gap-2.5 bg-[#F5B400] hover:bg-[#FFD24A] text-[#071A2F] font-black px-8 py-4 rounded-2xl text-base transition-all hover:shadow-xl hover:shadow-[#F5B400]/25"
              >
                Apply to Drive
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Right column — hero image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden h-[420px]">
                <img
                  src={DRIVER_IMAGES[0]}
                  alt="Driver on the road"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F]/50 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — EARNINGS STRIP ───────────────────────────────────── */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200">

            {/* Stat 1 */}
            <div className="flex-1 text-center px-8 py-4 sm:py-0">
              <p className="text-[#0B2239] font-black text-2xl sm:text-3xl leading-none mb-1">
                £800–£1,200
                <span className="text-base font-bold text-gray-400 ml-1">/ week</span>
              </p>
              <p className="text-gray-400 text-xs font-medium mt-1">Typical weekly earnings</p>
            </div>

            {/* Stat 2 */}
            <div className="flex-1 text-center px-8 py-4 sm:py-0">
              <p className="text-[#0B2239] font-black text-2xl sm:text-3xl leading-none mb-1">
                10,000+
              </p>
              <p className="text-gray-400 text-xs font-medium mt-1">Active drivers on the platform</p>
            </div>

            {/* Stat 3 */}
            <div className="flex-1 text-center px-8 py-4 sm:py-0">
              <p className="text-[#0B2239] font-black text-2xl sm:text-3xl leading-none mb-1">
                24–48 hrs
              </p>
              <p className="text-gray-400 text-xs font-medium mt-1">Typical approval time</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — REQUIREMENTS ─────────────────────────────────────── */}
      <section
        className="py-20 border-t border-[#EEF2F7]"
        style={{ background: '#F7FAFC' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left */}
            <div>
              <span className="text-[#0E2A47] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
                Requirements
              </span>
              <h2 className="text-3xl font-black text-[#0B2239] mb-4">
                What you need to join
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                We keep onboarding simple. Meet these four requirements and you can be earning within 48 hours of applying.
              </p>
            </div>

            {/* Right — 2×2 requirements grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  title: 'Valid UK driving licence (full)',
                  sub: 'Full UK licence, clean record preferred',
                },
                {
                  title: 'Vehicle insurance certificate',
                  sub: 'Third-party minimum, comprehensive for Gold tier',
                },
                {
                  title: 'Right to work in the UK',
                  sub: 'UK resident or valid work permit',
                },
                {
                  title: 'Smartphone with GPS',
                  sub: 'Android or iOS, in-app tracking required',
                },
              ].map((req, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4"
                  style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' }}
                >
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[#0B2239] font-bold text-sm leading-snug mb-0.5">{req.title}</p>
                    <p className="text-gray-400 text-xs leading-snug">{req.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — BENEFITS GRID ────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-[#EEF2F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-[#0E2A47] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
              Why Drive With Us
            </span>
            <h2 className="text-3xl font-black text-[#0B2239]">
              Built for independent drivers
            </h2>
          </div>

          {/* 5-column benefit cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">

            {/* 1. Flexible Hours */}
            <div className="bg-[#F7FAFC] rounded-2xl border border-gray-100 p-5 text-center">
              <div className="w-11 h-11 rounded-xl bg-blue-500 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[#0B2239] font-black text-sm mb-1.5">Flexible Hours</h3>
              <p className="text-gray-400 text-xs leading-snug">Work when it suits you</p>
            </div>

            {/* 2. Surge Bonuses */}
            <div className="bg-[#F7FAFC] rounded-2xl border border-gray-100 p-5 text-center">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: '#F5B400' }}>
                <Zap className="w-5 h-5 text-[#071A2F]" />
              </div>
              <h3 className="text-[#0B2239] font-black text-sm mb-1.5">Surge Bonuses</h3>
              <p className="text-gray-400 text-xs leading-snug">Earn more at peak demand</p>
            </div>

            {/* 3. 24–48hr Onboarding */}
            <div className="bg-[#F7FAFC] rounded-2xl border border-gray-100 p-5 text-center">
              <div className="w-11 h-11 rounded-xl bg-green-500 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[#0B2239] font-black text-sm mb-1.5">24–48hr Onboarding</h3>
              <p className="text-gray-400 text-xs leading-snug">Start earning fast</p>
            </div>

            {/* 4. Fair Commission */}
            <div className="bg-[#F7FAFC] rounded-2xl border border-gray-100 p-5 text-center">
              <div className="w-11 h-11 rounded-xl bg-purple-500 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[#0B2239] font-black text-sm mb-1.5">Fair Commission</h3>
              <p className="text-gray-400 text-xs leading-snug">Keep {silverKeep}–{goldKeep}% of every job</p>
            </div>

            {/* 5. Driver Support */}
            <div className="bg-[#F7FAFC] rounded-2xl border border-gray-100 p-5 text-center">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: '#0E2A47' }}>
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[#0B2239] font-black text-sm mb-1.5">Driver Support</h3>
              <p className="text-gray-400 text-xs leading-snug">24/7 dedicated team</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — DRIVER TIERS ──────────────────────────────────────── */}
      <section
        className="py-20 border-t border-white/5"
        style={{ background: 'linear-gradient(180deg, #071A2F 0%, #0E2A47 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-[#F5B400] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
              Driver Tiers
            </span>
            <h2 className="text-3xl font-black text-white">
              Choose your tier
            </h2>
          </div>

          {/* Tier cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">

            {/* Gold Tier */}
            <div className="border border-[#F5B400]/30 bg-[#F5B400]/5 rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#F5B400]/15 flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#F5B400]" />
                </div>
                <span className="bg-[#F5B400] text-[#0B2239] text-xs font-black px-3 py-1 rounded-full">Gold Star</span>
              </div>
              <h3 className="text-white font-black text-xl mb-1">Gold Tier Driver</h3>
              <p className="text-white/40 text-xs mb-5">Requires: Comprehensive insurance</p>

              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-5">
                <p className="text-white/40 text-xs mb-1">Commission split</p>
                <p className="text-white font-black text-lg">
                  Platform takes {goldPlatform}%
                  <span className="text-[#F5B400] ml-2">— you keep {goldKeep}%</span>
                </p>
              </div>

              <ul className="space-y-3 mb-7">
                {[
                  'Priority job dispatch',
                  'Higher-value jobs',
                  'Dedicated gold support',
                ].map((perk) => (
                  <li key={perk} className="flex items-center gap-3 text-white/80 text-sm">
                    <Check className="w-4 h-4 text-[#F5B400] shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onNavigate('driver-register')}
                className="w-full bg-[#F5B400] hover:bg-[#FFD24A] text-[#071A2F] font-black py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                Apply for Gold
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Silver Tier */}
            <div className="border border-white/10 bg-white/5 rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="bg-white/10 border border-white/15 text-white text-xs font-black px-3 py-1 rounded-full">Silver Star</span>
              </div>
              <h3 className="text-white font-black text-xl mb-1">Silver Tier Driver</h3>
              <p className="text-white/40 text-xs mb-5">Requires: Third-party insurance minimum</p>

              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-5">
                <p className="text-white/40 text-xs mb-1">Commission split</p>
                <p className="text-white font-black text-lg">
                  Platform takes {silverPlatform}%
                  <span className="text-white/60 ml-2">— you keep {silverKeep}%</span>
                </p>
              </div>

              <ul className="space-y-3 mb-7">
                {[
                  'Standard job queue',
                  'All van sizes eligible',
                  'Driver support access',
                ].map((perk) => (
                  <li key={perk} className="flex items-center gap-3 text-white/60 text-sm">
                    <Check className="w-4 h-4 text-white/60 shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onNavigate('driver-register')}
                className="w-full bg-[#0E2A47] hover:bg-[#0F3558] border border-white/10 text-white font-black py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — ONBOARDING PIPELINE ──────────────────────────────── */}
      <section
        className="py-20 border-t border-[#EEF2F7]"
        style={{ background: '#F7FAFC' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-14">
            <span className="text-[#0E2A47] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
              Application Process
            </span>
            <h2 className="text-3xl font-black text-[#0B2239]">
              From application to first job
            </h2>
          </div>

          {/* Horizontal timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-[28px] left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-0.5 bg-gray-200 hidden sm:block" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {[
                {
                  icon: FileText,
                  color: 'bg-blue-500',
                  number: '1',
                  title: 'Apply Online',
                  desc: 'Fill out the 5-minute form',
                },
                {
                  icon: Upload,
                  color: 'bg-[#F5B400]',
                  iconColor: 'text-[#071A2F]',
                  number: '2',
                  title: 'Upload Documents',
                  desc: 'Licence, insurance, vehicle photos',
                },
                {
                  icon: Shield,
                  color: 'bg-green-500',
                  number: '3',
                  title: 'Verification',
                  desc: 'Team reviews within 24–48 hours',
                },
                {
                  icon: Truck,
                  color: 'bg-purple-500',
                  number: '4',
                  title: 'Start Earning',
                  desc: 'Accept jobs, get paid weekly',
                },
              ].map((step, i) => {
                const Icon = step.icon;
                const iconColor = step.iconColor ?? 'text-white';
                return (
                  <div key={i} className="flex flex-col items-center text-center relative">
                    {/* Badge + icon circle */}
                    <div className="relative mb-5">
                      <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center shadow-lg`}>
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0B2239] border-2 border-white flex items-center justify-center">
                        <span className="text-white text-[10px] font-black">{step.number}</span>
                      </div>
                    </div>
                    <h3 className="text-[#0B2239] font-black text-sm mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-xs leading-snug">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7 — FINAL CTA ─────────────────────────────────────────── */}
      <section
        className="py-16"
        style={{ background: 'linear-gradient(180deg, #071A2F 0%, #0B1E35 100%)' }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#F5B400] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
            Join Today
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to drive with us?
          </h2>
          <p className="text-white/50 text-sm mb-8 leading-relaxed">
            Applications reviewed within 48 hours. No commitment required.
          </p>

          <button
            onClick={() => onNavigate('driver-register')}
            className="inline-flex items-center gap-2.5 bg-[#F5B400] hover:bg-[#FFD24A] text-[#071A2F] font-black px-10 py-4 rounded-2xl text-base transition-all hover:shadow-xl hover:shadow-[#F5B400]/25 mb-6"
          >
            Apply to Drive
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-white/30 text-xs">
            10,000+ drivers already earning on the platform
          </p>
        </div>
      </section>
    </>
  );
};

export default DriversPage;
