import React from 'react';
import { ArrowRight } from 'lucide-react';

interface MovingToolsSectionProps {
  onNavigate: (page: string) => void;
}

const TOOLS = [
  {
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    title: 'Van Size Calculator',
    desc: 'Not sure which van you need? Add your items and get an instant recommendation matched to your exact load.',
    cta: 'Find your van size',
    page: 'van-guide',
    badge: 'Interactive',
    color: 'bg-[#0E2A47]',
  },
  {
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    title: 'Moving House Checklist',
    desc: 'Track every task from 6 weeks out to moving day with our interactive UK moving checklist.',
    cta: 'Start your checklist',
    page: 'moving-checklist',
    badge: 'Free tool',
    color: 'bg-[#F5B400]',
  },
  {
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    title: 'Instant Price Guide',
    desc: 'Understand what drives your quote — distance, load size, helpers, timing. No surprises on the day.',
    cta: 'View price guide',
    page: 'services',
    badge: 'Guide',
    color: 'bg-purple-600',
  },
];

const MovingToolsSection: React.FC<MovingToolsSectionProps> = ({ onNavigate }) => (
  <section className="py-20 bg-white border-t border-[#EEF2F7]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#0E2A47]/8 text-[#0E2A47] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          Free Moving Tools
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#0B2239] mb-4">Plan your move with confidence</h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-base">Everything you need to plan, prepare, and execute a stress-free move across the UK.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {TOOLS.map(tool => (
          <div key={tool.title} className="group relative bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-[#0E2A47]/20 hover:shadow-xl transition-all duration-300">
            <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mb-5`}>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tool.icon} />
              </svg>
            </div>
            <span className="absolute top-5 right-5 text-xs font-semibold bg-white border border-gray-200 text-gray-500 px-2.5 py-1 rounded-full">{tool.badge}</span>
            <h3 className="text-lg font-black text-[#0B2239] mb-2">{tool.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">{tool.desc}</p>
            <button
              onClick={() => onNavigate(tool.page)}
              className="flex items-center gap-2 text-sm font-semibold text-[#0E2A47] group-hover:gap-3 transition-all"
            >
              {tool.cta}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default MovingToolsSection;
