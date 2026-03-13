const { query } = require('../config/database');

async function findById(id) {
  const rows = await query('SELECT * FROM users WHERE id = ?', [id]);
  return { rows };
}

async function findByUsername(username) {
  // Assuming name is used as the identifier for now if there's no username column
  // Or if there is, we'll try to match it.
  const rows = await query('SELECT * FROM users WHERE name = ? OR email LIKE ? LIMIT 1', [username, `%${username}%`]);
  return { rows };
}

module.exports = {
  findById,
  findByUsername,
};

