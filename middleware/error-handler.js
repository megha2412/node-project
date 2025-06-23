const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // log in terminal

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
