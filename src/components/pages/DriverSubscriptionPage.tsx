import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { SUBSCRIPTION_PLANS, calculateCommission, DRIVER_IMAGES } from '@/lib/constants';
import { useAppContext } from '@/contexts/AppContext';
import { updateDriverTier } from '@/services/drivers';
import { supabase } from '@/lib/supabase';

interface DriverSubscriptionPageProps {
  onNavigate: (page: string) => void;
}

type ApplicationGate = 'loading' | 'not-applied' | 'pending' | 'rejected' | 'approved';

const PRIORITY_BADGE: Record<number, string> = {
  5: 'bg-amber-50 text-amber-600 border border-amber-200',
  4: 'bg-purple-50 text-purple-600 border border-purple-200',
  3: 'bg-[#0E2A47]/8 text-[#0E2A47] border border-[#0E2A47]/15',
  2: 'bg-blue-50 text-blue-600 border border-blue-200',
  1: 'bg-gray-100 text-gray-500',
};

const PRIORITY_BAR: Record<number, string> = {
  5: 'bg-amber-500',
  4: 'bg-purple-500',
  3: 'bg-[#0E2A47]',
  2: 'bg-blue-500',
  1: 'bg-gray-400',
};

export default function DriverSubscriptionPage({ onNavigate }: DriverSubscriptionPageProps) {
  const { user, role, isLoading, driver } = useAppContext();
  const [gate, setGate]               = useState<ApplicationGate>('loading');
  const [examplePrice, setExamplePrice] = useState(250);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { setGate('loading'); return; }
    if (role === 'admin' || role === 'driver') { setGate('approved'); return; }

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('driver_applications')
        .select('status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;
      if (error) { setGate('not-applied'); return; }
      if (!data)                           setGate('not-applied');
      else if (data.status === 'approved') setGate('approved');
      else if (data.status === 'rejected') setGate('rejected');
      else                                 setGate('pending');
    })();
    return () => { cancelled = true; };
  }, [user?.id, role, isLoading]);

  // Current tier from driver record (fallback to 'silver')
  const currentTier = driver?.tier ?? 'silver';

  async function handleSubscribe(planId: string, planPrice: number) {
    if (!user) { onNavigate('login'); return; }

    // Not yet an approved driver — redirect to relevant page
    if (gate !== 'approved') {
      if (gate === 'not-applied') { onNavigate('driver-register'); return; }
      if (gate === 'pending' || gate === 'rejected') { onNavigate('driver-dashboard'); return; }
      return;
    }

    // Already on this tier
    if (planId === currentTier) return;

    if (!driver) {
      setSubscribeError('Driver profile not found. Please contact support.');
      return;
    }

    setSubscribing(planId);
    setSubscribeError(null);
    setSuccessPlan(null);

    const { error } = await updateDriverTier(driver.id, planId);
    setSubscribing(null);

    if (error) {
      setSubscribeError(error.message || 'Failed to update plan. Please try again.');
      return;
    }

    setSuccessPlan(planId);

    // Redirect to marketplace after short delay so user sees success state
    setTimeout(() => onNavigate('driver-marketplace'), 1800);
  }

  function ctaLabel(planId: string, planPrice: number): string {
    if (!user)                       return 'Sign in to subscribe';
    if (gate === 'loading')          return 'Checking…';
    if (gate === 'not-applied')      return 'Apply as driver first';
    if (gate === 'pending')          return 'Under review';
    if (gate === 'rejected')         return 'Re-submit application';
    if (planId === currentTier)      return 'Current Plan';
    if (planPrice === 0)             return 'Switch to Free';
    return 'Subscribe Now';
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-[88px] pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 60%, #0F3558 100%)' }}
      >
        <img src={DRIVER_IMAGES[1]} alt="" className="absolute inset-0 w-full h-full object-cover object-center opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#F5B400]/10 border border-[#F5B400]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#F5B400] text-xs font-bold tracking-[0.15em] uppercase">Driver Subscription Plans</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
            Choose your plan.<br />
            <span className="text-[#F5B400]">Maximise your earnings.</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-xl mx-auto">
            All drivers start on Silver. Upgrade anytime to lower your commission rate, unlock priority dispatch, and earn more on every job.
          </p>
          {gate === 'approved' && driver && (
            <div className="mt-6 inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-2">
              <span className="text-white/60 text-sm">Current plan:</span>
              <span className="text-[#F5B400] font-black text-sm capitalize">
                {SUBSCRIPTION_PLANS.find(p => p.id === currentTier)?.name ?? 'Silver'}
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── ELIGIBILITY BANNER ───────────────────────────────────────────── */}
        {user && role !== 'admin' && gate !== 'approved' && gate !== 'loading' && (
          <div className={`rounded-2xl border p-5 mb-8 flex items-start gap-4 ${
            gate === 'not-applied' ? 'bg-blue-50 border-blue-200' :
            gate === 'pending'     ? 'bg-yellow-50 border-yellow-200' :
                                     'bg-red-50 border-red-200'
          }`}>
            <span className="text-2xl shrink-0">
              {gate === 'not-applied' ? '📋' : gate === 'pending' ? '⏳' : '❌'}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm ${
                gate === 'not-applied' ? 'text-blue-900' :
                gate === 'pending'     ? 'text-yellow-900' : 'text-red-900'
              }`}>
                {gate === 'not-applied' && 'Apply to become a driver first'}
                {gate === 'pending'     && 'Your driver application is under review'}
                {gate === 'rejected'    && 'Your driver application was not approved'}
              </p>
              <p className={`text-xs mt-1 ${
                gate === 'not-applied' ? 'text-blue-700' :
                gate === 'pending'     ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {gate === 'not-applied' && 'Subscription plans are only available to approved drivers. Start your application — it takes about 5 minutes.'}
                {gate === 'pending'     && "We usually review applications within 24 hours. You can subscribe as soon as you're approved."}
                {gate === 'rejected'    && 'Check the review notes on your application status page and re-upload updated documents.'}
              </p>
              <button
                onClick={() => {
                  if (gate === 'not-applied') onNavigate('driver-register');
                  else onNavigate('driver-dashboard');
                }}
                className={`mt-3 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  gate === 'not-applied' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                  gate === 'pending'     ? 'bg-yellow-500 hover:bg-yellow-600 text-white' :
                                           'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {gate === 'not-applied' && 'Start driver application →'}
                {gate === 'pending'     && 'View application status →'}
                {gate === 'rejected'    && 'View review notes →'}
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR BANNER ─────────────────────────────────────────────────── */}
        {subscribeError && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm">{subscribeError}</p>
          </div>
        )}

        {/* ── SUCCESS BANNER ───────────────────────────────────────────────── */}
        {successPlan && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            <p className="text-green-700 text-sm font-semibold">
              Plan updated to <strong>{SUBSCRIPTION_PLANS.find(p => p.id === successPlan)?.name}</strong>! Redirecting to your marketplace…
            </p>
          </div>
        )}

        {/* ── PLAN CARDS ───────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5 mb-16">
          {SUBSCRIPTION_PLANS.map(plan => {
            const isCurrent    = plan.id === currentTier && gate === 'approved';
            const isSubscribing = subscribing === plan.id;
            const isSuccess    = successPlan === plan.id;
            const isDisabled   = subscribing !== null || successPlan !== null || isCurrent;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-6 flex flex-col transition-all ${
                  isCurrent
                    ? 'border-2 border-[#0E2A47] shadow-xl shadow-[#0E2A47]/10 scale-[1.03] z-10'
                    : plan.popular
                    ? 'border-2 border-[#F5B400] shadow-xl shadow-[#F5B400]/10 scale-[1.02] z-5'
                    : 'border border-gray-100 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Badges */}
                {isCurrent && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0E2A47] text-white text-[10px] font-black px-4 py-1 rounded-full whitespace-nowrap tracking-wide">
                    YOUR PLAN
                  </div>
                )}
                {!isCurrent && plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F5B400] text-[#071A2F] text-[10px] font-black px-4 py-1 rounded-full whitespace-nowrap tracking-wide">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-xl font-black text-[#0B2239] mb-1 mt-1">{plan.name}</h3>
                <div className="mb-3">
                  <span className="text-3xl font-black text-[#0B2239]">{plan.price === 0 ? 'Free' : `£${plan.price}`}</span>
                  {plan.price > 0 && <span className="text-gray-500 text-sm ml-1">{plan.period}</span>}
                </div>
                <div className={`inline-flex self-start px-2.5 py-1 rounded-full text-xs font-semibold mb-4 ${PRIORITY_BADGE[plan.priorityLevel] ?? 'bg-gray-100 text-gray-500'}`}>
                  {plan.dispatchPriority} Priority
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-[#F5B400] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id, plan.price)}
                  disabled={isDisabled}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isSuccess
                      ? 'bg-green-500 text-white cursor-default'
                      : isCurrent
                      ? 'bg-[#0E2A47] text-white cursor-default'
                      : plan.popular
                      ? 'bg-[#F5B400] text-[#071A2F] hover:bg-[#FFD24A] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {isSubscribing && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSuccess     && <CheckCircle className="w-4 h-4" />}
                  {isSuccess     ? 'Plan Activated!'
                   : isSubscribing ? 'Activating…'
                   : isCurrent    ? '✓ Current Plan'
                   : ctaLabel(plan.id, plan.price)}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── EARNINGS COMPARISON ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-10 shadow-sm">
          <h2 className="text-2xl font-black text-[#0B2239] mb-2">Earnings Comparison</h2>
          <p className="text-gray-500 mb-6">See how much you keep per job with each plan</p>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Example job value: <span className="text-[#F5B400] font-black">£{examplePrice}</span>
            </label>
            <input
              type="range" min={50} max={1000} step={10}
              value={examplePrice} onChange={e => setExamplePrice(Number(e.target.value))}
              className="w-full accent-[#F5B400]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>£50</span><span>£1,000</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Plan</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Commission</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Platform fee</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Your earnings</th>
                </tr>
              </thead>
              <tbody>
                {SUBSCRIPTION_PLANS.map(plan => {
                  const calc = calculateCommission(examplePrice, plan.id);
                  const isActive = plan.id === currentTier && gate === 'approved';
                  return (
                    <tr key={plan.id} className={`border-b border-gray-50 ${isActive ? 'bg-[#0E2A47]/5' : 'hover:bg-gray-50'}`}>
                      <td className="py-3 px-4 font-semibold text-[#0B2239] flex items-center gap-2">
                        {plan.name}
                        {isActive && <span className="text-[9px] bg-[#0E2A47] text-white font-black px-2 py-0.5 rounded-full tracking-wide">YOUR PLAN</span>}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{calc.rate}%</td>
                      <td className="py-3 px-4 text-gray-500">£{calc.commission}</td>
                      <td className="py-3 px-4">
                        <span className={`font-black text-base ${isActive ? 'text-[#0E2A47]' : plan.popular ? 'text-[#F5B400]' : 'text-[#0E2A47]'}`}>
                          £{calc.earning}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── DISPATCH PRIORITY BARS ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-2xl font-black text-[#0B2239] mb-6">Dispatch Priority System</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-xl">Higher-tier drivers are offered jobs first. When demand is high, Elite drivers see opportunities before Gold, Silver Plus, and Silver drivers.</p>
          <div className="space-y-4">
            {[...SUBSCRIPTION_PLANS].reverse().map(plan => (
              <div key={plan.id} className="flex items-center gap-4">
                <div className="w-24 text-sm font-semibold text-gray-700 shrink-0">{plan.name}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${PRIORITY_BAR[plan.priorityLevel] ?? 'bg-gray-400'}`}
                    style={{ width: `${plan.priorityLevel * 20}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-500 w-20 shrink-0">{plan.dispatchPriority}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-[#EEF2F7]" style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-1 rounded-full bg-[#F5B400] mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white mb-3">Ready to start driving?</h2>
          <p className="text-white/45 text-sm mb-8 leading-relaxed">
            Join thousands of professional drivers already earning on the Fast Man &amp; Van network.
            All new drivers begin on Silver — upgrade anytime.
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
              className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 text-white/65 hover:text-white/90 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
            >
              Learn More About Driving
            </button>
          </div>
          <p className="text-white/25 text-xs mt-6">No upfront fees · Free to register · Paid by BACS</p>
        </div>
      </section>
    </div>
  );
}
