import Item from '../models/Item.js';
import * as cloudinaryService from './cloudinaryService.js';
import AppError from '../utils/AppError.js';

export const createItem = async (itemData, files, reporterId) => {
  const imageUrls = [];

  // Upload images to Cloudinary (if any)
  if (files && files.length > 0) {
    for (const file of files) {
      const url = await cloudinaryService.uploadToCloudinary(file.buffer);
      imageUrls.push(url);
    }
  }

  // Parse questions if passed as JSON string or array
  let identifyingQuestions = [];
  if (itemData.identifyingQuestions) {
    identifyingQuestions = typeof itemData.identifyingQuestions === 'string'
      ? JSON.parse(itemData.identifyingQuestions)
      : itemData.identifyingQuestions;
  }

  // Create new listing
  const newItem = await Item.create({
    ...itemData,
    images: imageUrls,
    reporter: reporterId,
    identifyingQuestions
  });

  return newItem;
};

export const queryItems = async (queryString) => {
  // 1) Initialize query object
  const queryObj = {};

  // 2) Filter parameters
  // Text Search
  if (queryString.search) {
    queryObj.$text = { $search: queryString.search };
  }

  // Type Filter
  if (queryString.type) {
    queryObj.type = queryString.type;
  }

  // Status Filter
  if (queryString.status) {
    queryObj.status = queryString.status;
  } else {
    // By default, exclude rejected listings for general users
    queryObj.status = { $ne: 'rejected' };
  }

  // Category Filter
  if (queryString.category) {
    queryObj.category = queryString.category;
  }

  // Location Filter (Regex search for partial matches)
  if (queryString.location) {
    queryObj.location = { $regex: queryString.location, $options: 'i' };
  }

  // Date Filters
  if (queryString.startDate || queryString.endDate) {
    queryObj.date = {};
    if (queryString.startDate) {
      queryObj.date.$gte = new Date(queryString.startDate);
    }
    if (queryString.endDate) {
      queryObj.date.$lte = new Date(queryString.endDate);
    }
  }

  // 3) Setup Query Promise
  let query = Item.find(queryObj);

  // Sorting
  if (queryString.search) {
    // If text searching, sort by search relevancy score by default
    query = query.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
  } else if (queryString.sort) {
    const sortBy = queryString.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    // Default sort: newest first
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(queryString.page, 10) || 1;
  const limit = parseInt(queryString.limit, 10) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit).populate('reporter', 'name email avatar');

  // 4) Execute query and fetch total counts
  const items = await query;
  const total = await Item.countDocuments(queryObj);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getItemById = async (id) => {
  const item = await Item.findById(id).populate('reporter', 'name email avatar');
  if (!item) {
    throw new AppError('No item found with that ID', 404);
  }
  return item;
};

export const updateItem = async (id, updateData, userId, role) => {
  let item = await Item.findById(id);
  if (!item) {
    throw new AppError('No item found with that ID', 404);
  }

  // Authorization check: Only reporter or admin can edit
  if (item.reporter.toString() !== userId && role !== 'admin') {
    throw new AppError('You do not have permission to edit this listing', 403);
  }

  // Filter allowed fields for update
  const allowedUpdates = ['title', 'description', 'category', 'date', 'location', 'status', 'identifyingQuestions'];
  const updates = {};
  
  Object.keys(updateData).forEach(key => {
    if (allowedUpdates.includes(key)) {
      if (key === 'identifyingQuestions') {
        updates[key] = typeof updateData[key] === 'string'
          ? JSON.parse(updateData[key])
          : updateData[key];
      } else {
        updates[key] = updateData[key];
      }
    }
  });

  // Apply updates
  const updatedItem = await Item.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  }).populate('reporter', 'name email avatar');

  return updatedItem;
};

export const deleteItem = async (id, userId, role) => {
  const item = await Item.findById(id);
  if (!item) {
    throw new AppError('No item found with that ID', 404);
  }

  // Authorization check: Only reporter or admin can delete
  if (item.reporter.toString() !== userId && role !== 'admin') {
    throw new AppError('You do not have permission to delete this listing', 403);
  }

  await Item.findByIdAndDelete(id);
};
