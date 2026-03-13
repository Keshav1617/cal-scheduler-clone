const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(422, 'Validation failed', { errors: errors.array() }));
  }
  return next();
}

module.exports = validateRequest;

