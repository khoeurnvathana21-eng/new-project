// ============================================================
// BootZone - Wishlist Routes
// File: server/routes/wishlistRoutes.js
// ============================================================

import express from 'express';
import {
  getWishlist, toggleWishlist, checkWishlist, removeFromWishlist
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getWishlist);
router.post('/', protect, toggleWishlist);
router.get('/check/:productId', protect, checkWishlist);
router.delete('/:productId', protect, removeFromWishlist);

export default router;
