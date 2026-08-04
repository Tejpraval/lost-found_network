import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  // Format Multer errors to be clean 400 Operational errors
  if (err.name === 'MulterError') {
    err.statusCode = 400;
    err.isOperational = true;
    if (err.code === 'LIMIT_FILE_SIZE') {
      err.message = 'One or more files are too large. Maximum size allowed is 10MB per file.';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      err.message = 'You can upload a maximum of 5 files.';
    } else {
      err.message = `File upload error: ${err.message}`;
    }
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Structured Logging of Errors
  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (err.stack) {
    logger.debug(err.stack);
  }

  // Development vs Production response format
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err,
      stack: err.stack
    });
  } else {
    // Production (Do not leak internal database details or third-party library errors)
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Something went wrong on our end. Please try again later.'
      });
    }
  }
};

export default errorHandler;
