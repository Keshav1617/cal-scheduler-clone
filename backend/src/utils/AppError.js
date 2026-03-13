class AppError extends Error {
  constructor(statusCode, message, meta = null) {
    super(message);
    this.statusCode = statusCode;
    this.meta = meta;
  }
}

module.exports = AppError;

