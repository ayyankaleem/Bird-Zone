import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  Package,
  AlertTriangle,
  XCircle,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Layers,
  Boxes,
  Eye,
  Calendar,
  Filter,
} from 'lucide-react';
import { api, ReportsData, OrderData, AuditLogData } from '../../services/api';

interface DashboardOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenOrder: (order: OrderData) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateTab, onOpenOrder }) => {
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState<'7days' | 'monthly' | 'yearly'>('7days');

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [rep, ordRes, logs] = await Promise.all([
          api.getReports(),
          api.getOrders({ limit: '6', sort: 'desc' }),
          api.getAuditLogs().catch(() => []),
        ]);
        setReports(rep);
        setRecentOrders(ordRes.orders);
        setAuditLogs(logs.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading || !reports) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-stone-200 p-4" />
          ))}
        </div>
        <div className="h-80 bg-white rounded-xl border border-stone-200" />
      </div>
    );
  }

  const { metrics, topProducts, last7Days } = reports;

  const maxSale = Math.max(...last7Days.map((d) => d.sales), 1000);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'Processing':
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Confirmation':
        return 'bg-amber-100 text-amber-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Quick Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 font-['Montserrat']">
            Quick Actions:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('products')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#153D2C] hover:bg-[#3C8053] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => onNavigateTab('categories')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-stone-600" />
            <span>Add Category</span>
          </button>

          <button
            onClick={() => onNavigateTab('orders')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#3C8053]" />
            <span>View Orders</span>
          </button>

          <button
            onClick={() => onNavigateTab('inventory')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Boxes className="w-3.5 h-3.5 text-[#E9BE69]" />
            <span>Update Inventory</span>
          </button>
        </div>
      </div>

      {/* 8 Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-[#3C8053] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Total Orders</span>
            <div className="p-2 rounded-lg bg-[#3C8053]/10 text-[#3C8053] group-hover:bg-[#3C8053] group-hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#202820] font-mono tabular-nums">
            {metrics.totalOrders}
          </div>
          <p className="text-[11px] text-[#778078] mt-1">All recorded storefront orders</p>
        </div>

        {/* Orders Awaiting Confirmation */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Awaiting Confirmation</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
            {metrics.pendingConfirmation}
          </div>
          <p className="text-[11px] text-[#778078] mt-1">Needs customer verification</p>
        </div>

        {/* Orders Being Processed */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Being Processed</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-600 font-mono tabular-nums">
            {metrics.processingCount}
          </div>
          <p className="text-[11px] text-[#778078] mt-1">Packing & rider dispatch</p>
        </div>

        {/* Completed Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Completed Orders</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
            {metrics.completedOrdersCount}
          </div>
          <p className="text-[11px] text-[#778078] mt-1">Delivered to customer</p>
        </div>

        {/* Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-[#153D2C] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Total Products</span>
            <div className="p-2 rounded-lg bg-[#153D2C]/10 text-[#153D2C] group-hover:bg-[#153D2C] group-hover:text-white transition-colors">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#202820] font-mono tabular-nums">
            {metrics.totalProductsCount}
          </div>
          <p className="text-[11px] text-[#778078] mt-1">Birds, cages & feeds</p>
        </div>

        {/* Low-Stock Products */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Low-Stock Alert</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
            {metrics.lowStockCount}
          </div>
          <p className="text-[11px] text-[#778078] mt-1">Approaching minimum threshold</p>
        </div>

        {/* Out-of-Stock Products */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-red-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Out of Stock</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-red-600 font-mono tabular-nums">
            {metrics.outOfStockCount}
          </div>
          <p className="text-[11px] text-[#778078] mt-1">Unavailable on storefront</p>
        </div>

        {/* Sales Revenue */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-[#3C8053] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Net Sales Revenue</span>
            <div className="p-2 rounded-lg bg-[#E9BE69]/20 text-[#153D2C] group-hover:bg-[#E9BE69] transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#153D2C] font-mono tabular-nums">
            PKR {metrics.netRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#778078] mt-1">Excludes cancelled orders</p>
        </div>

      </div>

      {/* Main Charts and Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Sales Trend Visual Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-3">
            <div>
              <h3 className="font-bold text-stone-900 text-base font-['Montserrat']">
                Sales & Orders Overview
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Real customer transactions recorded in Wapda Town
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setChartRange('7days')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  chartRange === '7days' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-600'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setChartRange('monthly')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  chartRange === 'monthly' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setChartRange('yearly')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  chartRange === 'yearly' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-600'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="pt-6">
            <div className="h-60 flex items-end justify-between gap-3 sm:gap-6 pt-4 pb-2">
              {last7Days.map((day) => {
                const heightPct = Math.max(12, Math.round((day.sales / maxSale) * 100));
                const dayLabel = new Date(day.date).toLocaleDateString('en-PK', { weekday: 'short' });
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="text-[10px] text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono tabular-nums">
                      PKR {day.sales.toLocaleString()}
                    </div>
                    <div
                      className="w-full bg-[#153D2C] hover:bg-[#3C8053] rounded-t-md transition-all duration-300 relative"
                      style={{ height: `${heightPct}%` }}
                    >
                      {day.orders > 0 && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-stone-700 font-mono">
                          {day.orders}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-stone-600">{dayLabel}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Peak Day Sales: PKR {maxSale.toLocaleString()}</span>
              <span>Total orders in window: {last7Days.reduce((a, b) => a + b.orders, 0)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Best Selling Products & Activity (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Top Sellers */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs">
            <h3 className="font-bold text-stone-900 text-sm font-['Montserrat'] mb-3 flex items-center justify-between">
              <span>Best-Selling Products</span>
              <span className="text-[11px] text-stone-400 font-normal">By volume</span>
            </h3>

            {topProducts.length === 0 ? (
              <p className="text-xs text-stone-400 py-4 text-center">No sales recorded yet.</p>
            ) : (
              <div className="divide-y divide-stone-100">
                {topProducts.map((p, idx) => (
                  <div key={p.sku} className="py-2.5 flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-stone-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-stone-400 font-mono">SKU: {p.sku}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#153D2C] font-mono tabular-nums block">
                        {p.quantity} units
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        PKR {p.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs">
            <h3 className="font-bold text-stone-900 text-sm font-['Montserrat'] mb-3">
              Recent Admin Activity
            </h3>
            <div className="space-y-3">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-stone-400 py-3 text-center">No logged activity yet.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-800">{log.userName}</span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-snug">{log.details}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-base font-['Montserrat']">
              Recent Store Orders
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Latest customer purchases</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-[#3C8053] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50/70 border-b border-stone-200 text-stone-600 font-semibold">
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Destination</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-stone-900">
                      {ord.orderNumber}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-stone-800">{ord.customerName}</div>
                      <div className="text-[11px] text-stone-400 font-mono">{ord.customerPhone}</div>
                    </td>
                    <td className="p-3.5 text-stone-600">
                      <div className="truncate max-w-[140px]">{ord.deliveryZoneName}</div>
                    </td>
                    <td className="p-3.5 text-stone-600 font-mono">
                      {ord.items.reduce((s, it) => s + it.quantity, 0)} items
                    </td>
                    <td className="p-3.5 font-bold font-mono text-[#153D2C] tabular-nums">
                      PKR {ord.total.toLocaleString()}
                    </td>
                    <td className="p-3.5 uppercase font-medium text-[11px]">
                      <span className={ord.paymentStatus === 'Paid' ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                        {ord.paymentMethod} ({ord.paymentStatus})
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getStatusBadge(ord.orderStatus)}`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onOpenOrder(ord)}
                        className="p-1.5 rounded hover:bg-stone-100 text-stone-500 hover:text-stone-800"
                        title="View order details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
