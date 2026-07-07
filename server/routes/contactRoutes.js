// ============================================================
// BootZone - Contact Routes
// File: server/routes/contactRoutes.js
// ============================================================

import express from 'express';
import { body } from 'express-validator';
import {
  submitContact, getContacts, markContactRead, deleteContact
} from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
], validate, submitContact);

router.get('/', protect, adminOnly, getContacts);
router.put('/:id/read', protect, adminOnly, markContactRead);
router.delete('/:id', protect, adminOnly, deleteContact);

export default router;
