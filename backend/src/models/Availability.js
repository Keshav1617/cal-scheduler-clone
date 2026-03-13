const { query } = require('../config/database');

async function findDefaultSchedule(userId) {
  const rows = await query(
    'SELECT * FROM availability_schedules WHERE user_id = ? AND is_default = TRUE LIMIT 1',
    [userId]
  );
  return { rows };
}

async function findAll(userId) {
  const rows = await query(
    'SELECT * FROM availability_schedules WHERE user_id = ? AND is_active = 1 ORDER BY is_default DESC, name ASC',
    [userId]
  );
  return { rows };
}

async function findById(id) {
  const rows = await query('SELECT * FROM availability_schedules WHERE id = ?', [id]);
  return { rows };
}

async function create(data) {
  const { user_id, name, timezone, is_default, is_active } = data;
  const result = await query(
    'INSERT INTO availability_schedules (user_id, name, timezone, is_default, is_active) VALUES (?, ?, ?, ?, ?)',
    [user_id, name || 'Working hours', timezone || 'Asia/Kolkata', is_default ? 1 : 0, is_active ? 1 : 0]
  );
  
  // result should be a ResultSetHeader object from mysql2
  const insertId = result.insertId;
  if (!insertId) {
     throw new Error('Failed to retrieve insertId from MySQL result. Result: ' + JSON.stringify(result));
  }

  const { rows } = await findById(insertId);
  return { rows };
}

async function updateScheduleInfo(id, data) {
  const { name, timezone, is_default, is_active } = data;
  await query(
    'UPDATE availability_schedules SET name = ?, timezone = ?, is_default = ?, is_active = ? WHERE id = ?',
    [name, timezone, is_default ? 1 : 0, is_active !== undefined ? (is_active ? 1 : 0) : 1, id]
  );
  const { rows } = await findById(id);
  return { rows };
}

async function remove(id) {
  await query('DELETE FROM availability_schedules WHERE id = ?', [id]);
  return { rows: [] };
}

async function unsetAllDefaults(userId) {
  await query('UPDATE availability_schedules SET is_default = FALSE WHERE user_id = ?', [userId]);
}

async function findRulesBySchedule(scheduleId) {
  const rows = await query(
    'SELECT * FROM availability_rules WHERE schedule_id = ? ORDER BY day_of_week ASC',
    [scheduleId]
  );
  return { rows };
}

async function upsertRules(scheduleId, rules) {
  await query('DELETE FROM availability_rules WHERE schedule_id = ?', [scheduleId]);

  if (!rules || !rules.length) {
    return { rows: [] };
  }

  const values = rules.map((rule) => [
    scheduleId,
    rule.dayOfWeek,
    rule.startTime,
    rule.endTime,
    rule.isEnabled ? 1 : 0,
  ]);

  const placeholders = values.map(() => '(?,?,?,?,?)').join(',');
  const flat = values.flat();

  await query(
    `INSERT INTO availability_rules (schedule_id, day_of_week, start_time, end_time, is_enabled)
     VALUES ${placeholders}`,
    flat
  );

  const { rows } = await findRulesBySchedule(scheduleId);
  return { rows };
}

async function findOverridesBySchedule(scheduleId) {
  const rows = await query(
    'SELECT * FROM date_overrides WHERE schedule_id = ? ORDER BY date ASC',
    [scheduleId]
  );
  return { rows };
}

async function findOverrides(scheduleId, fromDate, toDate) {
  const rows = await query(
    'SELECT * FROM date_overrides WHERE schedule_id = ? AND date BETWEEN ? AND ? ORDER BY date ASC',
    [scheduleId, fromDate, toDate]
  );
  return { rows };
}

async function upsertOverrides(scheduleId, overrides) {
  await query('DELETE FROM date_overrides WHERE schedule_id = ?', [scheduleId]);

  if (!overrides || !overrides.length) {
    return { rows: [] };
  }

  const values = overrides.map((o) => [
    scheduleId,
    o.date,
    o.startTime || null,
    o.endTime || null,
    o.isBlocked ? 1 : 0,
  ]);

  const placeholders = values.map(() => '(?,?,?,?,?)').join(',');
  const flat = values.flat();

  await query(
    `INSERT INTO date_overrides (schedule_id, date, start_time, end_time, is_blocked)
     VALUES ${placeholders}`,
    flat
  );

  const { rows } = await findOverridesBySchedule(scheduleId);
  return { rows };
}

module.exports = {
  findAll,
  findById,
  findDefaultSchedule,
  create,
  updateScheduleInfo,
  remove,
  unsetAllDefaults,
  findRulesBySchedule,
  upsertRules,
  findOverrides,
  findOverridesBySchedule,
  upsertOverrides,
};

