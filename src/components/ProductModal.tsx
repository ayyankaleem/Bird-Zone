import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, MessageCircle, ShieldCheck, Check, Sparkles, AlertCircle } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleWhatsApp = () => {
    const total = product.price * quantity;
    const msg = encodeURIComponent(
      `Assalam-o-Alaikum Bird Zone Wapda Town!\n\nI want to order:\n- Item: ${product.name}\n- Quantity: ${quantity}\n- Total Price: PKR ${total.toLocaleString()}\n- SKU: ${product.sku}\n\nPlease confirm availability and delivery time to my address in Lahore.`
    );
    window.open(`https://wa.me/923001234567?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-stone-100 text-stone-600 transition-colors shadow-sm"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Product Media Column */}
          <div className="md:col-span-6 bg-stone-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-stone-200 bg-white">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Avian assurance guarantee */}
            <div className="mt-5 p-3.5 bg-white rounded-lg border border-stone-200 text-xs text-stone-600 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-stone-800">
                <ShieldCheck className="w-4 h-4 text-[#4CAF50]" />
                <span>Bird Zone Avian Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed text-stone-500">
                All live birds in our Wapda Town branch are vet-inspected, healthy, and on a nutrient-balanced seed & egg-food diet. Cages and accessories feature pet-safe non-toxic materials.
              </p>
              {product.origin && (
                <div className="text-[11px] text-stone-600 font-medium pt-1 border-t border-stone-100">
                  <span className="text-stone-400">Origin / Spec:</span> {product.origin}
                </div>
              )}
            </div>
          </div>

          {/* Product Info Column */}
          <div className="md:col-span-6 p-6 flex flex-col justify-between">
            <div>
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                <span className="font-medium text-[#4CAF50]">{product.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-stone-400">SKU: {product.sku}</span>
              </div>

              <h2 className="text-xl font-bold text-stone-900 leading-tight font-['Montserrat']">
                {product.name}
              </h2>

              <p className="text-sm font-medium text-stone-600 mt-1 font-sans text-right" dir="rtl">
                {product.nameUrdu}
              </p>

              {/* Price & Rating */}
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-[#FF9800] tabular-nums font-mono">
                    PKR {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="ml-2 text-sm text-stone-400 line-through tabular-nums font-mono">
                      PKR {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="text-xs text-stone-500 flex items-center gap-1 font-semibold">
                  <span className="text-amber-500">★ {product.rating}</span>
                  <span>({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs leading-relaxed text-stone-600">
                {product.description}
              </p>

              {/* Key Features */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">Key Highlights</h4>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#4CAF50] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Care / Diet / Dimensions note */}
              {(product.careTips || product.diet || product.dimensions) && (
                <div className="mt-4 p-2.5 bg-stone-50 rounded border border-stone-200 text-xs space-y-1">
                  {product.diet && (
                    <div><span className="font-semibold text-stone-700">Recommended Diet:</span> {product.diet}</div>
                  )}
                  {product.careTips && (
                    <div><span className="font-semibold text-stone-700">Care Advice:</span> {product.careTips}</div>
                  )}
                  {product.dimensions && (
                    <div><span className="font-semibold text-stone-700">Dimensions:</span> {product.dimensions}</div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-stone-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center border border-stone-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-sm font-semibold text-stone-600 hover:bg-stone-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold font-mono tabular-nums text-stone-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-sm font-semibold text-stone-600 hover:bg-stone-100"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs text-stone-500">
                  Subtotal: <span className="font-bold text-stone-800 tabular-nums font-mono">PKR {(product.price * quantity).toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAdd}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-xs font-semibold transition-all duration-200 ${
                    added ? 'bg-[#2E7D32] text-white' : 'bg-[#4CAF50] hover:bg-[#43A047] text-white active:scale-95'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-xs font-semibold bg-[#25D366] hover:bg-[#20ba59] text-white transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Inquiry</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
