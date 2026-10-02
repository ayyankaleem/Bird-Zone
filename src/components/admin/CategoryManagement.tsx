import React, { useState, useEffect } from 'react';
import {
  Plus,
  Layers,
  Edit2,
  Trash2,
  X,
  Upload,
  AlertCircle,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { api, DBCategoryData } from '../../services/api';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<DBCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<DBCategoryData> | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState<DBCategoryData | null>(null);
  const [reassignTargetId, setReassignTargetId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory({
      name: '',
      nameUrdu: '',
      description: '',
      thumbnail: '/src/assets/images/product_spacious_bird_cage_1790931327322.jpg',
      iconName: 'Bird',
      displayOrder: (categories.length + 1) * 10,
      active: true,
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: DBCategoryData) => {
    setEditingCategory({ ...cat });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) {
      setError('Category name is required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (editingCategory.id) {
        await api.updateCategory(editingCategory.id, editingCategory);
      } else {
        await api.createCategory(editingCategory);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (cat: DBCategoryData) => {
    setCatToDelete(cat);
    const otherCats = categories.filter((c) => c.id !== cat.id);
    setReassignTargetId(otherCats[0]?.id || '');
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!catToDelete) return;
    try {
      await api.deleteCategory(catToDelete.id, reassignTargetId || undefined);
      setDeleteModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      setEditingCategory((prev) => ({ ...prev, thumbnail: res.url }));
    } catch (err: any) {
      alert(err.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-['Montserrat']">
            Store Categories
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize products into intuitive collections for Lahore customers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#153D2C] hover:bg-[#3C8053] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-stone-400 text-xs">
            Loading categories...
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:border-stone-300 transition-all group"
            >
              <div>
                <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden">
                  <img
                    src={cat.thumbnail}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-bold text-stone-800 shadow-xs">
                    <span>{cat.productCount || 0} products</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-stone-900 text-sm font-['Montserrat']">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-stone-400 font-mono">
                      Order: {cat.displayOrder}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-sans" dir="rtl">
                    {cat.nameUrdu}
                  </p>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description || 'No description entered.'}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    cat.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {cat.active ? 'Active' : 'Hidden'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 hover:text-[#153D2C] hover:bg-stone-200/60 rounded text-stone-600"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(cat)}
                    className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded text-stone-400"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm font-['Montserrat']">
                {editingCategory.id ? `Edit: ${editingCategory.name}` : 'New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              {error && (
                <div className="p-2.5 rounded bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Category Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exotic Birds"
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#3C8053]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Category Name (Urdu - اردو نام)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  placeholder="طوطے اور نایاب پرندے"
                  value={editingCategory.nameUrdu || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, nameUrdu: e.target.value })}
                  className="w-full border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#3C8053]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingCategory.displayOrder || 10}
                    onChange={(e) => setEditingCategory({ ...editingCategory, displayOrder: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded px-3 py-2 font-mono text-stone-800 focus:outline-hidden focus:border-[#3C8053]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="catActive"
                    checked={Boolean(editingCategory.active)}
                    onChange={(e) => setEditingCategory({ ...editingCategory, active: e.target.checked })}
                    className="rounded border-stone-300 text-[#153D2C] focus:ring-[#3C8053]"
                  />
                  <label htmlFor="catActive" className="font-semibold text-stone-800 cursor-pointer">
                    Visible on Storefront
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Collection summary for customers"
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-hidden focus:border-[#3C8053]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Thumbnail Photo</label>
                <div className="flex items-center gap-3">
                  <img
                    src={editingCategory.thumbnail}
                    alt="Preview"
                    className="w-14 h-14 rounded-lg object-cover border border-stone-300 shrink-0"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold cursor-pointer border border-stone-300">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#153D2C] hover:bg-[#3C8053] text-white font-semibold rounded shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safe Category Deletion & Reassignment Modal */}
      {deleteModalOpen && catToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="font-bold text-stone-900 text-sm font-['Montserrat'] text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Category Deletion</span>
            </h3>

            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Are you sure you want to delete <strong>{catToDelete.name}</strong>?
              {catToDelete.productCount ? (
                <span className="block mt-2 text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                  This category contains <strong>{catToDelete.productCount}</strong> products. Please select a category to reassign them to so products are not orphaned.
                </span>
              ) : null}
            </p>

            {catToDelete.productCount ? (
              <div className="mt-3">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Reassign existing products to:
                </label>
                <select
                  value={reassignTargetId}
                  onChange={(e) => setReassignTargetId(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded px-2.5 py-1.5"
                >
                  {categories
                    .filter((c) => c.id !== catToDelete.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
            ) : null}

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow-xs"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
