// ============================================================
// BootZone - Review Routes
// File: server/routes/reviewRoutes.js
// ============================================================

import express from 'express';
import {
  getProductReviews, createReview, deleteReview,
  getAllReviews, approveReview
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

// Admin
router.get('/admin/all', protect, adminOnly, getAllReviews);
router.put('/:id/approve', protect, adminOnly, approveReview);

export default router;
