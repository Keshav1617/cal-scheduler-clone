const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate_v5() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('Migrating database (v5)...');

  try {
    // Update the default user's username to 'keshav' to match frontend links
    await connection.execute(
      "UPDATE users SET username = 'keshav', name = 'Keshav' WHERE id = 1;"
    );
    console.log("Updated default user ID 1 username to 'keshav'");

    console.log('Migration v5 complete');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await connection.end();
  }
}

migrate_v5();
