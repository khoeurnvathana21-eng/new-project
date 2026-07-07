// ============================================================
// BootZone - Auth Controller
// File: server/controllers/authController.js
// ============================================================

import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { generateToken, clearToken } from '../utils/generateToken.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, phone } = req.body;

  // Check if user already exists
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    'INSERT INTO users (first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)',
    [first_name, last_name, email, hashedPassword, phone || null]
  );

  const [rows] = await pool.query(
    'SELECT id, first_name, last_name, email, role, phone, avatar FROM users WHERE id = ?',
    [result.insertId]
  );

  const user = rows[0];
  const token = generateToken(res, user);

  res.status(201).json({ user, token });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!user.is_active) {
    return res.status(403).json({ message: 'Account is deactivated. Contact support.' });
  }

  delete user.password;
  const token = generateToken(res, user);
  res.json({ user, token });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res) => {
  clearToken(res);
  res.json({ message: 'Logged out successfully' });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, first_name, last_name, email, role, phone, avatar FROM users WHERE id = ?',
    [req.user.id]
  );
  if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
  res.json({ user: rows[0] });
});

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { first_name, last_name, phone, avatar } = req.body;
  await pool.query(
    'UPDATE users SET first_name = ?, last_name = ?, phone = ?, avatar = ? WHERE id = ?',
    [first_name, last_name, phone || null, avatar || null, req.user.id]
  );
  const [rows] = await pool.query(
    'SELECT id, first_name, last_name, email, role, phone, avatar FROM users WHERE id = ?',
    [req.user.id]
  );
  res.json({ user: rows[0] });
});

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
  const match = await bcrypt.compare(currentPassword, rows[0].password);
  if (!match) return res.status(400).json({ message: 'Current password is incorrect' });

  const hashed = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
  res.json({ message: 'Password updated successfully' });
});

// @desc    Forgot password (request reset token)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    // Don't leak whether email exists
    return res.json({ message: 'If the email exists, a reset link has been sent.' });
  }
  // Generate a simple reset token (in production use a secure random + email delivery)
  const token = await bcrypt.hash(`${rows[0].id}-${Date.now()}`, 10);
  await pool.query(
    'UPDATE users SET reset_token = ?, reset_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?',
    [token, rows[0].id]
  );
  res.json({ message: 'If the email exists, a reset link has been sent.', resetToken: token });
});

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const [rows] = await pool.query(
    'SELECT id FROM users WHERE reset_token = ? AND reset_expires > NOW()',
    [token]
  );
  if (rows.length === 0) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  await pool.query(
    'UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
    [hashed, rows[0].id]
  );
  res.json({ message: 'Password reset successful. Please login.' });
});
