// ============================================================
// BootZone - Dashboard Routes (Admin)
// File: server/routes/dashboardRoutes.js
// ============================================================

import express from 'express';
import {
  getStats, getRevenueChart, getTopProducts,
  getOrderStatusBreakdown, getBrandPerformance
} from '../controllers/dashboardController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, adminOnly, getStats);
router.get('/revenue', protect, adminOnly, getRevenueChart);
router.get('/top-products', protect, adminOnly, getTopProducts);
router.get('/order-status', protect, adminOnly, getOrderStatusBreakdown);
router.get('/brand-performance', protect, adminOnly, getBrandPerformance);

export default router;
