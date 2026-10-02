import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Menu, X, Bird, FileText, MapPin, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenProposal: () => void;
  onOpenBooking: () => void;
  onOpenAdmin?: () => void;
  announcementText?: string;
  whatsappNumber?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenProposal,
  onOpenBooking,
  onOpenAdmin,
  announcementText = 'خوش آمدید · Welcome! Free express delivery in Wapda Town on orders over PKR 3,500 | WhatsApp Orders: +92 300 1234567',
  whatsappNumber = '923001234567',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top micro-announcement banner */}
      <div className="bg-[#153D2C] text-white text-xs py-1.5 px-4 text-center font-medium">
        <span className="opacity-90">{announcementText}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Zone 1: Brand title, single line text element wordmark */}
          <a href="#" className="flex items-center gap-2 group text-stone-900 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#153D2C]/15 flex items-center justify-center text-[#153D2C] group-hover:bg-[#153D2C] group-hover:text-white transition-colors duration-200">
              <Bird className="w-6 h-6 animate-bird-float" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight font-['Montserrat'] text-stone-900 leading-tight">
                Bird Zone <span className="text-[#3C8053]">Wapda Town</span>
              </span>
              <span className="text-[11px] text-stone-500 font-normal">Lahore’s Premier Pet & Avian Store · لاہور</span>
            </div>
          </a>

          {/* Zone 2: 4-6 clean text navigation links with subtle hover underlines */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
            <a href="#shop" className="hover:text-[#3C8053] transition-colors py-1">
              Shop Birds & Supplies
            </a>
            <a href="#delivery" className="hover:text-[#3C8053] transition-colors py-1">
              Delivery Zones
            </a>
            <a href="#care-guides" className="hover:text-[#3C8053] transition-colors py-1">
              Care Tips & Diet
            </a>
            <a href="#reviews" className="hover:text-[#3C8053] transition-colors py-1">
              Customer Reviews
            </a>
            <a href="#location" className="hover:text-[#3C8053] transition-colors py-1">
              Visit Store
            </a>
            <button
              onClick={onOpenProposal}
              className="flex items-center gap-1.5 text-stone-500 hover:text-[#FF9800] transition-colors py-1 text-xs cursor-pointer font-semibold"
              title="View Website Proposal & Tech Comparison"
            >
              <FileText className="w-3.5 h-3.5 text-[#FF9800]" />
              <span>Tech Proposal</span>
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2.5">
            {/* WhatsApp Quick Order button */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=Assalam-o-Alaikum%20Bird%20Zone%20Wapda%20Town!%20I%20would%20like%20to%20inquire%20about%20your%20available%20birds%20and%20cages.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md bg-[#25D366] text-white hover:bg-[#20ba59] transition-transform active:scale-95 shadow-xs whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>

            {/* In-Store Visit booking button */}
            <button
              onClick={onOpenBooking}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-md border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#3C8053]" />
              <span>Book Visit</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-md text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer flex items-center gap-1.5 border border-stone-200"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-stone-800" />
              <span className="hidden sm:inline text-xs font-semibold">Bag</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-[#FF9800] rounded-full tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Gateway Button */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-md bg-[#153D2C] hover:bg-[#3C8053] text-[#E9BE69] text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                title="Open Shop Owner Admin Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 py-3 px-2 space-y-2 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
            <a
              href="#shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              Shop Birds & Supplies
            </a>
            <a
              href="#delivery"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              Lahore Delivery Zones
            </a>
            <a
              href="#care-guides"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              Care Tips & Diet
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              Customer Reviews
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              Store Location (Wapda Town)
            </a>
            <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-bold text-[#E9BE69] bg-[#153D2C] flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin & Store Management Panel</span>
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-[#153D2C] bg-[#153D2C]/10"
              >
                Book Shop Visit / Consultation
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProposal();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-600 bg-stone-100"
              >
                View Website Proposal & Tech Spec
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold rounded-md bg-[#25D366] text-white"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
