// ============================================================
// BootZone - Cart Controller
// File: server/controllers/cartController.js
// ============================================================

import pool from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.id, c.product_id, c.quantity, c.size, c.created_at,
            p.name, p.slug, p.price, p.compare_price, p.stock, p.images, b.name AS brand_name
     FROM carts c
     JOIN products p ON c.product_id = p.id
     LEFT JOIN brands b ON p.brand_id = b.id
     WHERE c.user_id = ?
     ORDER BY c.created_at DESC`,
    [req.user.id]
  );

  const items = rows.map((row) => ({
    ...row,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images || [],
  }));

  const subtotal = items.reduce((sum, it) => sum + Number(it.price) * it.quantity, 0);
  res.json({ items, subtotal, count: items.length });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { product_id, quantity = 1, size } = req.body;

  // Check existing
  const [existing] = await pool.query(
    'SELECT id, quantity FROM carts WHERE user_id = ? AND product_id = ? AND (size = ? OR (size IS NULL AND ? IS NULL))',
    [req.user.id, product_id, size, size]
  );

  if (existing.length > 0) {
    await pool.query(
      'UPDATE carts SET quantity = quantity + ? WHERE id = ?',
      [quantity, existing[0].id]
    );
  } else {
    await pool.query(
      'INSERT INTO carts (user_id, product_id, quantity, size) VALUES (?, ?, ?, ?)',
      [req.user.id, product_id, quantity, size || null]
    );
  }

  res.status(201).json({ message: 'Item added to cart' });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (quantity <= 0) {
    await pool.query('DELETE FROM carts WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  } else {
    await pool.query(
      'UPDATE carts SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.id, req.user.id]
    );
  }
  res.json({ message: 'Cart updated' });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM carts WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ message: 'Item removed from cart' });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access   Private
export const clearCart = asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM carts WHERE user_id = ?', [req.user.id]);
  res.json({ message: 'Cart cleared' });
});
