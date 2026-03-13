const EventType = require('../models/EventType');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { success } = require('../utils/responseHelper');
const AppError = require('../utils/AppError');
const { getAvailableSlots } = require('../services/slotService');
const { createBooking } = require('../services/bookingService');

async function getEventType(req, res, next) {
  try {
    const { slug } = req.params;
    const { rows } = await EventType.findBySlug(slug);
    const eventType = rows[0];
    if (!eventType || !eventType.is_active) {
      throw new AppError(404, 'Event type not found');
    }
    return success(res, eventType, 'Event type fetched');
  } catch (err) {
    return next(err);
  }
}

async function getSlots(req, res, next) {
  try {
    const { slug } = req.params;
    const { date, timezone } = req.query;
    if (!date) {
      throw new AppError(400, 'Date is required');
    }

    const { rows } = await EventType.findBySlug(slug);
    const eventType = rows[0];
    if (!eventType || !eventType.is_active) {
      throw new AppError(404, 'Event type not found');
    }

    const { available, booked } = await getAvailableSlots(eventType.id, date, timezone || null);
    return success(res, { available, booked }, 'Slots fetched');
  } catch (err) {
    return next(err);
  }
}

async function createPublicBooking(req, res, next) {
  try {
    const { 
      eventTypeId, 
      bookerName, 
      bookerEmail, 
      date, 
      time, 
      notes, 
      timezone,
      customAnswers,
      location
    } = req.body;

    const booking = await createBooking(
      eventTypeId,
      bookerName,
      bookerEmail,
      date,
      time,
      notes,
      timezone,
      customAnswers,
      location
    );

    return success(res, booking, 'Booking created', null, 201);
  } catch (err) {
    return next(err);
  }
}

async function getConfirmation(req, res, next) {
  try {
    const { uid } = req.params;
    const { rows } = await Booking.findById(uid);
    const booking = rows[0];
    if (!booking) {
      throw new AppError(404, 'Booking not found');
    }
    return success(res, booking, 'Booking confirmation fetched');
  } catch (err) {
    return next(err);
  }
}

async function getPublicProfile(req, res, next) {
  try {
    const { username } = req.params;
    const { rows } = await User.findByUsername(username);
    const user = rows[0];
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    // Remove sensitive info
    delete user.password;
    return success(res, user, 'User profile fetched');
  } catch (err) {
    return next(err);
  }
}

async function getPublicEventTypes(req, res, next) {
  try {
    const { userId } = req.params;
    const { rows } = await EventType.findAll(userId);
    // Filter only active ones
    const activeOnes = rows.filter(et => et.is_active);
    return success(res, activeOnes, 'Public event types fetched');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getEventType,
  getSlots,
  createPublicBooking,
  getConfirmation,
  getPublicProfile,
  getPublicEventTypes,
};

