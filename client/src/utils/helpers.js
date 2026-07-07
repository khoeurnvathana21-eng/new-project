// ============================================================
// BootZone Client - Utility Functions
// File: client/src/utils/helpers.js
// ============================================================

// Format a number as currency (USD)
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

// Truncate text with ellipsis
export const truncate = (str, length = 100) => {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '…' : str;
};

// Calculate discount percentage
export const discountPercent = (price, comparePrice) => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

// Generate star rating array (for rendering)
export const buildStars = (rating) => {
  const r = Number(rating) || 0;
  return [1, 2, 3, 4, 5].map((n) => ({
    filled: n <= Math.floor(r),
    half: !Number.isInteger(r) && n === Math.ceil(r),
  }));
};

// Convert string to URL-friendly slug
export const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Build query string from object
export const buildQuery = (obj) => {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) params.append(k, v);
  });
  return params.toString();
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Get first image from product
export const primaryImage = (product) => {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images[0];
  }
  return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600';
};
