// ============================================================
// BootZone - Wishlist Controller
// File: server/controllers/wishlistController.js
// ============================================================

import pool from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT w.id, w.created_at, p.*, b.name AS brand_name, b.slug AS brand_slug
     FROM wishlists w
     JOIN products p ON w.product_id = p.id
     LEFT JOIN brands b ON p.brand_id = b.id
     WHERE w.user_id = ? AND p.is_active = 1
     ORDER BY w.created_at DESC`,
    [req.user.id]
  );

  const items = rows.map((row) => ({
    ...row,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images || [],
    sizes: typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes || [],
  }));

  res.json({ items, count: items.length });
});

// @desc    Toggle wishlist item (add or remove)
// @route   POST /api/wishlist
// @access  Private
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { product_id } = req.body;
  const [existing] = await pool.query(
    'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
    [req.user.id, product_id]
  );

  if (existing.length > 0) {
    await pool.query('DELETE FROM wishlists WHERE id = ?', [existing[0].id]);
    return res.json({ message: 'Removed from wishlist', inWishlist: false });
  }

  await pool.query(
    'INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)',
    [req.user.id, product_id]
  );
  res.status(201).json({ message: 'Added to wishlist', inWishlist: true });
});

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
export const checkWishlist = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
    [req.user.id, req.params.productId]
  );
  res.json({ inWishlist: rows.length > 0 });
});

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
  await pool.query(
    'DELETE FROM wishlists WHERE user_id = ? AND product_id = ?',
    [req.user.id, req.params.productId]
  );
  res.json({ message: 'Removed from wishlist' });
});
