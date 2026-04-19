import React from 'react';
import { ArrowRight, BarChart3, Repeat, FileText } from 'lucide-react';
import { FEATURE_IMAGES } from '@/lib/constants';

interface EnterprisePreviewProps {
  onNavigate: (page: string) => void;
}

const highlights = [
  { icon: BarChart3, text: 'Real-time analytics dashboard' },
  { icon: Repeat,    text: 'Automated recurring schedules' },
  { icon: FileText,  text: 'Consolidated monthly invoicing' },
];

const EnterprisePreview: React.FC<EnterprisePreviewProps> = ({ onNavigate }) => (
  <section className="py-14 border-t border-gray-100" style={{ background: '#F8FAFC' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-gray-900/8 order-2 lg:order-1">
          <img
            src={FEATURE_IMAGES.corporate}
            alt="Enterprise logistics"
            className="w-full h-56 lg:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F]/50 to-transparent" />
          <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-2.5">
            <p className="text-[#0B2239] text-2xl font-black leading-none">25%</p>
            <p className="text-gray-400 text-xs mt-0.5">volume discount</p>
          </div>
        </div>

        {/* Content */}
        <div className="order-1 lg:order-2">
          <span className="text-[#0E2A47] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">Enterprise</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2239] mb-3 leading-tight">
            Logistics infrastructure<br />for modern business
          </h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Corporate portal with bulk bookings, team access controls, and consolidated invoicing — built for operations at scale.
          </p>

          <div className="space-y-3 mb-6">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#0E2A47]/8 rounded-lg flex items-center justify-center shrink-0">
                  <h.icon className="w-4 h-4 text-[#0E2A47]" />
                </div>
                <span className="text-gray-700 text-sm font-medium">{h.text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('enterprise')}
            className="group inline-flex items-center gap-2.5 bg-[#0E2A47] hover:bg-[#0F3558] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0E2A47]/20"
          >
            Explore Enterprise
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  </section>
);

export default EnterprisePreview;
