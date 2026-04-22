// AppError.js — Custom error class for operational errors
// Usage: throw new AppError("Not found", 404)
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes known errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
