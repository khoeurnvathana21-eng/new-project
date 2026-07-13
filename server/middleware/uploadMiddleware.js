// ============================================================
// BootZone - Multer Upload Middleware
// File: server/middleware/uploadMiddleware.js
// ============================================================

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vercel's filesystem is read-only except /tmp, and /tmp doesn't persist
// between invocations — use it there so uploads at least work per-request
// instead of crashing the function on cold start.
export const uploadDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '..', 'uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.error('Could not create uploads directory:', err.message);
}

// Disk storage with timestamped filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

// Accept only image files
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ok = allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase());
  cb(ok ? null : new Error('Only image files (jpeg, png, webp, gif) are allowed'), ok);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
});

export default upload;
