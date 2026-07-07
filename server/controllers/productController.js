// ============================================================
// BootZone - Product Controller
// File: server/controllers/productController.js
// ============================================================

import pool from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { paginate } from '../utils/apiResponse.js';

// @desc    Get all products with filters, sorting, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search = '',
    brand,
    category,
    surface,
    minPrice,
    maxPrice,
    size,
    sort = 'newest',
    featured,
    new_arrival,
    best_seller,
  } = req.query;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(48, Math.max(1, Number(limit)));
  const offset = (pageNum - 1) * limitNum;

  let where = ['p.is_active = 1'];
  const params = [];

  if (search) {
    where.push('(p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)');
    const term = `%${search}%`;
    params.push(term, term, term);
  }
  if (brand) {
    where.push('b.slug = ?');
    params.push(brand);
  }
  if (category) {
    where.push('c.slug = ?');
    params.push(category);
  }
  if (surface) {
    where.push('p.surface = ?');
    params.push(surface);
  }
  if (minPrice) {
    where.push('p.price >= ?');
    params.push(Number(minPrice));
  }
  if (maxPrice) {
    where.push('p.price <= ?');
    params.push(Number(maxPrice));
  }
  if (size) {
    where.push('JSON_CONTAINS(p.sizes, JSON_QUOTE(?))');
    params.push(size);
  }
  if (featured === 'true') where.push('p.is_featured = 1');
  if (new_arrival === 'true') where.push('p.is_new_arrival = 1');
  if (best_seller === 'true') where.push('p.is_best_seller = 1');

  const whereClause = where.join(' AND ');

  // Sorting
  let orderBy = 'p.created_at DESC';
  switch (sort) {
    case 'price-low': orderBy = 'p.price ASC'; break;
    case 'price-high': orderBy = 'p.price DESC'; break;
    case 'rating': orderBy = 'p.rating DESC'; break;
    case 'newest': orderBy = 'p.created_at DESC'; break;
    case 'popular': orderBy = 'p.review_count DESC'; break;
  }

  const countSql = `SELECT COUNT(*) AS total FROM products p JOIN brands b ON p.brand_id=b.id JOIN categories c ON p.category_id=c.id WHERE ${whereClause}`;
  const [countRows] = await pool.query(countSql, params);
  const total = countRows[0].total;

  const dataSql = `
    SELECT p.*, b.name AS brand_name, b.slug AS brand_slug, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN brands b ON p.brand_id = b.id
    JOIN categories c ON p.category_id = c.id
    WHERE ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?`;

  const [rows] = await pool.query(dataSql, [...params, limitNum, offset]);

  // Parse JSON fields
  const products = rows.map((p) => ({
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes || [],
  }));

  res.json({
    products,
    pagination: paginate(pageNum, limitNum, total),
  });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, b.name AS brand_name, b.slug AS brand_slug, c.name AS category_name, c.slug AS category_slug
     FROM products p
     JOIN brands b ON p.brand_id = b.id
     JOIN categories c ON p.category_id = c.id
     WHERE p.slug = ? AND p.is_active = 1`,
    [req.params.slug]
  );

  if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });

  const product = {
    ...rows[0],
    images: typeof rows[0].images === 'string' ? JSON.parse(rows[0].images) : rows[0].images || [],
    sizes: typeof rows[0].sizes === 'string' ? JSON.parse(rows[0].sizes) : rows[0].sizes || [],
  };

  res.json({ product });
});

// @desc    Get related products (same brand or category)
// @route   GET /api/products/:slug/related
// @access  Public
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const [base] = await pool.query('SELECT brand_id, category_id FROM products WHERE slug = ?', [req.params.slug]);
  if (base.length === 0) return res.status(404).json({ message: 'Product not found' });

  const [rows] = await pool.query(
    `SELECT p.*, b.name AS brand_name, b.slug AS brand_slug
     FROM products p JOIN brands b ON p.brand_id = b.id
     WHERE p.slug != ? AND p.is_active = 1 AND (p.brand_id = ? OR p.category_id = ?)
     ORDER BY p.rating DESC LIMIT 4`,
    [req.params.slug, base[0].brand_id, base[0].category_id]
  );

  const products = rows.map((p) => ({
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes || [],
  }));

  res.json({ products });
});

// @desc    Create product (admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name, slug, description, price, compare_price, brand_id, category_id,
    surface, primary_color, sku, stock, images, sizes,
    is_featured, is_new_arrival, is_best_seller
  } = req.body;

  const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const [result] = await pool.query(
    `INSERT INTO products
      (name, slug, description, price, compare_price, brand_id, category_id, surface, primary_color, sku, stock, images, sizes, is_featured, is_new_arrival, is_best_seller)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name, finalSlug, description || null, price, compare_price || null,
      brand_id, category_id, surface || null, primary_color || null, sku || null, stock || 0,
      JSON.stringify(images || []), JSON.stringify(sizes || []),
      is_featured ? 1 : 0, is_new_arrival ? 1 : 0, is_best_seller ? 1 : 0,
    ]
  );

  res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name, slug, description, price, compare_price, brand_id, category_id,
    surface, primary_color, sku, stock, images, sizes, is_active,
    is_featured, is_new_arrival, is_best_seller
  } = req.body;

  await pool.query(
    `UPDATE products SET
      name=?, slug=?, description=?, price=?, compare_price=?, brand_id=?, category_id=?,
      surface=?, primary_color=?, sku=?, stock=?, images=?, sizes=?, is_active=?,
      is_featured=?, is_new_arrival=?, is_best_seller=?
     WHERE id=?`,
    [
      name, slug, description || null, price, compare_price || null,
      brand_id, category_id, surface || null, primary_color || null, sku || null, stock || 0,
      JSON.stringify(images || []), JSON.stringify(sizes || []),
      is_active ? 1 : 0, is_featured ? 1 : 0, is_new_arrival ? 1 : 0, is_best_seller ? 1 : 0,
      req.params.id
    ]
  );

  res.json({ message: 'Product updated successfully' });
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ message: 'Product deleted successfully' });
});

// @desc    Get distinct surfaces for filter
// @route   GET /api/products/meta/surfaces
// @access  Public
export const getSurfaces = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT DISTINCT surface FROM products WHERE surface IS NOT NULL AND is_active = 1 ORDER BY surface"
  );
  res.json({ surfaces: rows.map((r) => r.surface) });
});
