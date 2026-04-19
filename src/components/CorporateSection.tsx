import React from 'react';
import { Building2, BarChart3, Users, FileText, Repeat, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { FEATURE_IMAGES } from '@/lib/constants';

interface CorporateSectionProps {
  onNavigate: (page: string) => void;
}

const corpFeatures = [
  { icon: Building2, title: 'Bulk Bookings', desc: 'Schedule hundreds of deliveries at once with CSV upload or API.' },
  { icon: Repeat, title: 'Recurring Deliveries', desc: 'Automated recurring schedules for your regular delivery routes.' },
  { icon: FileText, title: 'Monthly Invoicing', desc: 'Consolidated invoices with itemised breakdowns for accounting.' },
  { icon: Users, title: 'Team Access', desc: 'Role-based permissions and spending limits per team member.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Real-time cost reports, delivery performance, and trends.' },
  { icon: Zap, title: 'Priority Dispatch', desc: 'Corporate bookings jump the queue for faster driver assignment.' },
];

const CorporateSection: React.FC<CorporateSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/15">
              <img src={FEATURE_IMAGES.corporate} alt="Corporate logistics dashboard" className="w-full h-80 lg:h-[480px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061539]/60 to-transparent" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Monthly Savings</p>
              <p className="text-[#0A2463] text-3xl font-black">Up to 25%</p>
              <p className="text-gray-400 text-xs">vs individual bookings</p>
            </div>

            {/* Floating live badge */}
            <div className="absolute -top-4 -left-4 bg-[#0A2463] rounded-2xl shadow-xl px-5 py-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-white text-xs font-semibold">500+ active accounts</span>
            </div>
          </div>

          {/* Right: content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block text-[#0A2463] text-xs font-bold tracking-[0.2em] uppercase mb-5">For Business</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Enterprise logistics<br />
              <span className="text-[#D4AF37]">made simple</span>
            </h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
              Streamline your business deliveries with our corporate portal — from bulk bookings to detailed analytics.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {corpFeatures.map((f, idx) => (
                <div key={idx} className="group flex gap-3 p-4 rounded-2xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all">
                  <div className="w-9 h-9 bg-[#0A2463]/8 group-hover:bg-[#0A2463] rounded-xl flex items-center justify-center shrink-0 transition-colors">
                    <f.icon className="w-4 h-4 text-[#0A2463] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-0.5">{f.title}</p>
                    <p className="text-gray-400 text-xs leading-snug">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('corporate')}
              className="group inline-flex items-center gap-3 bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-8 py-4 rounded-2xl font-bold transition-all hover:shadow-xl hover:shadow-[#0A2463]/25 hover:-translate-y-0.5"
            >
              Open Corporate Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateSection;
