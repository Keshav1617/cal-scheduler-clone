const { query } = require('../config/database');

async function findAll(userId) {
  const rows = await query(
    'SELECT * FROM event_types WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return { rows };
}

async function findBySlug(slug) {
  const rows = await query('SELECT * FROM event_types WHERE slug = ?', [slug]);
  return { rows };
}

async function findById(id) {
  const rows = await query('SELECT * FROM event_types WHERE id = ?', [id]);
  return { rows };
}

async function create(data) {
  const { user_id, title, description, slug, duration, color, availability_schedule_id, before_buffer, after_buffer, custom_questions, location, durations, allow_multiple_durations, hide_duration_selector } = data;
  const result = await query(
    'INSERT INTO event_types (user_id, title, description, slug, duration, color, availability_schedule_id, before_buffer, after_buffer, custom_questions, location, durations, allow_multiple_durations, hide_duration_selector) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [
      user_id, title, description || null, slug, duration, color || '#006FEE', 
      availability_schedule_id || null, before_buffer || 0, after_buffer || 0, 
      custom_questions ? JSON.stringify(custom_questions) : null,
      location ? JSON.stringify(location) : null,
      durations ? JSON.stringify(durations) : null,
      allow_multiple_durations || false,
      hide_duration_selector || false
    ]
  );
  const { rows } = await findById(result.insertId);
  return { rows };
}

async function update(id, data) {
  const { title, description, slug, duration, color, is_active, availability_schedule_id, before_buffer, after_buffer, custom_questions, location, durations, allow_multiple_durations, hide_duration_selector } = data;
  await query(
    'UPDATE event_types SET title = ?, description = ?, slug = ?, duration = ?, color = ?, is_active = ?, availability_schedule_id = ?, before_buffer = ?, after_buffer = ?, custom_questions = ?, location = ?, durations = ?, allow_multiple_durations = ?, hide_duration_selector = ? WHERE id = ?',
    [
      title, description || null, slug, duration, color || '#006FEE', is_active, 
      availability_schedule_id || null, before_buffer || 0, after_buffer || 0, 
      custom_questions ? JSON.stringify(custom_questions) : null,
      location ? JSON.stringify(location) : null,
      durations ? JSON.stringify(durations) : null,
      allow_multiple_durations || false,
      hide_duration_selector || false,
      id
    ]
  );
  const { rows } = await findById(id);
  return { rows };
}

async function bulkUpdateAvailability(ids, scheduleId) {
  if (!ids || !ids.length) return { rows: [] };
  const placeholders = ids.map(() => '?').join(',');
  await query(
    `UPDATE event_types SET availability_schedule_id = ? WHERE id IN (${placeholders})`,
    [scheduleId, ...ids]
  );
  return { rows: [] };
}

async function remove(id) {
  await query('DELETE FROM event_types WHERE id = ?', [id]);
  return { rows: [] };
}

module.exports = {
  findAll,
  findBySlug,
  findById,
  create,
  update,
  remove,
  bulkUpdateAvailability,
};
