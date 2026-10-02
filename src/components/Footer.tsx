import React from 'react';
import { Bird, MessageCircle, Phone, MapPin, Mail, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenProposal: () => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenProposal, onOpenBooking }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#4CAF50]/20 flex items-center justify-center text-[#4CAF50]">
                <Bird className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-['Montserrat'] text-white">
                Bird Zone <span className="text-[#4CAF50]">Wapda Town</span>
              </span>
            </div>
            
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Lahore’s trusted avian sanctuary and pet retail destination. Dedicated to hand-tamed exotic birds, spacious flight cages, certified imported nutrition, and veterinary-informed care.
            </p>

            <div className="pt-2 flex flex-col gap-1.5 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#4CAF50] shrink-0" />
                <span>Commercial Area, Phase 1, Wapda Town, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF9800] shrink-0" />
                <span className="font-mono">+92 300 1234567 / (042) 3518-9000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#4CAF50] shrink-0" />
                <span>orders@birdzone.pk</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-['Montserrat']">
              Online Shop
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#shop" className="hover:text-white transition-colors">Exotic Birds</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Cages & Aviaries</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Prestige Feeds & Seeds</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Toys & Perches</a></li>
              <li><a href="#delivery" className="hover:text-white transition-colors">Delivery Rates & Zones</a></li>
            </ul>
          </div>

          {/* Services & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-['Montserrat']">
              Avian Services
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={onOpenBooking} className="hover:text-white transition-colors cursor-pointer text-left">
                  Book In-Store Visit
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} className="hover:text-white transition-colors cursor-pointer text-left">
                  Wing & Beak Grooming
                </button>
              </li>
              <li><a href="#care-guides" className="hover:text-white transition-colors">Avian Nutrition Guides</a></li>
              <li><a href="#care-guides" className="hover:text-white transition-colors">Lahore Winter Smog Tips</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Customer Reviews</a></li>
            </ul>
          </div>

          {/* Payment & WhatsApp Ordering */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-['Montserrat']">
              Ordering & Payments
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              We support Pakistan's standard payment methods with instant dispatch in Wapda Town:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
              <span className="px-2 py-1 bg-stone-800 text-stone-300 rounded border border-stone-700">Cash on Delivery</span>
              <span className="px-2 py-1 bg-stone-800 text-[#FF9800] rounded border border-stone-700">JazzCash</span>
              <span className="px-2 py-1 bg-stone-800 text-[#4CAF50] rounded border border-stone-700">Easypaisa</span>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenProposal}
                className="text-xs text-[#FFC107] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <span>Read Technical Website Proposal</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>

        </div>

        {/* Ethical Animal Welfare Commitment */}
        <div className="py-6 border-b border-stone-800 text-xs text-stone-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#4CAF50] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-stone-300">Animal Welfare Commitment:</strong> All birds offered at Bird Zone Wapda Town are captive-bred, domestically hand-reared companion birds. We strictly condemn and oppose the trade of wild-caught, endangered, or mistreated avian species. Every bird undergoes veterinary quarantine prior to adoption.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Bird Zone Wapda Town (Lahore). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#care-guides" className="hover:text-stone-400 transition-colors">Care Policy</a>
            <span>·</span>
            <a href="#delivery" className="hover:text-stone-400 transition-colors">Shipping Terms</a>
            <span>·</span>
            <button onClick={onOpenProposal} className="hover:text-stone-400 transition-colors cursor-pointer">
              System Architecture
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
