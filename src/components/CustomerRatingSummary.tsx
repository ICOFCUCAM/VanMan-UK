import React from 'react';
import { Star, Quote } from 'lucide-react';
import { SAMPLE_REVIEWS } from '@/lib/constants';

const CustomerRatingSummary: React.FC = () => {
  const featured = SAMPLE_REVIEWS.slice(0, 2);

  return (
    <section
      className="py-14"
      style={{ background: 'linear-gradient(180deg, #071A2F 0%, #0E2A47 100%)' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10">

          {/* Rating block */}
          <div className="shrink-0 text-center lg:text-left lg:pr-10 lg:border-r lg:border-white/[0.08]">
            <p className="text-[#F5B400] text-xs font-bold tracking-[0.2em] uppercase mb-3">Verified Reviews</p>
            <p className="text-6xl font-black text-white leading-none mb-2">4.9</p>
            <div className="flex gap-1 justify-center lg:justify-start mb-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className="w-4 h-4 text-[#F5B400] fill-[#F5B400]" />
              ))}
            </div>
            <p className="text-[#8FA9C4] text-xs">From 2,500+ verified reviews</p>
          </div>

          {/* Review cards */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {featured.map((review) => (
              <div
                key={review.id}
                className="flex-1 rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0px 10px 30px rgba(0,0,0,0.20)' }}
              >
                <Quote className="w-6 h-6 text-[#F5B400]/20 mb-3" />
                <p className="text-[#C9D8E8] text-sm leading-relaxed mb-4 line-clamp-3">{review.text}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#F5B400]/15 flex items-center justify-center text-[#F5B400] text-xs font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">{review.name}</p>
                      <p className="text-[#8FA9C4] text-[10px]">{review.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-[#F5B400] fill-[#F5B400]' : 'text-white/15'}`} />
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
