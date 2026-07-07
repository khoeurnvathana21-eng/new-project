// ============================================================
// BootZone Client - Cart, Wishlist, Order, Review Services
// File: client/src/services/shopService.js
// ============================================================

import api from './api.js';

export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  removeFromCart: (id) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart'),
};

export const wishlistService = {
  getWishlist: () => api.get('/wishlist'),
  toggleWishlist: (productId) => api.post('/wishlist', { product_id: productId }),
  checkWishlist: (productId) => api.get(`/wishlist/check/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
};

export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  // Admin
  getAllOrders: (params) => api.get('/orders/admin/all', { params }),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

export const reviewService = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  createReview: (data) => api.post('/reviews', data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  // Admin
  getAllReviews: () => api.get('/reviews/admin/all'),
  approveReview: (id, isApproved) => api.put(`/reviews/${id}/approve`, { is_approved: isApproved }),
};

export const userService = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const contactService = {
  submit: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  markRead: (id) => api.put(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRevenue: () => api.get('/dashboard/revenue'),
  getTopProducts: () => api.get('/dashboard/top-products'),
  getOrderStatus: () => api.get('/dashboard/order-status'),
  getBrandPerformance: () => api.get('/dashboard/brand-performance'),
};

export const uploadService = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
