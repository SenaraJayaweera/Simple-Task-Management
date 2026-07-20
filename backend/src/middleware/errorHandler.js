export function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500;
  let message = err.message || "Server error.";
  let errors;

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation failed.";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    status = 400;
    message = `Invalid value for field "${err.path}".`;
  }

  // Duplicate key
  if (err.code === 11000) {
    status = 409;
    message = "Duplicate value violates a unique constraint.";
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
