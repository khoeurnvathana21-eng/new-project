// ============================================================
// BootZone Client - Product Service
// File: client/src/services/productService.js
// ============================================================

import api from './api.js';

export const productService = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
  getRelatedProducts: (slug) => api.get(`/products/${slug}/related`),
  getSurfaces: () => api.get('/products/meta/surfaces'),
  // Admin
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};
