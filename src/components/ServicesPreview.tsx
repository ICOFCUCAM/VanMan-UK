import React from 'react';
import { ArrowRight, Home, Package, Building2, GraduationCap, Sofa, CalendarDays } from 'lucide-react';
import { SERVICE_IMAGES } from '@/lib/constants';

interface ServicesPreviewProps {
  onNavigate: (page: string) => void;
}

const SERVICES = [
  {
    icon: Building2,
    title: 'Office Relocation',
    desc: 'Efficient office moves with minimal downtime. Weekend and out-of-hours available.',
    tag: null,
    tagStyle: '',
    image: SERVICE_IMAGES.officeRelocation,
  },
  {
    icon: Home,
    title: 'House Moving',
    desc: 'Full house moves from studio flats to 5-bed homes. Careful, insured, stress-free.',
    tag: 'Most Popular',
    tagStyle: 'bg-[#F5B400] text-[#0B2239]',
    image: SERVICE_IMAGES.houseMoving,
  },
  {
    icon: GraduationCap,
    title: 'Student Moves',
    desc: 'Affordable moves for students. Halls, shared houses, and storage — 10% discount applied.',
    tag: '10% Off',
    tagStyle: 'bg-[#0E2A47] text-white',
    image: SERVICE_IMAGES.studentMoves,
  },
  {
    icon: Sofa,
    title: 'Furniture Delivery',
    desc: 'Single-item deliveries and flat-pack assembly. Perfect for marketplace and retailer purchases.',
    tag: null,
    tagStyle: '',
    image: SERVICE_IMAGES.furnitureDelivery,
  },
  {
    icon: Package,
    title: 'Same Day Delivery',
    desc: 'Urgent parcel and furniture deliveries within hours. Express dispatch guaranteed.',
    tag: 'Express',
    tagStyle: 'bg-orange-500 text-white',
    image: SERVICE_IMAGES.sameDayDelivery,
  },
  {
    icon: CalendarDays,
    title: 'Scheduled Deliveries',
    desc: 'Plan ahead with scheduled slots. Ideal for businesses and regular delivery runs.',
    tag: 'Business',
    tagStyle: 'bg-[#0E2A47] text-white',
    image: SERVICE_IMAGES.scheduled,
  },
];

const ServicesPreview: React.FC<ServicesPreviewProps> = ({ onNavigate }) => (
  <section className="py-16 bg-[#F7FAFC]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <span className="text-[#0E2A47] text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Our Services</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2239]">Core transport services</h2>
        </div>
        <button
          onClick={() => onNavigate('services')}
          className="flex items-center gap-2 text-[#0E2A47] text-sm font-semibold hover:gap-3 transition-all shrink-0"
        >
          View all services
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map((s, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate('services')}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100/80 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-left"
          >
            <div className="relative overflow-hidden h-[180px]">
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={e => {
                  const t = e.currentTarget;
                  t.style.display = 'none';
                  const p = t.parentElement;
                  if (p) p.style.background = 'linear-gradient(135deg, #071A2F 0%, #0F3558 100%)';
                }}
              />
              {s.tag && (
                <span className={`absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-full ${s.tagStyle}`}>
                  {s.tag}
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 bg-[#0E2A47]/8 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#0E2A47] transition-colors">
                  <s.icon className="w-3.5 h-3.5 text-[#0E2A47] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-[#0B2239] text-sm">{s.title}</h3>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-3">{s.desc}</p>
              <div className="flex items-center gap-1.5 text-[#F5B400] text-xs font-bold">
                View details
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </button>
        ))}
      </div>

    </div>
  </section>
);

export default ServicesPreview;
