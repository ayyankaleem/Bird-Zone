import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, DollarSign, ShoppingBag, Truck, TicketPercent } from 'lucide-react';
import { api, ReportsData } from '../../services/api';

export const ReportsAnalytics: React.FC = () => {
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await api.getReports();
        setReports(data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    if (!reports) return;
    const { metrics, topProducts, last7Days } = reports;
    const rows = [
      ['Metric', 'Value'],
      ['Total Orders', metrics.totalOrders],
      ['Valid Orders (Excluding Cancelled)', metrics.validOrdersCount],
      ['Cancelled Orders', metrics.cancelledOrdersCount],
      ['Gross Sales (PKR)', metrics.totalGrossSales],
      ['Delivery Collected (PKR)', metrics.totalDeliveryCollected],
      ['Discounts Given (PKR)', metrics.totalDiscountsGiven],
      ['Net Revenue (PKR)', metrics.netRevenue],
      ['', ''],
      ['Top Product', 'SKU', 'Units Sold', 'Revenue (PKR)'],
      ...topProducts.map((p) => [p.name, p.sku, p.quantity, p.revenue]),
      ['', ''],
      ['Date', 'Daily Sales (PKR)', 'Orders Count'],
      ...last7Days.map((d) => [d.date, d.sales, d.orders]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `birdzone_financial_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !reports) {
    return (
      <div className="py-12 text-center text-xs text-stone-400">
        Loading financial analytics...
      </div>
    );
  }

  const { metrics, statusCounts, paymentCounts, topProducts, last7Days } = reports;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-['Montserrat']">
            Store Performance & Financial Reports
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Transparent revenue tracking derived strictly from live database records.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-stone-500" />
          <span>Export Financial CSV</span>
        </button>
      </div>

      {/* Revenue Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Gross Product Sales</span>
            <DollarSign className="w-4 h-4 text-stone-400" />
          </div>
          <span className="text-xl font-black text-stone-900 font-mono tabular-nums">
            PKR {metrics.totalGrossSales.toLocaleString()}
          </span>
          <p className="text-[10px] text-stone-400 mt-1">Item base sales before fees</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Delivery Fees</span>
            <Truck className="w-4 h-4 text-[#3C8053]" />
          </div>
          <span className="text-xl font-black text-stone-900 font-mono tabular-nums">
            PKR {metrics.totalDeliveryCollected.toLocaleString()}
          </span>
          <p className="text-[10px] text-stone-400 mt-1">Rider shipping charges</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Discounts Given</span>
            <TicketPercent className="w-4 h-4 text-[#E9BE69]" />
          </div>
          <span className="text-xl font-black text-amber-700 font-mono tabular-nums">
            -PKR {metrics.totalDiscountsGiven.toLocaleString()}
          </span>
          <p className="text-[10px] text-stone-400 mt-1">Coupons & promo deductions</p>
        </div>

        <div className="p-4 bg-[#153D2C] text-white rounded-xl border border-[#153D2C] shadow-xs">
          <div className="flex items-center justify-between text-stone-300 mb-1">
            <span className="text-xs font-semibold text-[#E9BE69]">Net Order Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#E9BE69]" />
          </div>
          <span className="text-2xl font-black text-white font-mono tabular-nums">
            PKR {metrics.netRevenue.toLocaleString()}
          </span>
          <p className="text-[10px] text-stone-300 mt-1">Completed & pending orders</p>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Payment Methods Breakdown */}
        <div className="p-5 bg-white rounded-xl border border-stone-200/80 shadow-xs">
          <h3 className="font-bold text-stone-900 text-sm font-['Montserrat'] mb-3">
            Payment Methods Share
          </h3>
          <div className="space-y-3">
            {Object.entries(paymentCounts).map(([method, data]) => {
              const pct = metrics.netRevenue > 0 ? Math.round((data.total / metrics.netRevenue) * 100) : 0;
              return (
                <div key={method} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase text-stone-800">{method}</span>
                    <span className="font-mono text-stone-600">
                      PKR {data.total.toLocaleString()} ({data.count} orders · {pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#3C8053] h-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="p-5 bg-white rounded-xl border border-stone-200/80 shadow-xs">
          <h3 className="font-bold text-stone-900 text-sm font-['Montserrat'] mb-3">
            Orders Lifecycle Breakdown
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-stone-500 block text-[11px]">{status}</span>
                <span className="text-lg font-bold text-stone-900 font-mono mt-0.5 block">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
