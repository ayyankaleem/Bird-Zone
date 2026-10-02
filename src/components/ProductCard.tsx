import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, MessageCircle, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
}) => {
  const [addedRecently, setAddedRecently] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1500);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Assalam-o-Alaikum Bird Zone Wapda Town! I would like to order or check availability for: "${product.name}" (PKR ${product.price.toLocaleString()}). Could you provide delivery details to my location?`
    );
    window.open(`https://wa.me/923001234567?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-white rounded-lg border border-stone-200 overflow-hidden hover:border-stone-300 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full bg-[#F5F5F3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Styled graceful fallback container
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Stock / Featured Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.isFeatured && (
            <span className="text-[11px] font-semibold bg-[#4CAF50] text-white px-2 py-0.5 rounded shadow-sm">
              Popular
            </span>
          )}
          {!product.inStock && (
            <span className="text-[11px] font-semibold bg-stone-800 text-white px-2 py-0.5 rounded shadow-sm">
              Pre-Order
            </span>
          )}
        </div>

        {/* Quick View Button overlay on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-2.5 right-2.5 p-2 bg-white/90 hover:bg-white text-stone-700 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Unboxed Category and SKU */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>{product.category}</span>
            <span className="font-mono text-[11px] text-stone-400">{product.sku}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-stone-900 text-base leading-snug group-hover:text-[#4CAF50] transition-colors font-['Montserrat']">
            {product.name}
          </h3>

          {/* Urdu Name */}
          <p className="text-xs text-stone-500 font-medium mt-0.5 text-right font-sans" dir="rtl">
            {product.nameUrdu}
          </p>

          {/* Brief teaser */}
          <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Module */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xs text-stone-500 mr-1">Price</span>
              <span className="text-lg font-bold text-[#FF9800] tabular-nums font-mono">
                PKR {product.price.toLocaleString()}
              </span>
            </div>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through tabular-nums font-mono">
                PKR {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAdd}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                addedRecently
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-[#4CAF50] hover:bg-[#43A047] text-white active:scale-95'
              }`}
            >
              {addedRecently ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-md text-xs font-semibold bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-all duration-200 border border-[#25D366]/30"
              title="Order this product directly on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
