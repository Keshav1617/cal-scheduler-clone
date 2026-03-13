const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('Migrating database (v3)...');

  try {
    // Add custom_answers to bookings
    try {
      await connection.execute('ALTER TABLE bookings ADD COLUMN custom_answers TEXT;');
      console.log('Added custom_answers to bookings');
    } catch (e) {
      console.log('custom_answers might already exist in bookings');
    }

    // Add location to bookings (to store the specific location for this booking)
    try {
      await connection.execute('ALTER TABLE bookings ADD COLUMN location TEXT;');
      console.log('Added location to bookings');
    } catch (e) {
      console.log('location might already exist in bookings');
    }

    console.log('Migration v3 complete');
  } catch (err) {
    console.error('Migration v3 failed:', err);
  } finally {
    await connection.end();
  }
}

migrate();
