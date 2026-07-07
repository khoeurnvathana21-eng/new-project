// ============================================================
// BootZone - Cart Routes
// File: server/routes/cartRoutes.js
// ============================================================

import express from 'express';
import {
  getCart, addToCart, updateCartItem, removeFromCart, clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/:id', protect, updateCartItem);
router.delete('/:id', protect, removeFromCart);
router.delete('/', protect, clearCart);

export default router;
