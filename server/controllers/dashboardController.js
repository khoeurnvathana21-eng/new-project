// ============================================================
// BootZone - Admin Dashboard Controller
// File: server/controllers/dashboardController.js
// ============================================================

import pool from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getStats = asyncHandler(async (req, res) => {
  const [[{ total_products }]] = await pool.query('SELECT COUNT(*) AS total_products FROM products');
  const [[{ total_orders }]] = await pool.query('SELECT COUNT(*) AS total_orders FROM orders');
  const [[{ total_users }]] = await pool.query("SELECT COUNT(*) AS total_users FROM users WHERE role='customer'");
  const [[{ total_revenue }]] = await pool.query("SELECT COALESCE(SUM(total_amount),0) AS total_revenue FROM orders WHERE order_status != 'cancelled'");
  const [[{ low_stock }]] = await pool.query('SELECT COUNT(*) AS low_stock FROM products WHERE stock < 10');
  const [[{ pending_orders }]] = await pool.query("SELECT COUNT(*) AS pending_orders FROM orders WHERE order_status='pending'");

  res.json({
    stats: {
      total_products,
      total_orders,
      total_users,
      total_revenue: Number(total_revenue),
      low_stock,
      pending_orders,
    },
  });
});

// @desc    Get revenue by month (last 12 months)
// @route   GET /api/dashboard/revenue
// @access  Private/Admin
export const getRevenueChart = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
            COALESCE(SUM(total_amount),0) AS revenue,
            COUNT(*) AS order_count
     FROM orders
     WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       AND order_status != 'cancelled'
     GROUP BY month
     ORDER BY month`
  );
  res.json({ revenue: rows });
});

// @desc    Get top selling products
// @route   GET /api/dashboard/top-products
// @access  Private/Admin
export const getTopProducts = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.price, p.stock,
            COALESCE(SUM(oi.quantity),0) AS sold,
            p.images
     FROM products p
     LEFT JOIN order_items oi ON p.id = oi.product_id
     GROUP BY p.id
     ORDER BY sold DESC
     LIMIT 5`
  );
  const products = rows.map((p) => ({
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
  }));
  res.json({ products });
});

// @desc    Get orders by status distribution
// @route   GET /api/dashboard/order-status
// @access  Private/Admin
export const getOrderStatusBreakdown = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT order_status, COUNT(*) AS count FROM orders GROUP BY order_status`
  );
  res.json({ status: rows });
});

// @desc    Get brand performance
// @route   GET /api/dashboard/brand-performance
// @access  Private/Admin
export const getBrandPerformance = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.name AS brand,
            COUNT(p.id) AS products,
            COALESCE(SUM(oi.quantity),0) AS units_sold
     FROM brands b
     LEFT JOIN products p ON b.id = p.brand_id
     LEFT JOIN order_items oi ON p.id = oi.product_id
     GROUP BY b.id ORDER BY units_sold DESC`
  );
  res.json({ brands: rows });
});
