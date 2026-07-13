// ============================================================
// BootZone Server - Database Configuration
// File: server/config/db.js
// MySQL connection pool using mysql2/promise
// ============================================================

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a reusable connection pool for efficient query handling
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bootzone',
  waitForConnections: true,
  // Serverless functions run many short-lived instances in parallel, each
  // with its own pool — keep this low so they don't collectively exhaust
  // the database's max connection limit.
  connectionLimit: process.env.VERCEL ? 3 : 10,
  queueLimit: 0,
  dateStrings: true,
  // Cloud MySQL providers (TiDB Cloud, Aiven, PlanetScale, etc.) require TLS.
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
});

// Test connection on boot
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
  }
})();

export default pool;
