import React from 'react';
import { Home, Building2, Sofa, GraduationCap, Package, Clock, Truck, ArrowRight, CheckCircle } from 'lucide-react';
import { SERVICE_IMAGES, FEATURE_IMAGES } from '@/lib/constants';

const services = [
  {
    icon: Home,
    title: 'House Moving',
    desc: 'Full house moves from studio flats to 5-bed homes, with professional drivers and optional helpers.',
    tag: 'Most Popular',
    tagStyle: 'bg-[#F5B400] text-[#071A2F]',
    image: SERVICE_IMAGES.houseMoving,
    alt: 'House moving service',
  },
  {
    icon: Building2,
    title: 'Office Relocation',
    desc: 'Efficient office moves with minimal downtime — IT equipment, furniture, and document transport.',
    tag: null,
    tagStyle: '',
    image: SERVICE_IMAGES.officeRelocation,
    alt: 'Office relocation service',
  },
  {
    icon: Sofa,
    title: 'Furniture Delivery',
    desc: 'Single items or multiple pieces delivered safely with blanket wrapping and extra care.',
    tag: null,
    tagStyle: '',
    image: SERVICE_IMAGES.furnitureDelivery,
    alt: 'Furniture delivery service',
  },
  {
    icon: GraduationCap,
    title: 'Student Moves',
    desc: 'Affordable student moving with a 10% discount automatically applied to every booking.',
    tag: '10% Off',
    tagStyle: 'bg-purple-600 text-white',
    image: SERVICE_IMAGES.studentMoves,
    alt: 'Student moving service',
  },
  {
    icon: Package,
    title: 'Same Day Delivery',
    desc: 'Urgent deliveries within hours. AI dispatch finds the nearest available driver instantly.',
    tag: 'Express',
    tagStyle: 'bg-orange-500 text-white',
    image: SERVICE_IMAGES.sameDayDelivery,
    alt: 'Same day delivery service',
  },
  {
    icon: Clock,
    title: 'Scheduled Transport',
    desc: 'Book in advance for planned moves. Set your preferred date, time, and vehicle type.',
    tag: null,
    tagStyle: '',
    image: SERVICE_IMAGES.scheduled,
    alt: 'Scheduled transport service',
  },
];

const vehicles = [
  { name: 'Small Van',  capacity: 'Up to 2 items', price: 'From £50',  detail: 'Perfect for single items or small moves' },
  { name: 'Medium Van', capacity: '3–8 items',     price: 'From £70',  detail: 'Ideal for apartment moves' },
  { name: 'Large Van',  capacity: '9–20 items',    price: 'From £100', detail: 'Full house moves and large deliveries' },
  { name: 'Luton Van',  capacity: '20+ items',     price: 'From £130', detail: 'Maximum capacity for big moves' },
];

const ServicesSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-[#0E2A47] text-xs font-bold tracking-[0.2em] uppercase mb-3">Our Services</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            Transport solutions for every need
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            From single item deliveries to full house moves — we connect you with the right driver for any job.
          </p>
        </div>

        {/* Service cards — image top layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {services.map((s, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-200/60 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-[190px] shrink-0">
                <img
                  src={s.image}
                  alt={s.alt}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.background = 'linear-gradient(135deg, #0E2A47 0%, #0F3558 100%)';
                    }
                  }}
                />
                {/* Tag badge */}
                {s.tag && (
                  <span className={`absolute top-3 left-3 text-xs font-black px-3 py-1.5 rounded-full shadow-sm ${s.tagStyle}`}>
                    {s.tag}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5">
                {/* Icon + title */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-[#0E2A47]/8 group-hover:bg-[#0E2A47] rounded-xl flex items-center justify-center shrink-0 transition-colors">
                    <s.icon className="w-4 h-4 text-[#0E2A47] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900">{s.title}</h3>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5">{s.desc}</p>

                {/* CTA */}
                <div className="flex items-center gap-1.5 text-[#0E2A47] text-sm font-bold group-hover:gap-3 transition-all">
                  Book now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vehicle fleet — dark banner */}
        <div className="relative rounded-3xl overflow-hidden">
          <img src={FEATURE_IMAGES.vanLoaded} alt="Van fleet" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A2F]/98 via-[#0E2A47]/90 to-[#0E2A47]/50" />

          <div className="relative p-8 sm:p-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-[#F5B400] text-xs font-bold tracking-[0.2em] uppercase mb-4">Our Fleet</span>
                <h3 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
                  Every vehicle type<br />available, right now
                </h3>
                <p className="text-white/55 leading-relaxed mb-8">
                  From compact vans for single items to full Luton trucks for house moves. Our AI matches you with the right vehicle every time.
                </p>
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  All vehicles are verified and insured
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vehicles.map((v, idx) => (
                  <div key={idx} className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F5B400]/30 rounded-2xl p-5 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="w-4 h-4 text-[#F5B400]" />
                      <span className="text-white font-bold text-sm">{v.name}</span>
                    </div>
                    <p className="text-white/45 text-xs mb-3 leading-snug">{v.detail}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-xs">{v.capacity}</span>
                      <span className="text-[#F5B400] font-bold text-sm">{v.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
