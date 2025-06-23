class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Optional: to show proper error stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
