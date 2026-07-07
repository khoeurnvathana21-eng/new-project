// ============================================================
// BootZone - Brand Routes
// File: server/routes/brandRoutes.js
// ============================================================

import express from 'express';
import {
  getBrands, getBrandBySlug, createBrand, updateBrand, deleteBrand
} from '../controllers/catalogController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBrands);
router.get('/:slug', getBrandBySlug);
router.post('/', protect, adminOnly, createBrand);
router.put('/:id', protect, adminOnly, updateBrand);
router.delete('/:id', protect, adminOnly, deleteBrand);

export default router;
