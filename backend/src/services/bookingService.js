const { v4: uuidv4 } = require('uuid');
const AppError = require('../utils/AppError');
const EventType = require('../models/EventType');
const Booking = require('../models/Booking');
const { getAvailableSlots } = require('./slotService');
const { combineDateAndTimeInTz, combineDateAndTimeUtc, addMinutes } = require('../utils/timeUtils');

async function createBooking(eventTypeId, bookerName, bookerEmail, dateStr, timeStr, notes, timezone, customAnswers, location) {
  const { rows: eventRows } = await EventType.findById(eventTypeId);
  const eventType = eventRows[0];
  if (!eventType || !eventType.is_active) {
    throw new AppError(404, 'Event type not found');
  }

  // 1. Validate slot availability (with timezone)
  const { available: availableSlots } = await getAvailableSlots(eventTypeId, dateStr, timezone || null);
  if (!availableSlots.includes(timeStr)) {
    throw new AppError(409, 'This time slot is no longer available');
  }

  // 2. Calculate start and end times in UTC (using timezone-aware conversion)
  const startDate = timezone
    ? combineDateAndTimeInTz(dateStr, timeStr, timezone)
    : combineDateAndTimeUtc(dateStr, timeStr);
  const endDate = addMinutes(startDate, eventType.duration);

  // 3. Double-check overlap at DB level
  const { rows: overlaps } = await Booking.checkOverlap(
    eventTypeId,
    startDate,
    endDate
  );
  if (overlaps.length) {
    throw new AppError(409, 'This time slot is no longer available');
  }

  const uid = uuidv4();

  const { rows } = await Booking.create({
    event_type_id: eventTypeId,
    booker_name: bookerName,
    booker_email: bookerEmail,
    start_time: startDate,
    end_time: endDate,
    status: 'confirmed',
    uid,
    notes,
    custom_answers: customAnswers,
    location: location
  });

  const booking = rows[0];

  // 4. Email is optional; ignore errors
  try {
    const emailService = require('./emailService');
    // Fetch full details with titles/names for the email
    const { rows: fullBookingRows } = await Booking.findById(uid);
    const fullBooking = fullBookingRows[0] || booking;
    await emailService.sendBookingConfirmation(fullBooking);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to send booking confirmation email:', err.message);
  }

  return booking;
}

module.exports = {
  createBooking,
};

