import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, ShoppingBag, Eye, Calendar, X, MapPin } from 'lucide-react';
import { api, CustomerData, OrderData } from '../../services/api';

export const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<{ customer: CustomerData; orders: OrderData[] } | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.getCustomers(search);
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleOpenCustomer = async (id: string) => {
    setLoadingProfile(true);
    try {
      const data = await api.getCustomer(id);
      setSelectedCustomer(data);
    } catch (err: any) {
      alert(err.message || 'Failed to open customer details.');
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 font-['Montserrat']">
          Customer Database
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Directory of bird parents, repeat buyers, and contact profiles in Lahore.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
        <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by customer name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-hidden focus:border-[#3C8053]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-stone-800 text-white rounded-lg text-xs font-semibold hover:bg-stone-900"
          >
            Search
          </button>
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Contact Phone</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Total Orders</th>
                <th className="p-3.5">Total Spent (PKR)</th>
                <th className="p-3.5">Last Order</th>
                <th className="p-3.5 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    No customer accounts found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3.5 font-bold text-stone-900">{c.name}</td>
                    <td className="p-3.5 font-mono text-stone-700">{c.phone}</td>
                    <td className="p-3.5 text-stone-500">{c.email || '—'}</td>
                    <td className="p-3.5 font-mono font-bold text-stone-800">
                      {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[#153D2C] tabular-nums">
                      PKR {c.totalSpent.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-stone-500 font-mono text-[11px]">
                      {new Date(c.lastOrderDate).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleOpenCustomer(c.id)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-semibold text-xs"
                      >
                        View History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile & Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-base font-['Montserrat']">
                  {selectedCustomer.customer.name}
                </h3>
                <p className="text-xs text-stone-500">
                  Customer Profile & Purchase History
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-500 block">Phone:</span>
                  <span className="font-mono font-bold text-stone-900">{selectedCustomer.customer.phone}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Lifetime Orders:</span>
                  <span className="font-mono font-bold text-stone-900">{selectedCustomer.customer.totalOrders}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Total Spend:</span>
                  <span className="font-mono font-bold text-[#153D2C]">
                    PKR {selectedCustomer.customer.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Status:</span>
                  <span className="font-bold text-emerald-700 capitalize">{selectedCustomer.customer.status}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Delivery Addresses on File
                </h4>
                <div className="space-y-1.5">
                  {selectedCustomer.customer.addresses.map((addr, i) => (
                    <div key={i} className="p-2.5 bg-white border border-stone-200 rounded-lg flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#3C8053] shrink-0" />
                      <span className="text-stone-700">{addr}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Past Orders ({selectedCustomer.orders.length})
                </h4>
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                      <tr>
                        <th className="p-2.5">Order #</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Items</th>
                        <th className="p-2.5">Total</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-mono">
                      {selectedCustomer.orders.map((o) => (
                        <tr key={o.id}>
                          <td className="p-2.5 font-bold text-stone-900">{o.orderNumber}</td>
                          <td className="p-2.5 text-stone-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td className="p-2.5 font-sans">{o.items.length} items</td>
                          <td className="p-2.5 font-bold text-[#153D2C]">PKR {o.total.toLocaleString()}</td>
                          <td className="p-2.5 font-sans">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-800">
                              {o.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-1.5 bg-stone-800 text-white rounded text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
