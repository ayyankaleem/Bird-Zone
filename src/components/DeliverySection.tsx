import React from 'react';
import { DELIVERY_ZONES } from '../data/products';
import { Truck, MapPin, Clock, Banknote, ShieldAlert, Check } from 'lucide-react';

export const DeliverySection: React.FC = () => {
  return (
    <section id="delivery" className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4CAF50] uppercase tracking-wider mb-2">
            <Truck className="w-4 h-4" />
            <span>Local Lahore Shipping Logistics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Montserrat'] tracking-tight">
            Transparent Delivery Zones & COD Rules
          </h2>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed">
            We deliver birds and supplies directly to your doorstep in Lahore with climate-safe transport. In accordance with Pakistan retail conventions, 95% of orders are delivered via Cash on Delivery.
          </p>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DELIVERY_ZONES.map((zone, idx) => (
            <div
              key={zone.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all duration-200 ${
                idx === 0
                  ? 'border-[#4CAF50] bg-[#4CAF50]/5 ring-1 ring-[#4CAF50]'
                  : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300'
              }`}
            >
              <div>
                {/* Zone Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-[#4CAF50] uppercase tracking-wider">
                    Zone 0{idx + 1}
                  </span>
                  {idx === 0 && (
                    <span className="text-[10px] font-bold bg-[#4CAF50] text-white px-2 py-0.5 rounded">
                      Local Hub
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-stone-900 text-base font-['Montserrat']">
                  {zone.name}
                </h3>
                <p className="text-xs text-stone-500 font-sans mt-0.5" dir="rtl">
                  {zone.nameUrdu}
                </p>

                {/* Rate & Threshold */}
                <div className="my-4 pb-3 border-b border-stone-200/80">
                  <span className="text-2xl font-black text-[#FF9800] font-mono tabular-nums">
                    PKR {zone.rate.toLocaleString()}
                  </span>
                  {zone.freeDeliveryThreshold ? (
                    <div className="text-[11px] text-[#2E7D32] font-semibold mt-0.5 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Free on orders &gt; PKR {zone.freeDeliveryThreshold.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-stone-500 mt-0.5">Standard courier rate</div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  {zone.description}
                </p>
              </div>

              {/* ETA footer */}
              <div className="pt-3 border-t border-stone-200/80 flex items-center gap-1.5 text-xs font-medium text-stone-700">
                <Clock className="w-3.5 h-3.5 text-[#4CAF50] shrink-0" />
                <span>{zone.eta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Bird Safety Notice */}
        <div className="mt-8 p-4 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Live Avian Safety Policy:</span>
              <span>
                Live birds are transported in well-ventilated, padded travel crates via dedicated local riders in Lahore. For buyers outside Lahore, we strongly recommend in-store pickup or pre-arranged climate-controlled express vehicle transit to ensure zero bird stress.
              </span>
            </div>
          </div>
          <a
            href="https://wa.me/923001234567?text=Assalam-o-Alaikum%20Bird%20Zone!%20I%20have%20a%20question%20about%20live%20bird%20shipping."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-bold text-amber-800 hover:text-amber-950 underline"
          >
            Inquire on WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
};
