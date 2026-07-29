import app from './app.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';

process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.message}. Shutting down server...`);
  process.exit(1);
});

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION: ${err.message}. Shutting down server gracefully...`);
  server.close(() => {
    process.exit(1);
  });
});
