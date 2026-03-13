const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate_v4() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('Migrating database (v4)...');

  try {
    try {
      await connection.execute('ALTER TABLE availability_schedules ADD COLUMN is_active BOOLEAN DEFAULT TRUE;');
      console.log('Added is_active to availability_schedules');
    } catch (e) {
      console.log('is_active might already exist in availability_schedules');
    }

    console.log('Migration v4 complete');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await connection.end();
  }
}

migrate_v4();
