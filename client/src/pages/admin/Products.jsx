// ============================================================
// BootZone Admin - Products Management
// File: client/src/pages/admin/Products.jsx
// ============================================================

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiBox
} from 'react-icons/fi';
import { productService } from '../../services/productService.js';
import { catalogService } from '../../services/catalogService.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatPrice, slugify } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productService.getProducts({ limit: 48, search });
      setProducts(data.products);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCatalog = async () => {
    const [br, cat] = await Promise.all([
      catalogService.getBrands(),
      catalogService.getCategories(),
    ]);
    setBrands(br.data.brands);
    setCategories(cat.data.categories);
  };

  useEffect(() => {
    loadProducts();
    loadCatalog();
  }, []);

  useEffect(() => {
    const t = setTimeout(loadProducts, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted');
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditing(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  if (loading) return <Loader size="lg" label="Loading products..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-ink-900">Products</h1>
          <p className="mt-1 text-sm text-ink-500">Manage your product catalog</p>
        </div>
        <button onClick={handleAdd} className="btn-primary">
          <FiPlus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-bz pl-12"
        />
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <EmptyState icon={FiBox} title="No products found" description="Add your first product to get started." actionLabel="Add Product" actionTo="#" />
      ) : (
        <div className="card-bz overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50">
                <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Brand</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Stock</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-ink-50 hover:bg-ink-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-ink-100">
                          {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />}
                        </div>
                        <div className="max-w-xs">
                          <div className="font-medium text-ink-900 line-clamp-1">{p.name}</div>
                          <div className="text-xs text-ink-500">{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-700">{p.brand_name}</td>
                    <td className="px-5 py-3 font-medium text-ink-900">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3">
                      <span className={`badge-bz ${p.stock < 10 ? 'bg-red-50 text-red-700' : 'bg-pitch-50 text-pitch-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge-bz ${p.is_active ? 'bg-pitch-50 text-pitch-700' : 'bg-ink-100 text-ink-600'}`}>
                        {p.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="rounded-lg p-2 text-ink-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <ProductForm
          product={editing}
          brands={brands}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            loadProducts();
          }}
        />
      )}
    </div>
  );
};

// Inline Product Form modal
const ProductForm = ({ product, brands, categories, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    compare_price: product?.compare_price || '',
    brand_id: product?.brand_id || brands[0]?.id || '',
    category_id: product?.category_id || categories[0]?.id || '',
    surface: product?.surface || 'Firm Ground',
    primary_color: product?.primary_color || '',
    sku: product?.sku || '',
    stock: product?.stock || 0,
    is_featured: product?.is_featured || false,
    is_new_arrival: product?.is_new_arrival || false,
    is_best_seller: product?.is_best_seller || false,
    is_active: product?.is_active ?? true,
    images: product?.images?.join('\n') || '',
    sizes: product?.sizes?.join(',') || '7,8,9,10,11',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        compare_price: form.compare_price ? Number(form.compare_price) : null,
        brand_id: Number(form.brand_id),
        category_id: Number(form.category_id),
        stock: Number(form.stock),
        slug: form.slug || slugify(form.name),
        images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (product) {
        await productService.updateProduct(product.id, payload);
        toast.success('Product updated');
      } else {
        await productService.createProduct(payload);
        toast.success('Product created');
      }
      onSaved();
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink-900">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-ink-100">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-bz">Product Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input-bz" />
          </div>
          <div>
            <label className="label-bz">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-bz resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-bz">Price ($)</label>
              <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required className="input-bz" />
            </div>
            <div>
              <label className="label-bz">Compare Price ($)</label>
              <input type="number" step="0.01" name="compare_price" value={form.compare_price} onChange={handleChange} className="input-bz" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-bz">Brand</label>
              <select name="brand_id" value={form.brand_id} onChange={handleChange} className="input-bz">
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label-bz">Category</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} className="input-bz">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label-bz">Surface</label>
              <input name="surface" value={form.surface} onChange={handleChange} className="input-bz" />
            </div>
            <div>
              <label className="label-bz">Color</label>
              <input name="primary_color" value={form.primary_color} onChange={handleChange} className="input-bz" />
            </div>
            <div>
              <label className="label-bz">Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} className="input-bz" />
            </div>
          </div>
          <div>
            <label className="label-bz">SKU</label>
            <input name="sku" value={form.sku} onChange={handleChange} className="input-bz" />
          </div>
          <div>
            <label className="label-bz">Image URLs (one per line)</label>
            <textarea name="images" value={form.images} onChange={handleChange} rows={3} className="input-bz resize-none" placeholder="https://..." />
          </div>
          <div>
            <label className="label-bz">Sizes (comma separated)</label>
            <input name="sizes" value={form.sizes} onChange={handleChange} className="input-bz" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { key: 'is_featured', label: 'Featured' },
              { key: 'is_new_arrival', label: 'New Arrival' },
              { key: 'is_best_seller', label: 'Best Seller' },
              { key: 'is_active', label: 'Active' },
            ].map((f) => (
              <label key={f.key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name={f.key} checked={form[f.key]} onChange={handleChange} className="h-4 w-4 accent-ink-900" />
                {f.label}
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminProducts;
