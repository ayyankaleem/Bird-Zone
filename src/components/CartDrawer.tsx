import React from 'react';
import { CartItem, DeliveryZone } from '../types';
import { X, Trash2, ShoppingBag, MessageCircle, Truck, ArrowRight, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  deliveryZones: DeliveryZone[];
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  deliveryZones,
  selectedZone,
  onSelectZone,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Calculate delivery fee with free threshold rule
  const isFreeDelivery = selectedZone.freeDeliveryThreshold && subtotal >= selectedZone.freeDeliveryThreshold;
  const deliveryFee = items.length === 0 ? 0 : isFreeDelivery ? 0 : selectedZone.rate;
  const total = subtotal + deliveryFee;

  // WhatsApp order generator
  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;
    const itemListText = items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.product.name} (Qty: ${it.quantity}) - PKR ${(it.product.price * it.quantity).toLocaleString()}`
      )
      .join('\n');

    const msg = encodeURIComponent(
      `Assalam-o-Alaikum Bird Zone Wapda Town!\n\nI want to place an order:\n\n${itemListText}\n\nSubtotal: PKR ${subtotal.toLocaleString()}\nDelivery Zone: ${selectedZone.name} (${deliveryFee === 0 ? 'FREE Delivery' : `PKR ${deliveryFee}`})\nTotal Amount: PKR ${total.toLocaleString()}\n\nPlease confirm availability and dispatch schedule.`
    );
    window.open(`https://wa.me/923001234567?text=${msg}`, '_blank');
  };

  const freeRemaining = selectedZone.freeDeliveryThreshold
    ? Math.max(0, selectedZone.freeDeliveryThreshold - subtotal)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#4CAF50]" />
            <h2 className="font-bold text-stone-900 font-['Montserrat']">Your Bird Zone Bag</h2>
            <span className="text-xs bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-mono font-medium">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress in Wapda Town */}
        {items.length > 0 && selectedZone.freeDeliveryThreshold && (
          <div className="px-5 py-2.5 bg-[#4CAF50]/10 border-b border-[#4CAF50]/20 text-xs">
            {freeRemaining === 0 ? (
              <div className="flex items-center gap-1.5 text-[#2E7D32] font-semibold">
                <Check className="w-4 h-4" />
                <span>You unlocked FREE Delivery in {selectedZone.name}!</span>
              </div>
            ) : (
              <div>
                <span className="text-stone-700">
                  Add <span className="font-bold text-[#2E7D32] font-mono tabular-nums">PKR {freeRemaining.toLocaleString()}</span> more for <span className="font-semibold">Free Delivery</span>
                </span>
                <div className="w-full bg-stone-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-[#4CAF50] h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / selectedZone.freeDeliveryThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-stone-100">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="font-bold text-stone-800 text-base">Your shopping bag is empty</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Explore our hand-reared parrots, spacious cages, and imported nutritional seeds.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-4 py-2 bg-[#4CAF50] text-white rounded text-xs font-semibold hover:bg-[#43A047] transition-colors"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="py-3 flex items-start gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-md object-cover border border-stone-200 shrink-0 bg-stone-50"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-stone-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-mono">
                    PKR {item.product.price.toLocaleString()} each
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-200 rounded">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-mono font-semibold tabular-nums text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-stone-900 font-mono tabular-nums">
                        PKR {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-400 hover:text-red-600 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Zone Calculation */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-4">
            {/* Delivery Zone Selector */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#4CAF50]" />
                  <span>Delivery Destination</span>
                </span>
                <span className="text-[11px] text-stone-500">{selectedZone.eta}</span>
              </div>
              <select
                value={selectedZone.id}
                onChange={(e) => {
                  const found = deliveryZones.find((z) => z.id === e.target.value);
                  if (found) onSelectZone(found);
                }}
                className="w-full text-xs bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-hidden focus:border-[#4CAF50]"
              >
                {deliveryZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.rate === 0 ? 'Free' : `PKR ${z.rate}`})
                  </option>
                ))}
              </select>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-stone-800">PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono tabular-nums text-stone-800">
                  {deliveryFee === 0 ? (
                    <span className="text-[#2E7D32] font-semibold">FREE</span>
                  ) : (
                    `PKR ${deliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount</span>
                <span className="text-[#FF9800] font-mono tabular-nums text-base">
                  PKR {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2">
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3 px-4 rounded-md bg-[#4CAF50] hover:bg-[#43A047] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 active:scale-98 shadow-sm cursor-pointer"
              >
                <span>Proceed to Order (COD / JazzCash)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 px-4 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Quick WhatsApp Checkout</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-stone-500">
              95% of orders in Lahore are fulfilled with Cash on Delivery (COD).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
