import React from 'react';
import { MessageCircle, ShieldCheck, Truck, Sparkles, MapPin, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onBookVisitClick: () => void;
  heading?: string;
  headingUrdu?: string;
  subtitle?: string;
  heroImage?: string;
  whatsappNumber?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onBookVisitClick,
  heading = 'Welcome to Bird Zone, Wapda Town',
  headingUrdu = 'خوش آمدید · برڈ زون',
  subtitle = 'Lahore’s premier avian boutique and pet supplies specialist. Discover healthy exotic birds, spacious flight aviaries, imported nutritional feed, and handcrafted toys with same-day Wapda Town delivery and WhatsApp ordering.',
  heroImage = '/src/assets/images/hero_colorful_parrot_1790931293239.jpg',
  whatsappNumber = '923001234567',
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F7F2] via-white to-[#FAFAF8] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-stone-200">
      {/* Decorative nature accents */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#4CAF50]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#FF9800]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Unboxed inline metadata kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#2E7D32] mb-3">
              <span>{headingUrdu}</span>
              <span aria-hidden="true">·</span>
              <span>Wapda Town, Lahore</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#FF9800]">Hand-Reared & Vet-Certified</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] text-balance font-['Montserrat']">
              {heading}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
              {subtitle}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#4CAF50] text-white font-semibold text-sm hover:bg-[#43A047] transition-all duration-200 shadow-sm hover:shadow active:scale-98 whitespace-nowrap cursor-pointer"
              >
                <span>View Birds & Supplies</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${whatsappNumber}?text=Assalam-o-Alaikum%20Bird%20Zone%20Wapda%20Town!%20I%20am%20interested%20in%20ordering%20birds%20and%20supplies.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20ba59] transition-all duration-200 shadow-sm hover:shadow active:scale-98 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order via WhatsApp</span>
              </a>

              <button
                onClick={onBookVisitClick}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-stone-300 text-stone-700 bg-white font-semibold text-sm hover:bg-stone-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#4CAF50]" />
                <span>Visit Wapda Town Shop</span>
              </button>
            </div>

            {/* Trust and logistics guarantee items */}
            <div className="mt-10 pt-6 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-stone-600 text-xs">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#4CAF50] shrink-0" />
                <div>
                  <span className="font-semibold text-stone-800 block">Fast Wapda Town Delivery</span>
                  <span className="text-stone-500">Under 2 hours or safe pickup</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#FF9800] shrink-0" />
                <div>
                  <span className="font-semibold text-stone-800 block">100% Avian Health Check</span>
                  <span className="text-stone-500">Dewormed & vet-cleared</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#4CAF50] shrink-0" />
                <div>
                  <span className="font-semibold text-stone-800 block">Cash on Delivery & Wallets</span>
                  <span className="text-stone-500">JazzCash · Easypaisa · COD</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-xl overflow-hidden shadow-xl border border-stone-200 bg-white">
              <img
                src="/src/assets/images/hero_colorful_parrot_1790931293239.jpg"
                alt="Colorful exotic parrot and parakeet at Bird Zone Wapda Town Lahore"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {/* Bottom gradient overlay for caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-[#FFC107]">Exotic Aviary Collection</p>
                    <h3 className="text-lg font-bold">Hand-Reared Parrots & Cockatiels</h3>
                    <p className="text-xs text-stone-200 mt-0.5">Commercial Area, Phase 1, Wapda Town, Lahore</p>
                  </div>
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded text-xs font-medium">
                    Open 10 AM – 11 PM
                  </span>
                </div>
              </div>
            </div>

            {/* Floating verification badge */}
            <div className="absolute -bottom-4 -left-4 sm:left-4 bg-white/95 backdrop-blur-md border border-stone-200 rounded-lg p-3 shadow-lg flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#4CAF50]/20 flex items-center justify-center text-[#4CAF50] font-bold text-sm">
                4.9★
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-stone-800">Lahore’s Trusted Bird Hub</p>
                <p className="text-stone-500">Over 500+ Happy Avian Adoptions</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
