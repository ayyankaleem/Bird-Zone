import React, { useState } from 'react';
import { CartItem, DeliveryZone, OrderConfirmation } from '../types';
import { X, CheckCircle, ShieldCheck, Wallet, Banknote, Truck, MessageCircle, Copy, Check } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  deliveryZones: DeliveryZone[];
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
  onOrderCompleted: (order: OrderConfirmation) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  deliveryZones,
  selectedZone,
  onSelectZone,
  onOrderCompleted,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cityArea, setCityArea] = useState('Wapda Town Phase 1, Lahore');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash' | 'easypaisa'>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmation | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
  const isFreeDelivery = selectedZone.freeDeliveryThreshold && subtotal >= selectedZone.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : selectedZone.rate;
  const total = Math.max(0, subtotal + deliveryFee - couponDiscount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError('');
    setCouponSuccess('');
    try {
      const res = await import('../services/api').then(m => m.api.validateCoupon(couponCode.trim(), subtotal));
      setCouponDiscount(res.discountAmount);
      setCouponSuccess(`Coupon applied! -PKR ${res.discountAmount.toLocaleString()}`);
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon.');
      setCouponDiscount(0);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) {
      alert('Please fill in your name, contact phone number, and delivery address.');
      return;
    }

    setSubmitting(true);
    try {
      const apiModule = await import('../services/api');
      const savedOrder = await apiModule.api.createOrder({
        customerName,
        customerPhone: phone,
        deliveryAddress: `${address}, ${cityArea}`,
        cityArea,
        deliveryZoneId: selectedZone.id,
        items: items.map((it) => ({
          productId: it.product.id,
          quantity: it.quantity,
        })),
        paymentMethod,
        transactionId: transactionId || undefined,
        customerNotes: orderNotes || undefined,
        couponCode: couponDiscount > 0 ? couponCode : undefined,
      });

      const newOrder: OrderConfirmation = {
        orderId: savedOrder.orderNumber,
        customerName: savedOrder.customerName,
        phone: savedOrder.customerPhone,
        address: savedOrder.deliveryAddress,
        zone: savedOrder.deliveryZoneName,
        items: [...items],
        subtotal: savedOrder.subtotal,
        deliveryFee: savedOrder.deliveryFee,
        total: savedOrder.total,
        paymentMethod,
        date: new Date(savedOrder.createdAt).toLocaleDateString('en-PK', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'Confirmed',
      };

      setConfirmedOrder(newOrder);
      onOrderCompleted(newOrder);
    } catch (err: any) {
      alert(err.message || 'Failed to place order. Please check item stock.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShareOnWhatsApp = (order: OrderConfirmation) => {
    const itemsText = order.items
      .map((it, idx) => `• ${it.product.name} (Qty: ${it.quantity}) - PKR ${(it.product.price * it.quantity).toLocaleString()}`)
      .join('\n');

    const paymentLabel =
      order.paymentMethod === 'cod'
        ? 'Cash on Delivery (COD)'
        : order.paymentMethod === 'jazzcash'
        ? `JazzCash (TxID: ${transactionId || 'Sent via wallet'})`
        : `Easypaisa (TxID: ${transactionId || 'Sent via wallet'})`;

    const text = encodeURIComponent(
      `Assalam-o-Alaikum Bird Zone Wapda Town!\n\n*New Website Order: ${order.orderId}*\n\n*Customer Details:*\n- Name: ${order.customerName}\n- Phone: ${order.phone}\n- Address: ${order.address}\n- Zone: ${order.zone}\n\n*Items Ordered:*\n${itemsText}\n\n*Subtotal:* PKR ${order.subtotal.toLocaleString()}\n*Delivery Fee:* ${order.deliveryFee === 0 ? 'FREE' : `PKR ${order.deliveryFee.toLocaleString()}`}\n*Total Payable:* PKR ${order.total.toLocaleString()}\n*Payment Method:* ${paymentLabel}\n\n*Special Notes:* ${orderNotes || 'None'}\n\nPlease dispatch as scheduled.`
    );

    window.open(`https://wa.me/923001234567?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="font-bold text-lg text-stone-900 font-['Montserrat']">
              {confirmedOrder ? 'Order Confirmed!' : 'Lahore Delivery & Checkout'}
            </h2>
            <p className="text-xs text-stone-500">
              {confirmedOrder ? 'Thank you for choosing Bird Zone Wapda Town' : 'Cash on Delivery, JazzCash or Easypaisa payment'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation State */}
        {confirmedOrder ? (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#4CAF50]/15 text-[#4CAF50] flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-semibold text-[#4CAF50] uppercase tracking-wider">
                Order Received · شکریا
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-['Montserrat'] mt-1">
                Order Reference: {confirmedOrder.orderId}
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                Your order has been recorded in our Wapda Town dispatch system. Our rider will contact you at{' '}
                <span className="font-bold text-stone-800">{confirmedOrder.phone}</span> prior to delivery.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-left text-xs space-y-2.5 max-w-lg mx-auto">
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500">Delivery Address:</span>
                <span className="font-semibold text-stone-800 text-right">{confirmedOrder.address}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500">Delivery Zone & ETA:</span>
                <span className="font-semibold text-stone-800">{confirmedOrder.zone} ({selectedZone.eta})</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500">Payment Selected:</span>
                <span className="font-semibold uppercase text-stone-800">
                  {confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : confirmedOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-stone-900 text-sm">
                <span>Total Amount:</span>
                <span className="text-[#FF9800] font-mono tabular-nums text-base">
                  PKR {confirmedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons for Confirmed Order */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => handleShareOnWhatsApp(confirmedOrder)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Confirm Order on WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Order ${confirmedOrder.orderId} - Bird Zone Wapda Town - PKR ${confirmedOrder.total.toLocaleString()}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Receipt' : 'Copy Order ID'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Usman Tariq"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#4CAF50]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Active Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#4CAF50]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Zone in Lahore
                </label>
                <select
                  value={selectedZone.id}
                  onChange={(e) => {
                    const found = deliveryZones.find((z) => z.id === e.target.value);
                    if (found) onSelectZone(found);
                  }}
                  className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#4CAF50] bg-white"
                >
                  {deliveryZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} (PKR {z.rate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Area / Sector
                </label>
                <input
                  type="text"
                  value={cityArea}
                  onChange={(e) => setCityArea(e.target.value)}
                  placeholder="e.g. Wapda Town Phase 1, Block D"
                  className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#4CAF50]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Complete House / Street Address <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="House #, Street #, Landmark (e.g. Near Wapda Town Roundabout)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#4CAF50]"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-[#4CAF50] bg-[#4CAF50]/10 text-stone-900'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Banknote className="w-4 h-4 text-[#4CAF50]" />
                    <span>Cash on Delivery</span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1">95% preferred in Lahore. Pay rider when package arrives.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('jazzcash')}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                    paymentMethod === 'jazzcash'
                      ? 'border-[#FF9800] bg-[#FF9800]/10 text-stone-900'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Wallet className="w-4 h-4 text-[#FF9800]" />
                    <span>JazzCash</span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1">Instant mobile wallet or QR transfer.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('easypaisa')}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                    paymentMethod === 'easypaisa'
                      ? 'border-[#2E7D32] bg-[#2E7D32]/10 text-stone-900'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Wallet className="w-4 h-4 text-[#2E7D32]" />
                    <span>Easypaisa</span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1">Direct account transfer.</span>
                </button>
              </div>

              {/* Digital Wallet Instructions */}
              {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
                <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-2">
                  <p className="font-semibold">
                    {paymentMethod === 'jazzcash' ? 'JazzCash Account:' : 'Easypaisa Account:'}
                  </p>
                  <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded border border-amber-300 font-mono text-xs">
                    <span>Title: <strong>Bird Zone Wapda Town</strong></span>
                    <span>No: <strong>0300-1234567</strong></span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Enter Transaction ID (TID) from SMS (Optional for reference):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1928472918"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-300 rounded px-2.5 py-1 text-stone-800"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Order Notes / Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Call before coming, leave at gate, or deliver after 5 PM"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#4CAF50]"
              />
            </div>

            {/* Promo Coupon Code */}
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
              <label className="block text-xs font-semibold text-stone-700">
                Promo Code or Voucher (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOMEBZ or WAPDA500"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full text-xs bg-white border border-stone-300 rounded px-2.5 py-1.5 uppercase font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={validatingCoupon}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded text-xs font-semibold shrink-0"
                >
                  {validatingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </div>
              {couponSuccess && (
                <p className="text-[11px] text-emerald-700 font-semibold">{couponSuccess}</p>
              )}
              {couponError && (
                <p className="text-[11px] text-red-600">{couponError}</p>
              )}
            </div>

            {/* Summary & Submit */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Total Due:</span>
                <span className="text-xl font-bold text-[#FF9800] font-mono tabular-nums">
                  PKR {total.toLocaleString()}
                </span>
                {couponDiscount > 0 && (
                  <span className="text-[10px] text-emerald-700 block font-semibold">
                    Includes PKR {couponDiscount.toLocaleString()} discount
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-md bg-[#4CAF50] hover:bg-[#43A047] text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Placing Order...' : 'Place Order Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
