import React from 'react';
import { Home, Building2, Sofa, GraduationCap, Package, Clock, Truck, ArrowRight } from 'lucide-react';
import { FEATURE_IMAGES } from '@/lib/constants';

const services = [
  { icon: Home, title: 'House Moving', desc: 'Full house moves with professional drivers and optional helpers. From studio flats to 5-bedroom homes.', color: 'bg-blue-500' },
  { icon: Building2, title: 'Office Relocation', desc: 'Efficient office moves with minimal downtime. IT equipment, furniture, and document transport.', color: 'bg-purple-500' },
  { icon: Sofa, title: 'Furniture Delivery', desc: 'Single item or multiple furniture pieces delivered safely with blanket wrapping and care.', color: 'bg-green-500' },
  { icon: GraduationCap, title: 'Student Moves', desc: 'Affordable student moving service with 10% discount. Perfect for term-time relocations.', color: 'bg-pink-500' },
  { icon: Package, title: 'Same Day Delivery', desc: 'Urgent deliveries within hours. Our AI dispatch finds the nearest available driver instantly.', color: 'bg-orange-500' },
  { icon: Clock, title: 'Scheduled Transport', desc: 'Book in advance for planned moves. Set your preferred date, time, and vehicle type.', color: 'bg-teal-500' },
];

const ServicesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-[#0A2463]/10 text-[#0A2463] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">OUR SERVICES</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Transport Solutions for Every Need</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">From single item deliveries to full house moves, our platform connects you with the right driver and vehicle for any job.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((s, idx) => (
            <div key={idx} className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#0A2463]/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`w-14 h-14 ${s.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{s.desc}</p>
              <button className="flex items-center gap-1 text-[#0A2463] text-sm font-semibold group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Van loaded image section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gray-50 rounded-2xl overflow-hidden">
          <img src={FEATURE_IMAGES.vanLoaded} alt="Van loaded with goods" className="w-full h-72 lg:h-full object-cover" />
          <div className="p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Every Vehicle Type Available</h3>
            <p className="text-gray-600 mb-6">From compact vans for single items to Luton trucks for full house moves, we have the right vehicle for your needs.</p>
            <div className="grid grid-cols-2 gap-3">
              {['Small Van', 'Medium Van', 'Large Van', 'Luton Van'].map((v, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
                  <Truck className="w-5 h-5 text-[#0A2463]" />
                  <span className="text-sm font-medium text-gray-700">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
