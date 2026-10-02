import React, { useState, useEffect } from 'react';
import {
  Boxes,
  AlertTriangle,
  XCircle,
  TrendingDown,
  TrendingUp,
  History,
  Search,
  CheckCircle,
  X,
  Edit3,
} from 'lucide-react';
import { api, ProductFormData, InventoryMovementData } from '../../services/api';

export const InventoryManagement: React.FC = () => {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalUnits: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });
  const [lowStock, setLowStock] = useState<ProductFormData[]>([]);
  const [outOfStock, setOutOfStock] = useState<ProductFormData[]>([]);
  const [movements, setMovements] = useState<InventoryMovementData[]>([]);
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Adjustment Modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductFormData | null>(null);
  const [targetStock, setTargetStock] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('restock');
  const [adjustNotes, setAdjustNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [inv, prodRes] = await Promise.all([
        api.getInventory(),
        api.getProducts({ admin: 'true', limit: '100' }),
      ]);
      setSummary(inv.summary);
      setLowStock(inv.lowStock);
      setOutOfStock(inv.outOfStock);
      setMovements(inv.recentMovements);
      setProducts(prodRes.products);
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenAdjust = (prod: ProductFormData) => {
    setSelectedProduct(prod);
    setTargetStock(prod.stockQuantity);
    setAdjustReason('restock');
    setAdjustNotes('');
    setAdjustModalOpen(true);
  };

  const handleConfirmAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setSubmitting(true);
    try {
      await api.adjustStock(
        selectedProduct.id!,
        targetStock,
        adjustReason,
        adjustNotes || undefined
      );
      setAdjustModalOpen(false);
      fetchInventory();
    } catch (err: any) {
      alert(err.message || 'Failed to update stock quantity.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 font-['Montserrat']">
          Inventory Control & Stock Movements
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Real-time physical stock counts at Bird Zone Wapda Town aviary and store.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 block">Total Catalog Items</span>
          <span className="text-2xl font-black text-stone-900 font-mono mt-1 block">
            {summary.totalProducts}
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 block">Total Units in Stock</span>
          <span className="text-2xl font-black text-[#153D2C] font-mono mt-1 block">
            {summary.totalUnits}
          </span>
        </div>

        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 shadow-xs">
          <span className="text-xs text-amber-800 font-semibold block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock Items</span>
          </span>
          <span className="text-2xl font-black text-amber-700 font-mono mt-1 block">
            {summary.lowStockCount}
          </span>
        </div>

        <div className="p-4 bg-red-50/60 rounded-xl border border-red-200 shadow-xs">
          <span className="text-xs text-red-800 font-semibold block flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Out of Stock Items</span>
          </span>
          <span className="text-2xl font-black text-red-700 font-mono mt-1 block">
            {summary.outOfStockCount}
          </span>
        </div>
      </div>

      {/* Low & Out of Stock Urgent Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="bg-white p-5 rounded-xl border border-amber-200/80 shadow-xs">
          <h3 className="font-bold text-amber-900 text-sm font-['Montserrat'] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Urgent Stock Replenishment Required</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {outOfStock.map((prod) => (
              <div
                key={prod.id}
                className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-xs text-red-900 block truncate max-w-[220px]">
                    {prod.name}
                  </span>
                  <span className="text-[11px] text-red-700 font-mono">
                    SKU: {prod.sku} · Out of Stock (0 units)
                  </span>
                </div>
                <button
                  onClick={() => handleOpenAdjust(prod)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  Restock Now
                </button>
              </div>
            ))}

            {lowStock.map((prod) => (
              <div
                key={prod.id}
                className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-xs text-amber-900 block truncate max-w-[220px]">
                    {prod.name}
                  </span>
                  <span className="text-[11px] text-amber-700 font-mono">
                    SKU: {prod.sku} · Only {prod.stockQuantity} remaining (Threshold: {prod.lowStockThreshold})
                  </span>
                </div>
                <button
                  onClick={() => handleOpenAdjust(prod)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  Adjust Stock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Management Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-stone-900 text-sm font-['Montserrat']">
            All Inventory Levels
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search product or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                <th className="p-3">Product Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Low Threshold</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-3 font-semibold text-stone-900">{prod.name}</td>
                  <td className="p-3 font-mono text-stone-500">{prod.sku}</td>
                  <td className="p-3 text-stone-600">{prod.categoryName}</td>
                  <td className="p-3 font-mono font-bold tabular-nums text-stone-900">
                    {prod.stockQuantity} units
                  </td>
                  <td className="p-3 font-mono text-stone-500">{prod.lowStockThreshold} units</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        prod.stockQuantity <= 0
                          ? 'bg-red-100 text-red-800'
                          : prod.stockQuantity <= prod.lowStockThreshold
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {prod.availabilityStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleOpenAdjust(prod)}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-xs flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Adjust</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movements Audit Trail Ledger */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-sm font-['Montserrat'] flex items-center gap-2">
              <History className="w-4 h-4 text-[#3C8053]" />
              <span>Stock Movement Audit Trail</span>
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Automated tracking for sales, cancellations, restocks, and manual corrections.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold sticky top-0">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Previous</th>
                <th className="p-3">Change</th>
                <th className="p-3">New Stock</th>
                <th className="p-3">Logged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {movements.map((mov) => (
                <tr key={mov.id} className="hover:bg-stone-50/60 font-mono text-[11px]">
                  <td className="p-3 text-stone-500">
                    {new Date(mov.timestamp).toLocaleString('en-PK', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="p-3 font-sans font-semibold text-stone-800">
                    {mov.productName}
                  </td>
                  <td className="p-3 text-stone-500">{mov.sku}</td>
                  <td className="p-3 uppercase font-semibold text-stone-700 font-sans">
                    {mov.reason.replace('_', ' ')}
                  </td>
                  <td className="p-3 text-stone-600">{mov.previousStock}</td>
                  <td className={`p-3 font-bold ${mov.changeAmount > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {mov.changeAmount > 0 ? `+${mov.changeAmount}` : mov.changeAmount}
                  </td>
                  <td className="p-3 font-bold text-stone-900">{mov.newStock}</td>
                  <td className="p-3 font-sans text-stone-500">{mov.adminName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Stock Adjustment Dialog */}
      {adjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-stone-900 text-sm font-['Montserrat']">
                  Adjust Inventory Quantity
                </h3>
                <p className="text-[11px] text-stone-500">{selectedProduct.name} ({selectedProduct.sku})</p>
              </div>
              <button onClick={() => setAdjustModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjust} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-lg">
                <div>
                  <span className="text-stone-500 block">Current Stock:</span>
                  <span className="font-mono font-bold text-stone-900 text-base">
                    {selectedProduct.stockQuantity} units
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Low Threshold:</span>
                  <span className="font-mono font-bold text-stone-700 text-base">
                    {selectedProduct.lowStockThreshold} units
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  New Target Physical Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={targetStock}
                  onChange={(e) => setTargetStock(Number(e.target.value))}
                  className="w-full p-2 border border-stone-300 rounded font-mono font-bold text-stone-900 text-sm focus:outline-hidden focus:border-[#3C8053]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Reason for Adjustment <span className="text-red-500">*</span>
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded bg-white text-stone-800 focus:outline-hidden focus:border-[#3C8053]"
                >
                  <option value="restock">New Stock Delivery / Supplier Purchase</option>
                  <option value="manual_adjustment">Physical Audit Count Discrepancy</option>
                  <option value="damage">Damaged Goods / Expired Seed Feed</option>
                  <option value="return">Customer In-Store Return</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Reference Note / Invoice Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Supplier Invoice #9128 or Annual Stocktake"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded text-stone-800 focus:outline-hidden focus:border-[#3C8053]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#153D2C] hover:bg-[#3C8053] text-white font-semibold rounded shadow-xs"
                >
                  {submitting ? 'Updating...' : 'Record Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
