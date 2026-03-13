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

  console.log('Migrating database (v2)...');

  try {
    // Add location
    try {
      await connection.execute('ALTER TABLE event_types ADD COLUMN location TEXT;');
      console.log('Added location');
    } catch (e) {
      console.log('location might already exist');
    }

    // Add durations (as JSON array)
    try {
      await connection.execute('ALTER TABLE event_types ADD COLUMN durations TEXT;');
      console.log('Added durations');
    } catch (e) {
      console.log('durations might already exist');
    }

    // Add allow_multiple_durations
    try {
      await connection.execute('ALTER TABLE event_types ADD COLUMN allow_multiple_durations BOOLEAN DEFAULT FALSE;');
      console.log('Added allow_multiple_durations');
    } catch (e) {
      console.log('allow_multiple_durations might already exist');
    }

    // Add hide_duration_selector
    try {
      await connection.execute('ALTER TABLE event_types ADD COLUMN hide_duration_selector BOOLEAN DEFAULT FALSE;');
      console.log('Added hide_duration_selector');
    } catch (e) {
      console.log('hide_duration_selector might already exist');
    }

    console.log('Migration v2 complete');
  } catch (err) {
    console.error('Migration v2 failed:', err);
  } finally {
    await connection.end();
  }
}

migrate();
