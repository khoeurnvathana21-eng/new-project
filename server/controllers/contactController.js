// ============================================================
// BootZone - Contact Controller
// File: server/controllers/contactController.js
// ============================================================

import pool from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const [result] = await pool.query(
    'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone || null, subject || null, message]
  );
  res.status(201).json({ id: result.insertId, message: 'Message sent successfully' });
});

// @desc    Get all contact messages (admin)
// @route   GET /api/contact
// @access  Private/Admin
export const getContacts = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
  res.json({ contacts: rows });
});

// @desc    Mark message as read (admin)
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
export const markContactRead = asyncHandler(async (req, res) => {
  await pool.query('UPDATE contacts SET is_read = 1 WHERE id = ?', [req.params.id]);
  res.json({ message: 'Marked as read' });
});

// @desc    Delete contact message (admin)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM contacts WHERE id = ?', [req.params.id]);
  res.json({ message: 'Message deleted' });
});
