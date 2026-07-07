// ============================================================
// BootZone - Review Controller
// File: server/controllers/reviewController.js
// ============================================================

import pool from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.*, u.first_name, u.last_name, u.avatar
     FROM reviews r JOIN users u ON r.user_id = u.id
     WHERE r.product_id = ? AND r.is_approved = 1
     ORDER BY r.created_at DESC`,
    [req.params.productId]
  );
  res.json({ reviews: rows });
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { product_id, rating, title, comment } = req.body;

  // Prevent duplicate reviews by same user on same product
  const [existing] = await pool.query(
    'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
    [req.user.id, product_id]
  );
  if (existing.length > 0) {
    return res.status(409).json({ message: 'You have already reviewed this product' });
  }

  const [result] = await pool.query(
    'INSERT INTO reviews (user_id, product_id, rating, title, comment) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, product_id, rating, title || null, comment || null]
  );

  // Recompute product rating and review count
  const [stats] = await pool.query(
    'SELECT AVG(rating) AS avg_rating, COUNT(*) AS total FROM reviews WHERE product_id = ? AND is_approved = 1',
    [product_id]
  );
  await pool.query(
    'UPDATE products SET rating = ?, review_count = ? WHERE id = ?',
    [stats[0].avg_rating || 0, stats[0].total, product_id]
  );

  res.status(201).json({ id: result.insertId, message: 'Review submitted successfully' });
});

// @desc    Delete a review (owner or admin)
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ message: 'Review not found' });

  const review = rows[0];
  if (review.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await pool.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);

  // Recompute product stats
  const [stats] = await pool.query(
    'SELECT AVG(rating) AS avg_rating, COUNT(*) AS total FROM reviews WHERE product_id = ? AND is_approved = 1',
    [review.product_id]
  );
  await pool.query(
    'UPDATE products SET rating = ?, review_count = ? WHERE id = ?',
    [stats[0].avg_rating || 0, stats[0].total, review.product_id]
  );

  res.json({ message: 'Review deleted' });
});

// @desc    Get all reviews (admin)
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
export const getAllReviews = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.*, p.name AS product_name, u.first_name, u.last_name
     FROM reviews r
     JOIN products p ON r.product_id = p.id
     JOIN users u ON r.user_id = u.id
     ORDER BY r.created_at DESC`
  );
  res.json({ reviews: rows });
});

// @desc    Approve / reject review (admin)
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
export const approveReview = asyncHandler(async (req, res) => {
  const { is_approved } = req.body;
  await pool.query('UPDATE reviews SET is_approved = ? WHERE id = ?', [is_approved ? 1 : 0, req.params.id]);
  res.json({ message: 'Review updated' });
});
