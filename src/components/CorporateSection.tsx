import React from 'react';
import { Building2, BarChart3, Users, FileText, Repeat, ArrowRight, CheckCircle } from 'lucide-react';
import { FEATURE_IMAGES } from '@/lib/constants';

interface CorporateSectionProps {
  onNavigate: (page: string) => void;
}

const corpFeatures = [
  { icon: Building2, title: 'Bulk Bookings', desc: 'Schedule hundreds of deliveries at once with CSV upload or API integration.' },
  { icon: Repeat, title: 'Recurring Deliveries', desc: 'Set up automated recurring schedules for regular delivery routes.' },
  { icon: FileText, title: 'Monthly Invoicing', desc: 'Consolidated monthly invoices with detailed breakdowns for easy accounting.' },
  { icon: Users, title: 'Multi-User Access', desc: 'Add team members with role-based permissions and spending limits.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time delivery analytics, cost reports, and performance metrics.' },
  { icon: CheckCircle, title: 'Priority Dispatch', desc: 'Corporate bookings receive priority driver assignment for faster service.' },
];

const CorporateSection: React.FC<CorporateSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-[#0A2463]/10 text-[#0A2463] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">FOR BUSINESS</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Enterprise Logistics <span className="text-[#D4AF37]">Made Simple</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Streamline your business deliveries with our corporate portal. From bulk bookings to detailed analytics, we provide the tools your logistics team needs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {corpFeatures.map((f, idx) => (
                <div key={idx} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-[#0A2463]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-[#0A2463]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('corporate')}
              className="group flex items-center gap-2 bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-xl"
            >
              Open Corporate Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative">
            <img src={FEATURE_IMAGES.corporate} alt="Corporate logistics" className="rounded-2xl shadow-2xl w-full" />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Monthly Savings</p>
              <p className="text-[#0A2463] text-3xl font-bold">Up to 25%</p>
              <p className="text-gray-400 text-sm">vs individual bookings</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateSection;
