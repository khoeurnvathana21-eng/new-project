// ============================================================
// BootZone - User Controller (Admin)
// File: server/controllers/userController.js
// ============================================================

import pool from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const offset = (page - 1) * limit;
  const search = req.query.search;

  let where = '';
  const params = [];
  if (search) {
    where = 'WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM users ${where}`, params);
  const [rows] = await pool.query(
    `SELECT id, first_name, last_name, email, role, phone, avatar, is_active, created_at
     FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  res.json({
    users: rows,
    pagination: { page, limit, total: countRows[0].total, totalPages: Math.ceil(countRows[0].total / limit) },
  });
});

// @desc    Get single user (admin)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, first_name, last_name, email, role, phone, avatar, is_active, created_at FROM users WHERE id = ?',
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
  res.json({ user: rows[0] });
});

// @desc    Update user (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, role, phone, is_active } = req.body;
  await pool.query(
    'UPDATE users SET first_name=?, last_name=?, email=?, role=?, phone=?, is_active=? WHERE id=?',
    [first_name, last_name, email, role, phone || null, is_active ? 1 : 0, req.params.id]
  );
  res.json({ message: 'User updated' });
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  if (Number(req.params.id) === Number(req.user.id)) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }
  await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ message: 'User deleted' });
});
