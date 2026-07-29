import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

// Helper to sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

export const registerUser = async (name, email, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email address is already in use', 400);
  }

  // Create new user
  const newUser = await User.create({
    name,
    email,
    password
  });

  // Remove password from output object
  newUser.password = undefined;

  const token = signToken(newUser._id);

  return {
    user: newUser,
    token
  };
};

export const loginUser = async (email, password) => {
  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  if (user.status === 'suspended') {
    throw new AppError('Your account has been suspended. Please contact an administrator.', 403);
  }

  // Remove password from output object
  user.password = undefined;

  const token = signToken(user._id);

  return {
    user,
    token
  };
};
