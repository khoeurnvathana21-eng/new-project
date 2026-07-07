// ============================================================
// BootZone - API Response Helpers
// File: server/utils/apiResponse.js
// ============================================================

// Standardized success response
export const success = (res, data = {}, statusCode = 200, message = 'Success') => {
  return res.status(statusCode).json({ success: true, message, data });
};

// Standardized error response
export const error = (res, message = 'Something went wrong', statusCode = 500, extra = {}) => {
  return res.status(statusCode).json({ success: false, message, ...extra });
};

// Pagination helper
export const paginate = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};
