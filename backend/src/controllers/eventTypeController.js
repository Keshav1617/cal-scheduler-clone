const EventType = require('../models/EventType');
const { success } = require('../utils/responseHelper');
const AppError = require('../utils/AppError');

const DEFAULT_USER_ID = 1;

async function getAll(req, res, next) {
  try {
    const { rows } = await EventType.findAll(DEFAULT_USER_ID);
    return success(res, rows, 'Event types fetched');
  } catch (err) {
    return next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const { slug } = req.params;
    const { rows } = await EventType.findBySlug(slug);
    const eventType = rows[0];
    if (!eventType) {
      throw new AppError(404, 'Event type not found');
    }
    return success(res, eventType, 'Event type fetched');
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const payload = {
      user_id: DEFAULT_USER_ID,
      title: req.body.title,
      description: req.body.description,
      slug: req.body.slug,
      duration: req.body.duration,
      color: req.body.color,
      location: req.body.location,
      durations: req.body.durations,
      allow_multiple_durations: req.body.allow_multiple_durations,
      hide_duration_selector: req.body.hide_duration_selector,
    };
    const { rows } = await EventType.create(payload);
    return success(res, rows[0], 'Event type created', null, 201);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { rows: existingRows } = await EventType.findById(id);
    if (!existingRows[0]) {
      throw new AppError(404, 'Event type not found');
    }

    const payload = {
      title: req.body.title,
      description: req.body.description,
      slug: req.body.slug,
      duration: req.body.duration,
      color: req.body.color,
      is_active: req.body.is_active,
      availability_schedule_id: req.body.availability_schedule_id,
      before_buffer: req.body.before_buffer,
      after_buffer: req.body.after_buffer,
      custom_questions: req.body.custom_questions,
      location: req.body.location,
      durations: req.body.durations,
      allow_multiple_durations: req.body.allow_multiple_durations,
      hide_duration_selector: req.body.hide_duration_selector,
    };

    const { rows } = await EventType.update(id, payload);
    return success(res, rows[0], 'Event type updated');
  } catch (err) {
    return next(err);
  }
}

async function bulkUpdateAvailability(req, res, next) {
  try {
    const { ids, scheduleId } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError(400, 'Invalid event type IDs');
    }
    await EventType.bulkUpdateAvailability(ids, scheduleId);
    return success(res, null, 'Event types availability updated');
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const { rows: existingRows } = await EventType.findById(id);
    if (!existingRows[0]) {
      throw new AppError(404, 'Event type not found');
    }
    await EventType.remove(id);
    return success(res, null, 'Event type deleted');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  bulkUpdateAvailability,
  remove,
};

