// ============================================================
// BootZone - Product Routes
// File: server/routes/productRoutes.js
// ============================================================

import express from 'express';
import {
  getProducts, getProductBySlug, getRelatedProducts,
  createProduct, updateProduct, deleteProduct, getSurfaces
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getProducts);
router.get('/meta/surfaces', getSurfaces);
router.get('/:slug', getProductBySlug);
router.get('/:slug/related', getRelatedProducts);

// Admin
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
