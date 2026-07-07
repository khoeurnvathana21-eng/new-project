// ============================================================
// BootZone - Brand & Category Controller
// File: server/controllers/catalogController.js
// ============================================================

import pool from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// ---------- Brands ----------

export const getBrands = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.*, COUNT(p.id) AS product_count
     FROM brands b LEFT JOIN products p ON b.id = p.brand_id AND p.is_active = 1
     GROUP BY b.id ORDER BY b.name`
  );
  res.json({ brands: rows });
});

export const getBrandBySlug = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM brands WHERE slug = ?', [req.params.slug]);
  if (rows.length === 0) return res.status(404).json({ message: 'Brand not found' });
  res.json({ brand: rows[0] });
});

export const createBrand = asyncHandler(async (req, res) => {
  const { name, slug, description, logo } = req.body;
  const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const [result] = await pool.query(
    'INSERT INTO brands (name, slug, description, logo) VALUES (?, ?, ?, ?)',
    [name, finalSlug, description || null, logo || null]
  );
  res.status(201).json({ id: result.insertId, message: 'Brand created' });
});

export const updateBrand = asyncHandler(async (req, res) => {
  const { name, slug, description, logo } = req.body;
  await pool.query(
    'UPDATE brands SET name=?, slug=?, description=?, logo=? WHERE id=?',
    [name, slug, description || null, logo || null, req.params.id]
  );
  res.json({ message: 'Brand updated' });
});

export const deleteBrand = asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM brands WHERE id = ?', [req.params.id]);
  res.json({ message: 'Brand deleted' });
});

// ---------- Categories ----------

export const getCategories = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.*, COUNT(p.id) AS product_count
     FROM categories c LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
     GROUP BY c.id ORDER BY c.name`
  );
  res.json({ categories: rows });
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE slug = ?', [req.params.slug]);
  if (rows.length === 0) return res.status(404).json({ message: 'Category not found' });
  res.json({ category: rows[0] });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description } = req.body;
  const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const [result] = await pool.query(
    'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
    [name, finalSlug, description || null]
  );
  res.status(201).json({ id: result.insertId, message: 'Category created' });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, slug, description } = req.body;
  await pool.query(
    'UPDATE categories SET name=?, slug=?, description=? WHERE id=?',
    [name, slug, description || null, req.params.id]
  );
  res.json({ message: 'Category updated' });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
  res.json({ message: 'Category deleted' });
});
