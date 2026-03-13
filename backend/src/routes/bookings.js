const express = require('express');
const { param, query } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get(
  '/',
  [
    query('status')
      .optional()
      .isIn(['confirmed', 'cancelled', 'rescheduled', 'upcoming', 'past', 'unconfirmed', 'recurring']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  bookingController.getAll
);

router.get('/:uid', [param('uid').isUUID()], validateRequest, bookingController.getOne);

router.post(
  '/:uid/cancel',
  [param('uid').isUUID()],
  validateRequest,
  bookingController.cancel
);

module.exports = router;

