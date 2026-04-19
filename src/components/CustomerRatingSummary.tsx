import React from 'react';
import { Star, Quote } from 'lucide-react';
import { SAMPLE_REVIEWS } from '@/lib/constants';

const CustomerRatingSummary: React.FC = () => {
  const featured = SAMPLE_REVIEWS.slice(0, 2);

  return (
    <section className="py-14 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10">

          {/* Rating block */}
          <div className="shrink-0 text-center lg:text-left lg:pr-10 lg:border-r lg:border-gray-100">
            <p className="text-[#0E2A47] text-xs font-bold tracking-[0.2em] uppercase mb-3">Verified Reviews</p>
            <p className="text-6xl font-black text-[#0B2239] leading-none mb-2">4.9</p>
            <div className="flex gap-1 justify-center lg:justify-start mb-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className="w-4 h-4 text-[#F5B400] fill-[#F5B400]" />
              ))}
            </div>
            <p className="text-gray-400 text-xs">From platform-verified reviews</p>
          </div>

          {/* Review cards */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {featured.map((review) => (
              <div
                key={review.id}
                className="flex-1 bg-white rounded-2xl p-5 border border-gray-100"
                style={{ boxShadow: '0px 10px 30px rgba(0,0,0,0.07)' }}
              >
                <Quote className="w-6 h-6 text-[#0E2A47]/12 mb-3" />
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{review.text}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#0E2A47]/8 flex items-center justify-center text-[#0E2A47] text-xs font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[#0B2239] text-xs font-semibold">{review.name}</p>
                      <p className="text-gray-400 text-[10px]">{review.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-[#F5B400] fill-[#F5B400]' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CustomerRatingSummary;
