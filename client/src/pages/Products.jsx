// ============================================================
// BootZone Client - Products Page
// File: client/src/pages/Products.jsx
// Advanced filtering, sorting, pagination
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFilter, FiX, FiChevronDown, FiSliders, FiGrid, FiSearch
} from 'react-icons/fi';
import { productService } from '../services/productService.js';
import { catalogService } from '../services/catalogService.js';
import ProductCard from '../components/ProductCard.jsx';
import { ProductGridSkeleton } from '../components/ProductCardSkeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatPrice } from '../utils/helpers.js';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const sizes = ['6', '7', '8', '9', '10', '11', '12'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [surfaces, setSurfaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filters from URL
  const filters = {
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    surface: searchParams.get('surface') || '',
    size: searchParams.get('size') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  };

  // Load brands & surfaces once
  useEffect(() => {
    catalogService.getBrands().then(({ data }) => setBrands(data.brands)).catch(() => {});
    productService.getSurfaces().then(({ data }) => setSurfaces(data.surfaces)).catch(() => {});
  }, []);

  // Load products when filters change
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, limit: 12 };
      // Clean empty values
      Object.keys(params).forEach((k) => {
        if (params[k] === '' || params[k] === null) delete params[k];
      });
      const { data } = await productService.getProducts(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.brand, filters.minPrice, filters.maxPrice, filters.surface, filters.size, filters.sort, filters.page]);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') newParams.delete('page');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const activeFilterCount = [filters.brand, filters.minPrice, filters.maxPrice, filters.surface, filters.size, filters.search].filter(Boolean).length;

  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h4 className="label-bz">Search</h4>
        <div className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2 focus-within:border-ink-900 dark:border-ink-700 dark:focus-within:border-white">
          <FiSearch className="h-4 w-4 text-ink-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search boots..."
            className="flex-1 bg-transparent text-sm text-ink-900 outline-none dark:text-white"
          />
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="label-bz">Brand</h4>
        <div className="space-y-2">
          {brands.map((b) => (
            <label key={b.id} className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="radio"
                name="brand"
                checked={filters.brand === b.slug}
                onChange={() => updateFilter('brand', b.slug)}
                className="h-4 w-4 accent-ink-900"
              />
              <span className="flex flex-1 items-center justify-between text-ink-700 dark:text-ink-300">
                {b.name}
                <span className="text-xs text-ink-400">({b.product_count})</span>
              </span>
            </label>
          ))}
          {filters.brand && (
            <button onClick={() => updateFilter('brand', '')} className="text-xs text-flame-600 hover:underline">
              Clear brand
            </button>
          )}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="label-bz">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="w-full rounded-xl border border-ink-200 px-3 py-2 text-sm text-ink-900 focus:border-ink-900 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-white dark:focus:border-white"
          />
          <span className="text-ink-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="w-full rounded-xl border border-ink-200 px-3 py-2 text-sm text-ink-900 focus:border-ink-900 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-white dark:focus:border-white"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: 'Under $100', min: '', max: '100' },
            { label: '$100 - $200', min: '100', max: '200' },
            { label: '$200 - $250', min: '200', max: '250' },
            { label: '$250+', min: '250', max: '' },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => {
                updateFilter('minPrice', range.min);
                updateFilter('maxPrice', range.max);
              }}
              className="rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-700 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white dark:border-ink-700 dark:text-ink-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-ink-900"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Surface */}
      {surfaces.length > 0 && (
        <div>
          <h4 className="label-bz">Surface</h4>
          <div className="space-y-2">
            {surfaces.map((s) => (
              <label key={s} className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="radio"
                  name="surface"
                  checked={filters.surface === s}
                  onChange={() => updateFilter('surface', s)}
                  className="h-4 w-4 accent-ink-900"
                />
                <span className="text-ink-700 dark:text-ink-300">{s}</span>
              </label>
            ))}
            {filters.surface && (
              <button onClick={() => updateFilter('surface', '')} className="text-xs text-flame-600 hover:underline">
                Clear surface
              </button>
            )}
          </div>
        </div>
      )}

      {/* Size */}
      <div>
        <h4 className="label-bz">Size (UK)</h4>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => updateFilter('size', filters.size === s ? '' : s)}
              className={`rounded-xl border py-2 text-sm font-medium transition-colors ${
                filters.size === s
                  ? 'border-ink-900 bg-ink-900 text-white dark:border-white dark:bg-white dark:text-ink-900'
                  : 'border-ink-200 text-ink-700 hover:border-ink-900 dark:border-ink-700 dark:text-ink-300 dark:hover:border-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearFilters} className="w-full rounded-xl bg-ink-100 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700">
          Clear all filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-ink-950">
      {/* Page header */}
      <div className="border-b border-ink-100 bg-ink-50 dark:border-ink-800 dark:bg-ink-900">
        <div className="container-bz py-10">
          <nav className="mb-3 flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
            <Link to="/" className="hover:text-ink-900 dark:hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-ink-900 dark:text-white">Shop</span>
          </nav>
          <h1 className="font-display text-4xl tracking-tight text-ink-900 sm:text-5xl dark:text-white">
            {filters.brand
              ? `${brands.find((b) => b.slug === filters.brand)?.name || filters.brand} Boots`
              : 'All Football Boots'}
          </h1>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            {pagination.total > 0
              ? `${pagination.total} ${pagination.total === 1 ? 'product' : 'products'} available`
              : "Authentic boots from the world's best brands"}
          </p>
        </div>
      </div>

      <div className="container-bz py-8">
        <div className="flex gap-8">
          {/* Sidebar - desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24">
              <div className="mb-6 flex items-center gap-2">
                <FiSliders className="h-5 w-5 text-ink-900 dark:text-white" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink-900 dark:text-white">Filters</h3>
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-ink-100 bg-white px-4 py-3 dark:border-ink-800 dark:bg-ink-900">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-2 rounded-full bg-ink-100 px-4 py-2 text-sm font-medium text-ink-900 dark:bg-ink-800 dark:text-white lg:hidden"
                >
                  <FiFilter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-flame-500 text-xs text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <div className="hidden items-center gap-2 text-sm text-ink-500 dark:text-ink-400 sm:flex">
                  <FiGrid className="h-4 w-4" />
                  {loading ? 'Loading...' : `${products.length} of ${pagination.total} products`}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="hidden text-xs font-medium text-ink-500 dark:text-ink-400 sm:block">Sort by</label>
                <div className="relative">
                  <select
                    value={filters.sort}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className="appearance-none rounded-full border border-ink-200 bg-white py-2 pl-4 pr-9 text-sm font-medium text-ink-900 focus:border-ink-900 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-white dark:focus:border-white"
                  >
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {filters.search && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-3 py-1 text-xs text-ink-700 dark:bg-ink-800 dark:text-ink-300">
                    "{filters.search}"
                    <button onClick={() => updateFilter('search', '')}><FiX className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.brand && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-3 py-1 text-xs text-ink-700 dark:bg-ink-800 dark:text-ink-300">
                    {brands.find((b) => b.slug === filters.brand)?.name}
                    <button onClick={() => updateFilter('brand', '')}><FiX className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.surface && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-3 py-1 text-xs text-ink-700 dark:bg-ink-800 dark:text-ink-300">
                    {filters.surface}
                    <button onClick={() => updateFilter('surface', '')}><FiX className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.size && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-3 py-1 text-xs text-ink-700 dark:bg-ink-800 dark:text-ink-300">
                    Size {filters.size}
                    <button onClick={() => updateFilter('size', '')}><FiX className="h-3 w-3" /></button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-3 py-1 text-xs text-ink-700 dark:bg-ink-800 dark:text-ink-300">
                    {formatPrice(filters.minPrice || 0)} - {formatPrice(filters.maxPrice || 9999)}
                    <button onClick={() => { updateFilter('minPrice', ''); updateFilter('maxPrice', ''); }}>
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : products.length === 0 ? (
              <EmptyState
                icon={FiSearch}
                title="No boots found"
                description="Try adjusting your filters or search terms to find the perfect pair."
                actionLabel="Clear all filters"
                actionTo="/products"
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => updateFilter('page', Math.max(1, filters.page - 1))}
                  disabled={filters.page === 1}
                  className="rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent dark:border-ink-700 dark:text-ink-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-ink-900"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }).map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= filters.page - 1 && page <= filters.page + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => updateFilter('page', page)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                          page === filters.page
                            ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                            : 'border border-ink-200 text-ink-700 hover:border-ink-900 dark:border-ink-700 dark:text-ink-300 dark:hover:border-white'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  if (page === filters.page - 2 || page === filters.page + 2) {
                    return <span key={page} className="px-1 text-ink-400">…</span>;
                  }
                  return null;
                })}
                <button
                  onClick={() => updateFilter('page', Math.min(pagination.totalPages, filters.page + 1))}
                  disabled={filters.page === pagination.totalPages}
                  className="rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent dark:border-ink-700 dark:text-ink-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-ink-900"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-80 max-w-[85vw] overflow-y-auto bg-white p-6 shadow-xl dark:bg-ink-950">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink-900 dark:text-white">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="rounded-lg p-2 text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-full bg-ink-900 py-3 text-sm font-semibold text-white dark:bg-white dark:text-ink-900"
            >
              Show {pagination.total} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
