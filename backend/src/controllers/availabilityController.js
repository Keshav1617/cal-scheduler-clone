const Availability = require('../models/Availability');
const { success } = require('../utils/responseHelper');
const AppError = require('../utils/AppError');

const DEFAULT_USER_ID = 1;

async function getSchedule(req, res, next) {
  try {
    const { rows: scheduleRows } = await Availability.findDefaultSchedule(DEFAULT_USER_ID);
    const schedule = scheduleRows[0];
    if (!schedule) {
      throw new AppError(404, 'Availability schedule not found');
    }

    const { rows: rules } = await Availability.findRulesBySchedule(schedule.id);
    const { rows: overrides } = await Availability.findOverridesBySchedule(schedule.id);

    return success(
      res,
      {
        schedule,
        rules,
        overrides,
      },
      'Availability schedule fetched'
    );
  } catch (err) {
    return next(err);
  }
}

async function getAllSchedules(req, res, next) {
  try {
    const { rows } = await Availability.findAll(DEFAULT_USER_ID);
    return success(res, rows, 'All schedules fetched');
  } catch (err) {
    return next(err);
  }
}

async function getScheduleDetail(req, res, next) {
  try {
    const { id } = req.params;
    const { rows: scheduleRows } = await Availability.findById(id);
    const schedule = scheduleRows[0];
    if (!schedule) {
      throw new AppError(404, 'Schedule not found');
    }

    const { rows: rules } = await Availability.findRulesBySchedule(id);
    const { rows: overrides } = await Availability.findOverridesBySchedule(id);

    return success(res, { schedule, rules, overrides }, 'Schedule detail fetched');
  } catch (err) {
    return next(err);
  }
}

async function createSchedule(req, res, next) {
  try {
    const { name, timezone, is_default } = req.body;
    
    if (is_default) {
      await Availability.unsetAllDefaults(DEFAULT_USER_ID);
    }

    const { rows: scheduleRows } = await Availability.create({
      user_id: DEFAULT_USER_ID,
      name,
      timezone,
      is_default,
      is_active: 0 // Draft by default
    });
    const schedule = scheduleRows[0];

    // Initialize with default rules (Mon-Fri, 9-5)
    const defaultRules = [0, 1, 2, 3, 4, 5, 6].map(day => ({
      dayOfWeek: day,
      isEnabled: day >= 1 && day <= 5,
      startTime: '09:00:00',
      endTime: '17:00:00'
    }));
    await Availability.upsertRules(schedule.id, defaultRules);

    return success(res, schedule, 'Schedule created', null, 201);
  } catch (err) {
    return next(err);
  }
}

async function updateScheduleInfo(req, res, next) {
  try {
    const { id } = req.params;
    const { name, timezone, is_default } = req.body;

    if (is_default) {
      await Availability.unsetAllDefaults(DEFAULT_USER_ID);
    }

    const { rows } = await Availability.updateScheduleInfo(id, { name, timezone, is_default, is_active: req.body.is_active });
    return success(res, rows[0], 'Schedule info updated');
  } catch (err) {
    return next(err);
  }
}

async function updateSchedule(req, res, next) {
  try {
    const { scheduleId } = req.params;
    const { rules } = req.body;

    if (!Array.isArray(rules)) {
      throw new AppError(422, 'Invalid availability rules');
    }

    const { rows: scheduleRows } = await Availability.findById(scheduleId);
    if (!scheduleRows[0]) {
      throw new AppError(404, 'Schedule not found');
    }

    const { rows } = await Availability.upsertRules(scheduleId, rules);
    
    let updatedOverrides = [];
    if (req.body.overrides) {
      const { rows: overridesRows } = await Availability.upsertOverrides(scheduleId, req.body.overrides);
      updatedOverrides = overridesRows;
    }

    return success(
      res,
      {
        schedule: scheduleRows[0],
        rules: rows,
        overrides: updatedOverrides,
      },
      'Schedule rules updated'
    );
  } catch (err) {
    return next(err);
  }
}

async function deleteSchedule(req, res, next) {
  try {
    const { id } = req.params;
    const { rows: existing } = await Availability.findById(id);
    if (!existing[0]) {
      throw new AppError(404, 'Schedule not found');
    }
    if (existing[0].is_default) {
      throw new AppError(400, 'Cannot delete the default schedule');
    }

    await Availability.remove(id);
    return success(res, null, 'Schedule deleted');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getSchedule,
  getAllSchedules,
  getScheduleDetail,
  createSchedule,
  updateScheduleInfo,
  updateSchedule,
  deleteSchedule,
};

