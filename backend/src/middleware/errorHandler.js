const { failure } = require('../utils/responseHelper');

function errorHandler(err, req, res, next) {
  console.error('API Error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  const meta = {};
  if (err.meta) {
    meta.details = err.meta;
  }

  if (process.env.NODE_ENV !== 'production') {
    meta.stack = err.stack;
  }

  return failure(res, message, statusCode, meta);
}

module.exports = errorHandler;

