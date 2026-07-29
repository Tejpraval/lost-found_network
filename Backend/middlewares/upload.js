import multer from 'multer';
import AppError from '../utils/AppError.js';

// Setup Memory Storage
const storage = multer.memoryStorage();

// File validator (Allow only images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only images are allowed to be uploaded.', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5 // Max 5 files
  }
});

export const uploadImages = upload.array('images', 5);
export default uploadImages;
