// ============================================================
// BootZone Client - Axios API Instance
// File: client/src/services/api.js
// Central axios client with auth + interceptors
// ============================================================

import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bz_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    // Auto-logout on 401
    if (error.response?.status === 401) {
      // Don't auto-clear on auth endpoints to allow inline error display
      if (!error.config.url.includes('/auth/')) {
        localStorage.removeItem('bz_token');
        localStorage.removeItem('bz_user');
      }
    }
    return Promise.reject({ ...error, message });
  }
);

export default api;
