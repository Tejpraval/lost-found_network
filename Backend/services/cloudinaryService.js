import cloudinary from '../config/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

const isConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'local_placeholder' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'local_placeholder'
  );
};

export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    if (!isConfigured()) {
      // Mock Fallback URL for Local Development & Testing
      const mockUrl = `https://picsum.photos/seed/${uuidv4()}/800/600`;
      logger.info(`Cloudinary not configured. Mock URL generated: ${mockUrl}`);
      return resolve(mockUrl);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'lost_found_network',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          logger.error(`Cloudinary upload failed: ${error.message}`);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};
