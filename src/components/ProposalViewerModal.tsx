import React, { useState } from 'react';
import { X, CheckCircle, Code, DollarSign, Layers, Palette, Terminal, ExternalLink, GitBranch, Shield } from 'lucide-react';

interface ProposalViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProposalViewerModal: React.FC<ProposalViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'comparison' | 'architecture' | 'code'>('summary');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#4CAF50]/15 text-[#2E7D32]">
                Official Blueprint
              </span>
              <span className="text-xs text-stone-500">Lahore, Pakistan</span>
            </div>
            <h2 className="text-lg font-bold text-stone-900 font-['Montserrat'] mt-1">
              Bird Zone Wapda Town – Website Technical Proposal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 border-b border-stone-200 bg-white flex items-center gap-2 overflow-x-auto py-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'summary' ? 'bg-[#4CAF50] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Executive Summary & Goals
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'comparison' ? 'bg-[#4CAF50] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Platform Comparison (Woo vs Shopify vs React)
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'architecture' ? 'bg-[#4CAF50] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Site Map & Logistics Flow
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'code' ? 'bg-[#4CAF50] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Design Spec & Code Reference
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-stone-700 text-xs sm:text-sm space-y-6">
          
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-['Montserrat'] mb-2">
                  Executive Summary
                </h3>
                <p className="leading-relaxed text-stone-600">
                  Bird Zone (Wapda Town branch) is a renowned local pet and avian sanctuary in Lahore with high foot-traffic but previously lacking a digital e-commerce presence. This application provides a full-featured e-commerce solution targeting Lahore pet parents and hobbyists across Pakistan. The system handles live cataloging, Cash on Delivery (COD), local Wapda Town express delivery, WhatsApp ordering, appointment bookings, and reviews.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                    <span>Target Audience & Market</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                    <li>Local Lahore pet owners (Wapda Town, Johar Town, DHA, Model Town).</li>
                    <li>Avian breeders & hobbyists nationwide seeking high-quality cages & feed.</li>
                    <li>Pakistan e-commerce context: $5.4B market, mobile-first, 95% Cash on Delivery (COD).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#FF9800]" />
                    <span>Business & Revenue Goals</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                    <li>Direct online product sales (Birds, Cages, Imported Feeds, Toys).</li>
                    <li>Flat & tiered delivery fee monetization (PKR 150 - 600).</li>
                    <li>In-store appointment bookings for bird grooming and inspection.</li>
                    <li>Seamless WhatsApp Click-to-Chat ordering funnel.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs">
                <h4 className="font-bold text-emerald-950 mb-1">Local Lahore Logistics Configuration</h4>
                <p className="text-emerald-800 leading-relaxed">
                  Configured with specialized delivery zones: <strong>Wapda Town & Adjacent</strong> (Flat PKR 150 or Free above PKR 3,500), <strong>Johar Town & South Lahore</strong> (PKR 250), <strong>DHA/Cantt</strong> (PKR 350), and <strong>Nationwide Couriers</strong> (PKR 600 for dry goods & aviaries).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900 font-['Montserrat']">
                Architecture Options Comparison Table
              </h3>
              <p className="text-xs text-stone-500">
                Evaluation of the three technical approaches described in the proposal for Bird Zone Wapda Town:
              </p>

              <div className="overflow-x-auto border border-stone-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-100 border-b border-stone-200 text-stone-800 font-semibold">
                      <th className="p-3">Platform</th>
                      <th className="p-3">Example Themes</th>
                      <th className="p-3">Key Advantages</th>
                      <th className="p-3">Trade-offs</th>
                      <th className="p-3">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    <tr className="hover:bg-stone-50">
                      <td className="p-3 font-bold text-stone-900">
                        WordPress + WooCommerce
                        <span className="block font-normal text-stone-500 text-[11px]">(Self-Hosted)</span>
                      </td>
                      <td className="p-3 text-stone-600">Paws & Claws, Shopkeeper, Astra Pro</td>
                      <td className="p-3 text-stone-600">
                        • Complete data ownership<br />
                        • Rich plugin ecosystem for JazzCash/Easypaisa<br />
                        • Open-source (4M+ stores)
                      </td>
                      <td className="p-3 text-stone-600">
                        • Requires server & SSL maintenance<br />
                        • Security updates and caching optimization needed
                      </td>
                      <td className="p-3 font-mono text-stone-800 font-semibold">~$49–$69 theme + $80/yr host</td>
                    </tr>

                    <tr className="hover:bg-stone-50">
                      <td className="p-3 font-bold text-stone-900">
                        Shopify
                        <span className="block font-normal text-stone-500 text-[11px]">(Hosted SaaS)</span>
                      </td>
                      <td className="p-3 text-stone-600">Woofy by Yuva ($330), Supply, Booster</td>
                      <td className="p-3 text-stone-600">
                        • Zero server management<br />
                        • Built-in SSL, CDN & fraud protection<br />
                        • App store for WhatsApp widgets
                      </td>
                      <td className="p-3 text-stone-600">
                        • Monthly SaaS fee ($39+/mo) + transaction fees<br />
                        • Pakistani payment gateways require manual or 3P apps
                      </td>
                      <td className="p-3 font-mono text-stone-800 font-semibold">$330 theme + $39/mo</td>
                    </tr>

                    <tr className="bg-emerald-50/40 hover:bg-emerald-50/60">
                      <td className="p-3 font-bold text-[#2E7D32]">
                        Headless React / Next.js
                        <span className="block font-normal text-emerald-700 text-[11px]">(Modern Custom SPA/PWA)</span>
                      </td>
                      <td className="p-3 text-stone-600">Custom Tailwind SPA (Implemented Here!)</td>
                      <td className="p-3 text-stone-600">
                        • Instant sub-second page loads<br />
                        • Tailored Pakistani COD & WhatsApp flows<br />
                        • Seamless micro-animations & PWA readiness
                      </td>
                      <td className="p-3 text-stone-600">
                        • Requires frontend engineering skills<br />
                        • Custom backend/CMS integration
                      </td>
                      <td className="p-3 font-mono text-emerald-800 font-semibold">Free hosting on Cloud / Vercel</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-['Montserrat'] mb-2">
                  System Site Map & Flow Diagram
                </h3>
                <div className="bg-stone-900 text-stone-100 p-4 rounded-lg font-mono text-xs overflow-x-auto space-y-2">
                  <div className="text-emerald-400 font-semibold">// Mermaid Site Map</div>
                  <div>Home (Hero + Featured Birds + Care Guide + Location)</div>
                  <div className="pl-4">├── Shop Catalog (Filters: Birds, Cages, Feed, Toys)</div>
                  <div className="pl-8">├── Product Detail Modal (Photos, Diet, Dimensions, Health Guarantee)</div>
                  <div className="pl-8">└── Shopping Bag & Delivery Calculator</div>
                  <div className="pl-12">├── Cash on Delivery (COD) Checkout</div>
                  <div className="pl-12">├── JazzCash / Easypaisa Direct Wallet</div>
                  <div className="pl-12">└── 1-Click WhatsApp Instant Order</div>
                  <div className="pl-4">├── Store Visit Booking (Pickups & Wing Trimming)</div>
                  <div className="pl-4">└── Avian Nutrition Guides & Smog Protection</div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900 font-['Montserrat'] mb-2">
                  Deployment & CI/CD Pipeline
                </h3>
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg text-xs space-y-2 text-stone-600">
                  <p>
                    <strong>Workflow:</strong> Developer Workstation &rarr; Git Repository &rarr; Build & Lint Verification (Vite/TypeScript) &rarr; Staging Environment &rarr; Production Deployment (Google Cloud Run / CDN) &rarr; Customers in Lahore.
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Automated asset compression, TLS 1.3 encryption, and responsive mobile-first caching.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900 font-['Montserrat']">
                UI/UX Design Tokens & Reference Snippets
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-lg border border-stone-200 bg-[#4CAF50] text-white">
                  <span className="font-bold block">Primary Green</span>
                  <span className="font-mono text-[11px]">#4CAF50</span>
                </div>
                <div className="p-3 rounded-lg border border-stone-200 bg-[#FF9800] text-white">
                  <span className="font-bold block">Secondary Orange</span>
                  <span className="font-mono text-[11px]">#FF9800</span>
                </div>
                <div className="p-3 rounded-lg border border-stone-200 bg-[#FFC107] text-stone-900">
                  <span className="font-bold block">Accent Amber</span>
                  <span className="font-mono text-[11px]">#FFC107</span>
                </div>
                <div className="p-3 rounded-lg border border-stone-200 bg-[#424242] text-white">
                  <span className="font-bold block">Dark Gray Text</span>
                  <span className="font-mono text-[11px]">#424242</span>
                </div>
              </div>

              <div className="bg-stone-900 text-stone-100 p-4 rounded-lg font-mono text-xs overflow-x-auto space-y-3">
                <div className="text-emerald-400">// Sample Product Card React Component</div>
                <pre>{`export function ProductCard({ title, price, image, onAdd }) {
  return (
    <div className="product-card border border-stone-200 rounded-lg p-4 text-center">
      <img src={image} alt={title} className="w-full h-auto mb-3 rounded" />
      <h3 className="font-bold text-stone-800">{title}</h3>
      <p className="price font-bold text-[#FF9800] font-mono">PKR {price}</p>
      <button className="btn bg-[#4CAF50] text-white px-4 py-2 rounded mt-2" onClick={onAdd}>
        Add to Cart
      </button>
    </div>
  );
}`}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Bird Zone Wapda Town · Architecture Specification</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded font-medium cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
