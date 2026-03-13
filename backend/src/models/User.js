const { query } = require('../config/database');

async function findById(id) {
  const rows = await query('SELECT * FROM users WHERE id = ?', [id]);
  return { rows };
}

async function findByUsername(username) {
  const rows = await query('SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1', [username, username]);
  return { rows };
}

module.exports = {
  findById,
  findByUsername,
};

