const express = require('express');
const { body, param, query } = require('express-validator');
const publicController = require('../controllers/publicController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get(
  '/users/:username',
  [param('username').isString()],
  validateRequest,
  publicController.getPublicProfile
);

router.get(
  '/users/:userId/event-types',
  [param('userId').isInt()],
  validateRequest,
  publicController.getPublicEventTypes
);

router.get(
  '/event-types/:slug',
  [param('slug').isString()],
  validateRequest,
  publicController.getEventType
);

router.get(
  '/event-types/:slug/slots',
  [param('slug').isString(), query('date').isISO8601({ strict: true }).toDate()],
  validateRequest,
  publicController.getSlots
);

router.post(
  '/book',
  [
    body('eventTypeId').isInt(),
    body('bookerName').isString().isLength({ min: 2, max: 120 }),
    body('bookerEmail').isEmail(),
    body('date')
      .isISO8601()
      .withMessage('date must be YYYY-MM-DD')
      .custom((value) => {
        const today = new Date();
        const input = new Date(value);
        // Clear time for date-only comparison
        today.setHours(0, 0, 0, 0);
        input.setHours(0, 0, 0, 0);
        if (input < today) {
          throw new Error('date must not be in the past');
        }
        return true;
      }),
    body('time')
      .matches(/^\d{2}:\d{2}$/)
      .withMessage('time must be HH:MM'),
  ],
  validateRequest,
  publicController.createPublicBooking
);

router.get(
  '/confirmation/:uid',
  [param('uid').isUUID()],
  validateRequest,
  publicController.getConfirmation
);

module.exports = router;

