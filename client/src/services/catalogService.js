// ============================================================
// BootZone Client - Catalog Service (Brands & Categories)
// File: client/src/services/catalogService.js
// ============================================================

import api from './api.js';

export const catalogService = {
  getBrands: () => api.get('/brands'),
  getBrandBySlug: (slug) => api.get(`/brands/${slug}`),
  getCategories: () => api.get('/categories'),
  // Admin
  createBrand: (data) => api.post('/brands', data),
  updateBrand: (id, data) => api.put(`/brands/${id}`, data),
  deleteBrand: (id) => api.delete(`/brands/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};
