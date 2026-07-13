// ============================================================
// BootZone - Order Controller
// File: server/controllers/orderController.js
// ============================================================

import pool from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// Generate a unique order number
const generateOrderNumber = () => {
  const ts = Date.now().toString().slice(-8);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BZ-${ts}${rand}`;
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shipping_address, payment_method = 'cod', notes } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain at least one item' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Validate products and compute total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const [productRows] = await conn.query(
        'SELECT id, name, price, stock, images FROM products WHERE id = ? AND is_active = 1 FOR UPDATE',
        [item.product_id]
      );
      if (productRows.length === 0) throw new Error(`Product ${item.product_id} not found`);
      const product = productRows[0];
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const unitPrice = Number(product.price);
      total += unitPrice * item.quantity;

      const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [];

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_image: images[0] || null,
        size: item.size || null,
        quantity: item.quantity,
        unit_price: unitPrice,
      });

      // Decrement stock
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, product.id]);
    }

    const orderNumber = generateOrderNumber();
    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, order_number, total_amount, shipping_address, payment_method, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, orderNumber, total, JSON.stringify(shipping_address), payment_method, notes || null]
    );

    const orderId = orderResult.insertId;

    for (const oi of orderItems) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, size, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, oi.product_id, oi.product_name, oi.product_image, oi.size, oi.quantity, oi.unit_price]
      );
    }

    // Clear user's cart after order
    await conn.query('DELETE FROM carts WHERE user_id = ?', [req.user.id]);

    await conn.commit();
    res.status(201).json({
      order_id: orderId,
      order_number: orderNumber,
      total_amount: total,
      message: 'Order placed successfully',
    });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// @desc    Get current user's orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const [orders] = await pool.query(
    `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    [req.user.id]
  );

  const result = [];
  for (const order of orders) {
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    result.push({
      ...order,
      shipping_address: typeof order.shipping_address === 'string'
        ? JSON.parse(order.shipping_address) : order.shipping_address,
      items,
    });
  }

  res.json({ orders: result });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const [orders] = await pool.query(
    'SELECT * FROM orders WHERE id = ? AND (user_id = ? OR ? = (SELECT role FROM users WHERE id = ?))',
    [req.params.id, req.user.id, req.user.role, req.user.id]
  );
  if (orders.length === 0) return res.status(404).json({ message: 'Order not found' });

  const order = orders[0];
  const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

  res.json({
    order: {
      ...order,
      shipping_address: typeof order.shipping_address === 'string'
        ? JSON.parse(order.shipping_address) : order.shipping_address,
      items,
    },
  });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const offset = (page - 1) * limit;
  const status = req.query.status;

  let where = '';
  const params = [];
  if (status) {
    where = 'WHERE order_status = ?';
    params.push(status);
  }

  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM orders ${where}`, params);
  const [rows] = await pool.query(
    `SELECT o.*, u.first_name, u.last_name, u.email
     FROM orders o JOIN users u ON o.user_id = u.id
     ${where} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const orderIds = rows.map((o) => o.id);
  let itemsByOrder = {};
  if (orderIds.length > 0) {
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id IN (?)', [orderIds]);
    itemsByOrder = items.reduce((acc, item) => {
      (acc[item.order_id] ||= []).push(item);
      return acc;
    }, {});
  }
  const ordersWithItems = rows.map((o) => ({ ...o, items: itemsByOrder[o.id] || [] }));

  res.json({
    orders: ordersWithItems,
    pagination: { page, limit, total: countRows[0].total, totalPages: Math.ceil(countRows[0].total / limit) },
  });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { order_status, payment_status } = req.body;
  await pool.query(
    'UPDATE orders SET order_status = ?, payment_status = ? WHERE id = ?',
    [order_status, payment_status || 'pending', req.params.id]
  );
  res.json({ message: 'Order status updated' });
});
