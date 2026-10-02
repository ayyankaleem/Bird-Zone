import React from 'react';
import { MapPin, Clock, Phone, Mail, Navigation, MessageCircle, Calendar } from 'lucide-react';

interface StoreLocationSectionProps {
  onBookVisit: () => void;
}

export const StoreLocationSection: React.FC<StoreLocationSectionProps> = ({ onBookVisit }) => {
  return (
    <section id="location" className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Store Details */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4CAF50] uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" />
              <span>Physical Store & Aviary · ہمارا پتہ</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Montserrat'] tracking-tight">
              Visit Bird Zone Wapda Town
            </h2>

            <p className="mt-3 text-sm text-stone-600 leading-relaxed">
              Step into our sanitized, air-filtered showroom to meet hand-tamed exotic birds in person, inspect aviary setups, or consult with our avian dietitians.
            </p>

            {/* Key Information Cards */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <MapPin className="w-5 h-5 text-[#4CAF50] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-stone-900">Address</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Shop #4, Main Commercial Boulevard, Phase 1, Wapda Town, Lahore, Punjab, 54770, Pakistan.
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">Landmark: 2 minutes from Wapda Town Roundabout, near Khayaban-e-Jinnah</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <Clock className="w-5 h-5 text-[#FF9800] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-stone-900">Visiting Hours</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Monday to Sunday: <span className="font-semibold text-stone-800">10:00 AM – 11:00 PM</span> (Open 7 Days)
                  </p>
                  <p className="text-[11px] text-[#2E7D32] mt-0.5 font-medium">Friday timings: Open 10:00 AM – 1:00 PM & 2:30 PM – 11:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <Phone className="w-5 h-5 text-[#4CAF50] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-stone-900">Direct Phone & WhatsApp</h4>
                  <p className="text-xs text-stone-600 mt-0.5 font-mono">
                    +92 300 1234567 / 042-35189000
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Prompt assistance for availability and bird health queries</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={onBookVisit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#4CAF50] hover:bg-[#43A047] text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book In-Store Visit</span>
              </button>

              <a
                href="https://wa.me/923001234567?text=Assalam-o-Alaikum%20Bird%20Zone!%20Can%20you%20please%20share%20your%20exact%20Google%20Maps%20location%20pin?"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Get Google Maps Pin</span>
              </a>
            </div>

          </div>

          {/* Right Column: Visual Map Representation */}
          <div className="lg:col-span-6">
            <div className="relative rounded-xl overflow-hidden border border-stone-200 shadow-md bg-stone-100 p-6">
              
              {/* Styled interactive map graphic representation */}
              <div className="bg-stone-800 text-white rounded-lg p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4CAF50_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-700">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-[#4CAF50] animate-pulse" />
                      <span className="font-bold text-sm tracking-wide font-['Montserrat']">
                        Wapda Town Phase 1 Hub
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      31.4368° N, 74.2589° E
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-stone-300">
                    <p className="flex items-center justify-between py-1 border-b border-stone-700/60">
                      <span>From Johar Town / Shaukat Khanum:</span>
                      <span className="font-mono text-stone-400">8 mins (via Khayaban-e-Firdousi)</span>
                    </p>
                    <p className="flex items-center justify-between py-1 border-b border-stone-700/60">
                      <span>From Valencia / Lake City:</span>
                      <span className="font-mono text-stone-400">6 mins (via Pine Ave / Valencia Gate)</span>
                    </p>
                    <p className="flex items-center justify-between py-1 border-b border-stone-700/60">
                      <span>From DHA / Ring Road:</span>
                      <span className="font-mono text-stone-400">18 mins (via Ring Road Southern Loop)</span>
                    </p>
                  </div>

                  <div className="p-3 bg-stone-900/90 rounded border border-stone-700 mt-4 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-stone-400 block text-[10px]">Parking:</span>
                      <span className="font-semibold text-white">Spacious Front Parking Available</span>
                    </div>
                    <a
                      href="https://maps.google.com/?q=Wapda+Town+Lahore"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#4CAF50] hover:bg-[#43A047] text-white rounded text-xs font-semibold"
                    >
                      Open Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Storefront Highlight features */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-center text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-stone-700">
                  <span className="font-bold block text-stone-900">Climate Controlled</span>
                  <span className="text-[11px] text-stone-500">HEPA filtered aviaries</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-stone-700">
                  <span className="font-bold block text-stone-900">Live Handling Desk</span>
                  <span className="text-[11px] text-stone-500">Socialize before adopting</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
