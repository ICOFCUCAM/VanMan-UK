import React from 'react';
import { Home, Building2, Sofa, GraduationCap, Package, Clock, Truck, ArrowRight, CheckCircle } from 'lucide-react';
import { FEATURE_IMAGES } from '@/lib/constants';

const services = [
  { icon: Home, title: 'House Moving', desc: 'Full house moves with professional drivers and optional helpers. From studio flats to 5-bed homes.', tag: 'Most Popular' },
  { icon: Building2, title: 'Office Relocation', desc: 'Efficient office moves with minimal downtime. IT equipment, furniture, and document transport.', tag: null },
  { icon: Sofa, title: 'Furniture Delivery', desc: 'Single item or multiple pieces delivered safely with blanket wrapping and care.', tag: null },
  { icon: GraduationCap, title: 'Student Moves', desc: 'Affordable student moving with 10% discount. Perfect for term-time relocations.', tag: '10% Off' },
  { icon: Package, title: 'Same Day Delivery', desc: 'Urgent deliveries within hours. AI dispatch finds the nearest available driver instantly.', tag: 'Express' },
  { icon: Clock, title: 'Scheduled Transport', desc: 'Book in advance for planned moves. Set your preferred date, time, and vehicle type.', tag: null },
];

const vehicles = [
  { name: 'Small Van', capacity: 'Up to 2 items', price: 'From £50', detail: 'Perfect for single items or small moves' },
  { name: 'Medium Van', capacity: '3–8 items', price: 'From £70', detail: 'Ideal for apartment moves' },
  { name: 'Large Van', capacity: '9–20 items', price: 'From £100', detail: 'Full house moves and large deliveries' },
  { name: 'Luton Van', capacity: '20+ items', price: 'From £130', detail: 'Maximum capacity for big moves' },
];

const ServicesSection: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#0A2463] text-xs font-bold tracking-[0.2em] uppercase mb-4">Our Services</span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-5">Transport solutions<br />for every need</h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">From single item deliveries to full house moves, our platform connects you with the right driver and vehicle for any job.</p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {services.map((s, idx) => (
            <div key={idx} className="group relative bg-white rounded-2xl p-7 border border-gray-100 hover:border-[#0A2463]/15 hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-300 hover:-translate-y-1">
              {s.tag && (
                <span className="absolute top-5 right-5 text-xs font-bold px-2.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#8B6914]">{s.tag}</span>
              )}
              <div className="w-12 h-12 bg-[#0A2463]/6 group-hover:bg-[#0A2463] rounded-xl flex items-center justify-center mb-5 transition-colors">
                <s.icon className="w-6 h-6 text-[#0A2463] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{s.desc}</p>
              <div className="flex items-center gap-1 text-[#0A2463] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Vehicle types — dark premium section */}
        <div className="relative rounded-3xl overflow-hidden">
          <img src={FEATURE_IMAGES.vanLoaded} alt="Van fleet" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061539]/98 via-[#0A2463]/90 to-[#0A2463]/50" />

          <div className="relative p-8 sm:p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">Our Fleet</span>
                <h3 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">Every vehicle type<br />available, right now</h3>
                <p className="text-white/55 leading-relaxed mb-8">From compact vans for single items to full Luton trucks for house moves. Our AI matches you with the right vehicle every time.</p>
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  All vehicles are verified and insured
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vehicles.map((v, idx) => (
                  <div key={idx} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/30 rounded-2xl p-5 transition-all cursor-default">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-white font-bold text-sm">{v.name}</span>
                    </div>
                    <p className="text-white/45 text-xs mb-3 leading-snug">{v.detail}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-xs">{v.capacity}</span>
                      <span className="text-[#D4AF37] font-bold text-sm">{v.price}</span>
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
