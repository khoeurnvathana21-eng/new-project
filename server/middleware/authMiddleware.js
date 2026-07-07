// ============================================================
// BootZone - JWT Authentication Middleware
// File: server/middleware/authMiddleware.js
// ============================================================

import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Verify JWT token from cookie or Authorization header
export const protect = async (req, res, next) => {
  let token;

  // Prefer cookie, fall back to Bearer header
  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query(
      'SELECT id, first_name, last_name, email, role, avatar FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Restrict route to admin users only
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

// Optional auth: attaches user if token valid, but does not block
export const optionalAuth = async (req, res, next) => {
  let token;
  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query(
      'SELECT id, first_name, last_name, email, role, avatar FROM users WHERE id = ?',
      [decoded.id]
    );
    if (rows.length > 0) req.user = rows[0];
  } catch (err) {
    // silently ignore
  }
  next();
};
