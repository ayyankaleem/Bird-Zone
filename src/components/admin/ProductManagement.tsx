import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  ArrowUpDown,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { api, ProductFormData, DBCategoryData } from '../../services/api';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [categories, setCategories] = useState<DBCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductFormData> | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({
        category: selectedCategory,
        search,
        status: selectedStatus,
        sort: sortBy,
        page: page.toString(),
        limit: '20',
        admin: 'true',
      });
      setProducts(res.products);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedStatus, sortBy, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleOpenAddModal = () => {
    const firstCat = categories[0] || { id: 'cat-exotic-birds', name: 'Exotic Birds' };
    setEditingProduct({
      name: '',
      nameUrdu: '',
      sku: `BZ-${Math.floor(100 + Math.random() * 900)}`,
      categoryId: firstCat.id,
      categoryName: firstCat.name,
      shortDescription: '',
      description: '',
      regularPrice: 1000,
      stockQuantity: 10,
      lowStockThreshold: 2,
      availabilityStatus: 'in_stock',
      productStatus: 'published',
      productType: 'Bird',
      isFeatured: false,
      mainImage: '/src/assets/images/hero_colorful_parrot_1790931293239.jpg',
      galleryImages: ['/src/assets/images/hero_colorful_parrot_1790931293239.jpg'],
      deliveryEligibility: 'all',
      tags: [],
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (product: ProductFormData) => {
    setEditingProduct({ ...product });
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.regularPrice || !editingProduct?.sku) {
      setFormError('Please fill in product name, SKU, and regular price.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      if (editingProduct.id) {
        await api.updateProduct(editingProduct.id, editingProduct);
      } else {
        await api.createProduct(editingProduct);
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }
    try {
      await api.deleteProduct(id);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  const handleDuplicateProduct = async (id: string) => {
    try {
      await api.duplicateProduct(id);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate product.');
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      if (isGallery) {
        setEditingProduct((prev) => ({
          ...prev,
          galleryImages: [...(prev?.galleryImages || []), res.url],
        }));
      } else {
        setEditingProduct((prev) => ({
          ...prev,
          mainImage: res.url,
          galleryImages: prev?.galleryImages?.length ? prev.galleryImages : [res.url],
        }));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleBulkAction = async (action: string, value?: any) => {
    if (selectedIds.length === 0) return;
    if (action === 'delete' && !window.confirm(`Delete ${selectedIds.length} selected products?`)) {
      return;
    }

    try {
      await api.bulkProducts(selectedIds, action, value);
      setSelectedIds([]);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to complete bulk action.');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id!));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-['Montserrat']">
            Product Catalog
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your live store products, pricing, stock levels, and avian attributes.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#153D2C] hover:bg-[#3C8053] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search product name, SKU, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-hidden focus:border-[#3C8053]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="text-xs border border-stone-200 rounded-lg px-2.5 py-2 bg-stone-50 text-stone-700 focus:outline-hidden focus:border-[#3C8053]"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="text-xs border border-stone-200 rounded-lg px-2.5 py-2 bg-stone-50 text-stone-700 focus:outline-hidden focus:border-[#3C8053]"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs border border-stone-200 rounded-lg px-2.5 py-2 bg-stone-50 text-stone-700 focus:outline-hidden focus:border-[#3C8053]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock-asc">Lowest Stock First</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-stone-800 text-white rounded-lg text-xs font-semibold hover:bg-stone-900 transition-colors"
            >
              Filter
            </button>
          </div>
        </form>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-stone-50 px-3 py-2 rounded-lg">
            <span className="font-semibold text-stone-700">
              {selectedIds.length} products selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('status', 'published')}
                className="px-2.5 py-1 bg-white border border-stone-200 hover:bg-stone-100 rounded text-stone-700 font-medium"
              >
                Mark Published
              </button>
              <button
                onClick={() => handleBulkAction('status', 'draft')}
                className="px-2.5 py-1 bg-white border border-stone-200 hover:bg-stone-100 rounded text-stone-700 font-medium"
              >
                Mark Draft
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded font-medium"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === products.length}
                    onChange={toggleSelectAll}
                    className="rounded border-stone-300 text-[#153D2C] focus:ring-[#3C8053]"
                  />
                </th>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Price (PKR)</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const isSelected = selectedIds.includes(prod.id!);
                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-stone-50 transition-colors ${
                        isSelected ? 'bg-[#3C8053]/5' : ''
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(prod.id!)}
                          className="rounded border-stone-300 text-[#153D2C] focus:ring-[#3C8053]"
                        />
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.mainImage}
                            alt={prod.name}
                            className="w-11 h-11 rounded-lg object-cover border border-stone-200 shrink-0 bg-stone-50"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-stone-900 truncate flex items-center gap-1.5">
                              <span>{prod.name}</span>
                              {prod.isFeatured && (
                                <span className="text-[10px] font-bold bg-[#E9BE69] text-stone-900 px-1.5 py-0.2 rounded">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-400 font-sans" dir="rtl">
                              {prod.nameUrdu}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-stone-600">{prod.categoryName}</td>
                      <td className="p-3.5 font-mono text-stone-500 font-medium">{prod.sku}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-[#153D2C] font-mono tabular-nums">
                          PKR {(prod.salePrice || prod.regularPrice).toLocaleString()}
                        </div>
                        {prod.salePrice && (
                          <div className="text-[10px] text-stone-400 line-through font-mono tabular-nums">
                            PKR {prod.regularPrice.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`font-mono font-bold tabular-nums ${
                            prod.stockQuantity <= 0
                              ? 'text-red-600'
                              : prod.stockQuantity <= prod.lowStockThreshold
                              ? 'text-amber-600'
                              : 'text-stone-800'
                          }`}
                        >
                          {prod.stockQuantity} units
                        </span>
                        <div className="text-[10px] text-stone-400 capitalize">
                          {prod.availabilityStatus.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                            prod.productStatus === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prod.productStatus === 'draft'
                              ? 'bg-stone-100 text-stone-700'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {prod.productStatus}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 text-stone-500">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="p-1.5 hover:text-[#153D2C] hover:bg-stone-100 rounded"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateProduct(prod.id!)}
                            className="p-1.5 hover:text-[#3C8053] hover:bg-stone-100 rounded"
                            title="Duplicate product"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id!, prod.name)}
                            className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
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

      {/* Product Add / Edit Modal Drawer */}
      {modalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-stone-900 font-['Montserrat']">
                  {editingProduct.id ? `Edit: ${editingProduct.name}` : 'Create New Store Product'}
                </h3>
                <p className="text-xs text-stone-500">
                  Update inventory, pricing in PKR, avian health details, and gallery photos.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-800 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-6">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* General Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-['Montserrat']">
                  1. Essential Identification & Category
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Product Name (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cockatiel Pair (Lutino & Pearl)"
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#3C8053]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Product Name (Urdu - برائے پرندہ یا پنجرہ)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      placeholder="کوکاٹیل جوڑا"
                      value={editingProduct.nameUrdu || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nameUrdu: e.target.value })}
                      className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#3C8053]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editingProduct.categoryId || ''}
                      onChange={(e) => {
                        const cat = categories.find((c) => c.id === e.target.value);
                        setEditingProduct({
                          ...editingProduct,
                          categoryId: e.target.value,
                          categoryName: cat?.name || '',
                        });
                      }}
                      className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 bg-white focus:outline-hidden focus:border-[#3C8053]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Product Type
                    </label>
                    <select
                      value={editingProduct.productType || 'Bird'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, productType: e.target.value as any })}
                      className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 bg-white focus:outline-hidden focus:border-[#3C8053]"
                    >
                      <option value="Bird">Live Bird (طوطا / پرندہ)</option>
                      <option value="Cage">Cage & Aviary (پنجرہ)</option>
                      <option value="Feed">Feed & Seed (فیڈ)</option>
                      <option value="Toy">Toy & Enrichment (کھلونا)</option>
                      <option value="Accessory">Accessory & Bowls (برتن)</option>
                      <option value="Other">Other Pet Supply</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      SKU (Unique Code) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="BZ-BRD-001"
                      value={editingProduct.sku || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value.toUpperCase() })}
                      className="w-full text-xs border border-stone-300 rounded px-3 py-2 font-mono text-stone-800 focus:outline-hidden focus:border-[#3C8053]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Short Summary (Displayed on Product Card)
                  </label>
                  <input
                    type="text"
                    placeholder="Brief 1-sentence teaser"
                    value={editingProduct.shortDescription || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                    className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#3C8053]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Comprehensive Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Full specifications, dimensions, pedigree, vaccination, and features..."
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#3C8053]"
                  />
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-['Montserrat']">
                  2. Pricing & Stock Control
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Regular Price (PKR) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingProduct.regularPrice || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, regularPrice: Number(e.target.value) })}
                      className="w-full text-xs border border-stone-300 rounded px-3 py-2 font-mono font-bold text-stone-900 focus:outline-hidden focus:border-[#3C8053]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Sale Price (PKR, Optional)
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Leave blank if none"
                      value={editingProduct.salePrice || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          salePrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      className="w-full text-xs border border-stone-300 rounded px-3 py-2 font-mono text-[#E9BE69] font-bold focus:outline-hidden focus:border-[#3C8053]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editingProduct.stockQuantity ?? 10}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                      className="w-full text-xs border border-stone-300 rounded px-3 py-2 font-mono text-stone-900 focus:outline-hidden focus:border-[#3C8053]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Low-Stock Warning At
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editingProduct.lowStockThreshold ?? 2}
                      onChange={(e) => setEditingProduct({ ...editingProduct, lowStockThreshold: Number(e.target.value) })}
                      className="w-full text-xs border border-stone-300 rounded px-3 py-2 font-mono text-stone-900 focus:outline-hidden focus:border-[#3C8053]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Publication Status
                    </label>
                    <select
                      value={editingProduct.productStatus || 'published'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, productStatus: e.target.value as any })}
                      className="w-full text-xs border border-stone-300 rounded px-3 py-2 bg-white focus:outline-hidden focus:border-[#3C8053]"
                    >
                      <option value="published">Published (Visible in Shop)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Availability Rule
                    </label>
                    <select
                      value={editingProduct.availabilityStatus || 'in_stock'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, availabilityStatus: e.target.value as any })}
                      className="w-full text-xs border border-stone-300 rounded px-3 py-2 bg-white focus:outline-hidden focus:border-[#3C8053]"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="enquiry_only">Enquiry Only (Live Birds/Consultation)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={Boolean(editingProduct.isFeatured)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      className="rounded border-stone-300 text-[#153D2C] focus:ring-[#3C8053]"
                    />
                    <label htmlFor="isFeatured" className="text-xs font-semibold text-stone-800 cursor-pointer">
                      Feature on Storefront Homepage
                    </label>
                  </div>
                </div>
              </div>

              {/* Live Bird Specific Fields */}
              {editingProduct.productType === 'Bird' && (
                <div className="space-y-4 pt-4 border-t border-stone-100 bg-[#3C8053]/5 p-4 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#153D2C] font-['Montserrat'] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#3C8053]" />
                    <span>3. Live Avian Specific Data (Species & Temperament)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Avian Species / Mutation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Nymphicus hollandicus"
                        value={editingProduct.species || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, species: e.target.value })}
                        className="w-full text-xs border border-stone-300 rounded px-3 py-2 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Age Range
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10-12 months"
                        value={editingProduct.ageRange || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, ageRange: e.target.value })}
                        className="w-full text-xs border border-stone-300 rounded px-3 py-2 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Delivery Eligibility
                      </label>
                      <select
                        value={editingProduct.deliveryEligibility || 'lahore_only'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, deliveryEligibility: e.target.value as any })}
                        className="w-full text-xs border border-stone-300 rounded px-3 py-2 bg-white"
                      >
                        <option value="lahore_only">Lahore Only (Climate Rider)</option>
                        <option value="pickup_only">Wapda Town Store Pickup Only</option>
                        <option value="all">Nationwide Deliverable</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="handTamed"
                      checked={Boolean(editingProduct.handTamed)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, handTamed: e.target.checked })}
                      className="rounded border-stone-300 text-[#153D2C] focus:ring-[#3C8053]"
                    />
                    <label htmlFor="handTamed" className="text-xs font-semibold text-stone-800 cursor-pointer">
                      Hand-Tamed / Family Friendly Behavior Verified
                    </label>
                  </div>
                </div>
              )}

              {/* Images & Gallery Management */}
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-['Montserrat']">
                  4. Product Images (Persistent Server Storage)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Main Image */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Main Product Photo
                    </label>
                    <div className="flex items-center gap-3">
                      <img
                        src={editingProduct.mainImage}
                        alt="Preview"
                        className="w-20 h-20 rounded-lg object-cover border border-stone-300 shrink-0 bg-stone-50"
                      />
                      <div className="flex-1">
                        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold cursor-pointer border border-stone-300">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingImage ? 'Uploading...' : 'Upload Image from Computer'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileUpload(e, false)}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[10px] text-stone-400 mt-1">
                          JPG, PNG, WebP up to 5MB. Saved directly to server storage.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image Alt */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Image Alt Text (SEO & Accessibility)
                    </label>
                    <input
                      type="text"
                      placeholder="Descriptive image caption"
                      value={editingProduct.imageAlt || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageAlt: e.target.value })}
                      className="w-full text-xs border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#3C8053]"
                    />
                  </div>
                </div>

                {/* Additional Gallery Images */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-stone-700">
                      Additional Gallery Images ({editingProduct.galleryImages?.length || 0})
                    </label>
                    <label className="text-xs text-[#3C8053] font-semibold hover:underline cursor-pointer flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Gallery Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, true)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {editingProduct.galleryImages?.map((url, idx) => (
                      <div key={idx} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-stone-300">
                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProduct({
                              ...editingProduct,
                              galleryImages: editingProduct.galleryImages?.filter((_, i) => i !== idx),
                            })
                          }
                          className="absolute inset-0 bg-red-900/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg bg-[#153D2C] hover:bg-[#3C8053] text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving...' : editingProduct.id ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
