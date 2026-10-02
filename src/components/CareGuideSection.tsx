import React, { useState } from 'react';
import { CARE_GUIDES } from '../data/products';
import { CareGuide } from '../types';
import { BookOpen, ChevronRight, Sparkles, HeartPulse, ThermometerSnowflake, Feather } from 'lucide-react';

export const CareGuideSection: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<CareGuide>(CARE_GUIDES[0]);

  const getGuideIcon = (index: number) => {
    switch (index) {
      case 0:
        return <HeartPulse className="w-5 h-5 text-[#4CAF50]" />;
      case 1:
        return <ThermometerSnowflake className="w-5 h-5 text-[#FF9800]" />;
      default:
        return <Feather className="w-5 h-5 text-[#2E7D32]" />;
    }
  };

  return (
    <section id="care-guides" className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4CAF50] uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Avian Health & Care Knowledge · پرندوں کی دیکھ بھال</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Montserrat'] tracking-tight">
            Expert Bird Care Tips & Nutrition
          </h2>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed">
            Written by our Wapda Town avian specialists. Practical advice tailored to Lahore’s seasonal climate, parrot psychology, and healthy breeding practices.
          </p>
        </div>

        {/* 2-Column Interactive Guide Reader */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Guide Selector List */}
          <div className="lg:col-span-5 space-y-3">
            {CARE_GUIDES.map((guide, idx) => {
              const isSelected = selectedGuide.id === guide.id;
              return (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#4CAF50] shadow-md ring-1 ring-[#4CAF50]'
                      : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 rounded-md bg-stone-100 shrink-0">
                        {getGuideIcon(idx)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1">
                          <span className="font-semibold text-stone-700">{guide.category}</span>
                          <span>·</span>
                          <span>{guide.readTime}</span>
                        </div>
                        <h3 className="font-bold text-stone-900 text-sm font-['Montserrat'] leading-snug">
                          {guide.title}
                        </h3>
                        <p className="text-xs text-stone-500 font-sans mt-0.5" dir="rtl">
                          {guide.titleUrdu}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 mt-1 transition-transform ${
                        isSelected ? 'text-[#4CAF50] translate-x-1' : 'text-stone-300'
                      }`}
                    />
                  </div>
                </div>
              );
            })}

            {/* In-store advice callout */}
            <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#4CAF50]" />
                <span>Need Personalized Guidance?</span>
              </span>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Bring your bird to our Wapda Town branch for free dietary assessments and non-invasive health checks by appointment.
              </p>
            </div>
          </div>

          {/* Guide Detail Display */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <span className="text-xs font-semibold text-[#4CAF50] tracking-wide uppercase">
                {selectedGuide.category}
              </span>
              <span className="text-xs text-stone-400 font-mono">{selectedGuide.readTime}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Montserrat'] mt-3 leading-snug">
              {selectedGuide.title}
            </h3>

            <p className="text-sm text-stone-500 font-sans mt-1" dir="rtl">
              {selectedGuide.titleUrdu}
            </p>

            <div className="my-5 p-3.5 bg-stone-50 border-l-3 border-[#FF9800] rounded-r text-xs text-stone-700 leading-relaxed italic">
              "{selectedGuide.summary}"
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-stone-600 leading-relaxed">
              {selectedGuide.content.map((paragraph, index) => (
                <p key={index} className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#4CAF50] mt-0.5">0{index + 1}.</span>
                  <span>{paragraph}</span>
                </p>
              ))}
            </div>

            <div className="mt-8 pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-stone-500">
                Have questions regarding your bird's symptoms?
              </span>
              <a
                href="https://wa.me/923001234567?text=Assalam-o-Alaikum%20Bird%20Zone!%20I%20have%20a%20question%20regarding%20bird%20care."
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#25D366] hover:underline"
              >
                Ask our Avian Specialist on WhatsApp &rarr;
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
