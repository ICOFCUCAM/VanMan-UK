import React from 'react';
import { ArrowRight, User, Truck, Building2 } from 'lucide-react';

interface SignUpPageProps {
  onNavigate: (page: string) => void;
}

const OPTIONS = [
  {
    icon: User,
    title: 'Customer Account',
    subtitle: 'Book a move or delivery',
    desc: 'Book vans, track your orders in real time, and manage all your deliveries from one dashboard.',
    features: ['Instant price estimates', 'Live order tracking', 'Secure escrow payments', 'Booking history & receipts'],
    cta: 'Sign Up as Customer',
    page: 'login',
    accent: 'bg-blue-600',
    border: 'hover:border-blue-300',
    ctaStyle: 'bg-[#0E2A47] hover:bg-[#0F3558] text-white',
  },
  {
    icon: Truck,
    title: 'Driver Account',
    subtitle: 'Earn on your schedule',
    desc: 'Join 10,000+ professional drivers on the UK\'s fastest-growing van logistics network.',
    features: ['Keep up to 90% per job', 'Choose your own hours', 'Weekly BACS payouts', 'Priority job dispatch'],
    cta: 'Apply as a Driver',
    page: 'driver-register',
    accent: 'bg-[#F5B400]',
    border: 'hover:border-[#F5B400]',
    ctaStyle: 'bg-[#F5B400] hover:bg-[#E5A000] text-[#071A2F]',
    popular: true,
  },
  {
    icon: Building2,
    title: 'Enterprise Account',
    subtitle: 'Corporate logistics at scale',
    desc: 'Dedicated account management, invoicing, analytics dashboard, and bulk booking for your business.',
    features: ['Dedicated account manager', 'Monthly invoicing', 'API access & integrations', 'Usage analytics'],
    cta: 'Get Enterprise Access',
    page: 'corporate',
    accent: 'bg-purple-600',
    border: 'hover:border-purple-300',
    ctaStyle: 'bg-[#0E2A47] hover:bg-[#0F3558] text-white',
  },
];

export default function SignUpPage({ onNavigate }: SignUpPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section
        className="relative pt-[88px] pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 60%, #0F3558 100%)' }}
      >
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#F5B400]/10 border border-[#F5B400]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#F5B400] text-xs font-bold tracking-[0.15em] uppercase">Create your account</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            How will you use<br />
            <span className="text-[#F5B400]">Fast Man &amp; Van?</span>
          </h1>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            Choose your account type below. Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="text-[#F5B400] hover:text-[#FFD24A] font-semibold transition-colors">
              Sign in here
            </button>
          </p>
        </div>
      </section>

      {/* Option cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {OPTIONS.map(opt => (
            <div
              key={opt.title}
              className={`relative bg-white rounded-2xl p-7 border-2 transition-all duration-200 shadow-sm hover:shadow-xl flex flex-col ${
                opt.popular ? 'border-[#F5B400] shadow-lg shadow-[#F5B400]/10' : `border-gray-100 ${opt.border}`
              }`}
            >
              {opt.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F5B400] text-[#071A2F] text-[10px] font-black px-4 py-1 rounded-full whitespace-nowrap tracking-wide">
                  MOST POPULAR
                </div>
              )}

              <div className={`w-12 h-12 ${opt.accent} rounded-2xl flex items-center justify-center mb-5`}>
                <opt.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-black text-[#0B2239] mb-1">{opt.title}</h3>
              <p className="text-[#F5B400] text-sm font-semibold mb-3">{opt.subtitle}</p>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{opt.desc}</p>

              <ul className="space-y-2 mb-7 flex-1">
                {opt.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-[#F5B400] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onNavigate(opt.page)}
                className={`w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 group ${opt.ctaStyle}`}
              >
                {opt.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          All accounts are free to create &nbsp;·&nbsp; No credit card required &nbsp;·&nbsp; Cancel anytime
        </p>
      </div>
    </div>
  );
}
