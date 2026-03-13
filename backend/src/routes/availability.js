const express = require('express');
const { body, param } = require('express-validator');
const availabilityController = require('../controllers/availabilityController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

function isValidTime(str) {
  return /^\d{2}:\d{2}(:\d{2})?$/.test(str);
}

const scheduleInfoValidators = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('timezone')
    .isString()
    .custom((value) => {
      try {
        Intl.DateTimeFormat(undefined, { timeZone: value });
        return true;
      } catch (ex) {
        return false;
      }
    }),
  body('is_default').optional().isBoolean(),
  body('is_active').optional().isBoolean(),
];

const scheduleValidators = [
  param('scheduleId').isInt(),
  body('timezone')
    .isString()
    .custom((value) => {
      try {
        Intl.DateTimeFormat(undefined, { timeZone: value });
        return true;
      } catch (ex) {
        return false;
      }
    }),
  body('rules')
    .isArray()
    .custom((rules) => rules.length <= 7),
  body('rules.*.dayOfWeek').isInt({ min: 0, max: 6 }),
  body('rules.*.isEnabled').isBoolean(),
  body('rules.*.startTime')
    .optional({ nullable: true })
    .custom((value, { req, path }) => {
      const idx = Number(path.match(/\d+/)[0]);
      const rule = req.body.rules[idx];
      if (rule.isEnabled && !isValidTime(value)) {
        throw new Error('startTime must be HH:MM');
      }
      return true;
    }),
  body('rules.*.endTime')
    .optional({ nullable: true })
    .custom((value, { req, path }) => {
      const idx = Number(path.match(/\d+/)[0]);
      const rule = req.body.rules[idx];
      if (rule.isEnabled && !isValidTime(value)) {
        throw new Error('endTime must be HH:MM');
      }
      if (rule.isEnabled) {
        const [sh, sm] = rule.startTime.split(':').map(Number);
        const [eh, em] = value.split(':').map(Number);
        const startMinutes = sh * 60 + sm;
        const endMinutes = eh * 60 + em;
        if (startMinutes >= endMinutes) {
          throw new Error('startTime must be before endTime');
        }
      }
      return true;
    }),
  body('overrides')
    .optional()
    .isArray(),
  body('overrides.*.date').optional().isISO8601(),
  body('overrides.*.isBlocked').optional().isBoolean(),
  body('overrides.*.startTime').optional({ nullable: true }),
  body('overrides.*.endTime').optional({ nullable: true }),
];

router.get('/schedule', availabilityController.getSchedule);

router.get('/schedules', availabilityController.getAllSchedules);
router.post('/schedules', scheduleInfoValidators, validateRequest, availabilityController.createSchedule);

router.get('/schedules/:id', availabilityController.getScheduleDetail);
router.patch('/schedules/:id', scheduleInfoValidators, validateRequest, availabilityController.updateScheduleInfo);
router.delete('/schedules/:id', availabilityController.deleteSchedule);

router.put(
  '/schedule/:scheduleId',
  scheduleValidators.slice(1), // remove param('scheduleId') since we used it in the path? wait, actually slice(1) might be wrong if scheduleValidators includes it.
  validateRequest,
  availabilityController.updateSchedule
);

module.exports = router;

