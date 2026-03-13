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

  console.log('Migrating database...');

  try {
    // Add availability_schedule_id
    try {
      await connection.execute('ALTER TABLE event_types ADD COLUMN availability_schedule_id INT REFERENCES availability_schedules(id) ON DELETE SET NULL;');
      console.log('Added availability_schedule_id');
    } catch (e) {
      console.log('availability_schedule_id might already exist');
    }

    // Add before_buffer
    try {
      await connection.execute('ALTER TABLE event_types ADD COLUMN before_buffer INT DEFAULT 0;');
      console.log('Added before_buffer');
    } catch (e) {
      console.log('before_buffer might already exist');
    }

    // Add after_buffer
    try {
      await connection.execute('ALTER TABLE event_types ADD COLUMN after_buffer INT DEFAULT 0;');
      console.log('Added after_buffer');
    } catch (e) {
      console.log('after_buffer might already exist');
    }

    // Add custom_questions
    try {
      await connection.execute('ALTER TABLE event_types ADD COLUMN custom_questions TEXT;');
      console.log('Added custom_questions');
    } catch (e) {
      console.log('custom_questions might already exist');
    }

    console.log('Migration complete');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await connection.end();
  }
}

migrate();
