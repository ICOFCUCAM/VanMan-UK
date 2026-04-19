import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { SAMPLE_REVIEWS } from '@/lib/constants';

const ReviewsSection: React.FC = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const visibleCount = 3;

  const next = () => setCurrentReview((prev) => Math.min(prev + 1, SAMPLE_REVIEWS.length - visibleCount));
  const prev = () => setCurrentReview((prev) => Math.max(prev - 1, 0));

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-white/20'}`} />
      ))}
    </div>
  );

  return (
    <section className="py-14 bg-[#0A2463] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Aggregate rating header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">
          <div>
            <span className="inline-block text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">Customer Reviews</span>
            <div className="flex items-end gap-6">
              <div>
                <p className="text-6xl font-black text-white leading-none mb-2">4.9</p>
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-white/40 text-sm">From 2,500+ verified reviews</p>
              </div>
              <div className="hidden sm:block pb-1">
                <div className="space-y-1.5">
                  {[5,4,3].map((stars, i) => (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-white/40 text-xs w-2">{stars}</span>
                      <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: i === 0 ? '87%' : i === 1 ? '10%' : '3%' }} />
                      </div>
                      <span className="text-white/30 text-xs">{i === 0 ? '87%' : i === 1 ? '10%' : '3%'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white/80 max-w-xs">What our customers say about us</h2>
            <div className="flex gap-2 shrink-0">
              <button onClick={prev} disabled={currentReview === 0} className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 disabled:opacity-20 transition-all">
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button onClick={next} disabled={currentReview >= SAMPLE_REVIEWS.length - visibleCount} className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 disabled:opacity-20 transition-all">
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SAMPLE_REVIEWS.slice(currentReview, currentReview + visibleCount).map((review, idx) => (
            <div key={review.id} className="relative bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#D4AF37]/20 rounded-2xl p-6 transition-all duration-300">
              <Quote className="w-8 h-8 text-[#D4AF37]/20 mb-5" />
              <p className="text-white/70 leading-relaxed mb-6 text-sm">{review.text}</p>
              <div className="flex items-center justify-between pt-5 border-t border-white/8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{review.name}</p>
                    <p className="text-white/35 text-xs">{review.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  {renderStars(review.rating)}
                  <p className="text-white/25 text-xs mt-1">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile nav */}
        <div className="flex sm:hidden justify-center gap-2 mt-8">
          <button onClick={prev} disabled={currentReview === 0} className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center disabled:opacity-20">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button onClick={next} disabled={currentReview >= SAMPLE_REVIEWS.length - visibleCount} className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center disabled:opacity-20">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
