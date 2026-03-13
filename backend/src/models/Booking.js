const { query } = require('../config/database');

async function findAllByUser(userId, filter, page = 1, limit = 10) {
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const offset = (pageNum - 1) * limitNum;

  const baseParams = [userId];
  let whereClause = 'WHERE e.user_id = ?';
  let orderClause = 'ORDER BY b.start_time ASC';

  if (filter === 'upcoming') {
    whereClause += " AND b.status = 'confirmed' AND b.start_time > UTC_TIMESTAMP()";
    orderClause = 'ORDER BY b.start_time ASC';
  } else if (filter === 'past') {
    whereClause += " AND b.status = 'confirmed' AND b.start_time <= UTC_TIMESTAMP()";
    orderClause = 'ORDER BY b.start_time DESC';
  } else if (filter === 'unconfirmed' || filter === 'recurring') {
    // These statuses don't exist yet - return empty
    whereClause += " AND 1 = 0";
  } else if (filter) {
    whereClause += ' AND b.status = ?';
    baseParams.push(filter);
  }

  const countRows = await query(
    `
    SELECT COUNT(*) as total
    FROM bookings b
    JOIN event_types e ON b.event_type_id = e.id
    ${whereClause}
    `,
    baseParams
  );

  const total = countRows[0]?.total || 0;

  const rows = await query(
    `
    SELECT 
      b.*, 
      e.title AS event_title, 
      e.slug AS event_slug,
      u.name AS host_name
    FROM bookings b
    JOIN event_types e ON b.event_type_id = e.id
    JOIN users u ON e.user_id = u.id
    ${whereClause}
    ${orderClause}
    LIMIT ${limitNum} OFFSET ${offset}
    `,
    baseParams
  );

  return { rows, total };
}

async function findById(uid) {
  const rows = await query(
    `
    SELECT 
      b.*, 
      e.title AS event_title, 
      e.slug AS event_slug,
      u.name AS host_name,
      u.email AS host_email
    FROM bookings b
    JOIN event_types e ON b.event_type_id = e.id
    JOIN users u ON e.user_id = u.id
    WHERE b.uid = ?
    `,
    [uid]
  );
  return { rows };
}

async function create(data) {
  const {
    event_type_id,
    booker_name,
    booker_email,
    start_time,
    end_time,
    status,
    uid,
    notes,
    custom_answers,
    location
  } = data;

  const result = await query(
    `
    INSERT INTO bookings (
      event_type_id,
      booker_name,
      booker_email,
      start_time,
      end_time,
      status,
      uid,
      notes,
      custom_answers,
      location
    ) VALUES (?,?,?,?,?,?,?,?,?,?)
    `,
    [
      event_type_id,
      booker_name,
      booker_email,
      start_time,
      end_time,
      status || 'confirmed',
      uid,
      notes || null,
      custom_answers ? JSON.stringify(custom_answers) : null,
      location ? JSON.stringify(location) : null
    ]
  );

  const rows = await query('SELECT * FROM bookings WHERE id = ?', [result.insertId]);
  return { rows };
}

async function cancel(uid) {
  await query('UPDATE bookings SET status = "cancelled" WHERE uid = ?', [uid]);
  const { rows } = await findById(uid);
  return { rows };
}

async function checkOverlap(eventTypeId, start, end) {
  const rows = await query(
    `
    SELECT *
    FROM bookings
    WHERE event_type_id = ?
      AND status = 'confirmed'
      AND end_time > ?
      AND start_time < ?
    `,
    [eventTypeId, start, end]
  );
  return { rows };
}

async function findConfirmedForDate(eventTypeId, dateString) {
  const rows = await query(
    `
    SELECT *
    FROM bookings
    WHERE event_type_id = ?
      AND status = 'confirmed'
      AND DATE(start_time) = ?
    ORDER BY start_time ASC
    `,
    [eventTypeId, dateString]
  );
  return { rows };
}

module.exports = {
  findAllByUser,
  findById,
  create,
  cancel,
  checkOverlap,
  findConfirmedForDate,
};

