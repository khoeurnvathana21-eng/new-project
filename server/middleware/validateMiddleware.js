// ============================================================
// BootZone - Validation Middleware
// File: server/middleware/validateMiddleware.js
// ============================================================

import { validationResult } from 'express-validator';

// Runs express-validator checks and returns 422 on failure
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(422).json({
    message: 'Validation failed',
    errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
  });
};
