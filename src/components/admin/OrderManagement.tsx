import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  FileText,
  Download,
  Printer,
  MessageCircle,
  Phone,
  MapPin,
  X,
  Send,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { api, OrderData } from '../../services/api';

interface OrderManagementProps {
  initialSelectedOrder?: OrderData | null;
  onClearInitialOrder?: () => void;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({
  initialSelectedOrder,
  onClearInitialOrder,
}) => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Drawer / Modal
  const [activeOrder, setActiveOrder] = useState<OrderData | null>(null);
  const [internalNoteInput, setInternalNoteInput] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getOrders({
        search,
        status: selectedStatus,
        paymentStatus: selectedPaymentStatus,
        page: page.toString(),
        limit: '20',
        sort: 'desc',
      });
      setOrders(res.orders);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, selectedPaymentStatus, page]);

  useEffect(() => {
    if (initialSelectedOrder) {
      setActiveOrder(initialSelectedOrder);
      setInternalNoteInput(initialSelectedOrder.internalNotes || '');
    }
  }, [initialSelectedOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleUpdateStatus = async (newStatus: string, newPayment?: string) => {
    if (!activeOrder) return;
    if (newStatus === 'Cancelled' && !showCancelPrompt) {
      setShowCancelPrompt(true);
      return;
    }

    setUpdatingStatus(true);
    try {
      const updated = await api.updateOrderStatus(
        activeOrder.id,
        newStatus,
        newPayment,
        undefined,
        newStatus === 'Cancelled' ? cancellationReason : undefined
      );
      setActiveOrder(updated);
      setShowCancelPrompt(false);
      setCancellationReason('');
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || !internalNoteInput.trim()) return;
    try {
      await api.addOrderNotes(activeOrder.id, internalNoteInput.trim());
      setActiveOrder((prev) => (prev ? { ...prev, internalNotes: internalNoteInput.trim() } : null));
      alert('Internal note saved.');
    } catch (err: any) {
      alert(err.message || 'Failed to save note.');
    }
  };

  const handlePrintInvoice = (order: OrderData) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          body { font-family: -apple-system, sans-serif; padding: 40px; color: #202820; max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 2px solid #153D2C; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .logo { font-size: 24px; font-weight: bold; color: #153D2C; }
          .details { margin: 25px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
          th { background: #F8F7F1; text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }
          td { padding: 10px; border-bottom: 1px solid #eee; }
          .totals { margin-top: 20px; text-align: right; font-size: 14px; }
          .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 15px; font-size: 11px; text-align: center; color: #777; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">Bird Zone Wapda Town</div>
            <div>Commercial Area, Phase 1, Wapda Town, Lahore</div>
            <div>Phone: +92 300 1234567 | orders@birdzone.pk</div>
          </div>
          <div style="text-align: right;">
            <h2>INVOICE</h2>
            <div><strong>Order #:</strong> ${order.orderNumber}</div>
            <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div class="details">
          <div>
            <strong>Delivered To:</strong><br>
            ${order.customerName}<br>
            Phone: ${order.customerPhone}<br>
            ${order.deliveryAddress}<br>
            Zone: ${order.deliveryZoneName}
          </div>
          <div style="text-align: right;">
            <strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}<br>
            <strong>Payment Status:</strong> ${order.paymentStatus}<br>
            <strong>Order Status:</strong> ${order.orderStatus}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Qty</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (it) => `
              <tr>
                <td>${it.productName}</td>
                <td>${it.sku}</td>
                <td>PKR ${it.price.toLocaleString()}</td>
                <td>${it.quantity}</td>
                <td style="text-align: right;">PKR ${it.total.toLocaleString()}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="totals">
          <div>Subtotal: PKR ${order.subtotal.toLocaleString()}</div>
          <div>Delivery Fee: ${order.deliveryFee === 0 ? 'FREE' : `PKR ${order.deliveryFee.toLocaleString()}`}</div>
          ${order.discount ? `<div>Discount: -PKR ${order.discount.toLocaleString()}</div>` : ''}
          <div style="font-size: 18px; font-weight: bold; margin-top: 8px; color: #153D2C;">
            Total Payable: PKR ${order.total.toLocaleString()}
          </div>
        </div>

        <div class="footer">
          Thank you for choosing Bird Zone Wapda Town! All birds are health-certified and domestically reared.
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Address', 'Zone', 'Total (PKR)', 'Status', 'Payment Method', 'Payment Status'];
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.deliveryAddress}"`,
      `"${o.deliveryZoneName}"`,
      o.total,
      o.orderStatus,
      o.paymentMethod,
      o.paymentStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `birdzone_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'Dispatched':
        return 'bg-indigo-100 text-indigo-800';
      case 'Processing':
      case 'Confirmed':
      case 'Ready for Pickup':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Confirmation':
        return 'bg-amber-100 text-amber-800';
      case 'Cancelled':
      case 'Returned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-['Montserrat']">
            Customer Orders & Dispatch
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Process incoming orders, verify payments (COD / JazzCash / Easypaisa), and dispatch riders.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-stone-500" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by order number (e.g. BZ-LHR-7821), customer name, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-hidden focus:border-[#3C8053]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="text-xs border border-stone-200 rounded-lg px-2.5 py-2 bg-stone-50 text-stone-700 focus:outline-hidden focus:border-[#3C8053]"
            >
              <option value="all">All Order Statuses</option>
              <option value="Pending Confirmation">Pending Confirmation</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Payment Filter */}
            <select
              value={selectedPaymentStatus}
              onChange={(e) => {
                setSelectedPaymentStatus(e.target.value);
                setPage(1);
              }}
              className="text-xs border border-stone-200 rounded-lg px-2.5 py-2 bg-stone-50 text-stone-700 focus:outline-hidden focus:border-[#3C8053]"
            >
              <option value="all">All Payment Statuses</option>
              <option value="Unpaid">Unpaid (COD)</option>
              <option value="Pending">Pending (Wallet)</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-stone-800 text-white rounded-lg text-xs font-semibold hover:bg-stone-900 transition-colors"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5">Customer & Contact</th>
                <th className="p-3.5">Lahore Zone</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Order Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => {
                      setActiveOrder(ord);
                      setInternalNoteInput(ord.internalNotes || '');
                    }}
                    className="hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <td className="p-3.5 font-bold font-mono text-stone-900">
                      {ord.orderNumber}
                    </td>
                    <td className="p-3.5 text-stone-500 font-mono text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString('en-PK', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-stone-900">{ord.customerName}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{ord.customerPhone}</div>
                    </td>
                    <td className="p-3.5 text-stone-600">
                      <span className="truncate block max-w-[130px]">{ord.deliveryZoneName}</span>
                    </td>
                    <td className="p-3.5 font-bold text-[#153D2C] font-mono tabular-nums">
                      PKR {ord.total.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className="uppercase text-[11px] font-bold block">
                        {ord.paymentMethod}
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${
                          ord.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${getStatusBadge(
                          ord.orderStatus
                        )}`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveOrder(ord);
                          setInternalNoteInput(ord.internalNotes || '');
                        }}
                        className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px]"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Slide-Over Modal / Drawer */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold font-mono text-stone-900">
                    Order #{activeOrder.orderNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getStatusBadge(activeOrder.orderStatus)}`}>
                    {activeOrder.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Placed on {new Date(activeOrder.createdAt).toLocaleString('en-PK')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintInvoice(activeOrder)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700"
                  title="Print Invoice"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
                <button
                  onClick={() => {
                    setActiveOrder(null);
                    if (onClearInitialOrder) onClearInitialOrder();
                  }}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* Status Update Quick Bar */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-stone-800 block text-xs">Change Order Status:</span>
                  <span className="text-[11px] text-stone-500">Updating will record staff audit trail & adjust stock if cancelled.</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus('Confirmed')}
                    className="px-2.5 py-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold"
                  >
                    Confirm
                  </button>
                  <button
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus('Processing')}
                    className="px-2.5 py-1.5 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold"
                  >
                    Processing
                  </button>
                  <button
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus('Dispatched')}
                    className="px-2.5 py-1.5 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold"
                  >
                    Dispatched
                  </button>
                  <button
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus('Delivered')}
                    className="px-2.5 py-1.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                  >
                    Delivered
                  </button>
                  <button
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus('Cancelled')}
                    className="px-2.5 py-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 font-semibold"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>

              {/* Cancel Confirmation Prompt */}
              {showCancelPrompt && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-2">
                  <h4 className="font-bold text-red-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Confirm Order Cancellation & Automatic Stock Restock</span>
                  </h4>
                  <p className="text-[11px] text-red-700">
                    Cancelling this order will release the reserved items back into inventory so they are available for other buyers. Please enter a mandatory reason:
                  </p>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Customer cancelled on phone, or item out of breeding season"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="w-full p-2 bg-white border border-red-300 rounded text-xs"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setShowCancelPrompt(false)}
                      className="px-3 py-1 bg-white border border-stone-200 rounded text-stone-700"
                    >
                      Abort
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('Cancelled')}
                      className="px-3 py-1 bg-red-600 text-white rounded font-bold"
                    >
                      Confirm Cancellation & Restock
                    </button>
                  </div>
                </div>
              )}

              {/* Customer & Delivery Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#3C8053]" />
                    <span>Customer & Delivery Details</span>
                  </h4>
                  <div className="text-stone-700 space-y-1">
                    <p><strong className="text-stone-900">{activeOrder.customerName}</strong></p>
                    <p className="flex items-center gap-1 text-stone-600">
                      <Phone className="w-3.5 h-3.5" />
                      <span className="font-mono">{activeOrder.customerPhone}</span>
                      <a
                        href={`https://wa.me/${activeOrder.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-[#25D366] hover:underline flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </a>
                    </p>
                    {activeOrder.customerEmail && (
                      <p className="text-stone-500">{activeOrder.customerEmail}</p>
                    )}
                    <p className="pt-1 text-stone-800">
                      <strong>Address:</strong> {activeOrder.deliveryAddress}
                    </p>
                    <p className="text-stone-500">
                      <strong>Zone:</strong> {activeOrder.deliveryZoneName}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#3C8053]" />
                    <span>Payment Verification</span>
                  </h4>
                  <div className="space-y-1 text-stone-700">
                    <p>
                      <strong>Method:</strong> <span className="uppercase font-mono">{activeOrder.paymentMethod}</span>
                    </p>
                    <p>
                      <strong>Payment Status:</strong>{' '}
                      <span className="font-bold">{activeOrder.paymentStatus}</span>
                    </p>
                    {activeOrder.transactionId && (
                      <p className="bg-stone-50 p-1.5 rounded font-mono text-[11px]">
                        <strong>Transaction ID:</strong> {activeOrder.transactionId}
                      </p>
                    )}
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-stone-500">Mark Payment:</span>
                      <button
                        onClick={() => handleUpdateStatus(activeOrder.orderStatus, 'Paid')}
                        className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold"
                      >
                        Mark as Paid
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(activeOrder.orderStatus, 'Unpaid')}
                        className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-bold"
                      >
                        Mark Unpaid
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {activeOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img src={it.image} alt={it.productName} className="w-9 h-9 rounded object-cover border" />
                            <span className="font-semibold text-stone-800">{it.productName}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-stone-500">{it.sku}</td>
                        <td className="p-3 font-mono">PKR {it.price.toLocaleString()}</td>
                        <td className="p-3 font-mono font-bold">{it.quantity}</td>
                        <td className="p-3 text-right font-mono font-bold">
                          PKR {it.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Subtotals & Grand Total */}
                <div className="p-4 bg-stone-50/70 border-t border-stone-200 space-y-1.5 text-right font-mono">
                  <div>Subtotal: PKR {activeOrder.subtotal.toLocaleString()}</div>
                  <div>Delivery Fee: {activeOrder.deliveryFee === 0 ? 'FREE' : `PKR ${activeOrder.deliveryFee.toLocaleString()}`}</div>
                  {activeOrder.discount > 0 && (
                    <div className="text-emerald-700 font-semibold">
                      Discount ({activeOrder.couponCode || 'Promo'}): -PKR {activeOrder.discount.toLocaleString()}
                    </div>
                  )}
                  <div className="text-base font-extrabold text-[#153D2C] pt-2 border-t border-stone-200">
                    Grand Total: PKR {activeOrder.total.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Internal Notes & History */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Notes */}
                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                    Internal Order Notes (Staff Only)
                  </h4>
                  <form onSubmit={handleAddInternalNote} className="space-y-2">
                    <textarea
                      rows={3}
                      placeholder="Add private note regarding rider dispatch, packaging, or customer preferences..."
                      value={internalNoteInput}
                      onChange={(e) => setInternalNoteInput(e.target.value)}
                      className="w-full p-2 border border-stone-300 rounded text-xs"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded text-xs font-semibold"
                    >
                      Save Internal Note
                    </button>
                  </form>
                </div>

                {/* Status Timeline History */}
                <div className="space-y-2">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                    Audit Status History
                  </h4>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 max-h-48 overflow-y-auto space-y-2">
                    {activeOrder.statusHistory?.map((h, i) => (
                      <div key={i} className="text-[11px] pb-2 border-b border-stone-200/60 last:border-none">
                        <div className="flex items-center justify-between font-semibold text-stone-800">
                          <span>{h.status}</span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-stone-500 mt-0.5">{h.note}</p>
                        <span className="text-[10px] text-stone-400">By {h.updatedBy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">
                Bird Zone Wapda Town Order Dispatch System
              </span>
              <button
                onClick={() => {
                  setActiveOrder(null);
                  if (onClearInitialOrder) onClearInitialOrder();
                }}
                className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
