import React from 'react';
import { REVIEWS } from '../data/products';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4CAF50] uppercase tracking-wider mb-2">
              <MessageSquare className="w-4 h-4" />
              <span>Customer Feedback · گاہکوں کی آراء</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Montserrat'] tracking-tight">
              Loved by Bird Lovers in Lahore
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Real testimonials from bird parents across Wapda Town, DHA, and Johar Town.
            </p>
          </div>

          {/* Rating Summary Card */}
          <div className="flex items-center gap-4 bg-white p-3.5 rounded-lg border border-stone-200 shadow-xs shrink-0">
            <div className="text-center pr-3 border-r border-stone-200">
              <span className="text-2xl font-black text-stone-900 font-mono">4.9</span>
              <div className="flex text-amber-400 text-xs mt-0.5">
                {'★'.repeat(5)}
              </div>
            </div>
            <div className="text-xs text-stone-500">
              <span className="font-bold text-stone-800 block">500+ Happy Adoptions</span>
              <span>Based on Lahore store & web orders</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors"
            >
              <div>
                {/* Stars and Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">{rev.date}</span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-stone-700 leading-relaxed italic mb-4">
                  "{rev.text}"
                </p>
              </div>

              {/* Author and Item Info */}
              <div className="pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900">{rev.author}</span>
                  {rev.verifiedBuyer && (
                    <span className="flex items-center gap-1 text-[10px] text-[#2E7D32] font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">{rev.location}</div>
                <div className="text-[10px] text-stone-400 mt-1 truncate">
                  Purchased: <span className="text-stone-600 font-medium">{rev.itemPurchased}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
