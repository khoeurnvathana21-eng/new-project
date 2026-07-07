// ============================================================
// BootZone - JWT Token Utility
// File: server/utils/generateToken.js
// ============================================================

import jwt from 'jsonwebtoken';

// Sign a JWT and attach it as an httpOnly cookie
export const generateToken = (res, user) => {
  const payload = { id: user.id, role: user.role, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  const days = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7;
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: days * 24 * 60 * 60 * 1000,
  });

  return token;
};

// Clear the auth cookie
export const clearToken = (res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
};
