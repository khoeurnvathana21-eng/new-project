// ============================================================
// BootZone Admin - Categories & Brands Management
// File: client/src/pages/admin/Categories.jsx
// ============================================================

import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiTag } from 'react-icons/fi';
import { catalogService } from '../../services/catalogService.js';
import Loader from '../../components/Loader.jsx';
import { slugify } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(null); // 'brand' | 'category' | null
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [br, cat] = await Promise.all([catalogService.getBrands(), catalogService.getCategories()]);
      setBrands(br.data.brands);
      setCategories(cat.data.categories);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (type, id) => {
    if (!confirm(`Delete this ${type}?`)) return;
    try {
      if (type === 'brand') await catalogService.deleteBrand(id);
      else await catalogService.deleteCategory(id);
      toast.success(`${type} deleted`);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader size="lg" label="Loading..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-ink-900">Categories & Brands</h1>
        <p className="mt-1 text-sm text-ink-500">Manage your catalog structure</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Brands */}
        <div className="card-bz p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900">Brands ({brands.length})</h2>
            <button
              onClick={() => { setEditing(null); setShowForm('brand'); }}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-flame-600"
            >
              <FiPlus className="h-3.5 w-3.5" /> Add Brand
            </button>
          </div>
          <div className="space-y-2">
            {brands.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                <div>
                  <div className="text-sm font-semibold text-ink-900">{b.name}</div>
                  <div className="text-xs text-ink-500">{b.product_count} products</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditing(b); setShowForm('brand'); }}
                    className="rounded-lg p-2 text-ink-500 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('brand', b.id)}
                    className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="card-bz p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900">Categories ({categories.length})</h2>
            <button
              onClick={() => { setEditing(null); setShowForm('category'); }}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-flame-600"
            >
              <FiPlus className="h-3.5 w-3.5" /> Add Category
            </button>
          </div>
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                    <FiTag className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink-900">{c.name}</div>
                    <div className="text-xs text-ink-500">{c.product_count} products</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditing(c); setShowForm('category'); }}
                    className="rounded-lg p-2 text-ink-500 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('category', c.id)}
                    className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <CatalogForm
          type={showForm}
          item={editing}
          onClose={() => setShowForm(null)}
          onSaved={() => { setShowForm(null); load(); }}
        />
      )}
    </div>
  );
};

const CatalogForm = ({ type, item, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: item?.name || '',
    slug: item?.slug || '',
    description: item?.description || '',
    logo: item?.logo || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || slugify(form.name) };
      if (type === 'brand') {
        if (item) await catalogService.updateBrand(item.id, payload);
        else await catalogService.createBrand(payload);
      } else {
        if (item) await catalogService.updateCategory(item.id, payload);
        else await catalogService.createCategory(payload);
      }
      toast.success(`${type} saved`);
      onSaved();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">
            {item ? 'Edit' : 'Add'} {type === 'brand' ? 'Brand' : 'Category'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-ink-100"><FiX className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-bz">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-bz" />
          </div>
          <div>
            <label className="label-bz">Slug (optional)</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className="input-bz" />
          </div>
          <div>
            <label className="label-bz">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-bz resize-none" />
          </div>
          {type === 'brand' && (
            <div>
              <label className="label-bz">Logo URL</label>
              <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="input-bz" />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCategories;
