const AppError = require('../utils/AppError');
const EventType = require('../models/EventType');
const Availability = require('../models/Availability');
const Booking = require('../models/Booking');
const {
  combineDateAndTimeUtc,
  combineDateAndTimeInTz,
  addMinutes,
  formatTimeHHMM,
  formatTimeInTz,
} = require('../utils/timeUtils');

const DEFAULT_USER_ID = 1;

/**
 * Returns available and booked time slots for a given event type and date.
 * 
 * @param {number} eventTypeId
 * @param {string} dateString - 'YYYY-MM-DD' in the host's schedule timezone
 * @param {string} [timezone] - IANA timezone of the booker (e.g. 'Asia/Kolkata')
 * @returns {{ available: string[], booked: string[] }}
 */
async function getAvailableSlots(eventTypeId, dateString, timezone) {
  // 1. Load event type
  const { rows: eventRows } = await EventType.findById(eventTypeId);
  const eventType = eventRows[0];
  if (!eventType || !eventType.is_active) {
    throw new AppError(404, 'Event type not found');
  }

  const durationMinutes = eventType.duration;

  // 2. Load schedule
  let schedule;
  if (eventType.availability_schedule_id) {
    const { rows: scheduleRows } = await Availability.findById(eventType.availability_schedule_id);
    schedule = scheduleRows[0];
  }

  if (!schedule) {
    const { rows: scheduleRows } = await Availability.findDefaultSchedule(eventType.user_id || DEFAULT_USER_ID);
    schedule = scheduleRows[0];
  }

  if (!schedule) {
    return { available: [], booked: [] };
  }

  // 3. Load rules for schedule and find rule for day-of-week
  const targetDate = new Date(dateString + 'T00:00:00Z');
  const dayOfWeek = targetDate.getUTCDay(); // 0-6, 0 = Sun

  const { rows: ruleRows } = await Availability.findRulesBySchedule(schedule.id);
  const rule = ruleRows.find((r) => r.day_of_week === dayOfWeek);

  if (!rule || !rule.is_enabled) {
    return { available: [], booked: [] };
  }

  // 4. Check date overrides for that date (simple version: blocked or custom hours)
  const { rows: overrideRows } = await Availability.findOverrides(
    schedule.id,
    dateString,
    dateString
  );

  let effectiveStart = rule.start_time;
  let effectiveEnd = rule.end_time;

  if (overrideRows.length) {
    const override = overrideRows[0];
    if (override.is_blocked || (!override.start_time && !override.end_time)) {
      return { available: [], booked: [] };
    }
    if (override.start_time && override.end_time) {
      effectiveStart = override.start_time;
      effectiveEnd = override.end_time;
    }
  }

  // 5. Generate candidate slots for the day
  // The schedule times are interpreted in the host's schedule timezone
  const [startHour, startMinute] = effectiveStart.split(':').map(Number);
  const [endHour, endMinute] = effectiveEnd.split(':').map(Number);

  const startTimeStr = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
  const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

  let cursor = combineDateAndTimeInTz(dateString, startTimeStr, schedule.timezone);
  const endBoundary = combineDateAndTimeInTz(dateString, endTimeStr, schedule.timezone);

  const candidateSlots = [];

  while (addMinutes(cursor, durationMinutes) <= endBoundary) {
    // Format time in the booker's timezone if provided, else use UTC HH:MM
    const displayTime = timezone ? formatTimeInTz(cursor, timezone) : formatTimeHHMM(cursor);
    candidateSlots.push({ utcTime: cursor, displayTime });
    
    // Instead of incrementing by just a fixed interval, increment by the duration
    // or by a defined step. Currently, cal.com steps by duration unless the duration is large.
    // For a simple clone, step by durationMinutes.
    const step = durationMinutes; 
    cursor = addMinutes(cursor, step);
  }

  if (!candidateSlots.length) {
    return { available: [], booked: [] };
  }

  // 6. Load confirmed bookings for that date
  const { rows: bookingRows } = await Booking.findConfirmedForDate(eventTypeId, dateString);

  // 7. Filter out overlapping slots
  const available = [];
  const booked = [];

  for (const slot of candidateSlots) {
    const start = slot.utcTime;
    const end = addMinutes(start, durationMinutes);

    // With Buffers
    const startWithBuffer = addMinutes(start, -(eventType.before_buffer || 0));
    const endWithBuffer = addMinutes(end, (eventType.after_buffer || 0));

    const hasOverlap = bookingRows.some((b) => {
      const existingStart = new Date(b.start_time);
      const existingEnd = new Date(b.end_time);
      return endWithBuffer > existingStart && startWithBuffer < existingEnd;
    });

    if (hasOverlap) {
      booked.push(slot.displayTime);
    } else {
      available.push(slot.displayTime);
    }
  }

  return { available, booked };
}

module.exports = {
  getAvailableSlots,
};
