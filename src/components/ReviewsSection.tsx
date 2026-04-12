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
        <Star key={s} className={`w-4 h-4 ${s <= rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-block bg-[#0A2463]/10 text-[#0A2463] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">REVIEWS</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What Our Customers Say</h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button onClick={prev} disabled={currentReview === 0} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#0A2463] disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={next} disabled={currentReview >= SAMPLE_REVIEWS.length - visibleCount} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#0A2463] disabled:opacity-30 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_REVIEWS.slice(currentReview, currentReview + visibleCount).map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Quote className="w-8 h-8 text-[#D4AF37]/30 mb-4" />
              <p className="text-gray-700 leading-relaxed mb-4">{review.text}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  <p className="text-gray-500 text-sm">{review.location}</p>
                </div>
                <div className="text-right">
                  {renderStars(review.rating)}
                  <p className="text-gray-400 text-xs mt-1">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile nav */}
        <div className="flex sm:hidden justify-center gap-2 mt-6">
          <button onClick={prev} disabled={currentReview === 0} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center disabled:opacity-30">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} disabled={currentReview >= SAMPLE_REVIEWS.length - visibleCount} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center disabled:opacity-30">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
