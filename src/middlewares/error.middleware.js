const config = require("../config");
const ApiError = require("../utils/ApiError");

const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";

  // Malformed JSON body.
  if (error.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON body";
  }

  // Prisma: record not found / unique constraint / foreign key.
  if (error.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }
  if (error.code === "P2002") {
    statusCode = 409;
    message = "Record already exists";
  }
  if (error.code === "P2003") {
    statusCode = 409;
    message = "This record is linked to other records and cannot be changed or deleted";
  }

  if (statusCode === 500) console.error(error);

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.env === "development" && { stack: error.stack }),
  });
};

module.exports = { notFound, errorHandler };
