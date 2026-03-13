const express = require('express');
const { body, param } = require('express-validator');
const eventTypeController = require('../controllers/eventTypeController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const createOrUpdateValidators = [
  body('title').isString().isLength({ min: 3, max: 120 }),
  body('slug')
    .optional({ nullable: true })
    .isString()
    .isLength({ min: 3, max: 80 })
    .matches(/^[a-z0-9-]+$/),
  body('duration').isInt({ min: 1, max: 1440 }),
  body('description').optional({ nullable: true }).isString().isLength({ max: 500 }),
];

router.get('/', eventTypeController.getAll);
router.get('/:slug', eventTypeController.getOne);

router.post(
  '/',
  [
    body('title').isString().isLength({ min: 3, max: 120 }),
    body('slug')
      .isString()
      .isLength({ min: 3, max: 80 })
      .matches(/^[a-z0-9-]+$/),
    body('duration')
      .isInt({ min: 1, max: 1440 }),
    body('description').optional({ nullable: true }).isString().isLength({ max: 500 }),
  ],
  validateRequest,
  eventTypeController.create
);

router.put('/:id', [param('id').isInt(), ...createOrUpdateValidators], validateRequest, eventTypeController.update);

router.delete('/:id', [param('id').isInt()], validateRequest, eventTypeController.remove);

router.patch(
  '/bulk-update-availability',
  [
    body('ids').isArray({ min: 1 }),
    body('scheduleId').isInt(),
  ],
  validateRequest,
  eventTypeController.bulkUpdateAvailability
);

module.exports = router;

