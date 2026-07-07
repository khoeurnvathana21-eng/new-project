// ============================================================
// BootZone - Database Seeder
// File: server/utils/seeder.js
// Runs the database.sql file to (re)create schema and seed data,
// then sets the admin password to a proper bcrypt hash.
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = async () => {
  let connection;
  try {
    // Connect without database first (to create it)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true,
    });

    const sqlPath = path.join(__dirname, '..', 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await connection.query(sql);
    console.log('✅ Database schema created and seed data loaded');

    // Set a proper bcrypt hash for the admin user (password: admin123)
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(
      'UPDATE bootzone.users SET password = ? WHERE email = ?',
      [hashedPassword, 'admin@bootzone.com']
    );
    console.log('✅ Admin password set to: admin123');
    console.log('   Admin login: admin@bootzone.com / admin123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
};

seed();
