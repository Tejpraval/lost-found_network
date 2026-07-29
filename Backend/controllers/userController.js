import User from '../models/User.js';
import AppError from '../utils/AppError.js';

// Filter allowed fields for update
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: {
      user: req.user
    }
  });
};

export const updateMe = async (req, res, next) => {
  try {
    // 1) Throw error if password parameters are supplied
    if (req.body.password) {
      return next(new AppError('This route is not for password updates. Please use updatePassword.', 400));
    }

    // 2) Filter parameters to prevent role/status escalation
    const filteredBody = filterObj(req.body, 'name', 'avatar');

    // 3) Update user profile info
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};
